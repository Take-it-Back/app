import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs, faqPage, ORG, APP_LD } from "@/lib/seo";
import { CtaBand } from "@/components/site";
import Faq, { PageHead } from "@/components/Faq";
import { FAQ_GROUPS, PROBLEMS } from "@/lib/marketing";

export const metadata: Metadata = pageMeta({ title: "FAQ: how Take it back works, pricing and privacy", description: "Answers about fighting medical bills, insurance denials, landlords and debt collectors with Take it back, what Free and Premium include, and how your documents stay private.", path: "/faq" });

export default function FaqPage() {
  return (
    <main id="main">
      <JsonLd data={[faqPage([...FAQ_GROUPS.flatMap((g) => g.items), ...PROBLEMS.flatMap((p) => p.faqs)]), breadcrumbs([["Home", "/"], ["FAQ", "/faq"]])]} />
      <PageHead eyebrow="FAQ" title="Questions and answers" lede="Can't find what you need? Send us a message on the support page and a person will write back." />
      <div className="stack g48" style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 0", gap: 56 }}>
        {FAQ_GROUPS.map((g) => (
          <section key={g.title} className="stack g16">
            <h2 className="serif" style={{ margin: 0, fontSize: 32 }}>{g.title}</h2>
            <Faq items={g.items} openFirst={false} />
          </section>
        ))}
      </div>
      <section className="m-section">
        <div className="panel-sec orange">
          <div className="inner stack g24">
            <div className="stack g8">
              <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}>Questions by topic</h2>
            </div>
            <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 28 }}>
              {PROBLEMS.map((p) => (
                <section key={p.slug} className="stack g12">
                  <h3 className="serif" style={{ margin: 0, fontSize: 28, fontWeight: 400 }}>{p.name}</h3>
                  <Faq items={p.faqs} openFirst={false} />
                  <Link href={`/fight/${p.slug}`} style={{ fontWeight: 500, display: "inline-block", padding: "10px 0" }}>How to fight {p.name.toLowerCase()} →</Link>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand title="Try it on one letter, free." sub="Scan one letter and see what we find." />
    </main>
  );
}
