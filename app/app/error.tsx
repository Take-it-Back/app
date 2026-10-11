"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    fetch("/api/log-error", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `${error.message}${error.digest ? ` (${error.digest})` : ""}`, path: location.pathname }) }).catch(() => {});
  }, [error]);
  return (
    <main className="app-main">
      <div className="stack g16" style={{ paddingTop: 48 }}>
        <span className="hand" style={{ fontSize: 30, color: "#A8441F" }}>that didn&apos;t work</span>
        <h1 className="page-title">Something went <em className="o">wrong</em></h1>
        <p className="muted" style={{ margin: 0 }}>Your cases are safe. Try again, and if it keeps happening, email hello@takeitback.app.</p>
        <div className="row g12 wrap">
          <button type="button" className="btn-plain" onClick={reset} style={{ background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Try again</button>
          <Link href="/app" className="btn-plain">Go to Today</Link>
        </div>
      </div>
    </main>
  );
}
