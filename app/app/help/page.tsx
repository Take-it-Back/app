import { requireUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui";

const RESOURCES = [
  { name: "Legal aid near you", detail: "Free legal help if you qualify. Search by state.", href: "https://www.lawhelp.org", tone: "ink" as const },
  { name: "Find a legal aid office (LSC)", detail: "Legal Services Corporation's directory of funded programs.", href: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help", tone: "orange" as const },
  { name: "Call or text 211", detail: "Rent help, utility help and emergency programs.", href: "https://www.211.org", tone: "ink" as const },
  { name: "Lawyer referral from your state bar", detail: "Often a low-cost first meeting.", href: "https://www.americanbar.org/groups/legal_services/flh-home/", tone: "orange" as const },
  { name: "Complain to the CFPB", detail: "Debt collectors, credit reports and medical debt.", href: "https://www.consumerfinance.gov/complaint/", tone: "ink" as const },
  { name: "Medical bills: No Surprises help desk", detail: "Surprise bills and good faith estimates. 1-800-985-3059.", href: "https://www.cms.gov/nosurprises", tone: "orange" as const },
];

export default async function HelpPage() {
  await requireUser();
  return (
    <main className="app-main">
      <div className="stack g16">
        <h1 className="page-title" style={{ fontSize: 38 }}>Get a real <em className="o">person</em></h1>
        <div className="panel-orange stack g4">
          <span className="eyebrow" style={{ color: "#A8441F" }}>Court date, lawsuit or eviction?</span>
          <p style={{ margin: 0, fontSize: 15 }}>Go to every hearing, even if you're not ready. Contact legal aid today — court cases move faster than letters.</p>
        </div>
        <div className="stack">
          {RESOURCES.map((r) => (
            <a key={r.name} href={r.href} target="_blank" rel="noreferrer" className="list-row">
              <Avatar tone={r.tone} />
              <span className="stack grow"><span style={{ fontWeight: 500, fontSize: 15 }}>{r.name}</span><span className="muted small">{r.detail}</span></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5E5E5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            </a>
          ))}
        </div>
        <span className="hand muted" style={{ fontSize: 24, alignSelf: "center" }}>you're not alone in this</span>
        <p className="muted small" style={{ margin: 0 }}>Bring your case packet (on any case page) so they can help you faster. If you're in danger, call 911.</p>
      </div>
    </main>
  );
}
