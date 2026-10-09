import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import { Phone } from "@/components/screens";
import Faq from "@/components/Faq";
import FeatureIcon from "@/components/FeatureIcon";
import { PROBLEMS, SCENARIOS, problemBySlug } from "@/lib/marketing";

const CTA = { medical: "Fighting a hospital bill?", insurance: "Fighting your insurance company?", renters: "Fighting your landlord?", debt: "Fighting a debt collector?" } as const;

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = problemBySlug((await params).slug);
  return p ? { title: p.name, description: p.lede } : {};
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = problemBySlug((await params).slug);
  if (!p) notFound();
  const c = SCENARIOS[p.scenario];

  return (
    <main>
      <section className="wrap-1200 row wrap" style={{ paddingTop: "clamp(40px, 6vw, 72px)", gap: 56, alignItems: "center" }}>
        <div className="stack g16" style={{ flex: "1 1 460px", minWidth: 0 }}>
          <Link href="/fight" className="muted" style={{ fontSize: 14, textDecoration: "none", padding: "10px 0", alignSelf: "flex-start" }}>← Everyone we fight</Link>
          <span className="row g8"><span className="ico o"><FeatureIcon slug={p.slug} /></span><span className="eyebrow" style={{ fontSize: 13 }}>Fight back against {p.name.toLowerCase()}</span></span>
          <h1 className="h-xl" style={{ fontSize: "clamp(44px, 5.4vw, 70px)" }}>{p.headline[0]} <em className="o">{p.headline[1]}</em>.</h1>
          <p className="lede">{p.lede}</p>
          <div className="row wrap g12" style={{ marginTop: 4 }}>
            <CtaLink href="/login?mode=signup">Scan yours free</CtaLink>
            <Link href="/how-it-works" className="btn-plain" style={{ minHeight: 52 }}>How it works</Link>
          </div>
        </div>
        <div style={{ flex: "1 1 360px", display: "flex", justifyContent: "center" }}>
          <Phone kind="found" s={p.scenario} label={`What we found: ${c.title}`} />
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec orange">
        <div className="inner stack g24">
        <div className="stack g8">
          <span className="eyebrow" style={{ fontSize: 13, color: "#A8441F" }}>What we catch</span>
          <h2 className="h-l" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>The things that go <em className="o">wrong</em> most</h2>
        </div>
        <ul className="check-list">
          {p.catches.map(([t, b]) => (
            <li key={t}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BF4F28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", marginTop: 2 }}><path d="M5 12l5 5 9-10" /></svg>
              <span className="stack g4"><span style={{ fontWeight: 500, fontSize: 17 }}>{t}</span><span className="muted" style={{ fontSize: 15 }}>{b}</span></span>
            </li>
          ))}
        </ul>
        </div>
        </div>
      </section>

      <section className="m-section">
        <div className="wrap-1200 stack g8" style={{ marginBottom: 28 }}>
          <span className="eyebrow" style={{ fontSize: 13 }}>A real example</span>
          <h2 className="h-l" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>{c.counterparty}, <em className="o">start to finish</em></h2>
          <p className="lede" style={{ fontSize: 17 }}>{c.summary}</p>
        </div>
        <div className="strip">
          <div>
            {([
              ["scan", "Snap it"],
              ["found", "See what's wrong"],
              ["letter", "Send the letter"],
              ["tracker", "Track both deadlines"],
              ["reply", "Decode their reply"],
            ] as const).map(([k, t], i) => (
              <figure key={k}>
                <Phone kind={k} s={p.scenario} size="sm" label={`${t}: ${c.counterparty}`} />
                <figcaption className="row g8"><span className="serif" style={{ fontSize: 24, color: "#BF4F28", lineHeight: 1 }}>{i + 1}</span><span style={{ fontWeight: 500 }}>{t}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec ink">
          <div className="inner row wrap" style={{ gap: 48, alignItems: "flex-start" }}>
            <div className="stack g12" style={{ flex: "1 1 320px" }}>
              <span className="eyebrow" style={{ fontSize: 13, color: "#F0A07E" }}>Rules on your side</span>
              <h2 className="serif" style={{ margin: 0, fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: 1.1 }}>We name the rule, so they <em className="o">take you seriously</em>.</h2>
              <p className="muted small" style={{ margin: 0 }}>General information. Rules vary by state and plan, and we'll check the details on your letter.</p>
            </div>
            <div className="stack" style={{ flex: "1 1 420px" }}>
              {p.rules.map(([t, b], i) => (
                <div key={t} className="stack g4" style={{ padding: "18px 0", borderBottom: i < p.rules.length - 1 ? "1px solid #333" : 0 }}>
                  <span style={{ fontWeight: 600, color: "#F0A07E" }}>{t}</span>
                  <span style={{ fontSize: 16, color: "#D4D4D4" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec gray">
        <div className="inner stack g32">
        <div className="stack g8">
          <span className="eyebrow" style={{ fontSize: 13 }}>Three steps</span>
          <h2 className="h-l" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>What you'll <em className="o">do</em></h2>
        </div>
        <ol className="grid-auto" style={{ margin: 0, padding: 0, listStyle: "none", gap: 36 }}>
          {p.steps.map(([t, b], i) => (
            <li key={t} className="stack g8" style={{ borderTop: "1px solid #1A1A1A", paddingTop: 22 }}>
              <span className="serif" style={{ fontSize: 46, lineHeight: 1, color: "#BF4F28" }}>{i + 1}</span>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>{t}</h3>
              <p className="muted" style={{ margin: 0, fontSize: 16 }}>{b}</p>
            </li>
          ))}
        </ol>
        </div>
        </div>
      </section>

      <section className="stack g24 m-section" style={{ maxWidth: 820, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <h2 className="h-l" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>Common <em className="o">questions</em></h2>
        <Faq items={p.faqs} />
      </section>

      <CtaBand title={CTA[p.scenario]} italic="Start here." sub="Scan it free and see where you stand in a minute." />
    </main>
  );
}
