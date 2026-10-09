// Daily deadline reminders. Runs from pg_cron once a day.
// Sends email through Resend when RESEND_API_KEY is set; otherwise it only records nothing and exits.
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
  if (!resendKey) return Response.json({ ok: true, sent: 0, note: "RESEND_API_KEY not set" });

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
    const { data: prof } = await admin.from("profiles").select("full_name, remind_email").eq("id", userId).maybeSingle();
    if (prof && prof.remind_email === false) continue;
    const { data: u } = await admin.auth.admin.getUserById(userId);
    const email = u?.user?.email;
    if (!email) continue;
    const first = (prof?.full_name ?? "").split(" ")[0];
    const lines = items.map((r) => {
      // deno-lint-ignore no-explicit-any
      const caseTitle = (r as any).cases?.title ?? "your case";
      if (r.owner === "them") return `• ${caseTitle}: their reply was due ${r.due_date}. If nothing came, it's time for a follow-up.`;
      const days = Math.round((Date.parse(r.due_date) - Date.parse(today)) / 86400000);
      return `• ${caseTitle}: ${r.title} — ${days === 0 ? "due today" : `due in ${days} day${days === 1 ? "" : "s"}`} (${r.due_date}).`;
    });
    const text = `${first ? `Hi ${first},` : "Hi,"}\n\nA quick nudge from Take it back:\n\n${lines.join("\n")}\n\nOpen your cases: ${SITE}/app\n\nYou can turn these emails off on the You page.\n— Take it back (information and self-help tools, not legal advice)`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [email], subject: items.length === 1 ? `Reminder: ${items[0].title}` : `${items.length} reminders from Take it back`, text }),
    });
    if (res.ok) {
      sent++;
      await admin.from("deadlines").update({ last_reminded_on: today }).in("id", items.map((i) => i.id));
    }
  }
  return Response.json({ ok: true, sent });
});
