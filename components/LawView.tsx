import Link from "next/link";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import Faq, { PageHead } from "@/components/Faq";
import TimeLimitCheck from "@/components/TimeLimitCheck";
import { JsonLd, breadcrumbs, faqPage, SITE_URL } from "@/lib/seo";
import { LAW_STATES, LAW_TOPICS, lawStateSlug, type Fact, type LawTopic } from "@/lib/lawPages";
import { legalAidFor } from "@/lib/legalAid";

export const LAW_DATA_DATE = "2026-10-11";

function FactCard({ f }: { f: Fact }) {
  return (
    <div className="card stack g4" style={{ borderRadius: 22, padding: "18px 22px" }}>
      <span className="eyebrow">{f.label}</span>
      <span style={{ fontSize: 18, lineHeight: 1.5 }}>{f.text}</span>
      {f.url && <a href={f.url} target="_blank" rel="noopener noreferrer" className="muted small tap">Source</a>}
    </div>
  );
}

export function LawStateView({ topic, state }: { topic: LawTopic; state: string }) {
  const c = topic.build(state);
  const path = `/laws/${topic.slug}/${lawStateSlug(state)}`;
  const aid = legalAidFor(state);
  const others = LAW_TOPICS.filter((t) => t.slug !== topic.slug);
  return (
    <main>
      <JsonLd
        data={[
          {
            "@type": "Article",
            headline: topic.stateTitle(state),
            description: topic.stateDesc(state),
            dateModified: LAW_DATA_DATE,
            datePublished: LAW_DATA_DATE,
            mainEntityOfPage: `${SITE_URL}${path}`,
            image: `${SITE_URL}/og.png`,
            author: { "@id": `${SITE_URL}/#org` },
            publisher: { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Take it back", logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512.png` } },
          },
          breadcrumbs([["Home", "/"], ["State laws", "/states"], [topic.name, `/laws/${topic.slug}`], [state, path]]),
          faqPage(c.faqs),
        ]}
      />
      <PageHead eyebrow={topic.name} title={`${topic.name} in`} italic={state} after="." lede={topic.stateLede(state)} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }} className="stack g32">
        <p className="muted small" style={{ margin: "-8px 0 0" }}>Data checked October 2026 · General information, not legal advice. <Link href="/states">All states</Link></p>

        <div className="panel-orange row wrap between g12" style={{ alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{topic.cta}</span>
          <CtaLink href="/login?mode=signup" variant="orange">Start free</CtaLink>
        </div>

        <section className="stack g12">
          <h2 className="serif" style={{ fontSize: 30, margin: 0, fontWeight: 400 }}>What {state} law says</h2>
          {c.facts.map((f) => <FactCard key={f.label} f={f} />)}
        </section>

        {c.years !== undefined && <TimeLimitCheck years={c.years} state={state} />}

        {c.federal && c.federal.length > 0 && (
          <section className="stack g12">
            <h2 className="serif" style={{ fontSize: 30, margin: 0, fontWeight: 400 }}>Federal rules that apply in every state</h2>
            {c.federal.map((f) => <FactCard key={f.label} f={f} />)}
          </section>
        )}

        <section>
          <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>What to do, step by step</h2>
          <ol className="stack" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {c.steps.map(([t, d], i) => (
              <li key={t} className="row g16" style={{ padding: "16px 0", borderBottom: i < c.steps.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                <span className="serif" style={{ fontSize: 30, lineHeight: 1, color: "#BF4F28", width: 28, flex: "none" }}>{i + 1}</span>
                <span className="stack g4"><span style={{ fontWeight: 600, fontSize: 18 }}>{t}</span><span style={{ fontSize: 16, lineHeight: 1.6, color: "#4A4A4A" }}>{d}</span></span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>Questions</h2>
          <Faq items={c.faqs} />
        </section>

        <section className="stack g12">
          <Link href={`/guides/${topic.guide}`} className="card stack g4" style={{ textDecoration: "none", borderRadius: 22 }}>
            <span className="eyebrow">Read the full guide</span>
            <span className="serif" style={{ fontSize: 24 }}>The step-by-step guide that goes with this page</span>
            <span className="muted small">Includes what to say and what not to do.</span>
          </Link>
          {aid && (
            <Link href={`/legal-aid/${lawStateSlug(state)}`} className="card stack g4" style={{ textDecoration: "none", borderRadius: 22 }}>
              <span className="eyebrow">Need a lawyer?</span>
              <span className="serif" style={{ fontSize: 24 }}>Free legal help in {state}</span>
              <span className="muted small">Phone numbers and websites for free civil legal aid.</span>
            </Link>
          )}
        </section>

        <section>
          <h2 className="serif" style={{ fontSize: 26, margin: "0 0 12px", fontWeight: 400 }}>More {state} rules</h2>
          <div className="stack g8">
            {others.map((t) => <Link key={t.slug} href={`/laws/${t.slug}/${lawStateSlug(state)}`} className="list-row" style={{ fontWeight: 500 }}>{t.name} in {state}</Link>)}
          </div>
        </section>

        <section>
          <h2 className="serif" style={{ fontSize: 26, margin: "0 0 12px", fontWeight: 400 }}>{topic.name} in other states</h2>
          <div className="row wrap" style={{ columnGap: 16, rowGap: 0, fontSize: 15 }}>
            {LAW_STATES.filter((s) => s !== state).map((s) => <Link key={s} href={`/laws/${topic.slug}/${lawStateSlug(s)}`} className="tap">{s}</Link>)}
          </div>
        </section>

        <p className="muted small" style={{ margin: 0 }}>Compiled from state statutes, court and agency sites, and 50-state surveys, checked October 2026. Laws change and exceptions apply. Take it back is not a law firm; for legal advice talk to a licensed attorney or legal aid.</p>
      </div>
      <CtaBand title="Let us write the" italic="letter." sub="Scan it free. Premium writes the letter and tracks every deadline." />
    </main>
  );
}
