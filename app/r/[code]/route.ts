import { NextResponse } from "next/server";

// Referral links: takeitback.app/r/<code>. Remember who invited this person for 30 days, then send them on.
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const url = new URL(request.url);
  const to = url.searchParams.get("to");
  const dest = to && /^\/(w\/[0-9a-f-]{36}|pricing|fight\/[a-z-]+)?$/.test(to) ? to : "/";
  const res = NextResponse.redirect(new URL(dest, url.origin), 307);
  if (/^[a-z0-9]{6,12}$/i.test(code)) res.cookies.set("tib_ref", code.toLowerCase(), { maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax", httpOnly: true, secure: true });
  return res;
}
