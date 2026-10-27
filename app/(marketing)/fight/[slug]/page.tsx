import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs, faqPage } from "@/lib/seo";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import { SampleCaseLetter, SampleFindings } from "@/components/SampleDocs";
import Faq from "@/components/Faq";
import { PROBLEMS, SCENARIOS, problemBySlug } from "@/lib/marketing";
import { guidesFor } from "@/lib/guides";

const CTA = { medical: "Have a hospital bill?", insurance: "Have a denial letter?", renters: "Waiting on a deposit or a repair?", debt: "Got a collection letter?" } as const;

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = problemBySlug((await params).slug);
  return p ? pageMeta({ title: p.seoTitle, description: p.lede, path: `/fight/${p.slug}` }) : {};
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = problemBySlug((await params).slug);
  if (!p) notFound();
  const c = SCENARIOS[p.scenario];

  return (
    <main id="main">
      <JsonLd data={[breadcrumbs([["Home", "/"], ["Who we fight", "/fight"], [p.name, `/fight/${p.slug}`]]), faqPage(p.faqs)]} />
      <section className="wrap-1200 row wrap" style={{ paddingTop: "clamp(32px, 5vw, 64px)", gap: 56, alignItems: "center" }}>
        <div className="stack g16" style={{ flex: "1 1 440px", minWidth: 0 }}>
          <Link href="/fight" className="muted" style={{ fontSize: 14, textDecoration: "none", padding: "10px 0", alignSelf: "flex-start" }}>← Everything we help with</Link>
          <h1 className="h-xl" style={{ fontSize: "clamp(40px, 4.8vw, 62px)" }}>{p.headline.filter(Boolean).join(" ")}</h1>
          <p className="lede">{p.lede}</p>
          <div className="row wrap g12" style={{ marginTop: 4 }}>
            <CtaLink href="/login?mode=signup">Scan yours free</CtaLink>
            <Link href="/how-it-works" className="btn-plain" style={{ minHeight: 50 }}>How it works</Link>
          </div>
        </div>
        <div style={{ flex: "1 1 440px", minWidth: 0 }}><SampleFindings c={c} /></div>
      </section>

      <section className="wrap-1200 m-section stack g20">
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>Common problems</h2>
        <div className="rule-rows two">
          {p.catches.map(([t, b]) => (
            <div key={t} className="rule-row"><span className="rule-name">{t}</span><span className="muted">{b}</span></div>
          ))}
        </div>
      </section>

      <section className="wrap-1200 m-section row wrap" style={{ gap: 56, alignItems: "flex-start" }}>
        <div className="stack g16" style={{ flex: "1 1 400px", minWidth: 0 }}>
          <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>Example: {c.counterparty}</h2>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>{c.summary}</p>
          <ol className="plain-steps" style={{ fontSize: 16 }}>
            {[...c.timeline].reverse().map((t) => <li key={t.date + t.text}><strong>{t.date}:</strong> {t.text}</li>)}
          </ol>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}><strong>Their reply: {c.reply.verdict}.</strong> {c.reply.said} Next: {c.reply.next}</p>
        </div>
        <div style={{ flex: "1 1 440px", minWidth: 0 }}><SampleCaseLetter {...c.letter} /></div>
      </section>

      <section className="wrap-1200 m-section row wrap" style={{ gap: 56, alignItems: "flex-start" }}>
        <div className="stack g16" style={{ flex: "1 1 460px", minWidth: 0 }}>
          <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>The rules we cite</h2>
          <div className="rule-rows two">
            {p.rules.map(([t, b]) => <div key={t} className="rule-row"><span className="rule-name">{t}</span><span>{b}</span></div>)}
          </div>
          <p className="muted small" style={{ margin: 0 }}>General information. Rules vary by state and plan, and we check the details on your letter.</p>
        </div>
        <div className="stack g12" style={{ flex: "1 1 340px", minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Plus the rules for your state</h3>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>{p.state.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>All 50 states and DC, with sources. <Link href="/states">Rules by state</Link> · <Link href="/legal-aid">Free legal aid</Link></p>
        </div>
      </section>

      <section className="wrap-1200 m-section stack g16">
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>What you'll do</h2>
        <ol className="plain-steps">
          {p.steps.map(([t, b]) => <li key={t}><strong>{t}.</strong> {b}</li>)}
        </ol>
      </section>

      <section className="stack g16 m-section" style={{ maxWidth: 820, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>Common questions</h2>
        <Faq items={p.faqs} />
        <h3 style={{ margin: "20px 0 0", fontSize: 18 }}>Guides</h3>
        <div className="stack">
          {guidesFor(p.slug).map((g) => <Link key={g.slug} href={`/guides/${g.slug}`} className="list-row" style={{ fontWeight: 500 }}>{g.title} →</Link>)}
        </div>
      </section>

      <CtaBand title={`${CTA[p.scenario]} Scan it free.`} sub="See what's wrong in about a minute. No card needed." />
    </main>
  );
}
