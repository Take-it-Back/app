import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import Faq from "@/components/Faq";
import GuideCover from "@/components/GuideCover";
import { guideBySlug } from "@/lib/guides";
import { ES_GUIDES, esGuideBySlug } from "@/lib/guideEs";
import { pageMeta, JsonLd, breadcrumbs, faqPage, SITE_URL } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return ES_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = esGuideBySlug((await params).slug);
  if (!g) return {};
  const m = pageMeta({
    title: g.title, description: g.description, path: `/es/guias/${g.slug}`, locale: "es_US",
    languages: { "en-US": `/guides/${g.slug}`, "es-US": `/es/guias/${g.slug}`, "x-default": `/guides/${g.slug}` },
  });
  return { ...m, openGraph: { ...m.openGraph, type: "article" } };
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const g = esGuideBySlug((await params).slug);
  const en = g ? guideBySlug(g.slug) : undefined;
  if (!g || !en) notFound();
  const others = ES_GUIDES.filter((x) => x.slug !== g.slug).slice(0, 4);
  return (
    <main lang="es">
      <JsonLd
        data={[
          {
            "@type": "Article", inLanguage: "es", headline: g.title, description: g.description,
            dateModified: en.updated, datePublished: en.updated, mainEntityOfPage: `${SITE_URL}/es/guias/${g.slug}`, image: `${SITE_URL}/og.png`,
            author: { "@id": `${SITE_URL}/#org` }, publisher: { "@id": `${SITE_URL}/#org` },
          },
          breadcrumbs([["Inicio", "/es"], ["Guías", "/es/guias"], [g.title, `/es/guias/${g.slug}`]]),
          faqPage(g.faqs),
        ]}
      />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px, 6vw, 72px) 24px 0" }}>
        <Link href="/es/guias" className="muted tap" style={{ fontSize: 14, textDecoration: "none" }}>← Todas las guías</Link>
        <div style={{ marginTop: 18, borderRadius: 24, overflow: "hidden" }}>
          <GuideCover slug={g.slug} category={en.category} icon={en.icon} ratio="2.4 / 1" />
        </div>
        <h1 className="h-xl" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginTop: 22 }}>{g.title}</h1>
        <p className="lede" style={{ marginTop: 16 }}>{g.intro}</p>
        <p className="muted small" style={{ marginTop: 10 }}>Información general, no consejo legal. Las leyes y los plazos pueden cambiar. <Link href={`/guides/${g.slug}`} hrefLang="en" lang="en">Read this guide in English</Link>.</p>

        <div className="panel-orange row wrap between g12" style={{ margin: "24px 0 8px", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{g.cta}</span>
          <CtaLink href="/login?mode=signup" variant="orange">Empezar gratis</CtaLink>
        </div>

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
          <h2 className="serif" style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 400 }}>Preguntas</h2>
          <Faq items={g.faqs} />
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="serif" style={{ fontSize: 26, margin: "0 0 12px", fontWeight: 400 }}>Más guías</h2>
          <div className="stack g8">
            {others.map((r) => <Link key={r.slug} href={`/es/guias/${r.slug}`} className="list-row" style={{ fontWeight: 500 }}>{r.title}</Link>)}
            <Link href="/es/guias" className="tap" style={{ fontWeight: 600, fontSize: 15 }}>Todas las guías →</Link>
          </div>
        </section>
      </article>
      <CtaBand title="¿Prefiere que lo" italic="hagamos por usted?" sub="Escanee su carta gratis y le mostramos qué está mal." />
    </main>
  );
}
