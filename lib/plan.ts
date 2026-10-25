import type { SupabaseClient } from "@supabase/supabase-js";

export const PRICES = {
  monthly: { amount: 1499, label: "$14.99", interval: "month" as const, per: "a month" },
  yearly: { amount: 5900, label: "$59", interval: "year" as const, per: "a year" },
};
/** What the yearly plan saves against paying monthly for a year, in percent. */
export const YEARLY_SAVES = Math.round((1 - PRICES.yearly.amount / (PRICES.monthly.amount * 12)) * 100);
/** The free trial is offered on the yearly plan only. */
export const TRIAL_DAYS = 7;
export const TRIAL_PLAN = "yearly" as const;
export const FREE_SCANS_PER_MONTH = 1;
/** One-time unlock of a single case. */
export const CASE_PASS = { amount: 2499, label: "$24.99", days: 60 };

/** The auto-renewal terms shown next to the button and saved with the person's consent (California ARL and similar laws). */
export function renewalTerms(which: keyof typeof PRICES, trialEligible: boolean, from = new Date(), freeMonths = 0) {
  const p = PRICES[which];
  const trial = trialEligible && which === TRIAL_PLAN;
  const days = (trial ? TRIAL_DAYS : 0) + freeMonths * 30;
  const first = new Date(from.getTime() + days * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
  return days > 0
    ? `Free for ${days} days, then ${p.label} ${p.per} starting ${first}, renewing automatically every ${p.interval} until you cancel. Cancel online anytime in Settings before ${first} and you won't be charged.`
    : `${p.label} ${p.per}, charged today and renewing automatically every ${p.interval} until you cancel. Cancel online anytime in Settings; you keep Premium until the end of the period you paid for.`;
}

export type PlanInfo = { premium: boolean; status: string | null; periodEnd: string | null; customer: string | null; source: "stripe" | "apple" | null };

export async function getPlan(supabase: SupabaseClient, userId: string): Promise<PlanInfo> {
  const { data } = await supabase
    .from("profiles")
    .select("plan, plan_status, current_period_end, stripe_customer_id, billing_source")
    .eq("id", userId)
    .maybeSingle();
  const premium = data?.plan === "premium" && ["active", "trialing", "past_due"].includes(data?.plan_status || "");
  return { premium, status: data?.plan_status ?? null, periodEnd: data?.current_period_end ?? null, customer: data?.stripe_customer_id ?? null, source: (data?.billing_source as PlanInfo["source"]) ?? null };
}

/** Premium for this case: your own plan, or the case owner's when you're a helper on it. */
export async function getCasePremium(supabase: SupabaseClient, userId: string, caseId: string) {
  const [plan, { data }] = await Promise.all([getPlan(supabase, userId), supabase.rpc("case_premium", { p_case: caseId })]);
  return plan.premium || data === true;
}

export async function scansThisMonth(supabase: SupabaseClient) {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const { count } = await supabase.from("cases").select("id", { count: "exact", head: true }).gte("created_at", start).eq("is_demo", false);
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

/** Records a paid case pass through the locked-down database function. Safe to call twice for the same payment. */
export async function grantCasePass(
  supabase: SupabaseClient,
  args: { userId: string; caseId: string; ref: string; source: "stripe" | "apple"; amount: number | null }
) {
  const { data, error } = await supabase.rpc("grant_case_pass", {
    p_secret: process.env.BILLING_SECRET,
    p_user: args.userId,
    p_case: args.caseId,
    p_ref: args.ref,
    p_source: args.source,
    p_days: CASE_PASS.days,
    p_amount: args.amount,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function revokeCasePass(supabase: SupabaseClient, ref: string) {
  await supabase.rpc("revoke_case_pass", { p_secret: process.env.BILLING_SECRET, p_ref: ref });
}
