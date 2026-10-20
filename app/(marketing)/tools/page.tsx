import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { PageHead } from "@/components/Faq";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Free tools: deadline finder, letter builder and deposit deadline",
  description: "Free tools that run in your browser. Find your deadline, build a dispute letter and check when your landlord must return your deposit. Nothing you type is saved.",
  path: "/tools",
});

const TOOL_LIST = [
  { href: "/tools/deadline-finder", title: "Deadline finder", text: "Pick what you need to do, enter the date, and see your last day. Covers collectors, billing errors, appeals, discrimination complaints and more." },
  { href: "/tools/letter-builder", title: "Dispute letter builder", text: "Fill in a few boxes and get a ready-to-send letter: itemized bill, debt validation, credit report dispute, refund, cancellation, repairs and deposit." },
  { href: "/tools/deposit-deadline", title: "Deposit deadline by state", text: "Choose your state and move-out date. See when your landlord has to return your security deposit." },
];

export default function ToolsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Free tools", "/tools"]])} />
      <PageHead eyebrow="Free tools" title="Quick answers you can use" italic="right now" after="." lede="These run in your browser. Nothing you type is saved or sent anywhere. General information, not legal advice." />
      <section className="wrap-1200" style={{ paddingTop: 32 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {TOOL_LIST.map((t) => (
            <Link key={t.href} href={t.href} className="card stack g8" style={{ textDecoration: "none", padding: 26, borderRadius: 24 }}>
              <span className="serif" style={{ fontSize: 26, lineHeight: 1.15 }}>{t.title}</span>
              <span className="muted" style={{ fontSize: 15.5 }}>{t.text}</span>
              <span style={{ fontWeight: 500, color: "#A8441F", fontSize: 14, marginTop: "auto" }}>Open the tool →</span>
            </Link>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 28 }}>Want more? <Link href="/guides">Read the guides</Link> or <Link href="/states">see the rules for your state</Link>.</p>
      </section>
      <CtaBand title="Rather we just" italic="handle it?" sub="Scan your letter free and we'll show you what's wrong." />
    </main>
  );
}
