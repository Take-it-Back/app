import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, ORG, APP_LD, SITE_URL } from "@/lib/seo";
import { CtaLink } from "@/components/ui";
import { SampleBill, SampleLetter } from "@/components/SampleDocs";
import AppsComingSoon from "@/components/AppsComingSoon";
import { FAQ_GROUPS } from "@/lib/marketing";
import { depositRule } from "@/lib/deposits";
import { debtRule, smallClaimsRule } from "@/lib/stateLaw";

export const metadata: Metadata = pageMeta({
  title: "Take it back — Fight medical bills, insurance denials & landlords",
  description: "Scan a medical bill, insurance denial, landlord notice or collection letter. Take it back lists what's wrong, writes the letter to dispute it, and tracks the deadlines. Free to start.",
  path: "/",
  absolute: true,
  languages: { "en-US": "/", "es-US": "/es", "x-default": "/" },
});

const STEPS: [string, string][] = [
  ["Scan the bill.", "Take a photo or upload the PDF. Every page if there's more than one."],
  ["See what's wrong.", "On this bill: a CT scan charged twice ($1,240) and an out-of-network ER doctor ($522) that federal law says you don't owe in full."],
  ["Send the letter.", "We write it from your bill and your state's rules. Edit it, then print it, email it, or have us mail it certified for $8.99."],
  ["We track the deadlines.", "Hospitals usually have 30 days to answer. We remind you before your dates and theirs."],
  ["Scan their reply.", "We tell you what they fixed, what they didn't, and write the next letter."],
];

const FIGHTS: { name: string; href: string; what: string; rules: string }[] = [
  { name: "Medical bills", href: "/fight/medical-bills", what: "Duplicate charges, surprise out-of-network bills, hospital charity care, medical debt on your credit report.", rules: "No Surprises Act, hospital financial assistance policies, credit reporting rules for medical debt." },
  { name: "Insurance denials", href: "/fight/insurance-denials", what: "Denied claims and prior authorizations, internal appeals, outside review.", rules: "ACA appeal rights, plan deadlines (often 180 days), your state's external review." },
  { name: "Landlords", href: "/fight/landlords", what: "Kept security deposits, repairs that never happen, illegal fees and notices.", rules: "Your state's deposit deadline and penalty, repair and entry rules." },
  { name: "Debt collectors", href: "/fight/debt-collectors", what: "Debts you don't recognize, debts too old to sue on, harassment.", rules: "Fair Debt Collection Practices Act, validation requests, your state's time limit." },
];

const STATES = ["California", "Florida", "New York", "Ohio", "Pennsylvania", "Texas"];
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function Home() {
  return (
    <main id="main">
      <JsonLd data={[ORG, { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: SITE_URL, name: "Take it back", publisher: { "@id": `${SITE_URL}/#org` } }, APP_LD]} />

      <section className="wrap-1200 row wrap" style={{ paddingTop: "clamp(48px, 7vw, 88px)", gap: 56, alignItems: "center" }}>
        <div className="stack g20" style={{ flex: "1 1 440px", minWidth: 0 }}>
          <h1 className="h-xl" style={{ fontSize: "clamp(40px, 4.8vw, 62px)" }}>Dispute a medical bill, insurance denial, landlord or debt collector.</h1>
          <p className="lede">Scan the letter you got. Take it back lists what looks wrong, shows the rule for your state, writes the letter to send back, and reminds you before every deadline.</p>
          <div className="row wrap g12" style={{ marginTop: 6 }}>
            <CtaLink href="/login?mode=signup">Start free</CtaLink>
            <Link href="/how-it-works" className="btn-plain" style={{ minHeight: 52 }}>How it works</Link>
          </div>
          <span className="muted small">Free for 1 scan a month. Works in any phone or computer browser. Self-help tools, not legal advice.</span>
        </div>
        <div style={{ flex: "1 1 480px", minWidth: 0 }}><SampleBill /></div>
      </section>

      <section className="wrap-1200 m-section row wrap" style={{ gap: 56, alignItems: "flex-start" }}>
        <div className="stack g20" style={{ flex: "1 1 400px", minWidth: 0 }}>
          <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>What happens with a bill like that one</h2>
          <ol className="plain-steps">
            {STEPS.map(([t, b]) => <li key={t}><strong>{t}</strong> {b}</li>)}
          </ol>
          <Link href="/how-it-works" style={{ fontWeight: 500 }}>See a full insurance appeal, step by step →</Link>
        </div>
        <div style={{ flex: "1 1 440px", minWidth: 0 }}><SampleLetter /></div>
      </section>

      <section className="wrap-1200 m-section stack g20">
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>What we help with</h2>
        <div className="rule-rows">
          {FIGHTS.map((f) => (
            <Link key={f.href} href={f.href} className="rule-row">
              <span className="rule-name">{f.name} →</span>
              <span>{f.what}</span>
              <span className="muted">{f.rules}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap-1200 m-section stack g16">
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>The rules change by state</h2>
        <p className="lede" style={{ maxWidth: 680 }}>Every case uses the rules for your state, with the source linked. A few of them:</p>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th scope="col">State</th><th scope="col">Landlord must return your deposit within</th><th scope="col">Collectors can sue on a written contract for</th><th scope="col">Small claims limit</th></tr></thead>
            <tbody>
              {STATES.map((s) => (
                <tr key={s}>
                  <th scope="row">{s}</th>
                  <td>{depositRule(s)?.text || "—"}</td>
                  <td>{debtRule(s)?.written ? `${debtRule(s)!.written} years` : "—"}</td>
                  <td>{smallClaimsRule(s)?.limit ? money(smallClaimsRule(s)!.limit) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/states" style={{ fontWeight: 500 }}>All 50 states and DC →</Link>
      </section>

      <section className="wrap-1200 m-section stack g20">
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>Pricing</h2>
        <div className="price-cols">
          <div>
            <h3>Free</h3>
            <p className="price">$0</p>
            <p>1 scan a month. A plain-English summary, what looks wrong, your state's rules and the legal aid finder.</p>
          </div>
          <div>
            <h3>One case</h3>
            <p className="price">$24.99 <span>once</span></p>
            <p>Everything for one bill or letter for 60 days: letters, deadline reminders and reading their reply. No subscription.</p>
          </div>
          <div>
            <h3>Premium</h3>
            <p className="price">$59 <span>a year</span></p>
            <p>Every case, unlimited scans and letters, deadline alerts. $14.99 a month if you'd rather. The yearly plan starts with 7 days free.</p>
          </div>
        </div>
        <p className="muted" style={{ margin: 0 }}>We don't take a cut of anything you save or get back. Your documents are never sold or used for ads. <Link href="/pricing">Full pricing</Link></p>
        <div><CtaLink href="/login?mode=signup">Start free</CtaLink></div>
      </section>

      <section className="wrap-1200 m-section">
        <div className="notice-box row wrap" style={{ gap: 32, alignItems: "center" }}>
          <div className="stack g8" style={{ flex: "1 1 380px" }}>
            <h2 className="serif" style={{ margin: 0, fontSize: 30, fontWeight: 400 }}>Have a court date or an eviction notice?</h2>
            <p style={{ margin: 0 }}>Call legal aid today. Letters are too slow once you're in court. We list the free legal aid offices and tenant hotlines in your state, with phone numbers. No account needed.</p>
          </div>
          <form action="/legal-aid" method="get" className="row wrap g12" style={{ flex: "1 1 320px", alignItems: "flex-end" }}>
            <label className="field grow" style={{ minWidth: 160 }}><span style={{ fontSize: 15, fontWeight: 500 }}>Your ZIP code</span><input name="zip" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} className="input" placeholder="18701" /></label>
            <button className="btn btn-ink" style={{ minHeight: 48 }}>Find legal aid</button>
          </form>
        </div>
      </section>

      <section className="m-section stack g16" style={{ maxWidth: 820, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>Questions</h2>
        <div className="stack g8">
          {[...FAQ_GROUPS[0].items, FAQ_GROUPS[1].items[2]].map(([q, a]) => (
            <details key={q} className="faq">
              <summary>
                {q}
                <svg className="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
              </summary>
              <p className="muted" style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.6 }}>{a}</p>
            </details>
          ))}
        </div>
        <Link href="/faq" style={{ fontWeight: 500, display: "inline-block", padding: "10px 0" }}>All questions →</Link>
      </section>

      <section className="wrap-1200 m-section" style={{ paddingBottom: 96 }}>
        <div className="end-cta">
          <div className="stack g8">
            <h2 className="serif" style={{ margin: 0, fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 400 }}>Scan your bill and see what we find.</h2>
            <p className="muted" style={{ margin: 0 }}>Free, no card needed. Takes about a minute.</p>
          </div>
          <CtaLink href="/login?mode=signup">Start free</CtaLink>
        </div>
        <div className="stack g8" style={{ marginTop: 40, maxWidth: 560 }}>
          <p className="muted small" style={{ margin: 0 }}>iPhone and Android apps are on the way. Until then, open takeitback.app on your phone and add it to your home screen. Leave your email to hear when they launch:</p>
          <AppsComingSoon />
        </div>
      </section>
    </main>
  );
}
