import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";
import { PageHead } from "@/components/Faq";
import { CtaBand } from "@/components/site";
import { AID_STATES, stateFromZip, stateSlug } from "@/lib/legalAid";

export const metadata: Metadata = pageMeta({
  title: "Free legal aid near you, by state",
  description: "Find free civil legal aid, tenant help and lawyer referral services in every state. Enter your ZIP code for medical bill, eviction, debt collection and insurance help.",
  path: "/legal-aid",
});

export default async function LegalAidIndex({ searchParams }: { searchParams: Promise<{ zip?: string }> }) {
  const { zip } = await searchParams;
  const st = stateFromZip(zip);
  if (st) redirect(`/legal-aid/${stateSlug(st)}`);
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Legal aid", "/legal-aid"]])} />
      <PageHead eyebrow="Legal aid" title="Free legal aid near you" after="." lede="Legal aid offices help people who can't afford a lawyer with evictions, debt lawsuits, medical bills and insurance denials. Here's who to call in your state." />
      <section className="wrap" style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 48px" }}>
        <form method="get" className="card row wrap g12" style={{ alignItems: "flex-end", borderRadius: 12 }}>
          <label className="field grow" style={{ minWidth: 200 }}><span style={{ fontSize: 15, fontWeight: 500 }}>Your ZIP code</span><input name="zip" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} className="input" placeholder="e.g. 18701" defaultValue={zip || ""} /></label>
          <button className="btn-plain" style={{ minHeight: 48 }}>Find help</button>
          {zip && !st && <p className="small" style={{ color: "#A8441F", margin: 0, width: "100%" }}>We couldn&apos;t match that ZIP code. Pick your state below.</p>}
        </form>
        <h2 className="serif" style={{ fontSize: 30, margin: "40px 0 12px", fontWeight: 400 }}>Or pick your state</h2>
        <ul className="state-grid" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "6px 16px" }}>
          {AID_STATES.map((s) => <li key={s}><Link href={`/legal-aid/${stateSlug(s)}`} style={{ display: "block", padding: "8px 0", fontSize: 16 }}>{s}</Link></li>)}
        </ul>
      </section>
      <CtaBand title="If you're not in court yet, answer in writing." sub="Scan the bill or letter. We'll find the problems and write what to send." />
    </main>
  );
}
