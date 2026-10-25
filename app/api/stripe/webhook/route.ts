import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { periodEnd, stripe } from "@/lib/stripe";
import { applyBilling, grantCasePass, PRICES, revokeCasePass } from "@/lib/plan";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { paymentFailedEmail, referralRewardEmail, renewalReminderEmail, subscriptionEndedEmail, subscriptionStartedEmail, trialEndingEmail, type Email } from "@/lib/emails/templates";

const usd = (cents: number) => (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0 });
const day = (unix: number) => new Date(unix * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
const custId = (c: string | Stripe.Customer | Stripe.DeletedCustomer | null) => (typeof c === "string" ? c : c?.id) || null;

/** Email a Stripe customer, using the address and name on their Stripe record. */
async function mailCustomer(customer: string | null, make: (name: string | null) => Email) {
  if (!customer) return;
  try {
    const c = await stripe().customers.retrieve(customer);
    if (c.deleted || !c.email) return;
    const e = make(c.name || null);
    await sendEmail(c.email, e.subject, e.text, e.html);
  } catch (err) {
    console.error("email failed", err);
  }
}

function priceLabel(sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  const amt = item?.price?.unit_amount ?? PRICES.monthly.amount;
  const yearly = item?.price?.recurring?.interval === "year";
  return { yearly, text: `${usd(amt)} a ${yearly ? "year" : "month"}`, plan: `Premium, ${yearly ? "yearly" : "monthly"}` };
}

/** Give-a-month, get-a-month: a month's credit for the new subscriber and the friend who invited them. */
async function rewardReferral(supabase: SupabaseClient, userId: string, bankedUsed: number) {
  const secret = process.env.BILLING_SECRET;
  if (bankedUsed > 0) await supabase.rpc("referral_bank_month", { p_secret: secret, p_user: userId, p_delta: -bankedUsed });
  const { data } = await supabase.rpc("referral_reward", { p_secret: secret, p_user: userId });
  const row = (data as { referrer: string; referrer_customer: string | null; friend_customer: string | null }[] | null)?.[0];
  if (!row) return;
  const credit = (customer: string, who: string) =>
    stripe().customers.createBalanceTransaction(customer, { amount: -PRICES.monthly.amount, currency: "usd", description: `Referral reward: one free month (${who})` });
  if (row.friend_customer) await credit(row.friend_customer, "joined with a friend's link");
  if (row.referrer_customer) {
    await credit(row.referrer_customer, "a friend joined");
    await mailCustomer(row.referrer_customer, (name) => referralRewardEmail({ name, applied: true }));
  } else await supabase.rpc("referral_bank_month", { p_secret: secret, p_user: row.referrer, p_delta: 1 });
}

// Keeps plans in sync when subscriptions start, renew, fail or end, and sends the matching email.
// Stripe webhook events to enable: checkout.session.completed, customer.subscription.created/updated/deleted,
// customer.subscription.trial_will_end, invoice.upcoming, invoice.payment_failed.
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
    if (event.type === "checkout.session.completed" && (event.data.object as Stripe.Checkout.Session).metadata?.kind === "case_pass") {
      const s = event.data.object as Stripe.Checkout.Session;
      const caseId = s.metadata?.case_id;
      const userId = s.metadata?.user_id;
      if (s.payment_status === "paid" && caseId && userId) {
        const ref = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id || s.id;
        await grantCasePass(supabase, { userId, caseId, ref, source: "stripe", amount: s.amount_total });
      }
    } else if (event.type === "charge.refunded") {
      // A refunded case pass stops unlocking the case.
      const ch = event.data.object as Stripe.Charge;
      const pi = typeof ch.payment_intent === "string" ? ch.payment_intent : ch.payment_intent?.id;
      if (pi && ch.metadata?.kind !== "send" && ch.refunded) await revokeCasePass(supabase, pi);
    } else if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.subscription && s.client_reference_id) {
        const sub = await stripe().subscriptions.retrieve(typeof s.subscription === "string" ? s.subscription : s.subscription.id);
        const customer = custId(s.customer);
        await applyBilling(supabase, { userId: s.client_reference_id, customer, subscription: sub.id, status: sub.status, periodEnd: periodEnd(sub) });
        await rewardReferral(supabase, s.client_reference_id, Number(sub.metadata?.banked_months || 0));
        // Confirmation with the renewal terms they agreed to (auto-renewal laws require this acknowledgment).
        const pl = priceLabel(sub);
        const trialEnds = sub.trial_end ? day(sub.trial_end) : null;
        await mailCustomer(customer, (name) =>
          subscriptionStartedEmail({ name, plan: pl.plan, price: pl.text, trialEnds, firstCharge: trialEnds || day(Math.floor(Date.now() / 1000)), terms: String(sub.metadata?.renewal_terms || `${pl.text}, renewing automatically until you cancel. Cancel online anytime in Settings.`) })
        );
      }
    } else if (event.type === "customer.subscription.trial_will_end") {
      const sub = event.data.object as Stripe.Subscription;
      if (sub.trial_end && sub.status === "trialing" && !sub.cancel_at_period_end) {
        const pl = priceLabel(sub);
        await mailCustomer(custId(sub.customer), (name) => trialEndingEmail({ name, ends: day(sub.trial_end!), price: pl.text }));
      }
    } else if (event.type === "invoice.upcoming") {
      // Stripe sends this ahead of each renewal; only yearly plans get a reminder.
      const inv = event.data.object as Stripe.Invoice;
      const line = inv.lines?.data?.[0] as (Stripe.InvoiceLineItem & { price?: Stripe.Price | null }) | undefined;
      const yearly = line?.price?.recurring?.interval === "year" || (line?.period && line.period.end - line.period.start > 200 * 86400);
      if (yearly && inv.next_payment_attempt) {
        await mailCustomer(custId(inv.customer), (name) => renewalReminderEmail({ name, date: day(inv.next_payment_attempt!), price: usd(inv.amount_due) }));
      }
    } else if (event.type === "invoice.payment_failed") {
      const inv = event.data.object as Stripe.Invoice;
      if (inv.amount_due > 0) await mailCustomer(custId(inv.customer), (name) => paymentFailedEmail({ name, amount: usd(inv.amount_due) }));
    } else if (event.type.startsWith("customer.subscription.")) {
      const sub = event.data.object as Stripe.Subscription;
      const userId = (sub.metadata?.user_id as string) || null;
      await applyBilling(supabase, { userId, customer: custId(sub.customer), subscription: sub.id, status: sub.status, periodEnd: periodEnd(sub) });
      if (event.type === "customer.subscription.deleted") await mailCustomer(custId(sub.customer), (name) => subscriptionEndedEmail({ name }));
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
