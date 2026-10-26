import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { playReady } from "@/lib/google";
import { applyGoogleCasePass, applyGoogleSubscription } from "@/lib/googleBilling";

// The Android app posts Google Play purchase tokens here after a purchase or "Restore purchases".
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (!playReady()) return NextResponse.json({ error: "Google Play purchases aren't switched on yet." }, { status: 503 });
  const body = (await request.json().catch(() => ({}))) as { kind?: string; purchaseToken?: unknown; caseId?: string };
  const tokens = (Array.isArray(body.purchaseToken) ? body.purchaseToken : [body.purchaseToken]).filter((t): t is string => typeof t === "string" && t.length < 4096).slice(0, 10);
  if (!tokens.length) return NextResponse.json({ error: "Nothing to check." }, { status: 400 });
  try {
    if (body.kind === "case_pass") {
      if (typeof body.caseId !== "string") return NextResponse.json({ error: "Missing case." }, { status: 400 });
      const r = await applyGoogleCasePass(supabase, tokens[0], user.id, body.caseId);
      return NextResponse.json(r, { status: r.ok ? 200 : 400 });
    }
    let last: { ok: boolean; premium?: boolean; error?: string } = { ok: false, error: "No active subscription found." };
    for (const t of tokens) {
      const r = await applyGoogleSubscription(supabase, t, user.id);
      if (r.ok && r.premium) return NextResponse.json(r);
      last = r;
    }
    return NextResponse.json(last, { status: last.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ error: "We couldn't confirm this purchase with Google. Please try again." }, { status: 502 });
  }
}
