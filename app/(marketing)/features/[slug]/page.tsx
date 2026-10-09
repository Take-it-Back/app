import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import { Phone } from "@/components/screens";
import FeatureIcon from "@/components/FeatureIcon";
import { FEATURES, SCENARIOS, featureBySlug } from "@/lib/marketing";

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = featureBySlug((await params).slug);
  return f ? { title: f.name, description: f.lede } : {};
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const f = featureBySlug((await params).slug);
  if (!f) notFound();
  const [main, ...others] = f.shots;

  return (
    <main>
      <section className="wrap-1200 stack g16" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <Link href="/features" className="muted" style={{ fontSize: 14, textDecoration: "none", padding: "10px 0", alignSelf: "flex-start" }}>← All features</Link>
        <span className="row g8">
          <span className="ico o"><FeatureIcon slug={f.slug} /></span>
          <span className="eyebrow" style={{ fontSize: 13 }}>{f.name}</span>
          {f.plan === "premium" ? <span className="pill-pro">Premium</span> : f.plan === "free" ? <span className="pill-free">Free</span> : <span className="pill-free">Free + Premium</span>}
        </span>
        <h1 className="h-xl" style={{ maxWidth: 900, fontSize: "clamp(44px, 5.4vw, 70px)" }}>{f.headline[0]} <em className="o">{f.headline[1]}</em>.</h1>
        <p className="lede">{f.lede}</p>
        <div className="row wrap g12" style={{ marginTop: 4 }}>
          <CtaLink href="/login?mode=signup">{f.plan === "premium" ? "Try it 7 days free" : "Start free"}</CtaLink>
          <Link href="/pricing" className="btn-plain" style={{ minHeight: 52 }}>See plans</Link>
        </div>
      </section>

      <section className="wrap-1200" style={{ paddingTop: 48 }}>
        <div className="shot-stage">
          {others[0] && <div className="side" style={{ transform: "rotate(-3deg)" }}><Phone kind={others[0][0]} s={others[0][1]} size="sm" label={`${f.name}: ${SCENARIOS[others[0][1]].tag}`} /></div>}
          <Phone kind={main[0]} s={main[1]} label={`${f.name}: ${SCENARIOS[main[1]].tag}`} />
          {others[1] && <div className="side" style={{ transform: "rotate(3deg)" }}><Phone kind={others[1][0]} s={others[1][1]} size="sm" label={`${f.name}: ${SCENARIOS[others[1][1]].tag}`} /></div>}
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec ink">
        <div className="inner row wrap" style={{ alignItems: "flex-start", gap: 56 }}>
        <div className="stack g16" style={{ flex: "1 1 420px" }}>
          <span className="eyebrow" style={{ fontSize: 13, color: "#F0A07E" }}>Why it matters</span>
          {f.story.map((p, i) => (
            <p key={i} className={i === 0 ? "serif" : "lede"} style={i === 0 ? { margin: 0, fontSize: "clamp(24px, 2.6vw, 32px)", lineHeight: 1.25 } : { fontSize: 17, color: "#D4D4D4" }}>{p}</p>
          ))}
          <p style={{ margin: "8px 0 0", fontSize: 15, background: "#242424", border: "1px solid #333", borderRadius: 18, padding: "14px 18px" }}><strong style={{ fontWeight: 600 }}>On your plan: </strong>{f.planNote}</p>
        </div>
        <ul className="stack" style={{ flex: "1 1 360px", margin: 0, padding: 0, listStyle: "none" }}>
          {f.benefits.map(([t, b], i) => (
            <li key={t} className="row g16" style={{ padding: "20px 0", borderBottom: i < f.benefits.length - 1 ? "1px solid #333" : 0, alignItems: "flex-start" }}>
              <span className="serif" style={{ fontSize: 34, lineHeight: 1, color: "#BF4F28", width: 28 }}>{i + 1}</span>
              <span className="stack g4"><span style={{ fontWeight: 500, fontSize: 18 }}>{t}</span><span style={{ fontSize: 15, color: "#BDBDBD" }}>{b}</span></span>
            </li>
          ))}
        </ul>
        </div>
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec orange">
          <div className="inner stack g24">
            <div className="stack g8">
              <span className="eyebrow" style={{ fontSize: 13, color: "#A8441F" }}>Related</span>
              <h2 className="serif" style={{ margin: 0, fontSize: "clamp(32px, 3.6vw, 46px)" }}>Works <em className="o">well</em> with</h2>
            </div>
            <div className="grid-auto">
              {f.related.map((slug) => {
                const r = featureBySlug(slug)!;
                return (
                  <Link key={slug} href={`/features/${slug}`} className="card stack g8" style={{ textDecoration: "none", padding: 24 }}>
                    <span className="ico o"><FeatureIcon slug={slug} /></span>
                    <span className="serif" style={{ fontSize: 24 }}>{r.name}</span>
                    <span className="muted" style={{ fontSize: 15 }}>{r.short}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Start your first case" italic="today." sub="Free to start. Premium is 7 days free." />
    </main>
  );
}
