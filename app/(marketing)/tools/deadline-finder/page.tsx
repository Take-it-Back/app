import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { DeadlineFinder } from "@/components/PublicTools";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Deadline finder: how long do you have?",
  description: "Find the last day to dispute a debt, report fraud, appeal a denial or file a complaint. Free, runs in your browser, nothing is saved.",
  path: "/tools/deadline-finder",
});

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Free tools", "/tools"], ["Deadline finder: how long do you have?", "/tools/deadline-finder"]])} />
      <PageHead eyebrow="Free tool" title="Deadline finder" lede="Pick what you need to do and the date the clock started. Nothing you enter is saved or sent." />
      <section className="wrap-1200" style={{ paddingTop: 32, maxWidth: 820 }}>
        <DeadlineFinder />
      </section>
      <CtaBand title="Scan your letter and see what's wrong." sub="Free, no card needed. Premium writes the letter and tracks the deadlines." />
    </main>
  );
}
