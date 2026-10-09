import { Mark } from "./ui";
import { SCENARIOS, type ScenarioKey, type ShotKind } from "@/lib/marketing";

// Product screenshots drawn in code, so they stay sharp and on-brand.

function TabBar({ on = 0 }: { on?: number }) {
  const labels = ["Today", "Cases", "", "Dates", "You"];
  return (
    <div className="s-tabbar" aria-hidden="true">
      {labels.map((l, i) =>
        i === 2 ? (
          <span key={i} className="s-scan">+</span>
        ) : (
          <span key={i} className={i === on ? "on" : ""}>
            <i />
            {l}
          </span>
        )
      )}
    </div>
  );
}

function Btn({ children, ink }: { children: React.ReactNode; ink?: boolean }) {
  return <span className={`s-btn${ink ? " ink" : ""}`}>{children}</span>;
}

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ flex: "none" }}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function Screen({ kind, s = "medical" }: { kind: ShotKind; s?: ScenarioKey }) {
  const c = SCENARIOS[s];
  switch (kind) {
    case "today":
      return (
        <>
          <span className="s-title">Today</span>
          <div className="s-card">
            <span className="serif" style={{ fontStyle: "italic", fontSize: 17, color: "#BF4F28", display: "block" }}>Morning, Maria —</span>
            <span>Your {c.counterparty.split(" ")[0]} letter is ready, and {SCENARIOS.insurance.counterparty} owes you a reply by Nov 2.</span>
          </div>
          <div className="s-grid2">
            <div className="s-o"><span className="s-k">Next deadline</span><span className="s-num">{c.you.days}</span></div>
            <div className="s-g"><span className="s-k">Taken back</span><span className="s-num">$1,340</span></div>
          </div>
          <Btn>Review your {c.counterparty.split(" ")[0]} letter</Btn>
          <div className="stack">
            {[SCENARIOS.insurance, SCENARIOS.medical, SCENARIOS.renters].map((x, i) => (
              <span key={x.key} className="s-row row between" style={i === 2 ? { borderBottom: 0 } : undefined}>
                <span className="stack"><span style={{ fontWeight: 500 }}>{x.counterparty}</span><span className="s-k">{x.tag}</span></span>
                <span className={`s-tag${i === 0 ? " o" : ""}`}>{i === 0 ? "Your move" : i === 1 ? "Waiting" : "Won"}</span>
              </span>
            ))}
          </div>
          <TabBar on={0} />
        </>
      );
    case "scan":
      return (
        <div className="s-camera">
          <span className="s-k" style={{ color: "#BDBDBD", textAlign: "center" }}>Fit the whole page in the frame</span>
          <div className="s-doc">
            <span style={{ fontWeight: 600, fontSize: 11 }}>{c.counterparty.toUpperCase()}</span>
            <span className="s-line" style={{ width: "60%" }} />
            <span className="s-line" />
            <span className="s-line" style={{ width: "80%" }} />
            <span className="row between" style={{ fontSize: 10, marginTop: 6 }}><span>Amount due</span><b>{c.amount}</b></span>
            <span className="s-line" />
            <span className="s-line" style={{ width: "70%" }} />
            <svg className="s-frame" viewBox="0 0 206 266" preserveAspectRatio="none" aria-hidden="true"><path d="M3 23V9a6 6 0 0 1 6-6h14M183 3h14a6 6 0 0 1 6 6v14M203 243v14a6 6 0 0 1-6 6h-14M23 263H9a6 6 0 0 1-6-6v-14" fill="none" stroke="#BF4F28" strokeWidth="3" strokeLinecap="round" /></svg>
          </div>
          <div className="row between" style={{ width: "100%", padding: "0 14px", color: "#fff", fontSize: 12 }}>
            <span>Upload PDF</span>
            <span className="s-shutter" />
            <span>2 pages</span>
          </div>
        </div>
      );
    case "questions":
      return (
        <>
          <span className="s-k">Step 2 of 3</span>
          <span className="s-title" style={{ fontSize: 26 }}>A few quick <em className="o">questions</em></span>
          <span style={{ fontWeight: 500 }}>What is it?</span>
          <div className="row wrap g8">
            {["Medical bill", "Insurance denial", "Landlord", "Debt collector"].map((t) => (
              <span key={t} className={`s-chip${t === c.tag || (s === "renters" && t === "Landlord") || (s === "debt" && t === "Debt collector") ? " on" : ""}`}>{t}</span>
            ))}
          </div>
          <span style={{ fontWeight: 500, marginTop: 6 }}>Which state are you in?</span>
          <span className="s-input">Ohio</span>
          <span style={{ fontWeight: 500, marginTop: 6 }}>When did it arrive?</span>
          <span className="s-input">September 9, 2026</span>
          <span style={{ fontWeight: 500, marginTop: 6 }}>Have you paid any of it?</span>
          <div className="row g8"><span className="s-chip">Yes</span><span className="s-chip on">No</span></div>
          <div style={{ marginTop: "auto" }}><Btn ink>Read my document</Btn></div>
        </>
      );
    case "found":
      return (
        <>
          <span className="s-tag o" style={{ alignSelf: "flex-start" }}>{c.tag}</span>
          <span className="s-title">What we <em className="o">found</em></span>
          <div className="s-o"><span className="s-k">You may owe up to</span><span className="s-num" style={{ fontSize: 32 }}>{c.savings} less</span></div>
          <div className="stack">
            {c.findings.map((f, i) => (
              <span key={f.title} className="s-row stack" style={i === c.findings.length - 1 ? { borderBottom: 0 } : undefined}>
                <span className="row between g8"><span style={{ fontWeight: 500 }}><span style={{ color: "#BF4F28" }}>{i + 1}</span> · {f.title}</span>{f.amount && <b style={{ fontWeight: 500 }}>{f.amount}</b>}</span>
                {f.rule && <span style={{ fontSize: 11, color: "#A8441F", fontWeight: 500 }}>{f.rule}</span>}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "auto" }}><Btn>Write my letter</Btn></div>
        </>
      );
    case "free":
      return (
        <>
          <span className="s-tag" style={{ alignSelf: "flex-start" }}>{c.tag} · Free</span>
          <span className="s-title">Where you <em className="o">stand</em></span>
          <span style={{ fontSize: 14 }}>{c.summary}</span>
          <div className="stack">
            {c.findings.map((f, i) => (
              <span key={f.title} className="s-row stack g4" style={i === c.findings.length - 1 ? { borderBottom: 0 } : undefined}>
                <span style={{ fontWeight: 500 }}>{i + 1} · {f.title}</span>
                <span className="row g4 s-k"><Lock /> Full details in Premium</span>
              </span>
            ))}
          </div>
          <div className="s-dark">
            <span style={{ fontSize: 10, letterSpacing: 1, color: "#BF4F28", fontWeight: 600 }}>PREMIUM</span>
            <span className="serif" style={{ fontSize: 17 }}>Want us to write the letter?</span>
            <span className="s-btn" style={{ marginTop: 4 }}>Try it free for 7 days</span>
          </div>
        </>
      );
    case "letter":
      return (
        <>
          <span className="s-title">Your <em className="o">letter</em></span>
          <div className="s-paper">
            <span className="s-k">October 9, 2026</span>
            <span style={{ fontSize: 11 }}>{c.letter.to}</span>
            <span style={{ fontWeight: 600, fontSize: 12 }}>Re: {c.letter.subject}</span>
            {c.letter.lines.map((l) => <span key={l} style={{ fontSize: 11.5, lineHeight: 1.45 }}>{l}</span>)}
            <span className="hand" style={{ fontSize: 22, marginTop: 4 }}>Maria Lopez</span>
          </div>
          <div className="row g8"><span className="s-chip">Edit</span><span className="s-chip">Rewrite</span><span className="s-chip">PDF</span></div>
          <div style={{ marginTop: "auto" }}><Btn>I sent it</Btn></div>
        </>
      );
    case "dates":
      return (
        <>
          <span className="s-title">Dates</span>
          <div className="row between" style={{ gap: 4 }}>
            {["F", "S", "S", "M", "T", "W", "T"].map((d, i) => (
              <span key={i} className={`s-day${i === 2 ? " on" : ""}${i === 5 ? " dot" : ""}`}><span className="s-k">{d}</span>{9 + i}</span>
            ))}
          </div>
          <div className="s-o" style={{ textAlign: "center" }}>
            <span className="s-k" style={{ color: "#A8441F" }}>{c.you.label} by {c.you.date}</span>
            <span className="s-num" style={{ fontSize: 44 }}>{c.you.days}</span>
            <span className="hand" style={{ fontSize: 20 }}>we'll nudge you</span>
          </div>
          <span className="s-k" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Coming up</span>
          {[
            ["11", "Oct", "Send your appeal", "Summit Health Plan", true],
            ["14", "Oct", "Ask for itemized bill", "Riverside Medical", true],
            ["2", "Nov", "Their decision due", "Summit Health Plan", false],
          ].map(([d, m, t, w, mine]) => (
            <span key={String(t)} className="s-row row g12">
              <span className="stack" style={{ alignItems: "center", width: 30 }}><span className="serif" style={{ fontSize: 22, lineHeight: 1 }}>{d}</span><span className="s-k">{m}</span></span>
              <span className="stack grow"><span style={{ fontWeight: 500 }}>{t}</span><span className="s-k">{w}</span></span>
              <span className={`s-tag${mine ? " o" : ""}`}>{mine ? "Yours" : "Theirs"}</span>
            </span>
          ))}
          <TabBar on={3} />
        </>
      );
    case "tracker":
      return (
        <>
          <span className="s-tag" style={{ alignSelf: "flex-start" }}>{c.tag}</span>
          <span className="s-title" style={{ fontSize: 26 }}>{c.counterparty}</span>
          <span className="s-k" style={{ fontSize: 12 }}>{c.title} · {c.amount} at stake</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
            {["#1A1A1A", "#1A1A1A", "#BF4F28", "#EBEBEB"].map((x, i) => <span key={i} style={{ height: 4, borderRadius: 2, background: x }} />)}
          </div>
          <div className="s-grid2">
            <div className="s-o"><span className="s-k" style={{ color: "#A8441F" }}>You · by {c.you.date}</span><span className="s-num" style={{ fontSize: 26 }}>{c.you.days}</span></div>
            <div className="s-b"><span className="s-k">{c.them.label}</span><span className="s-num" style={{ fontSize: 26 }}>{c.them.days}</span></div>
          </div>
          <div className="stack g12" style={{ marginTop: 4 }}>
            {c.timeline.map((t, i) => (
              <span key={t.text} className="row g12" style={{ alignItems: "flex-start" }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: i === 0 ? "#BF4F28" : "#1A1A1A", marginTop: 4, flex: "none" }} />
                <span className="stack"><span className="s-k">{t.date}</span>{t.text}</span>
              </span>
            ))}
          </div>
          <div style={{ marginTop: "auto" }}><Btn>See next step</Btn></div>
        </>
      );
    case "reply":
      return (
        <>
          <span className="s-k">Their reply · {c.counterparty}</span>
          <span className="s-title">They <em className="o">wrote back</em></span>
          <div className="s-o"><span className="s-k">The short version</span><span className="serif" style={{ fontSize: 26 }}>{c.reply.verdict}</span></div>
          <span style={{ fontSize: 14 }}>{c.reply.said}</span>
          <div className="s-g stack g4">
            <span style={{ fontWeight: 600 }}>What to do next</span>
            <span>{c.reply.next}</span>
          </div>
          <span className="hand muted" style={{ fontSize: 20 }}>round two, ready</span>
          <div style={{ marginTop: "auto" }}><Btn>Write the next letter</Btn></div>
        </>
      );
    case "packet":
      return (
        <>
          <span className="s-title">Case <em className="o">packet</em></span>
          <div className="s-paper" style={{ gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{c.counterparty}</span>
            <span className="s-k">{c.tag} · {c.amount} at stake</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, marginTop: 6 }}>TIMELINE</span>
            {c.timeline.slice().reverse().map((t) => (
              <span key={t.text} className="row between" style={{ fontSize: 10.5 }}><span>{t.text}</span><span className="s-k">{t.date}</span></span>
            ))}
            <span style={{ fontSize: 10.5, fontWeight: 600, marginTop: 6 }}>DOCUMENTS · 6</span>
            <div className="row g4">{[0, 1, 2, 3].map((i) => <span key={i} className="s-thumb" />)}</div>
          </div>
          <div style={{ marginTop: "auto" }}><Btn ink>Print or save as PDF</Btn></div>
        </>
      );
    case "help":
      return (
        <>
          <span className="s-title">Real <em className="o">help</em></span>
          <div className="s-o stack g4">
            <span style={{ fontSize: 10, letterSpacing: 1, color: "#A8441F", fontWeight: 600 }}>PLEASE READ THIS FIRST</span>
            <span>This notice has a court date. Please talk to a real person this week.</span>
          </div>
          {[
            ["Legal aid near you", "Free help if you qualify"],
            ["Tenant hotline", "Ohio Tenant Union"],
            ["State attorney general", "Consumer complaints"],
            ["CFPB", "Bank and collector complaints"],
          ].map(([t, d]) => (
            <span key={t} className="s-row row between">
              <span className="stack"><span style={{ fontWeight: 500 }}>{t}</span><span className="s-k">{d}</span></span>
              <span style={{ color: "#BF4F28" }}>→</span>
            </span>
          ))}
          <div style={{ marginTop: "auto" }}><Btn>Call legal aid</Btn></div>
        </>
      );
  }
}

export function Phone({ kind, s = "medical", size = "md", label }: { kind: ShotKind; s?: ScenarioKey; size?: "md" | "sm" | "xs"; label?: string }) {
  return (
    <div className={`phone ${size}`} role="img" aria-label={label || `App screen: ${kind}`}>
      <div className={`phone-in${kind === "scan" ? " dark" : ""}`}>
        <Screen kind={kind} s={s} />
      </div>
    </div>
  );
}

/** Desktop view of a case, in a browser window. */
export function Desktop({ s = "insurance" }: { s?: ScenarioKey }) {
  const c = SCENARIOS[s];
  return (
    <div className="browser" role="img" aria-label={`Desktop view of a ${c.tag.toLowerCase()} case`}>
      <div className="browser-bar">
        <i /><i /><i />
        <span>takeitback.app/app/cases</span>
      </div>
      <div className="browser-body">
        <aside className="b-side">
          <span className="row g8" style={{ fontWeight: 700, fontSize: 13 }}><Mark size={20} />take it back</span>
          {["Today", "Cases", "Dates", "Get help", "You"].map((l, i) => (
            <span key={l} className={`b-link${i === 1 ? " on" : ""}`}>{l}</span>
          ))}
          <span className="s-btn ink" style={{ marginTop: "auto" }}>Scan a document</span>
        </aside>
        <div className="b-main">
          <div className="row g8"><span className="s-tag">{c.tag}</span><span className="s-tag o">Your move</span></div>
          <span className="s-title" style={{ fontSize: 30 }}>{c.counterparty}</span>
          <span className="s-k" style={{ fontSize: 12 }}>{c.title} · {c.amount} at stake</span>
          <div className="b-cols">
            <div className="stack g12">
              <div className="s-grid2">
                <div className="s-o"><span className="s-k" style={{ color: "#A8441F" }}>{c.you.label} by {c.you.date}</span><span className="s-num">{c.you.days}</span></div>
                <div className="s-b"><span className="s-k">{c.them.label}</span><span className="s-num">{c.them.days}</span></div>
              </div>
              <span className="s-btn" style={{ alignSelf: "flex-start", padding: "10px 20px" }}>Review your letter</span>
              <div className="s-b stack g8">
                <span className="s-k" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Timeline</span>
                {c.timeline.map((t, i) => (
                  <span key={t.text} className="row g8"><span style={{ width: 8, height: 8, borderRadius: 4, background: i === 0 ? "#BF4F28" : "#1A1A1A" }} /><span className="grow">{t.text}</span><span className="s-k">{t.date}</span></span>
                ))}
              </div>
            </div>
            <div className="stack g12">
              <div className="s-b stack g8">
                <span className="s-k" style={{ textTransform: "uppercase", letterSpacing: 1 }}>What we found</span>
                {c.findings.map((f) => <span key={f.title} className="stack"><span style={{ fontWeight: 500 }}>{f.title}</span>{f.rule && <span style={{ fontSize: 11, color: "#A8441F" }}>{f.rule}</span>}</span>)}
              </div>
              <div className="s-b stack g4">
                <span className="s-k" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Letters</span>
                <span className="row between"><span>{c.letter.subject.split(",")[0]}</span><span className="s-tag o">Draft</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small cropped preview for cards and menus. */
export function Peek({ kind, s = "medical", tone = "gray" }: { kind: ShotKind; s?: ScenarioKey; tone?: "gray" | "orange" | "ink" }) {
  return (
    <div className={`peek ${tone}`} aria-hidden="true">
      <div className={`phone-in${kind === "scan" ? " dark" : ""}`}>
        <Screen kind={kind} s={s} />
      </div>
    </div>
  );
}
