import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The iPhone app saves its Apple notification token here, and removes it when alerts are turned off.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  if (typeof token !== "string" || !/^[0-9a-fA-F]{32,200}$/.test(token)) return NextResponse.json({ error: "Bad token" }, { status: 400 });
  const { error } = await supabase.rpc("claim_device_token", { p_token: token, p_platform: "ios" });
  if (error) return NextResponse.json({ error: "Couldn't turn on alerts. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  if (typeof token === "string") await supabase.from("device_tokens").delete().eq("token", token.toLowerCase());
  else await supabase.from("device_tokens").delete().eq("user_id", data.claims.sub as string);
  return NextResponse.json({ ok: true });
}
