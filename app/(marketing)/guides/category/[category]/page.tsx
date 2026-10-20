import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { GuideCard } from "@/components/GuideBrowser";
import { guidesIn, readMinutes } from "@/lib/guides";
import { CATEGORIES, categoryBySlug } from "@/lib/guideMeta";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORIES.filter((c) => guidesIn(c.slug).length).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = categoryBySlug((await params).category);
  if (!c) return {};
  return pageMeta({
    title: `${c.name}: ${guidesIn(c.slug).length} plain-English guides`,
    description: `${c.blurb} Step-by-step guides, rights explained and sample letters.`,
    path: `/guides/category/${c.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const c = categoryBySlug((await params).category);
  if (!c) notFound();
  const list = guidesIn(c.slug);
  if (!list.length) notFound();
  return (
    <main>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Guides", "/guides"], [c.name, `/guides/category/${c.slug}`]])} />
      <PageHead eyebrow={`Guides · ${c.name}`} title={c.name} italic="guides" after="." lede={c.blurb} />
      <section className="wrap-1200" style={{ paddingTop: 32 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {list.map((g) => <GuideCard key={g.slug} g={{ slug: g.slug, title: g.title, description: g.description, category: g.category, kind: g.kind, icon: g.icon, minutes: readMinutes(g) }} />)}
        </div>
      </section>
      <section className="wrap-1200 stack g12" style={{ paddingTop: 48 }}>
        <h2 className="serif" style={{ fontSize: 28, margin: 0, fontWeight: 400 }}>More topics</h2>
        <div className="chips">
          {CATEGORIES.filter((x) => x.slug !== c.slug && guidesIn(x.slug).length).map((x) => <Link key={x.slug} href={`/guides/category/${x.slug}`} className="chip">{x.name}</Link>)}
          <Link href="/guides" className="chip">All guides</Link>
        </div>
      </section>
      <CtaBand title="Rather we just" italic="handle it?" sub="Scan your letter free and we'll show you what's wrong." />
    </main>
  );
}
