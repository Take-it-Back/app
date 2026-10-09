import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { BackLink, CtaButton } from "@/components/ui";
import { PRICES, TRIAL_DAYS, getPlan } from "@/lib/plan";

const FREE = ["Scan up to 3 papers a month", "A plain-English summary", "General next steps and red flags", "Free legal aid finder"];
const PREMIUM = ["Unlimited scans", "Every problem we found, in full, with the rule behind it", "Letters written for you, ready to print or email", "Every deadline tracked, with email reminders", "Their replies read and explained", "Your whole case file and a printable case packet", "Complaints to regulators and credit report disputes", "Forward bills by email, text reminders and family helpers"];

function Check({ on = true }: { on?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#BF4F28" : "#9A9A9A"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", marginTop: 3 }}>
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

export default async function UpgradePage({ searchParams }: { searchParams: Promise<{ error?: string; canceled?: string }> }) {
  const { error, canceled } = await searchParams;
  const { supabase, user } = await requireUser();
  const plan = await getPlan(supabase, user.id);
  if (plan.premium) redirect("/app/you");
  const trial = !plan.status;

  return (
    <main className="app-main wide">
      <BackLink href="/app" />
      <div className="stack g8" style={{ margin: "8px 0 20px" }}>
        <h1 className="page-title" style={{ fontSize: 40 }}>Let us do the <em className="o">work</em></h1>
        <p className="muted" style={{ margin: 0, fontSize: 16, maxWidth: 560 }}>
          Free shows you where you stand. Premium writes the letters, keeps every date and stays with you until it's settled.
        </p>
      </div>

      {error === "billing" && <p className="notice" role="alert">Payments aren't switched on yet. Please try again soon.</p>}
      {error === "confirm" && <p className="notice" role="alert">We couldn't confirm your payment. If you were charged, it will show up here within a minute.</p>}
      {canceled && <p className="notice">No problem. Nothing was charged.</p>}

      <div className="plan-grid" style={{ marginTop: 8 }}>
        <form action="/api/stripe/checkout" method="post" className="plan-card hot">
          <input type="hidden" name="plan" value="yearly" />
          <span className="row between"><span className="eyebrow">Yearly</span><span className="tag tag-orange">Save 50%</span></span>
          <span><span className="big-num">{PRICES.yearly.label}</span> <span className="muted">{PRICES.yearly.per}</span></span>
          <span className="muted small">About $4.92 a month, billed once a year.</span>
          <CtaButton type="submit" variant="orange" block>{trial ? `Start ${TRIAL_DAYS}-day free trial` : "Choose yearly"}</CtaButton>
        </form>
        <form action="/api/stripe/checkout" method="post" className="plan-card">
          <input type="hidden" name="plan" value="monthly" />
          <span className="eyebrow">Monthly</span>
          <span><span className="big-num">{PRICES.monthly.label}</span> <span className="muted">{PRICES.monthly.per}</span></span>
          <span className="muted small">Cancel anytime from your account.</span>
          <CtaButton type="submit" variant="ink" block>{trial ? `Start ${TRIAL_DAYS}-day free trial` : "Choose monthly"}</CtaButton>
        </form>
      </div>
      {trial && <p className="muted small" style={{ marginTop: 12 }}>You won't be charged today. We'll email you before your trial ends.</p>}

      <div className="plan-grid" style={{ marginTop: 28 }}>
        <section className="card stack g12">
          <span className="eyebrow">Free</span>
          {FREE.map((f) => <span key={f} className="row g8" style={{ alignItems: "flex-start", fontSize: 15 }}><Check on={false} />{f}</span>)}
        </section>
        <section className="card stack g12">
          <span className="eyebrow" style={{ color: "#BF4F28" }}>Premium</span>
          {PREMIUM.map((f) => <span key={f} className="row g8" style={{ alignItems: "flex-start", fontSize: 15 }}><Check />{f}</span>)}
        </section>
      </div>
      <p className="muted small" style={{ marginTop: 16 }}>Secure checkout by Stripe. Information, not legal advice.</p>
    </main>
  );
}
