import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";
import { PageHead } from "@/components/Faq";
import { CtaBand } from "@/components/site";
import LegalAidList from "@/components/LegalAidList";
import { AID_STATES, legalAidFor, stateFromSlug, stateSlug } from "@/lib/legalAid";
import { smallClaimsRule } from "@/lib/stateLaw";
import { money } from "@/lib/format";

export const dynamicParams = false;
export function generateStaticParams() {
  return AID_STATES.map((s) => ({ state: stateSlug(s) }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const s = stateFromSlug((await params).state);
  if (!s) return {};
  return pageMeta({
    title: `Free legal aid in ${s}`,
    description: `Free civil legal aid, tenant help and lawyer referral in ${s}: phone numbers and websites for help with eviction, debt collection, medical bills and insurance denials.`,
    path: `/legal-aid/${stateSlug(s)}`,
  });
}

export default async function StateAid({ params }: { params: Promise<{ state: string }> }) {
  const s = stateFromSlug((await params).state);
  if (!s) notFound();
  const a = legalAidFor(s)!;
  const sc = smallClaimsRule(s);
  const orgs = a.orgs.map((o) => ({ "@type": "LegalService", name: o.name, url: o.url, ...(o.phone ? { telephone: o.phone } : {}), areaServed: `${o.area}, ${s}` }));
  return (
    <main>
      <JsonLd data={[breadcrumbs([["Home", "/"], ["Legal aid", "/legal-aid"], [s, `/legal-aid/${stateSlug(s)}`]]), { "@context": "https://schema.org", "@type": "ItemList", name: `Free legal aid in ${s}`, itemListElement: orgs.map((o, i) => ({ "@type": "ListItem", position: i + 1, item: o })) }]} />
      <PageHead eyebrow="Legal aid" title="Free legal help in" italic={s} after="." lede={`If you've been sued, have a court date or face eviction in ${s}, call legal aid today. Free help is available if your income qualifies.`} />
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 48px" }} className="stack g24">
        <LegalAidList state={s} />
        <div className="panel-gray stack g8">
          <span style={{ fontWeight: 600 }}>Before you call</span>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.65 }}>
            <li>Have the papers ready: the letter, bill, lease or court notice, with any dates circled.</li>
            <li>Know your household income and size. Most programs serve people under about 125–200% of the poverty line.</li>
            <li>Got a court date? Say so first. Go to the hearing even if you haven&apos;t found a lawyer.</li>
          </ul>
        </div>
        {sc && <p style={{ margin: 0, fontSize: 16 }}>Owed money instead? Small claims court in {s} handles claims up to {money(sc.limit)} without a lawyer. <Link href="/guides/small-claims-court-limits-by-state">How small claims works</Link>.</p>}
        <p className="muted small" style={{ margin: 0 }}><Link href="/legal-aid">All states</Link> · Listings compiled from the Legal Services Corporation, LawHelp and state bar sites, checked October 2026. Take it back isn&apos;t affiliated with these organizations.</p>
      </section>
      <CtaBand title="Fight it in writing" italic="first." sub="Scan the bill or letter. We'll find the problems and write what to send." />
    </main>
  );
}
