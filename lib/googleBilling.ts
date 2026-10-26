// Server only. Saves Google Play subscription and case pass state, after looking each purchase up at Google.
import type { SupabaseClient } from "@supabase/supabase-js";
import { acknowledgeSubscription, consumeProduct, googleProduct, googleSubscription, GOOGLE_PRODUCTS } from "@/lib/google";
import { CASE_PASS, grantCasePass } from "@/lib/plan";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns the account it was saved on, or an error. `expectUser` is the signed-in person when called from the app. */
export async function applyGoogleSubscription(supabase: SupabaseClient, purchaseToken: string, expectUser: string | null) {
  const s = await googleSubscription(purchaseToken);
  const owner = s.userHint && UUID.test(s.userHint) ? s.userHint.toLowerCase() : null;
  if (!owner) return { ok: false as const, error: "This purchase isn't linked to a Take it back account." };
  if (expectUser && owner !== expectUser) return { ok: false as const, error: "This Google Play subscription belongs to a different Take it back account." };
  const { error } = await supabase.rpc("billing_apply_google", {
    p_secret: process.env.BILLING_SECRET,
    p_user: owner,
    p_token: purchaseToken,
    p_status: s.status,
    p_period_end: s.periodEnd,
    p_signed_at: new Date().toISOString(),
  });
  if (error) return { ok: false as const, error: "We couldn't save your subscription. Please try again." };
  if (!s.acknowledged && s.productId && ["active", "trialing"].includes(s.status)) await acknowledgeSubscription(s.productId, purchaseToken).catch(() => {});
  return { ok: true as const, premium: ["active", "trialing", "past_due"].includes(s.status), status: s.status };
}

export async function applyGoogleCasePass(supabase: SupabaseClient, purchaseToken: string, userId: string, caseId: string) {
  const p = await googleProduct(GOOGLE_PRODUCTS.casePass, purchaseToken);
  if (!p.paid) return { ok: false as const, error: "Google hasn't confirmed this payment yet." };
  if (p.userHint && p.userHint.toLowerCase() !== userId) return { ok: false as const, error: "This purchase belongs to a different account." };
  const until = await grantCasePass(supabase, { userId, caseId, ref: `google:${p.orderId || purchaseToken.slice(0, 120)}`, source: "google", amount: CASE_PASS.amount });
  // Consumed so the case pass can be bought again for another case.
  if (!p.consumed) await consumeProduct(GOOGLE_PRODUCTS.casePass, purchaseToken).catch(() => {});
  return { ok: true as const, until };
}
