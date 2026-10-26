"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { haptic, isNativeApp, nativePlatform } from "@/lib/native";
import { APPLE_CASE_PASS, GOOGLE_CASE_PASS } from "@/lib/appleProducts";

export const PENDING_PASS_KEY = "tib_pending_case_pass";

/** One-time unlock of a single case. Web: Stripe checkout. iPhone app: Apple purchase. */
export default function UnlockCase({ caseId, label, days, userId, tone = "dark" }: { caseId: string; label: string; days: number; userId?: string; tone?: "dark" | "light" }) {
  const router = useRouter();
  const [native, setNative] = useState(false);
  const [price, setPrice] = useState(label);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isNativeApp()) return;
    setNative(true);
    (async () => {
      try {
        const { NativePurchases, PURCHASE_TYPE } = await import("@capgo/native-purchases");
        const id = nativePlatform() === "android" ? GOOGLE_CASE_PASS : APPLE_CASE_PASS;
        const { products } = await NativePurchases.getProducts({ productIdentifiers: [id], productType: PURCHASE_TYPE.INAPP });
        if (products[0]?.priceString) setPrice(products[0].priceString);
      } catch {}
    })();
  }, []);

  async function buyInApp() {
    setBusy(true);
    setMsg(null);
    try {
      const { NativePurchases, PURCHASE_TYPE } = await import("@capgo/native-purchases");
      // Not finished until our server has unlocked the case. The case is remembered on the phone so the
      // app can finish the unlock on next launch if this step fails (see NativeBridge).
      const { Preferences } = await import("@capacitor/preferences");
      await Preferences.set({ key: PENDING_PASS_KEY, value: caseId });
      const android = nativePlatform() === "android";
      const tx = await NativePurchases.purchaseProduct({ productIdentifier: android ? GOOGLE_CASE_PASS : APPLE_CASE_PASS, productType: PURCHASE_TYPE.INAPP, appAccountToken: userId, autoAcknowledgePurchases: false, isConsumable: android ? false : undefined });
      let d: { ok?: boolean; error?: string };
      if (android) {
        // Our server checks the purchase with Google, unlocks the case, then marks the pass as used.
        if (!tx.purchaseToken) throw new Error("No receipt from Google Play");
        const r = await fetch("/api/google/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "case_pass", purchaseToken: tx.purchaseToken, caseId }) });
        d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      } else {
        if (!tx.jwsRepresentation) throw new Error("No receipt from Apple");
        const r = await fetch("/api/apple/casepass", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jws: tx.jwsRepresentation, caseId }) });
        d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      }
      if (!d.ok) throw new Error(d.error || "We couldn't unlock this case.");
      if (!android) await NativePurchases.acknowledgePurchase({ purchaseToken: tx.transactionId }).catch(() => {});
      await Preferences.remove({ key: PENDING_PASS_KEY });
      haptic("success");
      router.push(`/app/cases/${caseId}?unlocked=1`);
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "";
      if (!/cancel/i.test(m)) setMsg(m || "Something went wrong. You weren't charged.");
    } finally {
      setBusy(false);
    }
  }

  const style = tone === "dark" ? { background: "transparent", color: "#fff", borderColor: "#5A5A5A" } : {};
  const button = (
    <button type={native ? "button" : "submit"} onClick={native ? buyInApp : undefined} disabled={busy} className="btn-plain" style={style}>
      {busy ? "One moment…" : `Unlock just this case · ${price}`}
    </button>
  );
  return (
    <div className="stack g4">
      {native ? button : (
        <form action="/api/casepass/checkout" method="post">
          <input type="hidden" name="case_id" value={caseId} />
          {button}
        </form>
      )}
      <span className="small" style={{ color: tone === "dark" ? "#BDBDBD" : "#5E5E5E" }}>One payment, no subscription. Letters, deadlines and reply help for this case for {days} days.</span>
      {msg && <span className="small" role="alert" style={{ color: tone === "dark" ? "#F3B49B" : "#A8441F" }}>{msg}</span>}
    </div>
  );
}
