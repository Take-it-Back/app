import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { periodEnd, stripe, stripeConfigured } from "@/lib/stripe";
import { applyBilling } from "@/lib/plan";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !sessionId || !stripeConfigured()) return NextResponse.redirect(`${url.origin}/app`);

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
    if (session.client_reference_id !== user.id) throw new Error("Session does not belong to this user");
    const sub = session.subscription as Stripe.Subscription | null;
    if (sub) {
      await applyBilling(supabase, {
        userId: user.id,
        customer: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
        subscription: sub.id,
        status: sub.status,
        periodEnd: periodEnd(sub),
      });
    }
    return NextResponse.redirect(`${url.origin}/app?upgraded=1`);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(`${url.origin}/app/upgrade?error=confirm`);
  }
}
