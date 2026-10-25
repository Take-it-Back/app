import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { CASE_PASS, getCasePremium } from "@/lib/plan";

// One-time payment to unlock a single case for 60 days.
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?next=/app`, { status: 303 });
  const form = await request.formData();
  const caseId = String(form.get("case_id") || "");
  const { data: c } = await supabase.from("cases").select("id, title, user_id").eq("id", caseId).maybeSingle();
  if (!c || c.user_id !== user.id) return NextResponse.redirect(`${origin}/app/cases`, { status: 303 });
  if (await getCasePremium(supabase, user.id, caseId)) return NextResponse.redirect(`${origin}/app/cases/${caseId}`, { status: 303 });
  if (!stripeConfigured()) return NextResponse.redirect(`${origin}/app/cases/${caseId}?error=billing`, { status: 303 });

  const { data: prof } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    ...(prof?.stripe_customer_id ? { customer: prof.stripe_customer_id } : { customer_email: user.email, customer_creation: "always" }),
    client_reference_id: user.id,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: CASE_PASS.amount,
        product_data: { name: "Case pass", description: `Letters, deadlines and reply help for "${c.title}" for ${CASE_PASS.days} days. One-time payment, no subscription.`.slice(0, 300) },
      },
    }],
    metadata: { kind: "case_pass", user_id: user.id, case_id: caseId },
    payment_intent_data: { metadata: { kind: "case_pass", user_id: user.id, case_id: caseId } },
    custom_text: { submit: { message: `One-time payment of ${CASE_PASS.label}. Unlocks this case for ${CASE_PASS.days} days. Nothing renews.` } },
    allow_promotion_codes: true,
    success_url: `${origin}/api/casepass/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/app/cases/${caseId}?canceled=1`,
  });
  return NextResponse.redirect(session.url as string, { status: 303 });
}
