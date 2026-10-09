import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { Peek } from "@/components/screens";
import { PageHead } from "@/components/Faq";
import FeatureIcon from "@/components/FeatureIcon";
import { PROBLEMS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Who it helps",
  description: "Take it back helps with medical bills, insurance denials, landlord problems and debt collectors.",
};

export default function HelpWithPage() {
  return (
    <main>
      <PageHead eyebrow="Who it helps" title="Built for the letters that" italic="ruin your week" after="." lede="If you're in the US and a bill, denial or notice feels wrong, Take it back is for you. No legal knowledge needed." />
      <section className="wrap-1200 stack g20" style={{ paddingTop: 48 }}>
        {PROBLEMS.map((p, i) => (
          <Link key={p.slug} href={`/help-with/${p.slug}`} className="problem-card" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 28, padding: 18 }}>
            <div style={{ flex: "1 1 280px", minWidth: 0, order: i % 2 ? 2 : 0 }}><Peek kind={i % 2 ? "tracker" : "found"} s={p.scenario} /></div>
            <div className="stack g12" style={{ flex: "2 1 360px", padding: "8px 12px" }}>
              <span className="row g8"><span className="ico o"><FeatureIcon slug={p.slug} /></span><span className="eyebrow">{p.menu}</span></span>
              <span className="serif" style={{ fontSize: "clamp(30px, 3.4vw, 42px)", lineHeight: 1.1 }}>{p.name}</span>
              <span className="muted" style={{ fontSize: 16 }}>{p.lede}</span>
              <span className="row wrap g8">{p.catches.slice(0, 4).map(([t]) => <span key={t} className="tag tag-gray">{t}</span>)}</span>
              <span style={{ fontWeight: 500, color: "#A8441F" }}>How we help with {p.name.toLowerCase()} →</span>
            </div>
          </Link>
        ))}
      </section>
      <section className="wrap-1200 m-section">
        <div className="panel-gray stack g8" style={{ padding: 28 }}>
          <span className="serif" style={{ fontSize: 26 }}>Something else?</span>
          <span className="muted">Scan it anyway. If it's outside what we cover, we'll tell you in plain words and point you to someone who can help.</span>
        </div>
      </section>
      <CtaBand title="See where you" italic="stand." sub="Scan your letter free. It takes about a minute." />
    </main>
  );
}
