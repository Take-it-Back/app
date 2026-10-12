// Daily deadline reminders. Runs from pg_cron once a day (18:30 UTC, inside 8am-8pm in every US time zone).
// Email: through the app's /api/email/remind route, which renders the branded reminder and sends it with Resend.
// Texts through Twilio (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM); phone alerts through /api/push/remind.
// Only Premium accounts get reminders. Idempotent: each deadline is reminded at most once per day (last_reminded_on).
// Texts and alerts: only 8am-8pm in the person's local time, at most one a day, never with case names or health details.
// Data retention (off until RETENTION_ENABLED=true is set as a function secret): uploaded files on cases closed
// more than RETENTION_DAYS ago (default 365) are deleted.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = Deno.env.get("SITE_URL") ?? "https://www.takeitback.app";
const RETENTION_DAYS = Number(Deno.env.get("RETENTION_DAYS") ?? 365);
const BUCKET = "case-files";

// Deletes the uploaded files (photos, PDFs) on cases that were closed, won or settled more than
// RETENTION_DAYS ago. The case itself, its summary, letters and timeline stay until the person deletes them.
// deno-lint-ignore no-explicit-any
async function retentionSweep(admin: any) {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString();
  const { data: cases, error } = await admin
    .from("cases")
    .select("id, user_id, closed_at, updated_at")
    .in("status", ["won", "settled", "closed"])
    .or(`closed_at.lt.${cutoff},and(closed_at.is.null,updated_at.lt.${cutoff})`)
    .limit(200);
  if (error) return { error: error.message };
  let files = 0, swept = 0;
  for (const c of cases ?? []) {
    const { data: docs } = await admin.from("documents").select("id, storage_path").eq("case_id", c.id);
    if (!docs?.length) continue;
    const paths = docs.map((d: { storage_path: string }) => d.storage_path).filter(Boolean);
    if (paths.length) {
      const { error: rmErr } = await admin.storage.from(BUCKET).remove(paths);
      if (rmErr) continue; // try again tomorrow
    }
    await admin.from("documents").delete().in("id", docs.map((d: { id: string }) => d.id));
    await admin.from("events").insert({
      case_id: c.id,
      user_id: c.user_id,
      title: "Files deleted",
      detail: `This case closed more than ${Math.round(RETENTION_DAYS / 30)} months ago, so its ${docs.length} uploaded file${docs.length > 1 ? "s were" : " was"} deleted. Your summary, letters and timeline are still here.`,
    });
    files += docs.length;
    swept++;
  }
  return { cases: swept, files };
}

const TZ: Record<string, string> = {
  Alabama: "America/Chicago", Alaska: "America/Anchorage", Arizona: "America/Phoenix", Arkansas: "America/Chicago", California: "America/Los_Angeles",
  Colorado: "America/Denver", Connecticut: "America/New_York", Delaware: "America/New_York", "District of Columbia": "America/New_York", Florida: "America/New_York",
  Georgia: "America/New_York", Hawaii: "Pacific/Honolulu", Idaho: "America/Boise", Illinois: "America/Chicago", Indiana: "America/Indiana/Indianapolis",
  Iowa: "America/Chicago", Kansas: "America/Chicago", Kentucky: "America/New_York", Louisiana: "America/Chicago", Maine: "America/New_York",
  Maryland: "America/New_York", Massachusetts: "America/New_York", Michigan: "America/Detroit", Minnesota: "America/Chicago", Mississippi: "America/Chicago",
  Missouri: "America/Chicago", Montana: "America/Denver", Nebraska: "America/Chicago", Nevada: "America/Los_Angeles", "New Hampshire": "America/New_York",
  "New Jersey": "America/New_York", "New Mexico": "America/Denver", "New York": "America/New_York", "North Carolina": "America/New_York", "North Dakota": "America/Chicago",
  Ohio: "America/New_York", Oklahoma: "America/Chicago", Oregon: "America/Los_Angeles", Pennsylvania: "America/New_York", "Puerto Rico": "America/Puerto_Rico",
  "Rhode Island": "America/New_York", "South Carolina": "America/New_York", "South Dakota": "America/Chicago", Tennessee: "America/Chicago", Texas: "America/Chicago",
  Utah: "America/Denver", Vermont: "America/New_York", Virginia: "America/New_York", Washington: "America/Los_Angeles", "West Virginia": "America/New_York",
  Wisconsin: "America/Chicago", Wyoming: "America/Denver",
};

function localHour(state: string | null, now: Date) {
  const tz = (state && TZ[state]) || "America/Los_Angeles";
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(now));
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
const short = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

Deno.serve(async () => {
  const twSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twFrom = Deno.env.get("TWILIO_FROM");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const smsOn = Boolean(twSid && twToken && twFrom);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);
  const now = new Date();
  const today = iso(now);
  const plus = (n: number) => iso(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + n)));
  const yesterday = plus(-1);

  const { data: rows, error } = await admin
    .from("deadlines")
    .select("id, user_id, case_id, title, due_date, owner, last_reminded_on, cases(title)")
    .eq("done", false)
    .or(`and(owner.eq.you,due_date.in.(${[plus(7), plus(3), plus(1), today].join(",")})),and(owner.eq.them,due_date.eq.${yesterday})`);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const due = (rows ?? []).filter((r) => r.last_reminded_on !== today);
  const byUser = new Map<string, typeof due>();
  for (const r of due) byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r]);

  let sent = 0, held = 0, pushes = 0, emails = 0;
  for (const [userId, items] of byUser) {
    const { data: prof } = await admin.from("profiles").select("full_name, remind_email, plan, plan_status, phone, sms_opt_in, sms_consent_at, state").eq("id", userId).maybeSingle();
    if (!prof || prof.plan !== "premium" || !["active", "trialing", "past_due"].includes(prof.plan_status ?? "")) continue;
    const daytime = (() => { const h = localHour(prof.state, now); return h >= 8 && h < 20; })();
    const mine = items.filter((i) => i.owner === "you");
    const soonest = mine.map((i) => i.due_date).sort()[0];
    let delivered = false;

    if (prof.remind_email !== false) {
      const list = items.map((r) => ({
        // deno-lint-ignore no-explicit-any
        caseTitle: (r as any).cases?.title ?? "Your case",
        title: r.title,
        due: short(r.due_date),
        owner: r.owner,
        days: Math.round((Date.parse(r.due_date) - Date.parse(today)) / 86400000),
      }));
      try {
        const res = await fetch(`${SITE}/api/email/remind`, {
          method: "POST",
          headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId, name: prof.full_name, items: list }),
        });
        if (res.ok) { delivered = true; emails++; }
      } catch (_) { /* email is best effort */ }
    }

    if (smsOn && prof.sms_opt_in && prof.sms_consent_at && prof.phone) {
      if (daytime) {
        const sms = `Take it back: ${mine.length ? `you have ${mine.length} deadline${mine.length > 1 ? "s" : ""} coming up${soonest ? `, the first on ${soonest}` : ""}.` : "a reply you were waiting for is overdue."} Details: ${SITE}/app Reply STOP to opt out, HELP for help.`;
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twSid}/Messages.json`, {
          method: "POST",
          headers: { Authorization: `Basic ${btoa(`${twSid}:${twToken}`)}`, "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ To: prof.phone, From: twFrom!, Body: sms }),
        });
        delivered = delivered || res.ok;
      } else held++;
    }

    if (daytime) {
      try {
        const res = await fetch(`${SITE}/api/push/remind`, {
          method: "POST",
          headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId, count: mine.length || items.length, overdue: mine.length === 0 }),
        });
        const j = await res.json().catch(() => ({}));
        if (res.ok && j.sent > 0) { delivered = true; pushes += j.sent; }
      } catch (_) { /* push is best effort */ }
    }

    if (delivered) {
      sent++;
      await admin.from("deadlines").update({ last_reminded_on: today }).in("id", items.map((i) => i.id));
    }
  }
  let retention: unknown = "off";
  if (Deno.env.get("RETENTION_ENABLED") === "true") try { retention = await retentionSweep(admin); } catch (e) { retention = { error: String(e) }; }
  return Response.json({ ok: true, sent, emails, pushes, textsHeld: held, retention });
});
