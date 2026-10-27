import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { PROBLEMS } from "@/lib/marketing";

export const metadata: Metadata = pageMeta({ title: "Who we fight: hospitals, insurers, landlords, debt collectors", description: "Take it back helps you dispute medical bills, appeal insurance denials, get your deposit back from a landlord and make debt collectors prove it.", path: "/fight" });

export default function HelpWithPage() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["What we fight", "/fight"]])} />
      <PageHead eyebrow="Who we fight" title="What we help you dispute" after="." lede="Medical bills, insurance denials, landlords and debt collectors. Pick one to see the common problems, the rules we cite and an example case." />
      <section className="wrap-1200" style={{ paddingTop: 40 }}>
        <div className="rule-rows">
          {PROBLEMS.map((p) => (
            <Link key={p.slug} href={`/fight/${p.slug}`} className="rule-row">
              <span className="rule-name">{p.name} →</span>
              <span>{p.lede}</span>
              <span className="muted">{p.catches.slice(0, 4).map(([t]) => t).join(", ")}.</span>
            </Link>
          ))}
        </div>
        <p style={{ margin: "28px 0 0", fontSize: 17, maxWidth: 720 }}><strong>Something else?</strong> Scan it anyway. If it&apos;s outside what we cover, we&apos;ll say so and point you to someone who can help.</p>
      </section>
      <CtaBand title="See what's wrong with your letter." sub="Scan your letter free. It takes about a minute." />
    </main>
  );
}
