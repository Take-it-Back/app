import Stripe from "stripe";

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY as string);
}

/** current_period_end moved onto subscription items in newer API versions. */
export function periodEnd(sub: Stripe.Subscription): number | null {
  const s = sub as unknown as { current_period_end?: number; items?: { data?: { current_period_end?: number }[] } };
  return s.current_period_end ?? s.items?.data?.[0]?.current_period_end ?? null;
}
