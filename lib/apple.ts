// Server only. Checks App Store signatures and turns Apple subscription data into our plan status.
import { Environment, SignedDataVerifier, type JWSTransactionDecodedPayload, type JWSRenewalInfoDecodedPayload } from "@apple/app-store-server-library";
import type { SupabaseClient } from "@supabase/supabase-js";
import { APPLE_ROOTS_B64 } from "@/lib/appleRoots";

import { APPLE_PRODUCTS } from "@/lib/appleProducts";

export const APPLE_BUNDLE_ID = process.env.APPLE_BUNDLE_ID || "app.takeitback";
const PRODUCT_IDS = new Set(Object.values(APPLE_PRODUCTS));

let verifiers: SignedDataVerifier[] | null = null;

/** Production first (needs the numeric App Store app id), then Sandbox, which TestFlight and App Review use. */
function getVerifiers() {
  if (verifiers) return verifiers;
  const roots = APPLE_ROOTS_B64.map((b) => Buffer.from(b, "base64"));
  const appId = Number(process.env.APPLE_APP_ID) || undefined;
  verifiers = [];
  if (appId) verifiers.push(new SignedDataVerifier(roots, true, Environment.PRODUCTION, APPLE_BUNDLE_ID, appId));
  verifiers.push(new SignedDataVerifier(roots, true, Environment.SANDBOX, APPLE_BUNDLE_ID));
  return verifiers;
}

async function firstOk<T>(fn: (v: SignedDataVerifier) => Promise<T>): Promise<T> {
  let last: unknown;
  for (const v of getVerifiers()) {
    try {
      return await fn(v);
    } catch (e) {
      last = e;
    }
  }
  throw last instanceof Error ? last : new Error("Apple signature check failed");
}

export const verifyTransaction = (jws: string) => firstOk((v) => v.verifyAndDecodeTransaction(jws));
export const verifyRenewalInfo = (jws: string) => firstOk((v) => v.verifyAndDecodeRenewalInfo(jws));
export const verifyNotification = (payload: string) => firstOk((v) => v.verifyAndDecodeNotification(payload));

export type AppleState = { originalTx: string; status: string; periodEnd: string | null; userHint: string | null };

/** Maps a verified transaction (plus renewal info, when Apple sends it) to the statuses the rest of the app uses. */
export function appleState(tx: JWSTransactionDecodedPayload, renewal?: JWSRenewalInfoDecodedPayload | null): AppleState | null {
  if (!tx.originalTransactionId || !tx.productId || !PRODUCT_IDS.has(tx.productId)) return null;
  const now = Date.now();
  const expires = tx.expiresDate ?? 0;
  const grace = renewal?.gracePeriodExpiresDate ?? 0;
  let status: string;
  if (tx.revocationDate) status = "canceled";
  else if (expires > now) status = tx.offerType === 1 && tx.offerDiscountType === "FREE_TRIAL" ? "trialing" : "active";
  else if (grace > now) status = "past_due";
  else status = "canceled";
  const end = Math.max(expires, grace);
  return {
    originalTx: tx.originalTransactionId,
    status,
    periodEnd: end ? new Date(end).toISOString() : null,
    userHint: tx.appAccountToken || renewal?.appAccountToken || null,
  };
}

/** Saves the Apple subscription state. Returns the account it was saved on (null if no account matched). */
export async function applyApple(supabase: SupabaseClient, userId: string | null, s: AppleState): Promise<string | null> {
  const { data, error } = await supabase.rpc("billing_apply_apple", {
    p_secret: process.env.BILLING_SECRET,
    p_user: userId,
    p_original_tx: s.originalTx,
    p_status: s.status,
    p_period_end: s.periodEnd,
  });
  if (error) throw new Error(error.message);
  return (data as string | null) ?? null;
}
