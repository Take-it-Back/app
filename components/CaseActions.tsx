"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CtaButton } from "./ui";

function useWriteLetter(caseId: string, kind: string, target?: string) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function go() {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/letter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId, kind, target }) });
    const json = await res.json().catch(() => ({}));
    if (res.status === 402) {
      router.push("/app/upgrade");
      return;
    }
    if (!res.ok) {
      setErr(json.error || "Couldn't write the letter. Try again.");
      setBusy(false);
      return;
    }
    router.push(`/app/cases/${caseId}/letter?id=${json.letterId}${json.warning ? `&note=${encodeURIComponent(json.warning)}` : ""}`);
  }
  return { busy, err, go };
}

/** A letter option shown as a tappable card in the letter menu. */
export function WriteLetterCard({ caseId, kind, target, title, blurb, caution }: { caseId: string; kind: string; target?: string; title: string; blurb: string; caution?: string }) {
  const { busy, err, go } = useWriteLetter(caseId, kind, target);
  return (
    <div className="stack g4">
      <button type="button" className="tool" onClick={go} disabled={busy} style={{ width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}>
        <span className="stack g4 grow" style={{ minWidth: 0 }}>
          <span style={{ fontWeight: 500, fontSize: 15 }}>{busy ? "Writing it…" : title}</span>
          <span className="muted small">{blurb}</span>
          {caution && <span className="small" style={{ color: "#A8441F" }}>{caution}</span>}
        </span>
        <span aria-hidden="true" style={{ alignSelf: "center", color: "#BF4F28", fontSize: 18 }}>{busy ? "…" : "→"}</span>
      </button>
      {err && <p className="error" role="alert" style={{ margin: 0 }}>{err}</p>}
    </div>
  );
}

export function WriteLetterButton({ caseId, kind = "dispute", label = "Write my letter", variant = "orange", block = true }: { caseId: string; kind?: string; label?: string; variant?: "orange" | "ink"; block?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function go() {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/letter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId, kind }) });
    const json = await res.json().catch(() => ({}));
    if (res.status === 402) {
      router.push("/app/upgrade");
      return;
    }
    if (!res.ok) {
      setErr(json.error || "Couldn't write the letter. Try again.");
      setBusy(false);
      return;
    }
    router.push(`/app/cases/${caseId}/letter?id=${json.letterId}${json.warning ? `&note=${encodeURIComponent(json.warning)}` : ""}`);
  }
  return (
    <div className="stack g8">
      <CtaButton type="button" onClick={go} disabled={busy} block={block} variant={variant}>
        {busy ? "Writing your letter…" : label}
      </CtaButton>
      {err && <p className="error" role="alert" style={{ margin: 0 }}>{err}</p>}
    </div>
  );
}

export function UploadButton({ caseId, userId, ownerId, kind, label, analyze }: { caseId: string; userId: string; ownerId?: string; kind: "reply" | "evidence" | "proof" | "other"; label: string; analyze?: boolean }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  async function onFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(f.type) || f.size > 20 * 1024 * 1024) {
      setMsg("Use a photo (JPG or PNG) or a PDF under 20 MB.");
      return;
    }
    setBusy("Saving…");
    setMsg(null);
    const supabase = createClient();
    const path = `${ownerId || userId}/${caseId}/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60)}`;
    const { error } = await supabase.storage.from("case-files").upload(path, f, { contentType: f.type });
    if (error) {
      setBusy(null);
      setMsg(error.message);
      return;
    }
    const { data: doc, error: de } = await supabase
      .from("documents")
      .insert({ case_id: caseId, user_id: userId, kind, storage_path: path, file_name: f.name, mime_type: f.type, label: kind === "reply" ? "Their reply" : kind === "proof" ? "Proof of delivery" : f.name })
      .select("id")
      .single();
    if (de || !doc) {
      setBusy(null);
      setMsg(de?.message || "Couldn't save.");
      return;
    }
    if (analyze) {
      setBusy("Reading their reply…");
      const res = await fetch("/api/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId, documentId: doc.id }) });
      const json = await res.json().catch(() => ({}));
      setBusy(null);
      router.push(`/app/cases/${caseId}/reply?doc=${doc.id}${json.warning ? `&note=${encodeURIComponent(json.warning)}` : ""}`);
      router.refresh();
      return;
    }
    setBusy(null);
    router.refresh();
  }
  return (
    <>
      <button type="button" className="btn-plain" onClick={() => ref.current?.click()} disabled={!!busy} style={{ minHeight: 48 }}>
        {busy || label}
      </button>
      <input ref={ref} type="file" accept="image/*,application/pdf" className="sr" onChange={(e) => onFile(e.target.files)} aria-label={label} />
      {msg && <p className="error" role="alert" style={{ margin: 0 }}>{msg}</p>}
    </>
  );
}
