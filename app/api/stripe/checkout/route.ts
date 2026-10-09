import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { PRICES, TRIAL_DAYS, getPlan } from "@/lib/plan";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?next=/app/upgrade`, { status: 303 });
  if (!stripeConfigured()) return NextResponse.redirect(`${origin}/app/upgrade?error=billing`, { status: 303 });

  const form = await request.formData();
  const which = form.get("plan") === "yearly" ? "yearly" : "monthly";
  const price = PRICES[which];
  const plan = await getPlan(supabase, user.id);
  if (plan.premium) return NextResponse.redirect(`${origin}/app/you`, { status: 303 });

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    ...(plan.customer ? { customer: plan.customer } : { customer_email: user.email }),
    client_reference_id: user.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: price.amount,
          recurring: { interval: price.interval },
          product_data: { name: "Take it back Premium", description: "Letters, case tracking, reminders and reply help" },
        },
      },
    ],
    subscription_data: { trial_period_days: plan.status ? undefined : TRIAL_DAYS, metadata: { user_id: user.id } },
    allow_promotion_codes: true,
    success_url: `${origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/app/upgrade?canceled=1`,
  });
  return NextResponse.redirect(session.url as string, { status: 303 });
}
