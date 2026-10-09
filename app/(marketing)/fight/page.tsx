import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { Peek } from "@/components/screens";
import { PageHead } from "@/components/Faq";
import FeatureIcon from "@/components/FeatureIcon";
import { PROBLEMS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Who we fight",
  description: "Take it back helps you fight hospitals and medical bills, insurance companies, landlords and debt collectors.",
};

export default function HelpWithPage() {
  return (
    <main>
      <PageHead eyebrow="Who we fight" title="Four industries that count on you" italic="giving up" after="." lede="Take it back is on your side, never theirs. We help patients, policyholders, renters and consumers push back, with no legal knowledge needed." />
      <section className="wrap-1200 stack g20" style={{ paddingTop: 48 }}>
        {PROBLEMS.map((p, i) => (
          <Link key={p.slug} href={`/fight/${p.slug}`} className="problem-card" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 28, padding: 18 }}>
            <div style={{ flex: "1 1 280px", minWidth: 0, order: i % 2 ? 2 : 0 }}><Peek kind={(["found", "letter", "tracker", "reply"] as const)[i]} s={p.scenario} tone={(["orange", "gray", "ink", "orange"] as const)[i]} /></div>
            <div className="stack g12" style={{ flex: "2 1 360px", padding: "8px 12px" }}>
              <span className="row g8"><span className="ico o"><FeatureIcon slug={p.slug} /></span><span className="eyebrow">{p.menu}</span></span>
              <span className="serif" style={{ fontSize: "clamp(30px, 3.4vw, 42px)", lineHeight: 1.1 }}>{p.name}</span>
              <span className="muted" style={{ fontSize: 16 }}>{p.lede}</span>
              <span className="row wrap g8">{p.catches.slice(0, 4).map(([t]) => <span key={t} className="tag tag-gray">{t}</span>)}</span>
              <span style={{ fontWeight: 500, color: "#A8441F" }}>How to fight {p.name.toLowerCase()} →</span>
            </div>
          </Link>
        ))}
      </section>
      <section className="m-section">
        <div className="panel-sec orange">
        <div className="inner stack g8">
          <span className="serif" style={{ fontSize: "clamp(30px, 3.4vw, 42px)" }}>Something <em className="o">else</em>?</span>
          <span style={{ fontSize: 17, color: "#4A4A4A", maxWidth: 640 }}>Scan it anyway. If it's outside what we cover, we'll tell you in plain words and point you to someone who can help.</span>
        </div>
        </div>
      </section>
      <CtaBand title="See where you" italic="stand." sub="Scan your letter free. It takes about a minute." />
    </main>
  );
}
