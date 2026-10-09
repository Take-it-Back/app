"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CtaButton } from "@/components/ui";

export default function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">(params.get("mode") === "signup" ? "signup" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(params.get("error"));
  const [notice, setNotice] = useState<string | null>(null);
  const next = params.get("next") || "/app";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();
    const origin = window.location.origin;
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name }, emailRedirectTo: `${origin}/auth/callback?next=/app` },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/app");
          router.refresh();
        } else {
          setNotice("Check your email for a link to confirm your account. Then come back and sign in.");
        }
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/app/you%3Freset%3D1` });
        if (error) throw error;
        setNotice("If that email has an account, a reset link is on its way.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="stack g16" style={{ width: "100%", maxWidth: 400 }}>
      <h1 className="serif" style={{ margin: 0, fontSize: 40, lineHeight: 1.05 }}>
        {mode === "signup" ? <>Let's take it <em className="o">back</em>.</> : mode === "signin" ? <>Welcome <em className="o">back</em>.</> : <>Reset your <em className="o">password</em></>}
      </h1>
      <p className="muted" style={{ margin: 0 }}>
        {mode === "signup" ? "Free to start. Takes a minute." : mode === "signin" ? "Sign in to see your cases." : "We'll email you a link."}
      </p>
      {mode === "signup" && (
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      {mode !== "reset" && (
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required />
        </div>
      )}
      {error && <p className="error" role="alert" style={{ margin: 0 }}>{error}</p>}
      {notice && <p className="panel-gray" role="status" style={{ margin: 0, fontSize: 15 }}>{notice}</p>}
      <CtaButton block disabled={busy} variant="ink">
        {busy ? "One moment…" : mode === "signup" ? "Create my account" : mode === "signin" ? "Sign in" : "Send reset link"}
      </CtaButton>
      <div className="row wrap between g8" style={{ fontSize: 15 }}>
        {mode === "signin" ? (
          <>
            <button type="button" className="btn-text" onClick={() => setMode("signup")}>New here? Create an account</button>
            <button type="button" className="btn-text muted" onClick={() => setMode("reset")}>Forgot password</button>
          </>
        ) : (
          <button type="button" className="btn-text" onClick={() => setMode("signin")}>I already have an account</button>
        )}
      </div>
      <p className="muted small" style={{ margin: 0 }}>Take it back gives information and self-help tools, not legal advice.</p>
    </form>
  );
}
