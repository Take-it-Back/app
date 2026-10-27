import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { GUIDES, readMinutes } from "@/lib/guides";
import GuideBrowser, { type GuideCardData } from "@/components/GuideBrowser";
import { LAW_TOPICS } from "@/lib/lawPages";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: `${GUIDES.length} plain-English guides to fight back: bills, debt, landlords, insurance and more`,
  description: "Step-by-step guides to disputing medical bills, appealing insurance denials, getting your deposit back, fixing your credit report, stopping debt collectors and more.",
  path: "/guides",
});

const CARDS: GuideCardData[] = GUIDES.map((g) => ({
  slug: g.slug, title: g.title, description: g.description, category: g.category, kind: g.kind, icon: g.icon, minutes: readMinutes(g),
}));

export default function GuidesPage() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Guides", "/guides"]])} />
      <PageHead eyebrow="Guides" title="Know your rights, in" italic="plain English" after="." lede="Step-by-step guides for the fights most people lose by default. General information, not legal advice." />
      <section className="wrap-1200" style={{ paddingTop: 24 }}>
        <GuideBrowser guides={CARDS} />
      </section>
      <section className="wrap-1200 stack g12" style={{ paddingTop: 56 }}>
        <h2 className="serif" style={{ fontSize: 32, margin: 0, fontWeight: 400 }}>Free tools</h2>
        <p className="muted" style={{ margin: 0, fontSize: 16 }}>Find your deadline, build a dispute letter or check your deposit deadline. <Link href="/tools">Open the tools</Link></p>
      </section>
      <section className="wrap-1200 stack g12" style={{ paddingTop: 48 }}>
        <h2 className="serif" style={{ fontSize: 32, margin: 0, fontWeight: 400 }}>Rules by state</h2>
        <p className="muted" style={{ margin: 0, fontSize: 16 }}>Deadlines, limits and penalties for all 50 states and DC. <Link href="/states">Pick your state</Link></p>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {LAW_TOPICS.map((t) => (
            <Link key={t.slug} href={`/laws/${t.slug}`} className="card stack g8" style={{ textDecoration: "none", padding: 24, borderRadius: 24 }}>
              <span className="serif" style={{ fontSize: 24, lineHeight: 1.15 }}>{t.indexTitle}</span>
              <span className="muted" style={{ fontSize: 15 }}>{t.indexDesc}</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand title="Rather we just" italic="handle it?" sub="Scan your letter free and we'll show you what's wrong." />
    </main>
  );
}
