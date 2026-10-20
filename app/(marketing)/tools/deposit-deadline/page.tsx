import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { DepositDeadline } from "@/components/PublicTools";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Security deposit deadline by state",
  description: "Choose your state and move-out date to see when your landlord must return your security deposit. Free, runs in your browser.",
  path: "/tools/deposit-deadline",
});

export default function Page() {
  return (
    <main>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Free tools", "/tools"], ["Security deposit deadline by state", "/tools/deposit-deadline"]])} />
      <PageHead eyebrow="Free tool" title="When is your deposit" italic="due?" after="." lede="Choose your state and move-out date. Nothing you enter is saved or sent." />
      <section className="wrap-1200" style={{ paddingTop: 32, maxWidth: 820 }}>
        <DepositDeadline />
      </section>
      <CtaBand title="Rather we just" italic="handle it?" sub="Scan your letter free and we'll show you what's wrong." />
    </main>
  );
}
