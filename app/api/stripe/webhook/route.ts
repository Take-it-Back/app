import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { periodEnd, stripe } from "@/lib/stripe";
import { applyBilling } from "@/lib/plan";

// Keeps plans in sync when subscriptions renew, fail, or are cancelled.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, request.headers.get("stripe-signature") || "", secret);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.subscription && s.client_reference_id) {
        const sub = await stripe().subscriptions.retrieve(typeof s.subscription === "string" ? s.subscription : s.subscription.id);
        await applyBilling(supabase, { userId: s.client_reference_id, customer: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null, subscription: sub.id, status: sub.status, periodEnd: periodEnd(sub) });
      }
    } else if (event.type.startsWith("customer.subscription.")) {
      const sub = event.data.object as Stripe.Subscription;
      const userId = (sub.metadata?.user_id as string) || null;
      await applyBilling(supabase, { userId, customer: typeof sub.customer === "string" ? sub.customer : sub.customer.id, subscription: sub.id, status: sub.status, periodEnd: periodEnd(sub) });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
