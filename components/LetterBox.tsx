"use client";

import Link from "next/link";
import { useState } from "react";

export default function LetterBox({ title, to, lines }: { title: string; to: string; lines: string[] }) {
  const [copied, setCopied] = useState(false);
  const text = [`To: ${to}`, "", ...lines].join("\n");
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* text stays selectable */ }
  };
  return (
    <section style={{ marginTop: 40 }} aria-labelledby="sample-letter">
      <h2 id="sample-letter" className="serif" style={{ fontSize: 30, margin: "0 0 6px", fontWeight: 400 }}>{title}</h2>
      <p className="muted" style={{ margin: "0 0 12px", fontSize: 15 }}>Fill in the [BRACKETS], keep a copy, and send it in a way that gives you proof.</p>
      <div className="card" style={{ padding: 22, borderRadius: 12 }}>
        <p className="muted small" style={{ margin: "0 0 10px" }}>To: {to}</p>
        {lines.map((l, i) => <p key={i} style={{ margin: "0 0 10px", fontSize: 15.5, lineHeight: 1.65 }}>{l}</p>)}
      </div>
      <div className="row wrap g8" style={{ marginTop: 12, alignItems: "center" }}>
        <button type="button" className="chip" onClick={copy} style={{ background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" }}>{copied ? "Copied" : "Copy letter"}</button>
        <Link href="/login?mode=signup" className="tap" style={{ fontWeight: 600, fontSize: 15 }}>Have us fill this in from your case →</Link>
      </div>
    </section>
  );
}
