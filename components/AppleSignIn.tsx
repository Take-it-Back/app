"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isNativeApp } from "@/lib/native";

const ON = process.env.NEXT_PUBLIC_APPLE_SIGNIN === "1";

async function sha256Hex(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** "Sign in with Apple" inside the iPhone app. Shown once the Apple provider is switched on in Supabase. */
export default function AppleSignIn({ next }: { next: string }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => setShow(ON && isNativeApp()), []);
  if (!show) return null;

  async function go() {
    setErr(null);
    try {
      const { SignInWithApple } = await import("@capacitor-community/apple-sign-in");
      const raw = crypto.randomUUID() + crypto.randomUUID();
      const r = await SignInWithApple.authorize({ clientId: process.env.NEXT_PUBLIC_APPLE_BUNDLE_ID || "app.takeitback", redirectURI: `${window.location.origin}/login`, scopes: "email name", nonce: await sha256Hex(raw) });
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithIdToken({ provider: "apple", token: r.response.identityToken, nonce: raw });
      if (error) throw error;
      const name = [r.response.givenName, r.response.familyName].filter(Boolean).join(" ");
      if (name) await supabase.auth.updateUser({ data: { full_name: name } });
      router.push(next);
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "";
      if (!/cancel|1001/i.test(m)) setErr("Sign in with Apple didn't work. Try again, or use your email.");
    }
  }

  return (
    <div className="stack g8">
      <button type="button" onClick={go} className="btn btn-ink btn-block" style={{ background: "#000", borderColor: "#000", justifyContent: "center", gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.5.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-4zM14 5.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" /></svg>
        Sign in with Apple
      </button>
      {err && <p className="error small" role="alert" style={{ margin: 0 }}>{err}</p>}
      <span className="muted small" style={{ textAlign: "center" }}>or use your email</span>
    </div>
  );
}
