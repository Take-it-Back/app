import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { FEATURES } from "@/lib/marketing";

export const metadata: Metadata = pageMeta({ title: "Features: scan, letters, deadlines and case tracking", description: "Scan bills and notices, get plain-English answers, send letters written for you, track every deadline and decode their replies until it's settled.", path: "/features" });

export default function FeaturesPage() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Features", "/features"]])} />
      <PageHead eyebrow="Features" title="Features" lede="What each part of Take it back does, and which parts are free." />
      <section className="wrap-1200" style={{ paddingTop: 40 }}>
        <div className="rule-rows feat">
          {FEATURES.map((f) => (
            <Link key={f.slug} href={`/features/${f.slug}`} className="rule-row">
              <span className="rule-name">{f.name} →</span>
              <span className="muted">{f.lede}</span>
              <span>{f.plan === "premium" ? "Premium" : f.plan === "free" ? "Free" : "Free, more with Premium"}</span>
            </Link>
          ))}
        </div>
        <p className="muted" style={{ margin: "20px 0 0" }}>Premium is $59 a year or $14.99 a month. One case without a subscription is $24.99. <Link href="/pricing">Compare plans</Link></p>
      </section>
      <CtaBand title="Try it on your next bill." sub="Free to start. Premium is 7 days free." />
    </main>
  );
}
