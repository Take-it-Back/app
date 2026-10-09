import type { SupabaseClient } from "@supabase/supabase-js";

export const PRICES = {
  monthly: { amount: 999, label: "$9.99", interval: "month" as const, per: "a month" },
  yearly: { amount: 5900, label: "$59", interval: "year" as const, per: "a year" },
};
export const TRIAL_DAYS = 7;
export const FREE_SCANS_PER_MONTH = 3;

export type PlanInfo = { premium: boolean; status: string | null; periodEnd: string | null; customer: string | null };

export async function getPlan(supabase: SupabaseClient, userId: string): Promise<PlanInfo> {
  const { data } = await supabase
    .from("profiles")
    .select("plan, plan_status, current_period_end, stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();
  const premium = data?.plan === "premium" && ["active", "trialing", "past_due"].includes(data?.plan_status || "");
  return { premium, status: data?.plan_status ?? null, periodEnd: data?.current_period_end ?? null, customer: data?.stripe_customer_id ?? null };
}

export async function scansThisMonth(supabase: SupabaseClient) {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const { count } = await supabase.from("cases").select("id", { count: "exact", head: true }).gte("created_at", start);
  return count ?? 0;
}

/** Records a Stripe subscription state through the locked-down database function. */
export async function applyBilling(
  supabase: SupabaseClient,
  args: { userId?: string | null; customer: string | null; subscription: string | null; status: string; periodEnd: number | null }
) {
  const { error } = await supabase.rpc("billing_apply", {
    p_secret: process.env.BILLING_SECRET,
    p_user: args.userId ?? null,
    p_customer: args.customer,
    p_subscription: args.subscription,
    p_status: args.status,
    p_period_end: args.periodEnd ? new Date(args.periodEnd * 1000).toISOString() : null,
  });
  if (error) throw new Error(error.message);
}
