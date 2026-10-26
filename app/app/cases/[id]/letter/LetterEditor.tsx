"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/ui";
import { markLetterSent, saveLetter } from "@/lib/actions";
import { todayISO } from "@/lib/format";
import type { LetterRow } from "@/lib/types";

const METHODS = [
  ["certified mail", "Certified mail", "Best proof. Keep the receipt."],
  ["mail", "Regular mail", ""],
  ["email", "Email", ""],
  ["online portal", "Their website or portal", ""],
  ["fax", "Fax", ""],
] as const;

export default function LetterEditor({ letter, caseId }: { letter: LetterRow; caseId: string }) {
  const router = useRouter();
  const [recipient, setRecipient] = useState(letter.recipient || "");
  const [subject, setSubject] = useState(letter.subject || "");
  const [body, setBody] = useState(letter.body);
  const [method, setMethod] = useState("certified mail");
  const [sentDate, setSentDate] = useState(todayISO());
  const [toast, setToast] = useState<string | null>(null);
  const [rewrite, setRewrite] = useState("");
  const [rewriting, setRewriting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [pending, start] = useTransition();
  const sent = letter.status === "sent";
  const draftKey = `tib_letter_${letter.id}`;
  const saved = useRef({ body: letter.body, subject: letter.subject || "", recipient: letter.recipient || "" });
  const dirty = body !== saved.current.body || subject !== saved.current.subject || recipient !== saved.current.recipient;

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  // Bring back changes that never reached the server (closed tab, lost connection, expired sign-in).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const d = JSON.parse(raw) as { body: string; subject: string; recipient: string; at: number };
      if (d.body !== letter.body || d.subject !== (letter.subject || "") || d.recipient !== (letter.recipient || "")) {
        setBody(d.body); setSubject(d.subject); setRecipient(d.recipient);
        flash("We brought back your unsaved changes");
      } else localStorage.removeItem(draftKey);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep a copy on this device while editing, save to the account after a short pause, and warn before leaving.
  useEffect(() => {
    if (!dirty || sent) return;
    try { localStorage.setItem(draftKey, JSON.stringify({ body, subject, recipient, at: Date.now() })); } catch {}
    const t = setTimeout(() => { persist(false); }, 2500);
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => { clearTimeout(t); window.removeEventListener("beforeunload", warn); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, subject, recipient]);

  async function persist(show: boolean) {
    const fields = { body, subject, recipient };
    try {
      const r = await saveLetter(letter.id, fields);
      if (!r.ok) { if (show) flash(r.error); return false; }
      saved.current = fields;
      try { localStorage.removeItem(draftKey); } catch {}
      if (show) flash("Saved");
      return true;
    } catch {
      if (show) flash("Not saved. Check your connection or sign in again. Your text is kept on this device.");
      return false;
    }
  }

  function save() {
    start(async () => { await persist(true); });
  }

  function send() {
    start(async () => {
      if (!(await persist(true))) return;
      await markLetterSent(letter.id, method, sentDate);
      router.push(`/app/cases/${caseId}?sent=1`);
      router.refresh();
    });
  }

  // Phones: share sheet with the letter as a PDF attachment (Mail, Gmail, Outlook, any app).
  // Elsewhere, or if sharing isn't available: open the email app. Long letters are too big for an
  // email link on many phones, so the text is copied first and the email opens with the subject only.
  async function emailIt() {
    setSharing(true);
    try {
      if (!sent) await saveLetter(letter.id, { body, subject, recipient });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
      if (mobile && nav.share) {
        let file: File | null = null;
        try {
          const res = await fetch(`/api/letter/pdf?id=${letter.id}`);
          if (res.ok) file = new File([await res.blob()], `${(subject || "letter").replace(/[^a-z0-9]+/gi, "-").slice(0, 60) || "letter"}.pdf`, { type: "application/pdf" });
        } catch { /* fall back to text only */ }
        const data: ShareData = file && nav.canShare?.({ files: [file] }) ? { title: subject, text: body, files: [file] } : { title: subject, text: `${subject}\n\n${body}` };
        try {
          await nav.share(data);
          return;
        } catch (e) {
          if ((e as Error)?.name === "AbortError") return;
        }
      }
      const full = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (full.length <= 1800) {
        window.location.href = full;
      } else {
        await navigator.clipboard.writeText(body).catch(() => {});
        flash("Letter copied. Paste it into the email.");
        setTimeout(() => { window.location.href = `mailto:?subject=${encodeURIComponent(subject)}`; }, 900);
      }
    } finally {
      setSharing(false);
    }
  }

  async function redo() {
    setRewriting(true);
    const res = await fetch("/api/letter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId, kind: letter.kind, instructions: rewrite }) });
    const json = await res.json().catch(() => ({}));
    setRewriting(false);
    if (res.ok) router.push(`/app/cases/${caseId}/letter?id=${json.letterId}`);
    else flash(json.error || "Couldn't rewrite it");
  }

  return (
    <div className="split">
      <div className="a stack g12">
        <label className="field"><span style={{ fontSize: 14 }}>To</span><input className="input" value={recipient} onChange={(e) => setRecipient(e.target.value)} readOnly={sent} /></label>
        <label className="field"><span style={{ fontSize: 14 }}>Subject</span><input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} readOnly={sent} /></label>
        <label className="field">
          <span style={{ fontSize: 14 }}>Letter</span>
          <textarea className="input" value={body} onChange={(e) => setBody(e.target.value)} rows={22} readOnly={sent} style={{ fontSize: 15, boxShadow: "0 6px 12px rgba(26,26,26,0.06)" }} />
        </label>
        <span className="hand muted" style={{ fontSize: 20 }}>fill in anything in [brackets] before you send</span>
        <div className="row wrap g8">
          {!sent && <button type="button" className="btn-plain" onClick={save} disabled={pending}>Save changes</button>}
          <button type="button" className="btn-plain" onClick={() => { navigator.clipboard.writeText(`${subject}\n\n${body}`); flash("Copied"); }}>Copy text</button>
          <button type="button" className="btn-plain" onClick={emailIt} disabled={sharing}>{sharing ? "Opening…" : "Email it"}</button>
        </div>
      </div>

      <div className="b stack g16">
        {sent ? (
          <div className="panel-gray stack g4">
            <span style={{ fontWeight: 500 }}>Sent{letter.sent_method ? ` by ${letter.sent_method}` : ""}</span>
            <span className="muted small">Saved to your case with the date. We're counting their deadline.</span>
          </div>
        ) : (
          <section className="card stack g12">
            <h2 className="serif" style={{ margin: 0, fontSize: 26 }}>How will it <em className="o">go</em>?</h2>
            <fieldset style={{ border: 0, margin: 0, padding: 0 }} className="stack">
              <legend className="sr">Delivery method</legend>
              {METHODS.map(([v, l, hint], i) => (
                <label key={v} className="row g12" style={{ padding: "12px 0", borderBottom: i < METHODS.length - 1 ? "1px solid #EBEBEB" : 0, cursor: "pointer" }}>
                  <input type="radio" name="method" value={v} checked={method === v} onChange={() => setMethod(v)} style={{ width: 20, height: 20, accentColor: "#BF4F28", margin: 0 }} />
                  <span className="stack"><span style={{ fontWeight: 500, fontSize: 15 }}>{l}</span>{hint && <span className="muted small">{hint}</span>}</span>
                </label>
              ))}
            </fieldset>
            <label className="field"><span style={{ fontSize: 14 }}>Date sent</span><input type="date" className="input" value={sentDate} max={todayISO()} onChange={(e) => setSentDate(e.target.value)} /></label>
            <CtaButton type="button" onClick={send} disabled={pending} block>{pending ? "Saving…" : "I've sent it"}</CtaButton>
            <p className="muted small" style={{ margin: 0 }}>Print or save the PDF, sign it, and send it. Or <a href={`/app/cases/${caseId}/letter/send?id=${letter.id}`}>have us send it</a> by certified mail or fax.</p>
          </section>
        )}
        {!sent && (
          <details className="card">
            <summary className="btn-text" style={{ listStyle: "none", justifyContent: "flex-start" }}>Rewrite it with a note</summary>
            <div className="stack g8" style={{ marginTop: 8 }}>
              <textarea className="input" rows={3} value={rewrite} onChange={(e) => setRewrite(e.target.value)} placeholder="e.g. Mention I called on Sept 20 and was told it was under review." aria-label="What to change" />
              <button type="button" className="btn-plain" onClick={redo} disabled={rewriting || !rewrite.trim()} style={{ alignSelf: "flex-start" }}>{rewriting ? "Rewriting…" : "Rewrite"}</button>
            </div>
          </details>
        )}
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
