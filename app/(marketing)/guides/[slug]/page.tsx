import { TABLES, type DebtRule, type SmallClaimsRule } from "@/lib/stateLaw";
import { money } from "@/lib/format";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import Faq from "@/components/Faq";
import { GUIDES, GUIDE_LAW_TOPIC, guideBySlug } from "@/lib/guides";
import { topicBySlug } from "@/lib/lawPages";
import { DEPOSIT_RULES } from "@/lib/deposits";
import { problemBySlug } from "@/lib/marketing";
import { pageMeta, JsonLd, breadcrumbs, faqPage, SITE_URL } from "@/lib/seo";
import { longDate } from "@/lib/format";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  const m = pageMeta({ title: g.title, description: g.description, path: `/guides/${g.slug}` });
  return { ...m, openGraph: { ...m.openGraph, type: "article" } };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const p = problemBySlug(g.problem)!;
  const law = topicBySlug(GUIDE_LAW_TOPIC[g.slug] || "");
  const related = GUIDES.filter((x) => x.slug !== g.slug && x.problem === g.problem).concat(GUIDES.filter((x) => x.problem !== g.problem)).slice(0, 3);

  return (
    <main>
      <JsonLd
        data={[
          {
            "@type": "Article",
            headline: g.title,
            description: g.description,
            dateModified: g.updated,
            datePublished: g.updated,
            mainEntityOfPage: `${SITE_URL}/guides/${g.slug}`,
            image: `${SITE_URL}/og.png`,
            author: { "@id": `${SITE_URL}/#org` },
            publisher: { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Take it back", logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512.png` } },
          },
          breadcrumbs([["Home", "/"], ["Guides", "/guides"], [g.title, `/guides/${g.slug}`]]),
          faqPage(g.faqs),
        ]}
      />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px, 6vw, 72px) 24px 0" }}>
        <Link href="/guides" className="muted" style={{ fontSize: 14, textDecoration: "none" }}>← All guides</Link>
        <span className="eyebrow" style={{ display: "block", margin: "18px 0 10px", fontSize: 13 }}>{g.kicker}</span>
        <h1 className="h-xl" style={{ fontSize: "clamp(38px, 5vw, 58px)" }}>{g.title}</h1>
        <p className="lede" style={{ marginTop: 16 }}>{g.intro}</p>
        <p className="muted small" style={{ marginTop: 10 }}>Updated {longDate(g.updated + "T12:00:00Z")} · General information, not legal advice.</p>

        <div className="panel-orange row wrap between g12" style={{ margin: "24px 0 8px", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{g.cta}</span>
          <CtaLink href="/login?mode=signup" variant="orange">Start free</CtaLink>
        </div>

        {law && (
          <div className="panel-gray row wrap between g12" style={{ margin: "8px 0 8px", alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>The rules change by state. See what your state says about {law.name.toLowerCase()}.</span>
            <Link href={`/laws/${law.slug}`} style={{ fontWeight: 600 }}>Pick your state →</Link>
          </div>
        )}

        {g.depositTable && (
          <section style={{ marginTop: 32 }}>
            <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>Deadlines by state</h2>
            <div className="card" style={{ padding: "8px 12px", borderRadius: 22 }}>
              <table className="pt">
                <thead><tr><th scope="col">State</th><th scope="col">Deadline to return the deposit</th></tr></thead>
                <tbody>
                  {Object.entries(DEPOSIT_RULES).map(([state, r]) => (
                    <tr key={state}><td>{state}</td><td data-label="Deadline">{r.text}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted small">Compiled from state law summaries, checked October 2026. Exceptions apply and laws change; check your state&apos;s statute for your situation.</p>
          </section>
        )}

        {g.table === "debt" && (
          <section style={{ marginTop: 32 }}>
            <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>Time limits by state</h2>
            <div className="card" style={{ padding: "8px 12px", borderRadius: 22 }}>
              <table className="pt">
                <thead><tr><th scope="col">State</th><th scope="col">Years to sue</th><th scope="col">Can a payment or promise restart it?</th></tr></thead>
                <tbody>
                  {stateRows<DebtRule>(TABLES.debt).map(([state, r]) => (
                    <tr key={state}>
                      <td>{state}</td>
                      <td data-label="Years">{r.written === r.open ? r.written : `${Math.min(r.written, r.open)}–${Math.max(r.written, r.open)}`}</td>
                      <td data-label="Restart">{r.revival === "none" ? "No" : r.revival === "payment" ? "Yes, a payment" : r.revival === "writing" ? "Yes, a signed promise" : "Yes, a payment or written promise"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted small">Written contracts and credit cards; some debts, like medical debt, differ. Compiled from state statutes and 50-state surveys, checked October 2026. Laws change; check your state&apos;s statute or ask legal aid before relying on a date.</p>
          </section>
        )}

        {g.table === "smallclaims" && (
          <section style={{ marginTop: 32 }}>
            <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>Limits by state</h2>
            <div className="card" style={{ padding: "8px 12px", borderRadius: 22 }}>
              <table className="pt">
                <thead><tr><th scope="col">State</th><th scope="col">Limit</th><th scope="col">Court</th><th scope="col">Filing fee</th></tr></thead>
                <tbody>
                  {stateRows<SmallClaimsRule>(TABLES.smallclaims).map(([state, r]) => (
                    <tr key={state}><td>{state}</td><td data-label="Limit">{money(r.limit)}</td><td data-label="Court">{r.court}</td><td data-label="Fee">{r.fee}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted small">Limits for individuals, checked October 2026 against state court sites. Several states are raising limits; confirm with your court before filing.</p>
          </section>
        )}

        {g.blocks.map((b) => (
          <section key={b.h} style={{ marginTop: 36 }}>
            <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>{b.h}</h2>
            {b.p?.map((t, i) => <p key={i} style={{ fontSize: 17, lineHeight: 1.65, margin: "0 0 14px" }}>{t}</p>)}
            {b.list && (
              <ul style={{ margin: 0, paddingLeft: 22, fontSize: 17, lineHeight: 1.65 }}>
                {b.list.map((t) => <li key={t} style={{ marginBottom: 8 }}>{t}</li>)}
              </ul>
            )}
            {b.steps && (
              <ol className="stack" style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {b.steps.map(([t, d], i) => (
                  <li key={t} className="row g16" style={{ padding: "16px 0", borderBottom: i < b.steps!.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                    <span className="serif" style={{ fontSize: 30, lineHeight: 1, color: "#BF4F28", width: 28, flex: "none" }}>{i + 1}</span>
                    <span className="stack g4"><span style={{ fontWeight: 600, fontSize: 18 }}>{t}</span><span style={{ fontSize: 16, lineHeight: 1.6, color: "#4A4A4A" }}>{d}</span></span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}

        <section style={{ marginTop: 40 }}>
          <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>Questions</h2>
          <Faq items={g.faqs} />
        </section>

        <section style={{ marginTop: 40 }}>
          <Link href={`/fight/${p.slug}`} className="card stack g4" style={{ textDecoration: "none", borderRadius: 22 }}>
            <span className="eyebrow">How Take it back helps</span>
            <span className="serif" style={{ fontSize: 24 }}>{p.seoTitle}</span>
            <span className="muted small">{p.menu}</span>
          </Link>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="serif" style={{ fontSize: 26, margin: "0 0 12px", fontWeight: 400 }}>More guides</h2>
          <div className="stack g8">
            {related.map((r) => <Link key={r.slug} href={`/guides/${r.slug}`} className="list-row" style={{ fontWeight: 500 }}>{r.title}</Link>)}
          </div>
        </section>
      </article>
      <CtaBand title="Let us write the" italic="letter." sub="Scan it free. Premium writes the letter and tracks every deadline." />
    </main>
  );
}

function stateRows<T>(t: Record<string, unknown>) {
  return Object.entries(t).filter(([k]) => k !== "_meta" && k !== "Puerto Rico") as [string, T][];
}
