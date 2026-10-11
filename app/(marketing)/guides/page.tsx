import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { GUIDES } from "@/lib/guides";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Guides: fight medical bills, insurance denials, landlords and debt collectors",
  description: "Plain-English, step-by-step guides to disputing medical bills, appealing insurance denials, getting your security deposit back and handling debt collectors.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Guides", "/guides"]])} />
      <PageHead eyebrow="Guides" title="Know your rights, in" italic="plain English" after="." lede="Step-by-step guides for the fights most people lose by default. General information, not legal advice." />
      <section className="wrap-1200" style={{ paddingTop: 40 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card stack g8" style={{ textDecoration: "none", padding: 24, borderRadius: 24 }}>
              <span className="eyebrow">{g.kicker}</span>
              <span className="serif" style={{ fontSize: 24, lineHeight: 1.15 }}>{g.title}</span>
              <span className="muted" style={{ fontSize: 15 }}>{g.description}</span>
              <span style={{ fontWeight: 500, color: "#A8441F", fontSize: 14, marginTop: "auto" }}>Read the guide →</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand title="Rather we just" italic="handle it?" sub="Scan your letter free and we'll show you what's wrong." />
    </main>
  );
}
