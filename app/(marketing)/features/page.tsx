import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import { Peek } from "@/components/screens";
import { PageHead } from "@/components/Faq";
import FeatureIcon from "@/components/FeatureIcon";
import { FEATURES } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Features",
  description: "Scan bills and notices, get plain answers, send letters written for you, and track every deadline and reply until it's settled.",
};

export default function FeaturesPage() {
  return (
    <main>
      <PageHead eyebrow="Features" title="Everything you need to" italic="fight back" after="." lede="Eight tools that work together, from the moment a letter arrives to the day it's settled." />
      <section className="wrap-1200" style={{ paddingTop: 48 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => (
            <Link key={f.slug} href={`/features/${f.slug}`} className="problem-card">
              <Peek kind={f.shot} s={f.shots[0][1]} tone={(["orange", "gray", "ink"] as const)[FEATURES.indexOf(f) % 3]} />
              <span className="stack g8" style={{ padding: "0 8px" }}>
                <span className="row between g8">
                  <span className="row g8"><span className="ico o" style={{ width: 32, height: 32, borderRadius: 10 }}><FeatureIcon slug={f.slug} size={16} /></span><span className="serif" style={{ fontSize: 24 }}>{f.name}</span></span>
                  {f.plan === "premium" ? <span className="pill-pro">Premium</span> : f.plan === "free" ? <span className="pill-free">Free</span> : null}
                </span>
                <span className="muted" style={{ fontSize: 15 }}>{f.short}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="m-section">
        <div className="panel-sec gray">
          <div className="inner row wrap between g24" style={{ alignItems: "center" }}>
            <div className="stack g8" style={{ flex: "1 1 420px" }}>
              <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}>Free shows the problem. <em className="o">Premium</em> fixes it.</h2>
              <p className="muted" style={{ margin: 0, fontSize: 17 }}>Scan, plain answers and real help are free. Letters, deadlines, tracking and replies are Premium, with a 7-day free trial.</p>
            </div>
            <CtaLink href="/pricing" variant="orange">Compare plans</CtaLink>
          </div>
        </div>
      </section>
      <CtaBand title="Try it on your next" italic="bill." sub="Free to start. Premium is 7 days free." />
    </main>
  );
}
