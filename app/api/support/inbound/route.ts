import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyCustomerReply, notifyNewTicket } from "@/lib/support";

// Email sent to any @takeitback.app address arrives here from Resend (webhook event "email.received").
// The webhook only names the email; we fetch it from Resend with our own key, so a forged call can't inject anything.
export const maxDuration = 30;

type Received = {
  id: string;
  from: string;
  to?: string[];
  subject?: string | null;
  text?: string | null;
  html?: string | null;
  headers?: Record<string, string | string[]>;
};

const header = (h: Received["headers"], name: string) => {
  const v = Object.entries(h || {}).find(([k]) => k.toLowerCase() === name)?.[1];
  return Array.isArray(v) ? v.join(", ") : v || "";
};

function parseFrom(from: string) {
  const m = from.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].trim() || null, email: m[2].trim().toLowerCase() } : { name: null, email: from.trim().toLowerCase() };
}

/** Plain text of the new part only: drops quoted earlier messages and signatures' reply chains. */
function newText(r: Received) {
  let t = r.text || (r.html || "").replace(/<(br|\/p|\/div)[^>]*>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  t = t.replace(/\r\n/g, "\n");
  const cut = t.search(/\n\s*(On .{0,200}wrote:|-{2,}\s*Original Message|From: .*\nSent: )/i);
  if (cut > 0) t = t.slice(0, cut);
  return t.split("\n").filter((l) => !l.startsWith(">")).join("\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, 5000);
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !process.env.BILLING_SECRET) return NextResponse.json({ ok: true, skipped: "not configured" });
  const event = (await request.json().catch(() => ({}))) as { type?: string; data?: { email_id?: string; id?: string } };
  if (event.type !== "email.received") return NextResponse.json({ ok: true, skipped: "other event" });
  const emailId = event.data?.email_id || event.data?.id;
  if (!emailId || !/^[\w-]{8,64}$/.test(emailId)) return NextResponse.json({ ok: true, skipped: "no email id" });

  const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) return NextResponse.json({ error: "Could not fetch email" }, { status: res.status === 404 ? 200 : 502 });
  const r = (await res.json()) as Received;

  // This Resend account also serves other apps' domains; only mail to takeitback.app belongs here.
  if (!(r.to || []).some((x) => /@takeitback\.app>?$/i.test(x.trim()))) return NextResponse.json({ ok: true, skipped: "other domain" });
  const { name, email } = parseFrom(r.from || "");
  // Skip bounces, auto-replies and mailing lists so they don't open requests.
  const auto = header(r.headers, "auto-submitted");
  const precedence = header(r.headers, "precedence");
  if (/mailer-daemon|postmaster|no-?reply|bounce/i.test(email) || (auto && auto.toLowerCase() !== "no") || /bulk|list|junk/i.test(precedence) || header(r.headers, "list-unsubscribe")) {
    return NextResponse.json({ ok: true, skipped: "automated" });
  }
  const body = newText(r) || "(The email had no text. Check Resend for attachments.)";
  const to = (r.to || []).join(", ").slice(0, 200);

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("support_inbound", {
    p_secret: process.env.BILLING_SECRET,
    p_email_id: r.id || emailId,
    p_from_email: email,
    p_from_name: name,
    p_subject: r.subject || "",
    p_body: body,
    p_to: to,
  });
  if (error) {
    console.error("support inbound failed", error.message);
    return NextResponse.json({ error: "Try again" }, { status: 500 });
  }
  const t = data as { id?: string; number: number; email: string; name: string | null; subject: string; new: boolean; signed_in_owner: boolean; token: string | null; skipped?: string };
  if (t.skipped || !t.id) return NextResponse.json({ ok: true, skipped: t.skipped });
  const info = { ...t, id: t.id };
  if (t.new) await notifyNewTicket(info, body, `Email to ${to}`);
  else await notifyCustomerReply(info, body, `Email to ${to}`);
  return NextResponse.json({ ok: true, ticket: t.number });
}
