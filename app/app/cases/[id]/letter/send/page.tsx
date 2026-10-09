import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import { BackLink, CtaButton } from "@/components/ui";
import Upsell from "@/components/Upsell";
import { SEND_PRICES, methodConfigured } from "@/lib/send";
import { US_STATES } from "@/lib/states";

const ABBR: Record<string, string> = { Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY" };

function StateSelect({ name, value }: { name: string; value?: string | null }) {
  return (
    <select name={name} className="input" defaultValue={value || ""} required aria-label="State">
      <option value="">State</option>
      {US_STATES.filter((s) => ABBR[s]).map((s) => <option key={s} value={ABBR[s]}>{ABBR[s]}</option>)}
    </select>
  );
}

export default async function SendPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ id?: string; method?: string; err?: string; canceled?: string }> }) {
  const { id } = await params;
  const { id: letterId, method = "mail", err, canceled } = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: letter }, { data: p }, premium] = await Promise.all([
    supabase.from("letters").select("id, recipient, subject, case_id").eq("id", letterId || "").eq("case_id", id).maybeSingle(),
    supabase.from("profiles").select("full_name, address_line1, address_line2, address_city, address_state, address_zip").eq("id", user.id).maybeSingle(),
    getCasePremium(supabase, user.id, id),
  ]);
  if (!letter) notFound();
  const m = method === "fax" ? "fax" : "mail";
  const fromState = p?.address_state && p.address_state.length === 2 ? p.address_state : p?.address_state ? ABBR[p.address_state] : "";

  return (
    <main className="app-main">
      <BackLink href={`/app/cases/${id}/letter?id=${letter.id}`} />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>We&apos;ll <em className="o">send</em> it</h1>
        <span className="muted" style={{ fontSize: 15 }}>{letter.subject}</span>
      </div>

      {!premium ? (
        <Upsell title="We'll mail or fax it for you" body="Certified mail with tracking, or a fax with delivery confirmation, without finding a printer or a post office." />
      ) : (
        <div className="stack g20">
          {err && <p className="error" role="alert">{err}</p>}
          {canceled && <p className="notice">No problem. Nothing was charged.</p>}
          <nav className="chips" aria-label="How to send">
            {(["mail", "fax"] as const).map((k) => (
              <Link key={k} href={`/app/cases/${id}/letter/send?id=${letter.id}&method=${k}`} className={`chip${m === k ? " on" : ""}`}>
                {SEND_PRICES[k].name} · {SEND_PRICES[k].label}
              </Link>
            ))}
          </nav>
          {!methodConfigured(m) && <p className="panel-gray" style={{ margin: 0 }}>{SEND_PRICES[m].name} is coming soon. For now, print or save the PDF and send it yourself.</p>}

          <form action="/api/send/checkout" method="post" className="stack g20">
            <input type="hidden" name="letter_id" value={letter.id} />
            <input type="hidden" name="method" value={m} />
            {m === "mail" ? (
              <>
                <section className="card stack g12">
                  <span className="serif" style={{ fontSize: 22 }}>Send to</span>
                  <label className="field"><span>Name or department</span><input name="to_name" className="input" required defaultValue={(letter.recipient || "").slice(0, 40)} /></label>
                  <label className="field"><span>Street address</span><input name="to_line1" className="input" required autoComplete="off" /></label>
                  <label className="field"><span>Suite, P.O. box (optional)</span><input name="to_line2" className="input" autoComplete="off" /></label>
                  <div className="row g8"><input name="to_city" className="input grow" placeholder="City" required aria-label="City" /><div style={{ width: 96 }}><StateSelect name="to_state" /></div><input name="to_zip" className="input" placeholder="ZIP" required inputMode="numeric" aria-label="ZIP" style={{ width: 104 }} /></div>
                  <span className="muted small">Use the address on their letter or website for disputes, appeals or correspondence.</span>
                </section>
                <section className="card stack g12">
                  <span className="serif" style={{ fontSize: 22 }}>Your return address</span>
                  <label className="field"><span>Your name</span><input name="from_name" className="input" required defaultValue={p?.full_name || ""} autoComplete="name" /></label>
                  <label className="field"><span>Street address</span><input name="from_line1" className="input" required defaultValue={p?.address_line1 || ""} autoComplete="address-line1" /></label>
                  <label className="field"><span>Apt or unit (optional)</span><input name="from_line2" className="input" defaultValue={p?.address_line2 || ""} autoComplete="address-line2" /></label>
                  <div className="row g8"><input name="from_city" className="input grow" placeholder="City" required defaultValue={p?.address_city || ""} aria-label="City" autoComplete="address-level2" /><div style={{ width: 96 }}><StateSelect name="from_state" value={fromState} /></div><input name="from_zip" className="input" placeholder="ZIP" required inputMode="numeric" defaultValue={p?.address_zip || ""} aria-label="ZIP" style={{ width: 104 }} autoComplete="postal-code" /></div>
                  <label className="row g8 small"><input type="checkbox" name="save_from" defaultChecked style={{ width: 18, height: 18, accentColor: "#1A1A1A" }} />Save as my address for future letters</label>
                </section>
              </>
            ) : (
              <section className="card stack g12">
                <span className="serif" style={{ fontSize: 22 }}>Their fax number</span>
                <input name="fax" className="input" required inputMode="tel" placeholder="(555) 555-0123" aria-label="Fax number" />
                <span className="muted small">Insurers often list an appeals fax number on the denial letter.</span>
              </section>
            )}
            <div className="stack g8">
              <CtaButton type="submit" variant="orange" block disabled={!methodConfigured(m)}>Pay {SEND_PRICES[m].label} and send</CtaButton>
              <span className="muted small">{m === "mail" ? "Printed and sent USPS Certified Mail, usually within 1 business day. Tracking is saved to your case." : "Sent within minutes. A copy is saved to your case."} Review your letter first: it&apos;s sent exactly as written.</span>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
