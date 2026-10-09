import { requireUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import { deleteAccount, updateProfile } from "@/lib/actions";
import { US_STATES } from "@/lib/states";
import PasswordReset from "./PasswordReset";
import { getPlan } from "@/lib/plan";
import { CtaLink } from "@/components/ui";
import { shortDate } from "@/lib/format";

export default async function YouPage({ searchParams }: { searchParams: Promise<{ reset?: string; saved?: string }> }) {
  const { reset, saved } = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: p }, plan] = await Promise.all([supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(), getPlan(supabase, user.id)]);
  const ends = plan.periodEnd ? shortDate(plan.periodEnd.slice(0, 10)) : null;

  return (
    <main className="app-main">
      <div className="stack g20">
        <h1 className="page-title">You</h1>
        <div className="row g12">
          <Avatar size={56} />
          <span className="stack"><span style={{ fontWeight: 500, fontSize: 17 }}>{p?.full_name || "Add your name"}</span><span className="muted small">{user.email}</span></span>
        </div>

        {reset && <PasswordReset />}
        {saved && <p className="notice" role="status">Saved.</p>}

        {plan.premium ? (
          <div className="panel-orange stack g8">
            <span className="serif" style={{ fontSize: 22 }}>You're on <em className="o">Premium</em></span>
            <span className="small" style={{ color: "#4A4A4A" }}>
              {plan.status === "trialing" ? `Free trial${ends ? ` until ${ends}` : ""}.` : plan.status === "past_due" ? "Your last payment didn't go through. Please update your card." : ends ? `Renews ${ends}.` : "Active."}
            </span>
            <form action="/api/stripe/portal" method="post"><button className="btn-plain">Manage billing</button></form>
          </div>
        ) : (
          <div className="panel-gray stack g8">
            <span className="serif" style={{ fontSize: 22 }}>You're on <em className="o">Free</em></span>
            <span className="small muted">3 scans a month with a summary and general next steps. Premium writes your letters, tracks every deadline and reads their replies.</span>
            <CtaLink href="/app/upgrade" variant="orange">See Premium</CtaLink>
            {plan.customer && <form action="/api/stripe/portal" method="post"><button className="btn-text small">Billing history</button></form>}
          </div>
        )}

        <form action={updateProfile} className="stack g12">
          <span className="eyebrow">Your details</span>
          <label className="field"><span style={{ fontSize: 14 }}>Name on your letters</span><input name="full_name" className="input" defaultValue={p?.full_name || ""} /></label>
          <label className="field">
            <span style={{ fontSize: 14 }}>State</span>
            <select name="state" className="input" defaultValue={p?.state || ""}>
              <option value="">Choose your state</option>
              {US_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <span className="eyebrow" style={{ marginTop: 8 }}>Mailing address</span>
          <span className="muted small" style={{ marginTop: -6 }}>Used on your letters and as the return address when we mail for you.</span>
          <input name="address_line1" className="input" placeholder="Street address" defaultValue={p?.address_line1 || ""} autoComplete="address-line1" aria-label="Street address" />
          <input name="address_line2" className="input" placeholder="Apt or unit (optional)" defaultValue={p?.address_line2 || ""} autoComplete="address-line2" aria-label="Apartment or unit" />
          <div className="row g8">
            <input name="address_city" className="input grow" placeholder="City" defaultValue={p?.address_city || ""} autoComplete="address-level2" aria-label="City" />
            <input name="address_state" className="input" placeholder="ST" maxLength={2} defaultValue={p?.address_state || ""} autoComplete="address-level1" aria-label="State, 2 letters" style={{ width: 72, textTransform: "uppercase" }} />
            <input name="address_zip" className="input" placeholder="ZIP" inputMode="numeric" defaultValue={p?.address_zip || ""} autoComplete="postal-code" aria-label="ZIP" style={{ width: 104 }} />
          </div>
          <span className="eyebrow" style={{ marginTop: 8 }} id="reminders">Reminders</span>
          <label className="row between" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB", fontSize: 15 }}>Email me before deadlines<input type="checkbox" role="switch" name="remind_email" defaultChecked={p?.remind_email ?? true} style={{ width: 22, height: 22, accentColor: "#1A1A1A" }} /></label>
          <label className="field" style={{ paddingTop: 12 }}><span style={{ fontSize: 14 }}>Mobile number for text reminders</span><input name="phone" type="tel" inputMode="tel" className="input" placeholder="(555) 555-0123" defaultValue={p?.phone ? p.phone.replace(/^\+1/, "") : ""} autoComplete="tel" /></label>
          <label className="row between" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB", fontSize: 15, gap: 12 }}><span className="stack"><span>Text me before deadlines</span><span className="muted small">Premium. Msg &amp; data rates may apply. Reply STOP to opt out.</span></span><input type="checkbox" role="switch" name="sms_opt_in" defaultChecked={p?.sms_opt_in ?? false} style={{ width: 22, height: 22, accentColor: "#1A1A1A", flex: "none" }} /></label>
          <label className="row between" style={{ padding: "12px 0", fontSize: 15 }}>Morning briefing on Today<input type="checkbox" role="switch" name="morning_briefing" defaultChecked={p?.morning_briefing ?? true} style={{ width: 22, height: 22, accentColor: "#1A1A1A" }} /></label>
          <button className="btn-plain" style={{ alignSelf: "flex-start", background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Save</button>
        </form>

        <div className="stack">
          {p?.is_admin && <a href="/app/admin" className="list-row" style={{ fontWeight: 500 }}>Admin dashboard</a>}
          <span className="eyebrow">Privacy</span>
          <p className="muted small" style={{ margin: "6px 0" }}>Your documents are private to you, never sold and never used for ads.</p>
          <a href="/api/export" className="list-row">Download all my data</a>
          <form action="/auth/signout" method="post"><button className="list-row btn-text" style={{ width: "100%", justifyContent: "flex-start", borderBottom: "1px solid #EBEBEB" }}>Sign out</button></form>
          <form action={deleteAccount}>
            <ConfirmSubmit message="Delete your account, every case and every file? This can't be undone." className="btn-text" style={{ color: "#A8441F" }}>Delete my account and everything in it</ConfirmSubmit>
          </form>
        </div>
      </div>
    </main>
  );
}
