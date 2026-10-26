"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { haptic } from "@/lib/native";
import { CtaButton } from "@/components/ui";

type Offer = { basePlan: string; priceString: string; price: number; offerToken?: string; offerId?: string | null };

async function plugin() {
  const m = await import("@capgo/native-purchases");
  return { NP: m.NativePurchases, SUBS: m.PURCHASE_TYPE.SUBS };
}

async function sendToServer(purchaseToken: string[]) {
  const r = await fetch("/api/google/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "subscription", purchaseToken }) });
  const d = (await r.json().catch(() => ({}))) as { premium?: boolean; error?: string };
  return { premium: Boolean(d.premium), error: d.error };
}

/** Premium through Google Play, shown instead of the web checkout inside the Android app.
 *  Play setup: one subscription (productId) with base plans "monthly" and "yearly"; the yearly plan has a free-trial offer. */
export default function GooglePlans({ productId, userId, fallback, trialDays, saves }: { productId: string; userId: string; fallback: { monthly: string; yearly: string }; trialDays: number; saves: number }) {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { NP, SUBS } = await plugin();
        const { products } = await NP.getProducts({ productIdentifiers: [productId], productType: SUBS });
        setOffers(products.map((p) => ({ basePlan: p.identifier, priceString: p.priceString, price: p.price, offerToken: p.offerToken, offerId: (p as { offerId?: string | null }).offerId ?? null })));
      } catch {
        setMsg("We couldn't reach Google Play. Check your connection and try again.");
      }
    })();
  }, [productId]);

  // The base plan's own entry carries the regular price; an offer entry (like the free trial) carries its own token.
  const base = (plan: string) => offers.find((o) => o.basePlan === plan && !o.offerId) || offers.find((o) => o.basePlan === plan);
  const trialOffer = (plan: string) => offers.find((o) => o.basePlan === plan && o.offerId && /trial/i.test(o.offerId));
  const price = (plan: "monthly" | "yearly") => base(plan)?.priceString || fallback[plan];
  const trial = (plan: "monthly" | "yearly") => Boolean(trialOffer(plan)) || (!offers.length && plan === "yearly");

  async function buy(plan: "monthly" | "yearly") {
    setBusy(plan);
    setMsg(null);
    try {
      const { NP, SUBS } = await plugin();
      const offer = trialOffer(plan) || base(plan);
      const tx = await NP.purchaseProduct({ productIdentifier: productId, planIdentifier: plan, offerToken: offer?.offerToken, productType: SUBS, appAccountToken: userId });
      if (!tx.purchaseToken) throw new Error("No receipt from Google Play");
      const r = await sendToServer([tx.purchaseToken]);
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
      await NP.restorePurchases().catch(() => {});
      const { purchases } = await NP.getPurchases({ productType: SUBS });
      const tokens = purchases.map((p) => p.purchaseToken).filter((t): t is string => Boolean(t));
      if (!tokens.length) return setMsg("No active subscription found for this Google account.");
      const r = await sendToServer(tokens);
      if (r.premium) {
        router.push("/app/you?upgraded=1");
        router.refresh();
      } else setMsg(r.error || "No active subscription found for this Google account.");
    } catch {
      setMsg("We couldn't restore purchases. Try again in a moment.");
    } finally {
      setBusy(null);
    }
  }

  const terms = (plan: "monthly" | "yearly") =>
    `${trial(plan) ? `Free for ${trialDays} days, then ` : ""}${price(plan)} a ${plan === "yearly" ? "year" : "month"}. Charged to your Google Play account${trial(plan) ? " when the trial ends" : ""}, renewing automatically until you cancel. Cancel anytime in Google Play → Payments & subscriptions.`;

  return (
    <div className="stack g12">
      {msg && <p className="notice" role="alert">{msg}</p>}
      <div className="plan-grid" style={{ marginTop: 8 }}>
        <div className="plan-card hot">
          <span className="row between"><span className="eyebrow">Yearly</span><span className="tag tag-orange">Save {saves}%</span></span>
          <span><span className="big-num">{price("yearly")}</span> <span className="muted">a year</span></span>
          <span className="small" style={{ color: "#3A3A3A" }}>{terms("yearly")}</span>
          <CtaButton type="button" variant="orange" block disabled={Boolean(busy)} onClick={() => buy("yearly")}>{busy === "yearly" ? "Opening Google Play…" : trial("yearly") ? `Start ${trialDays}-day free trial` : "Choose yearly"}</CtaButton>
        </div>
        <div className="plan-card">
          <span className="eyebrow">Monthly</span>
          <span><span className="big-num">{price("monthly")}</span> <span className="muted">a month</span></span>
          <span className="small" style={{ color: "#3A3A3A" }}>{terms("monthly")}</span>
          <CtaButton type="button" variant="ink" block disabled={Boolean(busy)} onClick={() => buy("monthly")}>{busy === "monthly" ? "Opening Google Play…" : "Choose monthly"}</CtaButton>
        </div>
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        <button className="btn-text small" onClick={restore} disabled={Boolean(busy)}>{busy === "restore" ? "Checking…" : "Restore purchases"}</button>
        {" · "}<a href="/terms">Terms of Use</a>{" · "}<a href="/privacy">Privacy Policy</a>
      </p>
    </div>
  );
}
