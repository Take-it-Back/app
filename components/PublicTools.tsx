"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DEADLINES, LETTERS, addDeadline, addWeekdays, fmtDate } from "@/lib/publicTools";
import { DEPOSIT_RULES } from "@/lib/deposits";
import { lawStateSlug } from "@/lib/lawPages";

// All three tools run in the browser. Nothing typed here is saved or sent anywhere.
const input: React.CSSProperties = { padding: "12px 14px", fontSize: 16, borderRadius: 14, border: "1px solid #D4D4D4", minHeight: 44, width: "100%", font: "inherit", background: "#fff" };
const today = () => new Date().toISOString().slice(0, 10);
const daysFromNow = (d: Date) => Math.round((d.getTime() - new Date(today() + "T12:00:00Z").getTime()) / 86400000);

function Result({ date, days }: { date: Date; days: number }) {
  const left = daysFromNow(date);
  const late = left < 0;
  return (
    <div className={late ? "panel-gray" : "panel-orange"} role="status" style={{ marginTop: 4 }}>
      <div style={{ fontSize: 14 }} className="muted">{late ? "This date has passed" : "Your deadline"}</div>
      <div className="serif" style={{ fontSize: 30, lineHeight: 1.15, margin: "4px 0" }}>{fmtDate(date)}</div>
      <div style={{ fontSize: 15 }}>
        {late ? `About ${Math.abs(left)} days ago. You may still have options, so act now and ask legal aid or the agency.` : left === 0 ? "That is today." : `${left} ${left === 1 ? "day" : "days"} from today.`}
        {" "}Counted as {days} days.
      </div>
    </div>
  );
}

export function DeadlineFinder() {
  const [id, setId] = useState(DEADLINES[0].id);
  const [start, setStart] = useState("");
  const item = DEADLINES.find((d) => d.id === id)!;
  const date = start ? addDeadline(start, item.days, item.count) : null;
  return (
    <div className="stack g16">
      <div className="stack g8">
        <label htmlFor="dl-what" style={{ fontWeight: 600 }}>What do you need to do?</label>
        <select id="dl-what" value={id} onChange={(e) => setId(e.target.value)} style={input}>
          {DEADLINES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
      </div>
      <div className="stack g8">
        <label htmlFor="dl-date" style={{ fontWeight: 600 }}>Date of {item.from}</label>
        <input id="dl-date" type="date" value={start} onChange={(e) => setStart(e.target.value)} max={today()} style={{ ...input, maxWidth: 260 }} />
      </div>
      {date && <Result date={date} days={item.days} />}
      <p className="muted" style={{ margin: 0, fontSize: 15 }}>{item.note}</p>
      <p className="muted small" style={{ margin: 0 }}>This uses the federal rule. Your state, your plan or your contract can give you more time, and sometimes less. When unsure, count from the earlier date and act sooner.{item.guide ? <> Read the <Link href={`/guides/${item.guide}`}>full guide</Link>.</> : null}</p>
    </div>
  );
}

export function DepositDeadline() {
  const states = Object.keys(DEPOSIT_RULES);
  const [state, setState] = useState("");
  const [start, setStart] = useState("");
  const rule = state ? DEPOSIT_RULES[state] : null;
  const date = useMemo(() => {
    if (!rule || !rule.days || !start) return null;
    return /business days/i.test(rule.text) ? addWeekdays(start, rule.days) : addDeadline(start, rule.days, "calendar");
  }, [rule, start]);
  return (
    <div className="stack g16">
      <div className="stack g8">
        <label htmlFor="dd-state" style={{ fontWeight: 600 }}>Your state</label>
        <select id="dd-state" value={state} onChange={(e) => setState(e.target.value)} style={input}>
          <option value="">Choose a state</option>
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="stack g8">
        <label htmlFor="dd-date" style={{ fontWeight: 600 }}>Move-out date</label>
        <input id="dd-date" type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ ...input, maxWidth: 260 }} />
      </div>
      {rule && <p style={{ margin: 0, fontSize: 16 }}><strong>{state}:</strong> {rule.text}.</p>}
      {rule && rule.days === null && <p className="muted" style={{ margin: 0 }}>This state has no fixed deadline in its law. Ask for the deposit in writing and set your own reasonable date.</p>}
      {date && <Result date={date} days={rule!.days!} />}
      {rule && <p className="muted small" style={{ margin: 0 }}>In some states the clock starts when you give a forwarding address, not on move-out day. Check the rule above. <Link href={`/laws/security-deposit/${lawStateSlug(state)}`}>See {state}&apos;s full rules, penalties and steps</Link>.</p>}
    </div>
  );
}

export function LetterBuilder() {
  const [id, setId] = useState(LETTERS[0].id);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const t = LETTERS.find((l) => l.id === id)!;
  const text = t.build(vals).join("\n");
  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* the text is selectable below */ }
  };
  return (
    <div className="stack g16">
      <div className="stack g8">
        <label htmlFor="lb-type" style={{ fontWeight: 600 }}>What do you need to send?</label>
        <select id="lb-type" value={id} onChange={(e) => setId(e.target.value)} style={input}>
          {LETTERS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </div>
      <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {t.fields.map((fl) => (
          <div key={fl.id} className="stack g8" style={fl.multiline ? { gridColumn: "1 / -1" } : undefined}>
            <label htmlFor={`lb-${fl.id}`} style={{ fontWeight: 500, fontSize: 15 }}>{fl.label}{fl.optional ? <span className="muted"> (optional)</span> : null}</label>
            {fl.multiline
              ? <textarea id={`lb-${fl.id}`} rows={4} value={vals[fl.id] || ""} placeholder={fl.placeholder} onChange={(e) => set(fl.id, e.target.value)} style={{ ...input, resize: "vertical" }} />
              : <input id={`lb-${fl.id}`} value={vals[fl.id] || ""} placeholder={fl.placeholder} onChange={(e) => set(fl.id, e.target.value)} style={input} />}
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 22, borderRadius: 22 }}>
        <pre aria-label="Your letter" style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", font: "inherit", fontSize: 15.5, lineHeight: 1.65 }}>{text}</pre>
      </div>
      <div className="row wrap g8">
        <button type="button" className="chip" onClick={copy} style={{ background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" }}>{copied ? "Copied" : "Copy letter"}</button>
        <button type="button" className="chip" onClick={() => window.print()}>Print</button>
      </div>
      <p className="muted small" style={{ margin: 0 }}>Words in [BRACKETS] still need your details. Keep a copy and send it in a way that gives you proof, like email or certified mail. General information, not legal advice. Nothing you type here is saved or sent.{t.guide ? <> Read the <Link href={`/guides/${t.guide}`}>guide</Link> for the steps around this letter.</> : null}</p>
    </div>
  );
}
