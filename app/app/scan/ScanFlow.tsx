"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CtaButton } from "@/components/ui";
import { US_STATES } from "@/lib/states";
import { todayISO } from "@/lib/format";

const KINDS = [
  ["medical", "Medical bill"],
  ["insurance", "Insurance denial"],
  ["landlord", "Landlord"],
  ["debt", "Debt collector"],
  ["other", "Not sure"],
] as const;

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

export default function ScanFlow({ userId, defaultState }: { userId: string; defaultState: string }) {
  const router = useRouter();
  const camRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [kind, setKind] = useState<string>("other");
  const [state, setState] = useState(defaultState);
  const [insured, setInsured] = useState("yes");
  const [paid, setPaid] = useState("no");
  const [received, setReceived] = useState(todayISO());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const ok = Array.from(list).filter((f) => ACCEPT.split(",").includes(f.type) && f.size <= 20 * 1024 * 1024);
    if (ok.length < list.length) setError("Some files were skipped. Use photos (JPG, PNG) or PDFs under 20 MB.");
    else setError(null);
    setFiles((prev) => [...prev, ...ok].slice(0, 8));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length) {
      setError("Add a photo or file of the letter first.");
      return;
    }
    setError(null);
    const supabase = createClient();
    try {
      setBusy("Saving your document…");
      const { data: c, error: ce } = await supabase
        .from("cases")
        .insert({ user_id: userId, category: kind, title: KINDS.find((k) => k[0] === kind)?.[1] || "New case", status: "analyzing", received_date: received, insured: kind === "medical" || kind === "insurance" ? insured : null, paid, user_state: state || null })
        .select("id")
        .single();
      if (ce || !c) throw new Error(ce?.message || "Couldn't create the case.");
      if (state) await supabase.from("profiles").update({ state }).eq("id", userId);

      for (const [i, f] of files.entries()) {
        const safe = f.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60);
        const path = `${userId}/${c.id}/${Date.now()}-${i}-${safe}`;
        const { error: ue } = await supabase.storage.from("case-files").upload(path, f, { contentType: f.type });
        if (ue) throw new Error(ue.message);
        await supabase.from("documents").insert({ case_id: c.id, user_id: userId, kind: "original", storage_path: path, file_name: f.name, mime_type: f.type, label: files.length > 1 ? `Page ${i + 1}` : "Original document" });
      }

      setBusy("Reading the fine print…");
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId: c.id }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "We couldn't read it.");
      router.push(`/app/cases/${c.id}/found${json.warning ? `?note=${encodeURIComponent(json.warning)}` : ""}`);
      router.refresh();
    } catch (err) {
      setBusy(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (busy)
    return (
      <div className="stack g16 center" style={{ alignItems: "center", paddingTop: 120 }} role="status" aria-live="polite">
        <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true" style={{ animation: "wig 1.2s ease infinite" }}><path d="M11 8h26a7 7 0 0 1 7 7v14a7 7 0 0 1-7 7H23l-8 7v-7h-4a7 7 0 0 1-7-7V15a7 7 0 0 1 7-7z" fill="#1A1A1A" /><circle cx="16" cy="22" r="2.8" fill="#fff" /><circle cx="24" cy="22" r="2.8" fill="#fff" /><circle cx="32" cy="22" r="2.8" fill="#BF4F28" /></svg>
        <span className="serif" style={{ fontSize: 28 }}>{busy}</span>
        <span className="hand muted" style={{ fontSize: 24 }}>this takes about half a minute</span>
      </div>
    );

  return (
    <form onSubmit={submit} className="stack g24">
      <div className="page-head" style={{ marginBottom: 0 }}>
        <h1 className="page-title">Scan a <em className="o">letter</em></h1>
        <Link href="/app" className="btn-plain">Cancel</Link>
      </div>

      <section className="stack g12">
        <div style={{ background: "#222", borderRadius: 24, minHeight: 220, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: "#fff", textAlign: "center" }}>
          {files.length ? (
            <div className="stack g8" style={{ width: "100%" }}>
              {files.map((f, i) => (
                <div key={i} className="row between g8" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px" }}>
                  <span style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i + 1}. {f.name}</span>
                  <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="btn-text" style={{ color: "#fff", fontSize: 14 }}>Remove</button>
                </div>
              ))}
              <span className="hand" style={{ fontSize: 22 }}>more pages? add them too</span>
            </div>
          ) : (
            <>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#E07A52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M20 16v2a2 2 0 0 1-2 2h-2" /><path d="M8 20H6a2 2 0 0 1-2-2v-2" /></svg>
              <span className="hand" style={{ fontSize: 26 }}>hold it flat, in good light</span>
            </>
          )}
        </div>
        <div className="chips">
          <button type="button" className="chip on" onClick={() => camRef.current?.click()}>Take a photo</button>
          <button type="button" className="chip" onClick={() => fileRef.current?.click()}>Upload a file</button>
        </div>
        <input ref={camRef} type="file" accept="image/*" capture="environment" className="sr" onChange={(e) => addFiles(e.target.files)} aria-label="Take a photo" />
        <input ref={fileRef} type="file" accept={ACCEPT} multiple className="sr" onChange={(e) => addFiles(e.target.files)} aria-label="Upload a file" />
      </section>

      <section className="stack g20">
        <h2 className="serif" style={{ margin: 0, fontSize: 28 }}>A few <em className="o">quick</em> questions</h2>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>What is it?</legend>
          <div className="chips">
            {KINDS.map(([k, l]) => (
              <label key={k} className="chip"><input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />{l}</label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="state">Where do you live?</label>
          <select id="state" className="input" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Choose your state</option>
            {US_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        {(kind === "medical" || kind === "insurance" || kind === "other") && (
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Do you have health insurance?</legend>
            <div className="chips">
              {[["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]].map(([v, l]) => (
                <label key={v} className="chip"><input type="radio" name="insured" value={v} checked={insured === v} onChange={() => setInsured(v)} />{l}</label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="field">
          <label htmlFor="received">When did it arrive?</label>
          <input id="received" type="date" className="input" value={received} max={todayISO()} onChange={(e) => setReceived(e.target.value)} required />
          <span className="hand muted" style={{ fontSize: 20 }}>the date on the envelope or email is fine</span>
        </div>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Have you paid any of it?</legend>
          <div className="chips">
            {[["no", "Not yet"], ["some", "Some"], ["all", "All of it"], ["na", "Doesn't apply"]].map(([v, l]) => (
              <label key={v} className="chip"><input type="radio" name="paid" value={v} checked={paid === v} onChange={() => setPaid(v)} />{l}</label>
            ))}
          </div>
        </fieldset>
      </section>

      {error && <p className="error" role="alert" style={{ margin: 0 }}>{error}</p>}
      <CtaButton block>Show me what's wrong</CtaButton>
      <p className="muted small center" style={{ margin: 0 }}>Your files stay private to your account.</p>
    </form>
  );
}
