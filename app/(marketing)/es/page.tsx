import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, ORG, APP_LD, SITE_URL } from "@/lib/seo";
import { CtaLink } from "@/components/ui";
import { Phone } from "@/components/screens";

export const metadata: Metadata = pageMeta({
  title: "Take it back — Pelea facturas médicas, negaciones del seguro y caseros abusivos",
  description: "Toma una foto de la factura, la negación o el aviso. Take it back te explica en español qué está mal, escribe la carta para pelearlo y vigila cada fecha límite. Gratis para empezar.",
  path: "/es",
  absolute: true,
  locale: "es_US",
  languages: { "en-US": "/", "es-US": "/es", "x-default": "/" },
});

const FIGHTS = [
  ["Facturas médicas", "Cobros dobles, cargos sorpresa y ayuda financiera del hospital que nadie te ofreció.", "/fight/medical-bills"],
  ["Negaciones del seguro", "Apelaciones bien escritas y revisión externa cuando el seguro dice que no.", "/fight/insurance-denials"],
  ["Caseros", "Tu depósito de vuelta a tiempo, reparaciones por escrito y tus derechos en tu estado.", "/fight/landlords"],
  ["Cobradores de deudas", "Que prueben la deuda, que dejen de llamarte y que no te demanden por deudas viejas.", "/fight/debt-collectors"],
] as const;

const STEPS = [
  ["Toma una foto", "De la factura, la carta del seguro, el aviso del casero o la carta del cobrador."],
  ["Mira qué está mal", "Te lo explicamos en español sencillo, con la cantidad y la regla que te protege."],
  ["Manda la carta", "La escribimos por ti, en inglés, lista para imprimir, enviar por correo o por fax."],
  ["Nosotros vigilamos", "Tus fechas límite y las de ellos, con recordatorios para que no se te pase nada."],
] as const;

export default function Espanol() {
  return (
    <main id="main" lang="es">
      <JsonLd data={[ORG, { "@type": "WebPage", "@id": `${SITE_URL}/es`, url: `${SITE_URL}/es`, inLanguage: "es-US", name: "Take it back en español" }, { ...APP_LD, inLanguage: ["en-US", "es-US"] }]} />
      <section className="wrap-1200 row wrap" style={{ paddingTop: "clamp(48px, 7vw, 88px)", gap: 56, alignItems: "center" }}>
        <div className="stack g20" style={{ flex: "1 1 480px", minWidth: 0 }}>
          <span className="eyebrow" style={{ fontSize: 13 }}>Contra hospitales · aseguradoras · caseros · cobradores</span>
          <h1 className="h-xl">Cuentan con que te rindas. <em className="o">Recupéralo</em>.</h1>
          <p className="lede">Take it back lee la factura, negación o aviso injusto que recibiste, te dice en español qué está mal, escribe la carta para pelearlo y vigila cada fecha límite hasta que se resuelva.</p>
          <div className="row wrap g12" style={{ marginTop: 6 }}>
            <CtaLink href="/login?mode=signup&lang=es">Empieza gratis</CtaLink>
            <Link href="/legal-aid" className="btn-plain" style={{ minHeight: 52 }}>Ayuda legal gratis</Link>
          </div>
          <span className="muted small">Gratis para empezar. Información y herramientas de autoayuda, no asesoría legal. La app está en inglés por ahora; tus resúmenes y explicaciones pueden estar en español. Las apps para iPhone y Android llegan pronto.</span>
        </div>
        <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", justifyContent: "center" }}>
          <Phone kind="found" s="medical" label="Lo que encontramos en una factura del hospital" />
        </div>
      </section>

      <section className="wrap-1200 stack g24 m-section">
        <h2 className="h-l">Cuatro peleas que la mayoría <em className="o">pierde sin pelear</em>.</h2>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {FIGHTS.map(([t, b, href]) => (
            <Link key={t} href={href} className="card stack g8" style={{ textDecoration: "none", borderRadius: 22 }}>
              <span className="serif" style={{ fontSize: 24 }}>{t}</span>
              <span className="muted" style={{ fontSize: 15 }}>{b}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#A8441F" }}>Pelea →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec gray">
          <div className="inner stack g20">
            <h2 className="h-l">Cómo <em className="o">funciona</em></h2>
            <ol className="grid-auto" style={{ listStyle: "none", padding: 0, margin: 0, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              {STEPS.map(([t, b], i) => (
                <li key={t} className="stack g8">
                  <span className="serif" style={{ fontSize: 36, color: "#BF4F28" }}>{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{t}</span>
                  <span className="muted">{b}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="wrap-1200 stack g12 m-section" style={{ maxWidth: 760 }}>
        <h2 className="serif" style={{ fontSize: 32, margin: 0, fontWeight: 400 }}>Guías en español</h2>
        <p className="muted" style={{ margin: 0, fontSize: 17 }}>Pasos claros para pelear una factura médica, un cobrador, un abuso del casero o un error de crédito. <Link href="/es/guias">Ver las guías</Link></p>
      </section>
      <section className="wrap-1200 stack g16 m-section" style={{ maxWidth: 760 }}>
        <h2 className="h-l">Precio <em className="o">claro</em></h2>
        <p className="lede" style={{ margin: 0 }}>Gratis: 1 escaneo al mes con un resumen y los próximos pasos. ¿Solo un caso? Desbloquéalo por $24.99, un solo pago, por 60 días. Premium: $14.99 al mes, o $59 al año con 7 días gratis. Escribe tus cartas, vigila tus fechas y lee sus respuestas. Premium se renueva automáticamente hasta que canceles, y puedes cancelar en línea cuando quieras.</p>
        <p className="muted small" style={{ margin: 0 }}>Take it back no es un bufete de abogados y no da asesoría legal. Si te demandaron, tienes fecha de corte o te quieren desalojar, busca <Link href="/legal-aid">ayuda legal gratis</Link> hoy mismo.</p>
        <div><CtaLink href="/login?mode=signup&lang=es">Empieza gratis</CtaLink></div>
      </section>
    </main>
  );
}
