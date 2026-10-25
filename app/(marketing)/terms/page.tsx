import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs, faqPage, ORG, APP_LD } from "@/lib/seo";


export const metadata: Metadata = pageMeta({ title: "Terms", description: "The short version of Take it back's terms: information and self-help tools, not legal advice; plans, billing and fair use.", path: "/terms" });

export default function Terms() {
  return (
    <>
      <main className="stack g16" style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 96px", fontSize: 16, lineHeight: 1.65 }}>
        <span className="eyebrow">Terms</span>
        <h1 className="h-l">The <em className="o">short</em> version</h1>
        <p className="muted">Last updated October 9, 2026. Full terms will be finalized with counsel before general launch.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Not a law firm</h2>
        <p>Take it back gives general information and self-help tools. It is not a law firm, doesn't give legal advice, and using it doesn't create a lawyer-client relationship. You review and send every letter yourself.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Check the dates</h2>
        <p>We suggest deadlines based on common rules, but the exact date on your own letter, plan or lease is the one that counts. Always check it.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>When you need a person</h2>
        <p>If you have a court date, a lawsuit, an eviction filing or urgent medical care at stake, contact legal aid or a licensed attorney right away.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Plans and billing</h2>
        <p>The free plan includes 1 scan a month with a summary and general next steps. A case pass costs $24.99 once and unlocks Premium features for one case for 60 days; it does not renew. Premium costs $14.99 a month or $59 a year, and the yearly plan starts with a 7-day free trial for new subscribers. Premium renews automatically until you cancel, which you can do anytime from your account. Cancelling stops future charges; you keep Premium until the end of the period you paid for. In our iPhone app, prices are shown in your App Store currency and charged to your Apple ID, and the yearly plan is $59.99. Payments on our website are handled by Stripe. We never take a cut of what you save.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Fair use</h2>
        <p>Use the app for your own matters and be honest in what you send. Don't upload other people's documents without their permission.</p>
      </main>
    </>
  );
}
