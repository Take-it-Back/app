import { requireUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import SubmitButton from "@/components/SubmitButton";
import { deleteAccount, updateProfile, withdrawHealthConsent } from "@/lib/actions";
import { US_STATES } from "@/lib/states";
import ShareButton from "@/components/ShareButton";
import CopyButton from "@/components/CopyButton";
import { REFERRAL_TEXT, referralUrl } from "@/lib/referrals";
import PasswordReset from "./PasswordReset";
import ChangeEmail from "./ChangeEmail";
import PushToggle from "@/components/PushToggle";
import { getPlan } from "@/lib/plan";
import { CtaLink } from "@/components/ui";
import { shortDate } from "@/lib/format";
import { isAppRequest } from "@/lib/appContext";
import ManageApple from "@/components/ManageApple";
import NativeSettings from "@/components/NativeSettings";

export default async function YouPage({ searchParams }: { searchParams: Promise<{ reset?: string; saved?: string; consent?: string; upgraded?: string }> }) {
  const { reset, saved, consent, upgraded } = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: p }, plan] = await Promise.all([supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(), getPlan(supabase, user.id)]);
  const ends = plan.periodEnd ? shortDate(plan.periodEnd.slice(0, 10)) : null;
  const inApp = await isAppRequest();
  const apple = plan.source === "apple";
  const google = plan.source === "google";
  const storeBilled = apple || google;
  const storeName = google ? "Google Play" : "the App Store";

  return (
    <main id="main" className="app-main">
      <div className="stack g20">
        <h1 className="page-title">You</h1>
        <div className="row g12">
          <Avatar size={56} />
          <span className="stack"><span style={{ fontWeight: 500, fontSize: 17 }}>{p?.full_name || "Add your name"}</span><span className="muted small">{user.email}</span></span>
        </div>

        {reset && <PasswordReset />}
        {saved && <p className="notice" role="status">Saved.</p>}
        {upgraded && plan.premium && <p className="notice" role="status">You&apos;re on Premium. Thank you.</p>}

        {plan.premium ? (
          <div className="panel-orange stack g8">
            <span className="serif" style={{ fontSize: 22 }}>You're on <em className="o">Premium</em></span>
            <span className="small" style={{ color: "#4A4A4A" }}>
              {plan.status === "trialing" ? `Free trial${ends ? ` until ${ends}` : ""}.` : plan.status === "past_due" ? (google ? "Google Play couldn't charge your last payment. Check your payment method in Google Play." : apple ? "Apple couldn't charge your last payment. Check your payment method in your Apple ID settings." : "Your last payment didn't go through. Please update your card.") : ends ? `Renews ${ends}.` : "Active."}
            </span>
            {storeBilled ? <><ManageApple store={google ? "google" : "apple"} /><span className="muted small">Billed through {google ? "Google Play" : "Apple"}. Changes and cancellations happen in {storeName}.</span></>
              : inApp ? <span className="muted small">You subscribed on our website. To change or cancel, sign in at takeitback.app.</span>
              : <form action="/api/stripe/portal" method="post"><button className="btn-plain">Cancel or change plan</button></form>}
          </div>
        ) : (
          <div className="panel-gray stack g8">
            <span className="serif" style={{ fontSize: 22 }}>You're on <em className="o">Free</em></span>
            <span className="small muted">1 scan a month with a summary and general next steps. Premium writes your letters, tracks every deadline and reads their replies, on every case.</span>
            <CtaLink href="/app/upgrade" variant="orange">See Premium</CtaLink>
            {plan.customer && !inApp && <form action="/api/stripe/portal" method="post"><button className="btn-text small">Billing history</button></form>}
          </div>
        )}

        {p?.referral_code && !inApp && (
          <section className="card stack g8">
            <span className="serif" style={{ fontSize: 22 }}>Give a month, <em className="o">get a month</em></span>
            <span className="small muted">Share your link. When a friend starts Premium, they get a month free and so do you{p.referral_credit_months ? `. You have ${p.referral_credit_months} free month${p.referral_credit_months > 1 ? "s" : ""} waiting` : ""}.</span>
            <span className="small" style={{ wordBreak: "break-all" }}>{referralUrl(p.referral_code)}</span>
            <span className="row wrap g8">
              <ShareButton url={referralUrl(p.referral_code)} text={REFERRAL_TEXT} label="Share my link" />
              <CopyButton text={referralUrl(p.referral_code)} label="Copy link" />
            </span>
          </section>
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
          <label className="field" style={{ paddingTop: 12 }}>
            <span style={{ fontSize: 14 }}>Explain things to me in · <span lang="es">Explicarme en</span></span>
            <select name="language" className="input" defaultValue={p?.language || "en"}>
              <option value="en">English</option>
              <option value="es" lang="es">Español</option>
            </select>
            <span className="muted small">Summaries, findings and replies. Letters stay in English, since they go to US companies.</span>
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
          <label className="row between" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB", fontSize: 15 }}>Email me before deadlines<input type="checkbox" role="switch" name="remind_email" defaultChecked={p?.remind_email ?? true} style={{ width: 24, height: 24, accentColor: "#1A1A1A" }} /></label>
          <label className="field" style={{ paddingTop: 12 }}><span style={{ fontSize: 14 }}>Mobile number for text reminders</span><input name="phone" type="tel" inputMode="tel" className="input" placeholder="(555) 555-0123" defaultValue={p?.phone ? p.phone.replace(/^\+1/, "") : ""} autoComplete="tel" /></label>
          <label className="row between" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB", fontSize: 15, gap: 12 }}><span className="stack"><span>Text me before deadlines</span><span className="muted small">Premium. By turning this on you agree to get up to 1 text a day from Take it back about your deadlines at this number. Texts never include case details. Msg &amp; data rates may apply. Reply STOP to cancel, HELP for help. Not a condition of purchase. See our <a href="/privacy">privacy policy</a>.</span></span><input type="checkbox" role="switch" name="sms_opt_in" defaultChecked={p?.sms_opt_in ?? false} style={{ width: 24, height: 24, accentColor: "#1A1A1A", flex: "none" }} /></label>
          {inApp ? <NativeSettings /> : <PushToggle canTest={!!p?.is_admin} />}
          <label className="row between" style={{ padding: "12px 0", fontSize: 15 }}>Morning briefing on Today<input type="checkbox" role="switch" name="morning_briefing" defaultChecked={p?.morning_briefing ?? true} style={{ width: 24, height: 24, accentColor: "#1A1A1A" }} /></label>
          <SubmitButton className="btn-plain" style={{ alignSelf: "flex-start", background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Save</SubmitButton>
        </form>

        <div className="stack">
          {p?.is_admin && <a href="/app/admin" className="list-row" style={{ fontWeight: 500 }}>Admin dashboard</a>}
          <span className="eyebrow">Privacy</span>
          <p className="muted small" style={{ margin: "6px 0" }}>Your documents are private to you, never sold and never used for ads.</p>
          <ChangeEmail current={user.email || ""} />
          <a href="/api/export" className="list-row">Download all my data</a>
          {p?.health_consent_at ? (
            <form action={withdrawHealthConsent}>
              <ConfirmSubmit message="Stop collecting health information? Your cases stay, but new scans and forwarded bills will ask for your OK again." className="list-row btn-text" style={{ width: "100%", justifyContent: "flex-start", borderBottom: "1px solid #EBEBEB" }}>Withdraw health data consent</ConfirmSubmit>
            </form>
          ) : (
            <span className="list-row muted small">{consent === "withdrawn" ? "Health data consent withdrawn. We'll ask again before your next scan." : "No health data consent on file. We'll ask before your first scan."}</span>
          )}
          <form action="/auth/signout" method="post"><button className="list-row btn-text" style={{ width: "100%", justifyContent: "flex-start", borderBottom: "1px solid #EBEBEB" }}>Sign out</button></form>
          {storeBilled && plan.premium && <span className="muted small" style={{ paddingTop: 12 }}>Your Premium is billed by {google ? "Google Play" : "Apple"}. Deleting your account doesn&apos;t stop that billing, so cancel in {storeName} first.</span>}
          <form action={deleteAccount}>
            <ConfirmSubmit message={storeBilled && plan.premium ? `Delete your account, every case and every file? This can't be undone. Remember to cancel your subscription in ${storeName} too.` : "Delete your account, every case and every file? This can't be undone."} className="btn-text" style={{ color: "#A8441F" }}>Delete my account and everything in it</ConfirmSubmit>
          </form>
        </div>
      </div>
    </main>
  );
}
