import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import { Phone } from "@/components/screens";
import Faq, { PageHead } from "@/components/Faq";
import { FAQ_GROUPS, PLAN_ROWS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start free with 3 scans a month. Premium is $9.99 a month or $59 a year, with a 7-day free trial.",
};

function Check({ on = true }: { on?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#BF4F28" : "#9A9A9A"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", marginTop: 4 }}><path d="M5 12l5 5 9-10" /></svg>;
}

export default function PricingPage() {
  return (
    <main>
      <PageHead eyebrow="Pricing" title="Start free. Let us do the" italic="work" after=" when you're ready." lede="Free tells you where you stand. Premium writes the letters, keeps every date and stays with you until it's settled. You keep 100% of what you save." />

      <section className="wrap-1200" style={{ paddingTop: 48 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div className="card stack g16" style={{ padding: 32, borderRadius: 28 }}>
            <span style={{ fontWeight: 500, fontSize: 18 }}>Free</span>
            <span className="serif" style={{ fontSize: 60, lineHeight: 1 }}>$0</span>
            <p className="muted" style={{ margin: 0 }}>Know where you stand.</p>
            <ul className="stack g8" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["3 scans a month", "Plain-English summary", "General next steps and deadlines", "Red flags and free legal aid finder"].map((t) => <li key={t} className="row g8" style={{ alignItems: "flex-start" }}><Check on={false} />{t}</li>)}
            </ul>
            <Link href="/login?mode=signup" className="btn-plain" style={{ alignSelf: "flex-start", minHeight: 48, borderColor: "#1A1A1A", marginTop: "auto" }}>Start free</Link>
          </div>
          <div className="card stack g16" style={{ padding: 32, borderRadius: 28, border: "2px solid #BF4F28", position: "relative" }}>
            <span className="tag tag-orange" style={{ position: "absolute", top: -14, left: 28, fontSize: 13, padding: "6px 14px" }}>7 days free</span>
            <span style={{ fontWeight: 500, fontSize: 18 }}>Premium</span>
            <span className="serif" style={{ fontSize: 60, lineHeight: 1 }}>$9.99<span className="muted" style={{ fontFamily: "var(--sans)", fontSize: 16 }}> a month</span></span>
            <p className="muted" style={{ margin: 0 }}>Or <strong style={{ color: "#1A1A1A", fontWeight: 600 }}>$59 a year</strong> (save 50%). Cancel anytime.</p>
            <ul className="stack g8" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["Unlimited scans", "Every problem in full, with the rule behind it", "Letters written for you", "Deadline tracking with email reminders", "Their replies read and explained", "Case file and printable case packet"].map((t) => <li key={t} className="row g8" style={{ alignItems: "flex-start" }}><Check />{t}</li>)}
            </ul>
            <div style={{ marginTop: "auto" }}><CtaLink href="/login?mode=signup&next=/app/upgrade" variant="orange">Start 7-day free trial</CtaLink></div>
          </div>
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec gray">
        <div className="inner stack g20">
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}>Compare <em className="o">plans</em></h2>
        <div className="card" style={{ padding: "8px 12px", borderRadius: 26 }}>
          <table className="pt">
            <thead><tr><th scope="col">What you get</th><th scope="col">Free</th><th scope="col">Premium</th></tr></thead>
            <tbody>
              {PLAN_ROWS.map(([f, a, b]) => (
                <tr key={f}><td>{f}</td><td data-label="Free" className={a === "—" ? "muted" : undefined}>{a}</td><td data-label="Premium" style={{ fontWeight: 500 }}>{b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        </div>
      </section>

      <section className="wrap-1200 m-section">
        <div className="shot-stage" style={{ background: "#1A1A1A" }}>
          <div className="side" style={{ transform: "rotate(-3deg)" }}><Phone kind="free" s="insurance" size="sm" label="Free plan: summary with locked details" /></div>
          <div className="stack g8" style={{ alignSelf: "center", maxWidth: 280, textAlign: "center", padding: "0 8px" }}>
            <span className="hand" style={{ fontSize: 30, lineHeight: 1.1, color: "#fff" }}>free shows you the problem.</span>
            <span className="hand" style={{ fontSize: 30, lineHeight: 1.1, color: "#F0A07E" }}>premium fixes it.</span>
          </div>
          <div className="side" style={{ transform: "rotate(3deg)" }}><Phone kind="letter" s="insurance" size="sm" label="Premium: the appeal letter, written for you" /></div>
        </div>
      </section>

      <section className="stack g24 m-section" style={{ maxWidth: 820, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}>Pricing <em className="o">questions</em></h2>
        <Faq items={[...FAQ_GROUPS[1].items, ["Can I cancel anytime?", "Yes. Cancel from your account in two taps. You keep Premium until the end of the period you paid for."], ["What happens to my cases if I cancel?", "They stay in your account. You can still see your summaries and download your data anytime."]]} />
      </section>

      <CtaBand title="Try Premium free for" italic="7 days." sub="Cancel before it ends and you won't be charged." />
    </main>
  );
}
