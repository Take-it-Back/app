import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { appleSigninReady, exchangeAppleCode } from "@/lib/appleSignin";

// After Sign in with Apple in the iPhone app: keep Apple's refresh token so it can be revoked if the account is deleted.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!appleSigninReady()) return NextResponse.json({ ok: false, skipped: true });
  const { code } = (await request.json().catch(() => ({}))) as { code?: string };
  if (typeof code !== "string" || code.length > 500) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const clientId = process.env.APPLE_BUNDLE_ID || "app.takeitback";
  const token = await exchangeAppleCode(code, clientId).catch(() => null);
  if (!token) return NextResponse.json({ ok: false }, { status: 502 });
  const { error } = await supabase.rpc("save_apple_refresh_token", { p_token: token, p_client_id: clientId });
  return NextResponse.json({ ok: !error });
}
