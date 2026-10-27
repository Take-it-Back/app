import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";
import { LAW_STATES, LAW_TOPICS, lawStateFromSlug, lawStateSlug } from "@/lib/lawPages";
import { legalAidFor } from "@/lib/legalAid";

export const dynamicParams = false;
export function generateStaticParams() {
  return LAW_STATES.map((s) => ({ state: lawStateSlug(s) }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const s = lawStateFromSlug((await params).state);
  if (!s) return {};
  return pageMeta({
    title: `Your rights in ${s}: security deposits, debt, medical bills and insurance`,
    description: `${s} security deposit deadline, debt time limit, medical debt protections, insurance appeal rules, tenant repair rights and small claims limit, in one place.`,
    path: `/states/${lawStateSlug(s)}`,
  });
}

export default async function StateHub({ params }: { params: Promise<{ state: string }> }) {
  const s = lawStateFromSlug((await params).state);
  if (!s) notFound();
  const slug = lawStateSlug(s);
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["State laws", "/states"], [s, `/states/${slug}`]])} />
      <PageHead eyebrow="State laws" title="Your rights in" italic={s} after="." lede={`The ${s} rules that matter most for deposits, repairs, old debts, medical bills and insurance denials. General information, not legal advice.`} />
      <section className="wrap-1200 stack g24" style={{ paddingTop: 32 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {LAW_TOPICS.map((t) => {
            const f = t.build(s).facts[0];
            return (
              <Link key={t.slug} href={`/laws/${t.slug}/${slug}`} className="card stack g8" style={{ textDecoration: "none", padding: 24, borderRadius: 12 }}>
                <span className="eyebrow">{t.name}</span>
                {f && <span className="muted small">{f.label}</span>}
                {f && <span style={{ fontSize: 17, lineHeight: 1.45 }}>{f.text}</span>}
                <span style={{ fontWeight: 500, color: "#A8441F", fontSize: 14, marginTop: "auto" }}>See the {s} rules →</span>
              </Link>
            );
          })}
          {legalAidFor(s) && (
            <Link href={`/legal-aid/${slug}`} className="card stack g8" style={{ textDecoration: "none", padding: 24, borderRadius: 12 }}>
              <span className="eyebrow">Free legal aid</span>
              <span style={{ fontSize: 17, lineHeight: 1.45 }}>Phone numbers and websites for free civil legal help in {s}.</span>
              <span style={{ fontWeight: 500, color: "#A8441F", fontSize: 14, marginTop: "auto" }}>Find legal aid →</span>
            </Link>
          )}
        </div>
        <p className="muted small" style={{ margin: 0 }}><Link href="/states">All states</Link> · Compiled from state statutes, court and agency sites, and 50-state surveys, checked October 2026. Laws change and exceptions apply.</p>
      </section>
      <CtaBand title="Scan your letter and see what's wrong." sub="Free, no card needed. Premium writes the letter and tracks the deadlines." />
    </main>
  );
}
