"use client";

import { useActionState } from "react";
import { joinAppWaitlist } from "@/lib/waitlist";

function Badge({ store, os }: { store: string; os: string }) {
  return (
    <span className="soon-badge" aria-label={`${os} app on the ${store}, coming soon`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M10.5 18.5h3" /></svg>
      <span className="stack">
        <span className="soon-badge-top">Coming soon</span>
        <span className="soon-badge-name">{os} app</span>
      </span>
    </span>
  );
}

/** "iPhone and Android apps are coming" with an optional notify-me form. */
export default function AppsComingSoon({ form = true, tone = "light" }: { form?: boolean; tone?: "light" | "dark" }) {
  const [state, action, pending] = useActionState(joinAppWaitlist, null);
  return (
    <div className={`stack g12 soon ${tone}`}>
      <div className="row wrap g8">
        <Badge store="App Store" os="iPhone" />
        <Badge store="Google Play" os="Android" />
      </div>
      {form && (state?.ok ? (
        <p className="small" role="status" style={{ margin: 0 }}>You&apos;re on the list. We&apos;ll email you the day the apps launch.</p>
      ) : (
        <form action={action} className="row wrap g8" style={{ alignItems: "center" }}>
          <label htmlFor="soon-email" className="sr-only">Email</label>
          <input id="soon-email" name="email" type="email" required placeholder="Email me when they launch" className="input" style={{ flex: "1 1 220px", minWidth: 0 }} autoComplete="email" />
          <select name="platform" aria-label="Which phone" className="input" style={{ flex: "0 0 auto", width: "auto" }} defaultValue="both">
            <option value="both">iPhone or Android</option>
            <option value="iphone">iPhone</option>
            <option value="android">Android</option>
          </select>
          <button className="btn-plain" disabled={pending} style={{ minHeight: 48 }}>{pending ? "Adding…" : "Notify me"}</button>
          {state?.error && <span className="small" role="alert" style={{ color: "#A8441F", width: "100%" }}>{state.error}</span>}
        </form>
      ))}
    </div>
  );
}
