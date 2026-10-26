"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isNativeApp, nativePlatform } from "@/lib/native";
import type { Providers } from "@/lib/authProviders";

const GOOGLE_IOS = process.env.NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_WEB = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID;

async function sha256Hex(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, "0")).join("");
}

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.5.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-4zM14 5.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" /></svg>
);
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" /><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" /><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6.1z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z" /></svg>
);

/** "Continue with Apple / Google". Web uses Supabase's redirect sign-in; the iPhone app uses the native sheets. */
export default function SocialSignIn({ providers, next }: { providers: Providers; next: string }) {
  const router = useRouter();
  const [native, setNative] = useState(false);
  const [android, setAndroid] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { setNative(isNativeApp()); setAndroid(nativePlatform() === "android"); }, []);

  // In the app, Google needs its iPhone client ID (Google blocks its web sign-in inside apps).
  // In the iPhone app Google needs its iPhone client ID; on Android it uses the web client ID with the phone's Google account.
  const showGoogle = providers.google && (!native || (android ? Boolean(GOOGLE_WEB) : Boolean(GOOGLE_IOS)));
  // Sign in with Apple is offered on the web and iPhone; Android users have Google and email.
  const showApple = providers.apple && !android;
  if (!showGoogle && !showApple) return null;

  async function finish(provider: "apple" | "google", idToken: string, nonce: string | undefined, name?: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithIdToken({ provider, token: idToken, nonce });
    if (error) throw error;
    if (name) await supabase.auth.updateUser({ data: { full_name: name } }).catch(() => {});
    router.push(next);
    router.refresh();
  }

  async function go(provider: "apple" | "google") {
    setErr(null);
    setBusy(provider);
    try {
      if (!native) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`, scopes: provider === "apple" ? "name email" : undefined },
        });
        if (error) throw error;
        return; // the browser is on its way to Apple or Google
      }
      const { SocialLogin } = await import("@capgo/capacitor-social-login");
      const raw = crypto.randomUUID() + crypto.randomUUID();
      const hashed = await sha256Hex(raw);
      if (provider === "apple") {
        await SocialLogin.initialize({ apple: { clientId: process.env.NEXT_PUBLIC_APPLE_BUNDLE_ID || "app.takeitback" } });
        const r = await SocialLogin.login({ provider: "apple", options: { scopes: ["email", "name"], nonce: hashed } });
        const res = r.result as { idToken: string | null; authorizationCode?: string; profile: { givenName: string | null; familyName: string | null } };
        if (!res.idToken) throw new Error("No token from Apple");
        const name = [res.profile.givenName, res.profile.familyName].filter(Boolean).join(" ");
        await finish("apple", res.idToken, raw, name || undefined);
        // Lets us revoke Apple's access if this account is ever deleted (Apple requires it).
        if (res.authorizationCode) fetch("/api/auth/apple-token", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: res.authorizationCode }) }).catch(() => {});
      } else {
        await SocialLogin.initialize({ google: android ? { webClientId: GOOGLE_WEB, mode: "online" } : { iOSClientId: GOOGLE_IOS, iOSServerClientId: GOOGLE_WEB, webClientId: GOOGLE_WEB, mode: "online" } });
        const r = await SocialLogin.login({ provider: "google", options: { scopes: ["email", "profile"], nonce: hashed } });
        const res = r.result as { idToken?: string | null };
        if (!res.idToken) throw new Error("No token from Google");
        await finish("google", res.idToken, raw);
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : "";
      if (!/cancel|1001|-5|closed/i.test(m)) setErr(`Sign in with ${provider === "apple" ? "Apple" : "Google"} didn't work. Try again, or use your email.`);
    } finally {
      setBusy(null);
    }
  }

  const base = { justifyContent: "center", gap: 10 } as const;
  return (
    <div className="stack g8">
      {showApple && (
        <button type="button" onClick={() => go("apple")} disabled={Boolean(busy)} className="btn btn-block" style={{ ...base, background: "#000", color: "#fff", borderColor: "#000" }}>
          <AppleLogo />{busy === "apple" ? "One moment…" : "Continue with Apple"}
        </button>
      )}
      {showGoogle && (
        <button type="button" onClick={() => go("google")} disabled={Boolean(busy)} className="btn btn-block" style={{ ...base, background: "#fff", color: "#1A1A1A", border: "1px solid #D9D5CC" }}>
          <GoogleLogo />{busy === "google" ? "One moment…" : "Continue with Google"}
        </button>
      )}
      {err && <p className="error small" role="alert" style={{ margin: 0 }}>{err}</p>}
      <span className="row g8 muted small" style={{ alignItems: "center", margin: "4px 0" }}>
        <span style={{ flex: 1, height: 1, background: "#E7E3DA" }} />or use your email<span style={{ flex: 1, height: 1, background: "#E7E3DA" }} />
      </span>
    </div>
  );
}
