"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { haptic } from "@/lib/native";
import { CtaButton } from "@/components/ui";

type Ids = { monthly: string; yearly: string };
type Prod = { identifier: string; priceString: string; introEligible: boolean };

async function plugin() {
  const m = await import("@capgo/native-purchases");
  return { NP: m.NativePurchases, SUBS: m.PURCHASE_TYPE.SUBS };
}

async function sendToServer(jws: string[]) {
  const r = await fetch("/api/apple/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jws }) });
  const d = (await r.json().catch(() => ({}))) as { premium?: boolean; error?: string };
  return { premium: Boolean(d.premium), error: d.error };
}

/** Premium plans bought through Apple, shown instead of the web checkout inside the iPhone app. */
export default function ApplePlans({ ids, userId, fallback, trialDays }: { ids: Ids; userId: string; fallback: { monthly: string; yearly: string }; trialDays: number }) {
  const router = useRouter();
  const [prods, setProds] = useState<Record<string, Prod>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { NP, SUBS } = await plugin();
        const { products } = await NP.getProducts({ productIdentifiers: [ids.monthly, ids.yearly], productType: SUBS });
        const map: Record<string, Prod> = {};
        for (const p of products) map[p.identifier] = { identifier: p.identifier, priceString: p.priceString, introEligible: Boolean((p as { isEligibleForIntroOffer?: boolean }).isEligibleForIntroOffer ?? p.introductoryPrice) };
        setProds(map);
      } catch {
        setMsg("We couldn't reach the App Store. Check your connection and try again.");
      }
    })();
  }, [ids.monthly, ids.yearly]);

  async function buy(which: keyof Ids) {
    setBusy(which);
    setMsg(null);
    try {
      const { NP, SUBS } = await plugin();
      const tx = await NP.purchaseProduct({ productIdentifier: ids[which], productType: SUBS, appAccountToken: userId });
      if (!tx.jwsRepresentation) throw new Error("No receipt from Apple");
      const r = await sendToServer([tx.jwsRepresentation]);
      if (!r.premium) throw new Error(r.error || "We couldn't confirm your purchase.");
      await haptic("success");
      router.push("/app/you?upgraded=1");
      router.refresh();
    } catch (e) {
      const text = e instanceof Error ? e.message : "";
      if (!/cancel/i.test(text)) setMsg(text || "Something went wrong. You weren't charged.");
    } finally {
      setBusy(null);
    }
  }

  async function restore() {
    setBusy("restore");
    setMsg(null);
    try {
      const { NP, SUBS } = await plugin();
      await NP.restorePurchases();
      const { purchases } = await NP.getPurchases({ productType: SUBS, onlyCurrentEntitlements: true });
      const jws = purchases.map((p) => p.jwsRepresentation).filter((j): j is string => Boolean(j));
      if (!jws.length) {
        setMsg("No active subscription found for this Apple ID.");
        return;
      }
      const r = await sendToServer(jws);
      if (r.premium) {
        router.push("/app/you?upgraded=1");
        router.refresh();
      } else setMsg(r.error || "No active subscription found for this Apple ID.");
    } catch {
      setMsg("We couldn't restore purchases. Try again in a moment.");
    } finally {
      setBusy(null);
    }
  }

  const price = (which: keyof Ids) => prods[ids[which]]?.priceString || fallback[which];
  const trial = (which: keyof Ids) => prods[ids[which]]?.introEligible ?? true;
  const terms = (which: keyof Ids) =>
    `${trial(which) ? `Free for ${trialDays} days, then ` : ""}${price(which)} a ${which === "yearly" ? "year" : "month"}. Charged to your Apple ID${trial(which) ? " when the trial ends" : ""}, renewing automatically unless you cancel at least 24 hours before the end of the period. Cancel anytime in your iPhone's Settings → Apple ID → Subscriptions.`;

  return (
    <div className="stack g12">
      {msg && <p className="notice" role="alert">{msg}</p>}
      <div className="plan-grid" style={{ marginTop: 8 }}>
        <div className="plan-card hot">
          <span className="row between"><span className="eyebrow">Yearly</span><span className="tag tag-orange">Save 50%</span></span>
          <span><span className="big-num">{price("yearly")}</span> <span className="muted">a year</span></span>
          <span className="small" style={{ color: "#3A3A3A" }}>{terms("yearly")}</span>
          <CtaButton type="button" variant="orange" block disabled={Boolean(busy)} onClick={() => buy("yearly")}>{busy === "yearly" ? "Opening App Store…" : trial("yearly") ? `Start ${trialDays}-day free trial` : "Choose yearly"}</CtaButton>
        </div>
        <div className="plan-card">
          <span className="eyebrow">Monthly</span>
          <span><span className="big-num">{price("monthly")}</span> <span className="muted">a month</span></span>
          <span className="small" style={{ color: "#3A3A3A" }}>{terms("monthly")}</span>
          <CtaButton type="button" variant="ink" block disabled={Boolean(busy)} onClick={() => buy("monthly")}>{busy === "monthly" ? "Opening App Store…" : trial("monthly") ? `Start ${trialDays}-day free trial` : "Choose monthly"}</CtaButton>
        </div>
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        <button className="btn-text small" onClick={restore} disabled={Boolean(busy)}>{busy === "restore" ? "Checking…" : "Restore purchases"}</button>
        {" · "}<a href="/terms">Terms of Use</a>{" · "}<a href="/privacy">Privacy Policy</a>
      </p>
    </div>
  );
}
