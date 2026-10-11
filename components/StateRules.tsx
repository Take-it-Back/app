import { stateRights, debtTimeLimit, RULES_CHECKED } from "@/lib/stateLaw";
import { US_STATES } from "@/lib/states";
import { setCaseLaw } from "@/lib/actions";
import { shortDate } from "@/lib/format";
import type { CaseRow } from "@/lib/types";

/** Debt clock warning, shown on the case and before payment or settlement letters. */
export function DebtClock({ state, lastPayment, compact = false }: { state: string | null; lastPayment: string | null; compact?: boolean }) {
  const t = debtTimeLimit(state, lastPayment);
  if (!t) return null;
  const a = t.age;
  const tone = a?.expired ? "#BF4F28" : "#1A1A1A";
  return (
    <div className="card stack g8" role="note" style={{ background: a?.expired ? "#FBEDE7" : "#F6F6F4", borderRadius: 16 }}>
      <span style={{ fontWeight: 600, color: tone }}>
        {a?.expired ? "This debt may be too old to sue on" : a?.soon ? `The time limit to sue may end ${shortDate(a.expires!)}` : "Before you pay or promise anything"}
      </span>
      <span className="small">
        {a?.expired
          ? `In ${state}, collectors generally have ${t.span} to sue, and your last payment was more than that ago. `
          : `In ${state}, collectors generally have ${t.span} to sue, counted from your last payment. `}
        {t.revival}
        {t.rule.revival !== "none" && " Don't pay, agree to a plan or admit the debt in writing until you've checked the dates."}
      </span>
      {!compact && a?.expired && <span className="small muted">A &ldquo;Too old to sue&rdquo; letter is in your letters. A legal aid office can confirm the date for free.</span>}
      {!compact && !lastPayment && <span className="small muted">Add the date of your last payment below to see where this debt stands.</span>}
    </div>
  );
}

export default function StateRules({ c }: { c: CaseRow }) {
  // The debt clock card above already covers the time limit, so don't repeat it in the list.
  const rights = stateRights(c.category, c.user_state).filter((r) => !(c.user_state && c.category === "debt" && r.title === "Time limit to sue you"));
  const first = rights.slice(0, 3);
  const rest = rights.slice(3);
  const needsDate = c.category === "debt";
  return (
    <section>
      <div className="sec-head"><h2>{c.user_state ? `Your rights in ${c.user_state}` : "Your state's rules"}</h2></div>
      <div className="stack g12">
        {c.category === "debt" && c.user_state && <DebtClock state={c.user_state} lastPayment={c.last_payment_on ?? null} />}
        {rights.length > 0 && (
          <div className="card">
            <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {first.map((r) => <RightRow key={r.title} r={r} />)}
            </ul>
            {rest.length > 0 && (
              <details>
                <summary className="btn-text" style={{ listStyle: "none", justifyContent: "flex-start", marginTop: 8 }}>{rest.length} more rule{rest.length > 1 ? "s" : ""}</summary>
                <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {rest.map((r) => <RightRow key={r.title} r={r} />)}
                </ul>
              </details>
            )}
            <p className="muted small" style={{ margin: "12px 0 0" }}>General information checked {RULES_CHECKED}, not legal advice. Laws change and cities can add their own rules; tap a source to check.</p>
          </div>
        )}
        {(!c.user_state || needsDate) && (
          <form action={setCaseLaw.bind(null, c.id)} className="card stack g12">
            <label className="field">
              <span style={{ fontSize: 14 }}>State this happened in</span>
              <select name="user_state" className="input" defaultValue={c.user_state || ""}>
                <option value="">Choose a state</option>
                {US_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            {needsDate && (
              <label className="field">
                <span style={{ fontSize: 14 }}>When did you last pay on this debt? <span className="muted">(a guess is fine)</span></span>
                <input type="date" name="last_payment_on" className="input" defaultValue={c.last_payment_on || ""} max={new Date().toISOString().slice(0, 10)} />
              </label>
            )}
            <button className="btn-plain" style={{ alignSelf: "flex-start" }}>Save</button>
          </form>
        )}
      </div>
    </section>
  );
}

function RightRow({ r }: { r: { title: string; text: string; url?: string } }) {
  return (
    <li style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB" }} className="stack g4">
      <span style={{ fontWeight: 500 }}>{r.title}</span>
      <span className="small">{r.text}{r.url && <> <a href={r.url} target="_blank" rel="noopener noreferrer" className="muted">Source</a></>}</span>
    </li>
  );
}
