import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { CtaBand } from "@/components/site";

export const metadata: Metadata = pageMeta({ title: "About Take it back", description: "Who makes Take it back, what it does for people disputing medical bills, insurance denials, landlords and debt collectors, and the rules we hold ourselves to.", path: "/about" });

const RULES: [string, string][] = [
  ["We don't take a cut.", "You pay for the app, or nothing. We never take a share of money you save or get back."],
  ["Your documents aren't for sale.", "We don't sell them or use them for ads. You can download or delete everything from your account."],
  ["We say when you need a person.", "We're not a law firm. If you've been sued, have a court date or face eviction, we point you to free legal aid first."],
  ["Safety stays free.", "Warnings about court dates and the legal aid finder are free for everyone."],
  ["We show our sources.", "Every state rule we use links to where it comes from, with the date we last checked it."],
];

export default function AboutPage() {
  return (
    <main id="main" className="stack g20" style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px 0", fontSize: 17, lineHeight: 1.65 }}>
      <h1 className="h-l" style={{ fontSize: "clamp(36px, 4.2vw, 52px)" }}>About Take it back</h1>
      <p style={{ margin: 0 }}>
        Take it back helps people answer the letters that cost them money: hospital bills, insurance denials, landlords who keep a deposit, and debt collectors. You scan the letter. We list what looks wrong, show the rule for your state, write the reply, and remind you before each deadline.
      </p>
      <p style={{ margin: 0 }}>
        A lot of money is lost here without anyone deciding to lose it. A duplicate charge gets paid because the bill is 6 pages long. An appeal never gets filed because the deadline was buried on page 3. A deposit stays with the landlord because nobody knew the state gives them 30 days to return it. The rules that protect people already exist. Using them takes a letter, sent on time, that cites the right one.
      </p>
      <p style={{ margin: 0 }}>
        Take it back is made by <a href="https://www.squaredawaylabs.com">Squared Away Labs</a>, a small software studio.
      </p>

      <h2 className="serif" style={{ margin: "24px 0 0", fontSize: 30, fontWeight: 400 }}>Rules we hold ourselves to</h2>
      <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {RULES.map(([t, b]) => <li key={t}><strong>{t}</strong> {b}</li>)}
      </ul>
      <p className="muted" style={{ margin: "8px 0 0", fontSize: 15 }}>Questions or ideas? <Link href="/support">Send us a message</Link>.</p>
      <CtaBand title="Scan your first letter free." sub="Works in any phone or computer browser. iPhone and Android apps are on the way." />
    </main>
  );
}
