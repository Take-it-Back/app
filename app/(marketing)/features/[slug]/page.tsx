import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";
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
  return f ? pageMeta({ title: `${f.name}: ${f.headline.filter(Boolean).join(" ")}`, description: f.lede, path: `/features/${f.slug}` }) : {};
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const f = featureBySlug((await params).slug);
  if (!f) notFound();
  const [main] = f.shots;

  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Features", "/features"], [f.name, `/features/${f.slug}`]])} />
      <section className="wrap-1200 stack g16" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <Link href="/features" className="muted" style={{ fontSize: 14, textDecoration: "none", padding: "10px 0", alignSelf: "flex-start" }}>← All features</Link>
        <h1 className="h-xl" style={{ maxWidth: 900, fontSize: "clamp(40px, 4.8vw, 62px)" }}>{f.headline.filter(Boolean).join(" ")}</h1>
        <p className="lede">{f.lede}</p>
        <p className="muted" style={{ margin: 0 }}>{f.plan === "premium" ? "Included with Premium or a $24.99 case unlock." : f.plan === "free" ? "Free for everyone." : "Free, with more on Premium."}</p>
        <div className="row wrap g12" style={{ marginTop: 4 }}>
          <CtaLink href="/login?mode=signup">{f.plan === "premium" ? "Try it 7 days free" : "Start free"}</CtaLink>
          <Link href="/pricing" className="btn-plain" style={{ minHeight: 52 }}>See plans</Link>
        </div>
      </section>

      <section className="wrap-1200" style={{ paddingTop: 48 }}>
        <div className="shot-stage">
          <Phone kind={main[0]} s={main[1]} label={`${f.name}: ${SCENARIOS[main[1]].tag}`} />
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec open">
        <div className="inner row wrap" style={{ alignItems: "flex-start", gap: 56 }}>
        <div className="stack g16" style={{ flex: "1 1 420px" }}>
          {f.story.map((p, i) => (
            <p key={i} style={{ margin: 0, fontSize: 17, lineHeight: 1.65 }}>{p}</p>
          ))}
          <p className="panel-gray" style={{ margin: "8px 0 0", fontSize: 15 }}><strong style={{ fontWeight: 600 }}>On your plan: </strong>{f.planNote}</p>
        </div>
        <ul className="stack" style={{ flex: "1 1 360px", margin: 0, padding: 0, listStyle: "none" }}>
          {f.benefits.map(([t, b], i) => (
            <li key={t} className="row g16" style={{ padding: "20px 0", borderBottom: i < f.benefits.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
              <span className="stack g4"><span style={{ fontWeight: 500, fontSize: 18 }}>{t}</span><span className="muted" style={{ fontSize: 15 }}>{b}</span></span>
            </li>
          ))}
        </ul>
        </div>
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec open">
          <div className="inner stack g24">
            <div className="stack g8">
              <h2 className="serif" style={{ margin: 0, fontSize: "clamp(32px, 3.6vw, 46px)" }}>Related features</h2>
            </div>
            <div className="grid-auto">
              {f.related.map((slug) => {
                const r = featureBySlug(slug)!;
                return (
                  <Link key={slug} href={`/features/${slug}`} className="card stack g8" style={{ textDecoration: "none", padding: 24 }}>
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
