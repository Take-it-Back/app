"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangeEmail({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!open) return <button type="button" className="list-row btn-text" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => setOpen(true)}>Change email</button>;
  return (
    <form
      className="stack g8"
      style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB" }}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        const { error } = await createClient().auth.updateUser({ email: email.trim() }, { emailRedirectTo: `${location.origin}/auth/callback?next=/app/you` });
        setBusy(false);
        setMsg(error ? error.message : `Check ${email.trim()} (and ${current}) for a link to confirm the change.`);
      }}
    >
      <label className="field"><span style={{ fontSize: 14 }}>New email</span><input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
      <button className="btn-plain" disabled={busy} style={{ alignSelf: "flex-start" }}>{busy ? "Sending…" : "Send confirmation"}</button>
      {msg && <p className="notice" role="status" style={{ margin: 0 }}>{msg}</p>}
    </form>
  );
}
