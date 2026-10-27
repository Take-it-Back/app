import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs, faqPage, ORG, APP_LD } from "@/lib/seo";
import { CtaBand } from "@/components/site";
import { CtaLink } from "@/components/ui";
import Faq, { PageHead } from "@/components/Faq";
import { FAQ_GROUPS, PLAN_ROWS } from "@/lib/marketing";

export const metadata: Metadata = pageMeta({ title: "Pricing: start free, $24.99 for one case, or Premium", description: "Start free with 1 scan a month. Unlock a single case for $24.99, once. Or get Premium for every case: $59 a year with a 7-day free trial, or $14.99 a month. Keep 100% of what you save.", path: "/pricing" });

function Check({ on = true }: { on?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#BF4F28" : "#9A9A9A"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", marginTop: 4 }}><path d="M5 12l5 5 9-10" /></svg>;
}

export default function PricingPage() {
  return (
    <main id="main">
      <JsonLd data={[APP_LD, faqPage([...FAQ_GROUPS[1].items]), breadcrumbs([["Home", "/"], ["Pricing", "/pricing"]])]} />
      <PageHead eyebrow="Pricing" title="Pricing" lede="Start free. Pay once to handle one bill, or get Premium for every case. We never take a cut of what you save." />

      <section className="wrap-1200" style={{ paddingTop: 48 }}>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="card stack g16" style={{ padding: 32, borderRadius: 14 }}>
            <span style={{ fontWeight: 500, fontSize: 18 }}>Free</span>
            <span className="serif" style={{ fontSize: 60, lineHeight: 1 }}>$0</span>
            <p className="muted" style={{ margin: 0 }}>See what's wrong with one letter a month.</p>
            <ul className="stack g8" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["1 scan a month", "Plain-English summary", "What we found and how much you could save", "Your state's rules", "Red flags and free legal aid finder"].map((t) => <li key={t} className="row g8" style={{ alignItems: "flex-start" }}><Check on={false} />{t}</li>)}
            </ul>
            <Link prefetch={false} href="/login?mode=signup" className="btn-plain" style={{ alignSelf: "flex-start", minHeight: 48, borderColor: "#1A1A1A", marginTop: "auto" }}>Start free</Link>
          </div>
          <div className="card stack g16" style={{ padding: 32, borderRadius: 14 }}>
            <span style={{ fontWeight: 500, fontSize: 18 }}>One case</span>
            <span className="serif" style={{ fontSize: 60, lineHeight: 1 }}>$24.99<span className="muted" style={{ fontFamily: "var(--sans)", fontSize: 16 }}> once</span></span>
            <p className="muted" style={{ margin: 0 }}>For one bill or letter. No subscription, nothing renews.</p>
            <ul className="stack g8" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["Everything Premium does, for that case", "60 days to see it through", "Letters, deadlines and reminders", "Their replies read and explained"].map((t) => <li key={t} className="row g8" style={{ alignItems: "flex-start" }}><Check />{t}</li>)}
            </ul>
            <p className="muted small" style={{ margin: "auto 0 0" }}>Scan your letter free, then tap <strong style={{ color: "#1A1A1A", fontWeight: 600 }}>Unlock just this case</strong>.</p>
            <Link prefetch={false} href="/login?mode=signup" className="btn-plain" style={{ alignSelf: "flex-start", minHeight: 48, borderColor: "#1A1A1A" }}>Scan your letter</Link>
          </div>
          <div className="card stack g16" style={{ padding: 32, borderRadius: 14, border: "2px solid #BF4F28", position: "relative" }}>
                        <span style={{ fontWeight: 500, fontSize: 18 }}>Premium</span>
            <span className="serif" style={{ fontSize: 60, lineHeight: 1 }}>$59<span className="muted" style={{ fontFamily: "var(--sans)", fontSize: 16 }}> a year</span></span>
            <p className="muted" style={{ margin: 0 }}>Every case, all year. Or <strong style={{ color: "#1A1A1A", fontWeight: 600 }}>$14.99 a month</strong>. Renews automatically until you cancel, and you can cancel online anytime.</p>
            <ul className="stack g8" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["Unlimited scans and cases", "Every problem in full, with the rule behind it", "Letters written for you", "Deadline tracking with reminders", "Their replies read and explained", "Case file, packet, complaints and credit disputes"].map((t) => <li key={t} className="row g8" style={{ alignItems: "flex-start" }}><Check />{t}</li>)}
            </ul>
            <div style={{ marginTop: "auto" }}><CtaLink href="/login?mode=signup&next=/app/upgrade" variant="orange">Start 7-day free trial</CtaLink></div>
            <span className="muted small">Free trial on the yearly plan for new subscribers.</span>
          </div>
        </div>
      </section>

      <section className="wrap-1200 m-section">
        <div className="stack g20">
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}>Compare plans</h2>
        <div className="card" style={{ padding: "8px 12px", borderRadius: 12 }}>
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
      </section>

      <section className="stack g24 m-section" style={{ maxWidth: 820, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <h2 className="h-l" style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}>Pricing questions</h2>
        <Faq items={[...FAQ_GROUPS[1].items, ["Can I cancel anytime?", "Yes. Cancel from your account in two taps. You keep Premium until the end of the period you paid for."], ["What happens to my cases if I cancel?", "They stay in your account. You can still see your summaries and download your data anytime."]]} />
      </section>

      <CtaBand title="Try Premium free for 7 days." sub="On the yearly plan. Cancel before it ends and you won't be charged." />
    </main>
  );
}
