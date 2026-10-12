import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { emailConfigured, sendEmail } from "@/lib/email";
import { reminderEmail, type ReminderItem } from "@/lib/emails/templates";

// Called by the daily-reminders job with the Supabase service key as the bearer token.
// Only the service key can look up an account's email (auth admin), so nobody else can use this to send mail.
// The message always goes to the account's own address.
export async function POST(request: Request) {
  if (!emailConfigured()) return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 503 });
  const key = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const { userId, subject, text, name, items } = (await request.json().catch(() => ({}))) as { userId?: string; subject?: string; text?: string; name?: string | null; items?: ReminderItem[] };
  if (!key || !userId || !/^[0-9a-f-]{36}$/.test(userId) || (!items?.length && (!subject || !text))) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const e = items?.length ? reminderEmail(name, items.slice(0, 20)) : null;
  const r = e ? await sendEmail(data.user.email, e.subject, e.text, e.html) : await sendEmail(data.user.email, subject!, text!.slice(0, 5000));
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
