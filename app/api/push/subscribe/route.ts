import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/limits";

type Body = { subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } }; endpoint?: string };

async function signedIn() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return { supabase, userId: data?.claims?.sub as string | undefined };
}

const okEndpoint = (e: unknown): e is string => typeof e === "string" && e.startsWith("https://") && e.length <= 1000;

/** Save this device for phone alerts. */
export async function POST(request: Request) {
  const { supabase, userId } = await signedIn();
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { subscription: s } = (await request.json().catch(() => ({}))) as Body;
  const p256dh = s?.keys?.p256dh;
  const auth = s?.keys?.auth;
  if (!okEndpoint(s?.endpoint) || typeof p256dh !== "string" || typeof auth !== "string" || p256dh.length > 200 || auth.length > 100) {
    return NextResponse.json({ error: "That didn't look right. Please try again." }, { status: 400 });
  }
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ user_id: userId, endpoint: s.endpoint, p256dh, auth, user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null }, { onConflict: "endpoint" });
  if (error) {
    await logError(supabase, "push", error.message, "/api/push/subscribe", userId);
    return NextResponse.json({ error: "Couldn't turn on alerts. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** Forget this device. */
export async function DELETE(request: Request) {
  const { supabase, userId } = await signedIn();
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { endpoint } = (await request.json().catch(() => ({}))) as Body;
  if (!okEndpoint(endpoint)) return NextResponse.json({ error: "Missing device." }, { status: 400 });
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint).eq("user_id", userId);
  if (error) {
    await logError(supabase, "push", error.message, "/api/push/subscribe", userId);
    return NextResponse.json({ error: "Couldn't turn off alerts. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
