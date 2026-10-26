import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { LetterBuilder } from "@/components/PublicTools";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Free dispute letter builder",
  description: "Build a ready-to-send letter: itemized bill request, debt validation, credit report dispute, refund, cancellation, repairs or deposit. Free, nothing is saved.",
  path: "/tools/letter-builder",
});

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Free tools", "/tools"], ["Free dispute letter builder", "/tools/letter-builder"]])} />
      <PageHead eyebrow="Free tool" title="Build your" italic="letter" after="." lede="Answer a few questions and copy the letter. Nothing you type is saved or sent." />
      <section className="wrap-1200" style={{ paddingTop: 32, maxWidth: 820 }}>
        <LetterBuilder />
      </section>
      <CtaBand title="Rather we just" italic="handle it?" sub="Scan your letter free and we'll show you what's wrong." />
    </main>
  );
}
