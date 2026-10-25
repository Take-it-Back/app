import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next") || "/app";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/app";
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as "signup" | "recovery" | "email" });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  // Apple or Google sent the person back without signing in (they canceled, or the provider refused).
  const oauthError = searchParams.get("error_description") || searchParams.get("error");
  if (oauthError) {
    const canceled = /cancel|access_denied/i.test(oauthError);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(canceled ? "Sign-in was canceled. You can try again or use your email." : "That sign-in didn't work. Please try again or use your email.")}`);
  }
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("That link didn't work or has expired. Please sign in or try again.")}`);
}
