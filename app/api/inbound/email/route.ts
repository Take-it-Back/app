import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeCase } from "@/lib/analyzeCase";

// Inbound email (Postmark inbound webhook format). Each person forwards bills to <their token>@<INBOUND_DOMAIN>.
export const maxDuration = 60;

type Attachment = { Name: string; Content: string; ContentType: string; ContentLength: number };
type Inbound = {
  From?: string;
  FromFull?: { Email?: string; Name?: string };
  Subject?: string;
  TextBody?: string;
  MailboxHash?: string;
  OriginalRecipient?: string;
  ToFull?: { Email?: string; MailboxHash?: string }[];
  Attachments?: Attachment[];
};

const OK_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

function authorized(request: Request) {
  const secret = process.env.INBOUND_SECRET;
  if (!secret) return false;
  const url = new URL(request.url);
  if (url.searchParams.get("key") === secret) return true;
  const auth = request.headers.get("authorization") || "";
  if (auth.startsWith("Basic ")) {
    const [, pass] = Buffer.from(auth.slice(6), "base64").toString().split(":");
    return pass === secret;
  }
  return false;
}

function tokenFrom(m: Inbound) {
  const candidates = [m.MailboxHash, m.OriginalRecipient, ...(m.ToFull || []).flatMap((t) => [t.MailboxHash, t.Email])].filter(Boolean) as string[];
  for (const c of candidates) {
    const local = c.split("@")[0].toLowerCase();
    const hit = local.match(/(?:^|\+)([a-f0-9]{10})$/);
    if (hit) return hit[1];
  }
  return null;
}

export async function POST(request: Request) {
  // 403 tells the sender to stop retrying.
  if (!authorized(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const msg = (await request.json().catch(() => ({}))) as Inbound;
  const token = tokenFrom(msg);
  if (!token) return NextResponse.json({ ok: true, skipped: "no recipient token" });

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: prof } = await admin.from("profiles").select("id, plan, plan_status, state").eq("inbox_token", token).maybeSingle();
  if (!prof) return NextResponse.json({ ok: true, skipped: "unknown inbox" });
  const premium = prof.plan === "premium" && ["active", "trialing", "past_due"].includes(prof.plan_status || "");
  if (!premium) return NextResponse.json({ ok: true, skipped: "not premium" });

  const subject = (msg.Subject || "Forwarded document").replace(/^(fwd?|fw):\s*/i, "").slice(0, 80);
  const { data: c, error } = await admin
    .from("cases")
    .insert({ user_id: prof.id, category: "other", title: subject || "Forwarded document", status: "analyzing", received_date: new Date().toISOString().slice(0, 10), user_state: prof.state })
    .select("id")
    .single();
  if (error || !c) return NextResponse.json({ error: "Could not create case" }, { status: 500 });

  const files = (msg.Attachments || []).filter((a) => OK_TYPES.includes(a.ContentType) && a.ContentLength <= 20 * 1024 * 1024).slice(0, 5);
  for (const [i, a] of files.entries()) {
    const path = `${prof.id}/${c.id}/${Date.now()}-${i}-${a.Name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60)}`;
    const up = await admin.storage.from("case-files").upload(path, Buffer.from(a.Content, "base64"), { contentType: a.ContentType });
    if (!up.error) await admin.from("documents").insert({ case_id: c.id, user_id: prof.id, kind: "original", storage_path: path, file_name: a.Name, mime_type: a.ContentType, label: a.Name });
  }
  const from = msg.FromFull?.Email || msg.From || "email";
  await admin.from("events").insert({ case_id: c.id, user_id: prof.id, title: `Forwarded by email from ${from}`.slice(0, 200), detail: files.length ? `${files.length} attachment${files.length > 1 ? "s" : ""}` : (msg.TextBody || "").slice(0, 1500) || null });

  await analyzeCase(admin, prof.id, c.id, true, "Read automatically");
  return NextResponse.json({ ok: true, caseId: c.id });
}
