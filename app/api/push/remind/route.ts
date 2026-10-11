import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { pushReady, sendPushToSelf } from "@/lib/push";

// Called by the daily-reminders job. The caller passes a Supabase key as the bearer token and we read
// subscriptions with it, so row security decides what it can reach: only the service key sees other people's
// devices. The message text is fixed here (never taken from the request), so it can't be misused to send anything else.
export async function POST(request: Request) {
  if (!pushReady()) return NextResponse.json({ ok: false, error: "Push not configured" }, { status: 503 });
  const key = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!key) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId, count, overdue } = (await request.json().catch(() => ({}))) as { userId?: string; count?: number; overdue?: boolean };
  if (!userId || !/^[0-9a-f-]{36}$/.test(userId)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const n = Math.max(1, Math.min(20, Math.floor(Number(count) || 1)));
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });
  const body = overdue ? "A reply you were waiting for is overdue." : `You have ${n} deadline${n === 1 ? "" : "s"} coming up.`;
  const r = await sendPushToSelf(supabase, userId, { title: "Take it back", body, url: "/app/dates" });
  return NextResponse.json({ ok: true, ...r });
}
