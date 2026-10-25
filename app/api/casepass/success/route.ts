import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { grantCasePass } from "@/lib/plan";

// Stripe sends the person back here after paying. The webhook grants the pass too; whichever arrives first wins.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId || !stripeConfigured()) return NextResponse.redirect(`${url.origin}/app`);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const s = await stripe().checkout.sessions.retrieve(sessionId);
  const caseId = s.metadata?.case_id;
  if (s.metadata?.kind !== "case_pass" || !caseId || !user || s.metadata.user_id !== user.id) return NextResponse.redirect(`${url.origin}/app`);
  if (s.payment_status !== "paid") return NextResponse.redirect(`${url.origin}/app/cases/${caseId}?error=confirm`);
  const ref = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id || s.id;
  try {
    await grantCasePass(supabase, { userId: user.id, caseId, ref, source: "stripe", amount: s.amount_total });
  } catch {
    return NextResponse.redirect(`${url.origin}/app/cases/${caseId}?error=confirm`);
  }
  return NextResponse.redirect(`${url.origin}/app/cases/${caseId}?unlocked=1`);
}
