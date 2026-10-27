import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import { PageHead } from "@/components/Faq";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";
import { LAW_STATES, LAW_TOPICS, lawStateSlug, topicBySlug } from "@/lib/lawPages";

export const dynamicParams = false;
export function generateStaticParams() {
  return LAW_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const t = topicBySlug((await params).topic);
  if (!t) return {};
  return pageMeta({ title: t.indexTitle, description: t.indexDesc, path: `/laws/${t.slug}` });
}

export default async function LawTopicIndex({ params }: { params: Promise<{ topic: string }> }) {
  const t = topicBySlug((await params).topic);
  if (!t) notFound();
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["State laws", "/states"], [t.name, `/laws/${t.slug}`]])} />
      <PageHead eyebrow="State laws" title={t.name} italic="by state" after="." lede={t.indexLede} />
      <section className="wrap-1200 stack g24" style={{ paddingTop: 32 }}>
        <div className="panel-orange row wrap between g12" style={{ alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{t.cta}</span>
          <CtaLink href="/login?mode=signup" variant="orange">Start free</CtaLink>
        </div>
        <div className="card" style={{ padding: "8px 12px", borderRadius: 12 }}>
          <table className="pt">
            <thead>
              <tr><th scope="col">State</th>{t.cols.map(([h]) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {LAW_STATES.map((s) => (
                <tr key={s}>
                  <td><Link href={`/laws/${t.slug}/${lawStateSlug(s)}`} className="tap" style={{ fontWeight: 600 }}>{s}</Link></td>
                  {t.cols.map(([h, f]) => <td key={h} data-label={h}>{f(s)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small" style={{ margin: 0 }}>{t.indexNote} Checked October 2026. General information, not legal advice. <Link href={`/guides/${t.guide}`}>Read the guide</Link></p>
        <div className="stack g8">
          <h2 className="serif" style={{ fontSize: 26, margin: 0, fontWeight: 400 }}>Other state-by-state topics</h2>
          {LAW_TOPICS.filter((x) => x.slug !== t.slug).map((x) => <Link key={x.slug} href={`/laws/${x.slug}`} className="list-row" style={{ fontWeight: 500 }}>{x.indexTitle}</Link>)}
        </div>
      </section>
      <CtaBand title="Scan your letter and see what's wrong." sub="Free, no card needed. Premium writes the letter and tracks the deadlines." />
    </main>
  );
}
