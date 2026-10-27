import { requireUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui";
import LegalAidList from "@/components/LegalAidList";
import { stateFromZip, AID_STATES } from "@/lib/legalAid";

const RESOURCES = [
  { name: "Find a legal aid office (LSC)", detail: "Legal Services Corporation's directory of funded programs.", href: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help", tone: "orange" as const },
  { name: "Call or text 211", detail: "Rent help, utility help and emergency programs.", href: "https://www.211.org", tone: "ink" as const },
  { name: "Lawyer referral from your state bar", detail: "Often a low-cost first meeting.", href: "https://www.americanbar.org/groups/legal_services/flh-home/", tone: "orange" as const },
  { name: "Complain to the CFPB", detail: "Debt collectors, credit reports and medical debt.", href: "https://www.consumerfinance.gov/complaint/", tone: "ink" as const },
  { name: "Medical bills: No Surprises help desk", detail: "Surprise bills and good faith estimates. 1-800-985-3059.", href: "https://www.cms.gov/nosurprises", tone: "orange" as const },
];

export default async function HelpPage({ searchParams }: { searchParams: Promise<{ zip?: string; state?: string; focus?: string }> }) {
  const { zip, state: pick, focus } = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: prof } = await supabase.from("profiles").select("state").eq("id", user.id).maybeSingle();
  const fromZip = stateFromZip(zip);
  const state = fromZip || (pick && AID_STATES.includes(pick) ? pick : null) || prof?.state || null;
  return (
    <main id="main" className="app-main">
      <div className="stack g16">
        <h1 className="page-title" style={{ fontSize: 38 }}>Get a real <em className="o">person</em></h1>
        <div className="panel-orange stack g4">
          <span className="eyebrow" style={{ color: "#A8441F" }}>Court date, lawsuit or eviction?</span>
          <p style={{ margin: 0, fontSize: 15 }}>Go to every hearing, even if you're not ready. Contact legal aid today — court cases move faster than letters.</p>
        </div>
        <section className="stack g12">
          <div className="sec-head"><h2>{state ? `Free legal help in ${state}` : "Free legal help near you"}</h2></div>
          <form method="get" className="row g8" style={{ alignItems: "flex-end" }}>
            <label className="field grow"><span style={{ fontSize: 14 }}>{state ? "Somewhere else? Your ZIP code" : "Your ZIP code"}</span><input name="zip" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} className="input" defaultValue={zip || ""} placeholder="e.g. 18701" /></label>
            {focus && <input type="hidden" name="focus" value={focus} />}
            <button className="btn-plain">Find help</button>
          </form>
          {zip && !fromZip && <p className="notice" role="alert">We couldn&apos;t match that ZIP code. Check it, or pick your state in Settings.</p>}
          {state && <LegalAidList state={state} focus={focus === "tenant" ? "tenant" : undefined} />}
        </section>
        <div className="sec-head"><h2>More places to turn</h2></div>
        <div className="stack">
          {RESOURCES.map((r) => (
            <a key={r.name} href={r.href} target="_blank" rel="noreferrer" className="list-row">
              <Avatar tone={r.tone} />
              <span className="stack grow"><span style={{ fontWeight: 500, fontSize: 15 }}>{r.name}</span><span className="muted small">{r.detail}</span></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5E5E5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            </a>
          ))}
        </div>
        <p className="muted small" style={{ margin: 0 }}>Question about the app, billing or a scan? <a href="/app/support">Contact our support team</a>.</p>
        <p className="muted small" style={{ margin: 0 }}>Bring your case packet (on any case page) so they can help you faster. If you're in danger, call 911.</p>
      </div>
    </main>
  );
}
