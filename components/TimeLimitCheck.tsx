"use client";

import { useState } from "react";

/** Runs in the browser only. The date is never sent or saved. */
export default function TimeLimitCheck({ years, state }: { years: number; state: string }) {
  const [d, setD] = useState("");
  let msg = "";
  let tone: "ok" | "old" | "soon" = "ok";
  if (d) {
    const dt = new Date(d + "T12:00:00Z");
    if (!Number.isNaN(dt.getTime())) {
      dt.setUTCFullYear(dt.getUTCFullYear() + years);
      const ms = dt.getTime() - Date.now();
      const when = dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
      if (ms < 0) {
        tone = "old";
        msg = `Counting ${years} years from that date, the time limit likely ended ${when}. Don't pay or sign anything before you check the date and your state's rules.`;
      } else if (ms < 365 * 86400000) {
        tone = "soon";
        msg = `Counting ${years} years from that date, the time limit likely ends ${when}. That is less than a year away. A payment or signed promise could restart it.`;
      } else {
        msg = `Counting ${years} years from that date, the time limit likely ends ${when}.`;
      }
    }
  }
  return (
    <div className="panel-gray stack g12">
      <label htmlFor="tl-date" style={{ fontWeight: 600 }}>Check your debt&apos;s age</label>
      <span className="muted small">Enter the date of your last payment, or the first payment you missed. Nothing you enter is saved or sent.</span>
      <input id="tl-date" type="date" value={d} onChange={(e) => setD(e.target.value)} max={new Date().toISOString().slice(0, 10)} style={{ padding: "12px 14px", fontSize: 16, borderRadius: 14, border: "1px solid #D4D4D4", maxWidth: 260, minHeight: 44 }} />
      {msg && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, fontWeight: tone === "ok" ? 400 : 500 }} role="status">{msg} <span className="muted small">This is an estimate for {state}. The start date can differ by debt type.</span></p>}
    </div>
  );
}
