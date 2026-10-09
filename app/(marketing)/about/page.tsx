import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { Phone } from "@/components/screens";

export const metadata: Metadata = { title: "About", description: "Why we built Take it back, and the promises we keep." };

const PROMISES: [string, string][] = [
  ["Plain words, always", "If a sentence needs a law degree, we rewrite it."],
  ["You keep what you save", "No commissions, no cut of your refund, ever."],
  ["Your papers are yours", "Private by default. Never sold, never used for ads. Delete everything anytime."],
  ["Honest about limits", "We're not a law firm. When something needs a person, we say so and help you find one."],
  ["Safety is free", "Red flags and the legal aid finder are never behind a paywall."],
];

export default function AboutPage() {
  return (
    <main>
      <PageHead eyebrow="About" title="The system counts on you" italic="giving up" after="." />
      <section className="wrap-1200 row wrap" style={{ paddingTop: 40, gap: 56, alignItems: "flex-start" }}>
        <div className="stack g16" style={{ flex: "1 1 460px" }}>
          <p className="serif" style={{ margin: 0, fontSize: "clamp(24px, 2.6vw, 32px)", lineHeight: 1.25 }}>
            Hospitals, insurers, landlords and collectors have whole departments for this. You have a kitchen table and a stack of envelopes.
          </p>
          <p className="lede" style={{ fontSize: 17 }}>
            Billing errors go unchallenged. Denied claims go unappealed. Deposits go unreturned. Not because people are wrong, but because the letters are confusing, the deadlines are short and nobody explains the rules.
          </p>
          <p className="lede" style={{ fontSize: 17 }}>
            Take it back gives everyday people the same organization the other side has: a clear read of the letter, the rule that backs you up, a well-written reply, and someone keeping track of every date.
          </p>
        </div>
        <div style={{ flex: "1 1 320px", display: "flex", justifyContent: "center" }}><Phone kind="today" s="medical" label="Today screen with a morning briefing" /></div>
      </section>
      <section className="m-section">
        <div className="panel-sec orange">
        <div className="inner stack g24">
        <h2 className="h-l" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>Our <em className="o">promises</em></h2>
        <ul className="check-list">
          {PROMISES.map(([t, b]) => (
            <li key={t}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BF4F28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", marginTop: 2 }}><path d="M5 12l5 5 9-10" /></svg>
              <span className="stack g4"><span style={{ fontWeight: 500, fontSize: 17 }}>{t}</span><span className="muted" style={{ fontSize: 15 }}>{b}</span></span>
            </li>
          ))}
        </ul>
        <p className="small" style={{ margin: 0, color: "#4A4A4A" }}>Questions or ideas? Email <a href="mailto:hello@takeitback.app">hello@takeitback.app</a>.</p>
        </div>
        </div>
      </section>
      <CtaBand title="Take it" italic="back." sub="Free to start. Works on any phone or computer." />
    </main>
  );
}
