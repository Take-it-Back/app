"use client";

import { useState, useTransition } from "react";
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
  const [pending, start] = useTransition();
  const sent = letter.status === "sent";

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function save() {
    start(async () => {
      await saveLetter(letter.id, { body, subject, recipient });
      flash("Saved");
    });
  }

  function send() {
    start(async () => {
      await saveLetter(letter.id, { body, subject, recipient });
      await markLetterSent(letter.id, method, sentDate);
      router.push(`/app/cases/${caseId}?sent=1`);
      router.refresh();
    });
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
          <a className="btn-plain" href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>Open in email</a>
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
            <p className="muted small" style={{ margin: 0 }}>Print or save the PDF, sign it, and send it. Certified mail sent for you is coming soon.</p>
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
