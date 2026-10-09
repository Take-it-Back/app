import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import Faq, { PageHead } from "@/components/Faq";
import { FAQ_GROUPS, PROBLEMS } from "@/lib/marketing";

export const metadata: Metadata = { title: "FAQ", description: "Answers about how Take it back works, what it costs and how your information is kept private." };

export default function FaqPage() {
  return (
    <main>
      <PageHead eyebrow="FAQ" title="Good" italic="questions" after="." lede="Can't find what you need? Email hello@takeitback.app and a person will write back." />
      <div className="stack g48" style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 0", gap: 56 }}>
        {FAQ_GROUPS.map((g) => (
          <section key={g.title} className="stack g16">
            <h2 className="serif" style={{ margin: 0, fontSize: 32 }}>{g.title}</h2>
            <Faq items={g.items} openFirst={false} />
          </section>
        ))}
        {PROBLEMS.map((p) => (
          <section key={p.slug} className="stack g16">
            <h2 className="serif" style={{ margin: 0, fontSize: 32 }}>{p.name}</h2>
            <Faq items={p.faqs} openFirst={false} />
            <Link href={`/help-with/${p.slug}`} style={{ fontWeight: 500 }}>More about {p.name.toLowerCase()} →</Link>
          </section>
        ))}
      </div>
      <CtaBand title="Still unsure? Try it" italic="free." sub="Scan one letter and see what we find." />
    </main>
  );
}
