"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Admins confirm a 6-digit code from an authenticator app before seeing any user data. */
export default function AdminMfa() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"loading" | "verify" | "enroll">("loading");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.mfa.listFactors();
      const totp = data?.totp?.find((f) => f.status === "verified");
      if (totp) {
        setFactorId(totp.id);
        setMode("verify");
        return;
      }
      const { data: en, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `Admin ${new Date().toISOString().slice(0, 10)}` });
      if (error || !en) {
        setErr(error?.message || "Couldn't start setup.");
        return;
      }
      setFactorId(en.id);
      setQr(en.totp.qr_code);
      setSecret(en.totp.secret);
      setMode("enroll");
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setBusy(true);
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    setBusy(false);
    if (error) {
      setErr("That code didn't work. Check the time on your phone and try the newest code.");
      return;
    }
    router.refresh();
  }

  return (
    <section className="card stack g12" style={{ maxWidth: 460 }}>
      <span className="serif" style={{ fontSize: 24 }}>Two-step <em className="o">verification</em></span>
      {mode === "enroll" && (
        <>
          <span className="small">Admin pages show every user&apos;s data, so they need a code from an authenticator app (1Password, Google Authenticator, Authy). Scan this once:</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr && <img src={qr} alt="QR code to add Take it back to your authenticator app" width={180} height={180} style={{ background: "#fff", borderRadius: 12 }} />}
          {secret && <span className="small muted" style={{ wordBreak: "break-all" }}>Or enter this key: {secret}</span>}
        </>
      )}
      {mode === "verify" && <span className="small">Enter the 6-digit code from your authenticator app.</span>}
      {mode !== "loading" && (
        <form onSubmit={submit} className="row wrap g8" style={{ alignItems: "flex-end" }}>
          <label className="field" style={{ flex: "1 1 160px" }}>
            <span>Code</span>
            <input className="input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          <button className="btn-plain" disabled={busy}>{busy ? "Checking…" : "Confirm"}</button>
        </form>
      )}
      {err && <p className="error small" role="alert" style={{ margin: 0 }}>{err}</p>}
    </section>
  );
}
