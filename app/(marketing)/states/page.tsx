import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";
import { LAW_STATES, LAW_TOPICS, lawStateSlug } from "@/lib/lawPages";

export const metadata: Metadata = pageMeta({
  title: "Your rights by state: deposits, debt, medical bills and insurance appeals",
  description: "Pick your state to see its security deposit deadline, debt time limit, medical debt protections, insurance appeal rules and small claims limit.",
  path: "/states",
});

export default function StatesIndex() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["State laws", "/states"]])} />
      <PageHead eyebrow="State laws" title="Your rights, in" italic="your state" after="." lede="The rules change from state to state. Pick yours, or start with a topic. General information, not legal advice." />
      <section className="wrap-1200 stack g32" style={{ paddingTop: 40 }}>
        <div className="stack g12">
          <h2 className="serif" style={{ fontSize: 30, margin: 0, fontWeight: 400 }}>By topic</h2>
          <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {LAW_TOPICS.map((t) => (
              <Link key={t.slug} href={`/laws/${t.slug}`} className="card stack g8" style={{ textDecoration: "none", padding: 24, borderRadius: 12 }}>
                <span className="serif" style={{ fontSize: 24, lineHeight: 1.15 }}>{t.indexTitle}</span>
                <span className="muted" style={{ fontSize: 15 }}>{t.indexDesc}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="stack g12">
          <h2 className="serif" style={{ fontSize: 30, margin: 0, fontWeight: 400 }}>By state</h2>
          <div className="row wrap" style={{ columnGap: 20, rowGap: 0, fontSize: 17 }}>
            {LAW_STATES.map((s) => <Link key={s} href={`/states/${lawStateSlug(s)}`} className="tap">{s}</Link>)}
          </div>
        </div>
      </section>
      <CtaBand title="Scan your letter and see what's wrong." sub="Free, no card needed. Premium writes the letter and tracks the deadlines." />
    </main>
  );
}
