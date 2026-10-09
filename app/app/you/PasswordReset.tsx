"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordReset() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await createClient().auth.updateUser({ password: pw });
    setMsg(error ? error.message : "Password updated.");
  }
  return (
    <form onSubmit={save} className="card stack g12">
      <span className="eyebrow">Set a new password</span>
      <input type="password" className="input" minLength={8} required value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" aria-label="New password" />
      <button className="btn-plain" style={{ alignSelf: "flex-start" }}>Save password</button>
      {msg && <p role="status" className="small" style={{ margin: 0 }}>{msg}</p>}
    </form>
  );
}
