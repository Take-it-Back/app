import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import GuideCover from "@/components/GuideCover";
import { guideBySlug } from "@/lib/guides";
import { ES_GUIDES } from "@/lib/guideEs";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Guías en español: facturas médicas, deudas, caseros y más",
  description: "Guías paso a paso en español para pelear facturas médicas, cobradores de deudas, abusos de caseros, errores de crédito y más. Información general, no consejo legal.",
  path: "/es/guias",
  locale: "es_US",
  languages: { "en-US": "/guides", "es-US": "/es/guias", "x-default": "/guides" },
});

export default function GuiasPage() {
  return (
    <main lang="es">
      <JsonLd data={breadcrumbs([["Inicio", "/es"], ["Guías", "/es/guias"]])} />
      <PageHead eyebrow="Guías" title="Conozca sus derechos," italic="en palabras sencillas" after="." lede="Guías paso a paso para las peleas que la mayoría pierde por no saber qué hacer. Información general, no consejo legal." />
      <section className="wrap-1200" style={{ paddingTop: 32 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {ES_GUIDES.map((g) => {
            const en = guideBySlug(g.slug);
            return (
              <Link key={g.slug} href={`/es/guias/${g.slug}`} className="card stack" style={{ textDecoration: "none", padding: 0, borderRadius: 22, overflow: "hidden", gap: 0 }}>
                {en && <GuideCover slug={g.slug} category={en.category} icon={en.icon} />}
                <span className="stack g8" style={{ padding: "18px 20px 20px" }}>
                  <span className="serif" style={{ fontSize: 22, lineHeight: 1.18 }}>{g.title}</span>
                  <span className="muted" style={{ fontSize: 15 }}>{g.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="muted" style={{ marginTop: 28 }}>Más guías en inglés: <Link href="/guides">ver todas</Link>.</p>
      </section>
      <CtaBand title="¿Prefiere que lo" italic="hagamos por usted?" sub="Escanee su carta gratis y le mostramos qué está mal." />
    </main>
  );
}
