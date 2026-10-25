import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { PRICES, TRIAL_DAYS, TRIAL_PLAN, getPlan, renewalTerms } from "@/lib/plan";

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
  // Auto-renewal laws: the person must tick the box agreeing to the renewal terms; keep a record of what they agreed to.
  if (form.get("agree") !== "on") return NextResponse.redirect(`${origin}/app/upgrade?error=agree`, { status: 303 });
  // The free trial is for new subscribers on the yearly plan.
  const trial = !plan.status && which === TRIAL_PLAN;
  // Free months earned from referrals (banked before they had a subscription) extend the trial.
  const { data: prof } = await supabase.from("profiles").select("referral_credit_months").eq("id", user.id).maybeSingle();
  const banked = Math.min(12, prof?.referral_credit_months || 0);
  const trialDays = (trial ? TRIAL_DAYS : 0) + banked * 30;
  const terms = renewalTerms(which, trial, new Date(), banked);
  const agreedAt = new Date().toISOString();
  await supabase.from("profiles").update({ renewal_consent_at: agreedAt, renewal_consent_text: terms }).eq("id", user.id);

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
    subscription_data: { trial_period_days: trialDays || undefined, metadata: { user_id: user.id, banked_months: String(banked), renewal_consent_at: agreedAt, renewal_terms: terms.slice(0, 480) } },
    custom_text: { submit: { message: terms.slice(0, 1000) } },
    allow_promotion_codes: true,
    success_url: `${origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/app/upgrade?canceled=1`,
  });
  return NextResponse.redirect(session.url as string, { status: 303 });
}
