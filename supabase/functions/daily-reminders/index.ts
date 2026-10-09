// Daily deadline reminders. Runs from pg_cron once a day.
// Email through Resend (RESEND_API_KEY) and text messages through Twilio (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM).
// Only Premium accounts get reminders. If neither channel is configured it exits without doing anything.
// Idempotent: each deadline is reminded at most once per day (last_reminded_on).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = Deno.env.get("SITE_URL") ?? "https://www.takeitback.app";
const FROM = Deno.env.get("REMINDER_FROM") ?? "Take it back <reminders@takeitback.app>";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

Deno.serve(async () => {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const twSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twFrom = Deno.env.get("TWILIO_FROM");
  const smsOn = Boolean(twSid && twToken && twFrom);
  if (!resendKey && !smsOn) return Response.json({ ok: true, sent: 0, note: "No reminder channel configured" });

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const now = new Date();
  const today = iso(now);
  const plus = (n: number) => iso(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + n)));
  const yesterday = plus(-1);

  // Your deadlines in 7, 3, 1 and 0 days; their deadlines that passed yesterday.
  const { data: rows, error } = await admin
    .from("deadlines")
    .select("id, user_id, case_id, title, due_date, owner, last_reminded_on, cases(title)")
    .eq("done", false)
    .or(`and(owner.eq.you,due_date.in.(${[plus(7), plus(3), plus(1), today].join(",")})),and(owner.eq.them,due_date.eq.${yesterday})`);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const due = (rows ?? []).filter((r) => r.last_reminded_on !== today);
  const byUser = new Map<string, typeof due>();
  for (const r of due) byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r]);

  let sent = 0;
  for (const [userId, items] of byUser) {
    const { data: prof } = await admin.from("profiles").select("full_name, remind_email, plan, plan_status, phone, sms_opt_in").eq("id", userId).maybeSingle();
    if (!prof || prof.plan !== "premium" || !["active", "trialing", "past_due"].includes(prof.plan_status ?? "")) continue;
    const { data: u } = await admin.auth.admin.getUserById(userId);
    const email = prof.remind_email === false ? null : u?.user?.email;
    const first = (prof?.full_name ?? "").split(" ")[0];
    const lines = items.map((r) => {
      // deno-lint-ignore no-explicit-any
      const caseTitle = (r as any).cases?.title ?? "your case";
      if (r.owner === "them") return `• ${caseTitle}: their reply was due ${r.due_date}. If nothing came, it's time for a follow-up.`;
      const days = Math.round((Date.parse(r.due_date) - Date.parse(today)) / 86400000);
      return `• ${caseTitle}: ${r.title} — ${days === 0 ? "due today" : `due in ${days} day${days === 1 ? "" : "s"}`} (${r.due_date}).`;
    });
    const text = `${first ? `Hi ${first},` : "Hi,"}\n\nA quick nudge from Take it back:\n\n${lines.join("\n")}\n\nOpen your cases: ${SITE}/app\n\nYou can turn these emails off in Settings.\n— Take it back (information and self-help tools, not legal advice)`;
    let delivered = false;
    if (resendKey && email) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [email], subject: items.length === 1 ? `Reminder: ${items[0].title}` : `${items.length} reminders from Take it back`, text }),
      });
      delivered = delivered || res.ok;
    }
    if (smsOn && prof.sms_opt_in && prof.phone) {
      const top = items[0];
      // deno-lint-ignore no-explicit-any
      const caseTitle = (top as any).cases?.title ?? "your case";
      const sms = `Take it back: ${top.owner === "them" ? `${caseTitle}: their reply was due ${top.due_date}.` : `${top.title} for ${caseTitle} is due ${top.due_date}.`}${items.length > 1 ? ` +${items.length - 1} more.` : ""} ${SITE}/app Reply STOP to opt out.`;
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twSid}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${btoa(`${twSid}:${twToken}`)}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ To: prof.phone, From: twFrom!, Body: sms.slice(0, 320) }),
      });
      delivered = delivered || res.ok;
    }
    if (delivered) {
      sent++;
      await admin.from("deadlines").update({ last_reminded_on: today }).in("id", items.map((i) => i.id));
    }
  }
  return Response.json({ ok: true, sent });
});
