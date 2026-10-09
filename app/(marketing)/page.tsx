import Link from "next/link";
import { CtaLink } from "@/components/ui";
import { CtaBand, SiteFooter, SiteHeader } from "@/components/site";

const benefits = ["Plain-English answers", "Every deadline tracked", "Letters in one tap", "Their replies, explained", "Keep 100% of what you save", "Your papers stay private"];

const features = [
  { id: "f-scan", title: "Snap it", body: "Photo, PDF or a screenshot. We pull out every date and dollar.", shot: "scan" },
  { id: "f-answers", title: "Plain answers", body: "What's wrong, what you may be owed, and the rule behind it.", shot: "found" },
  { id: "f-letters", title: "Ready letters", body: "Firm, polite letters you review, sign and send.", shot: "letter" },
  { id: "f-dates", title: "Deadline keeper", body: "Your dates and theirs, counted down and remembered.", shot: "dates" },
  { id: "f-tracker", title: "Case tracker", body: "Every letter, reply and receipt, start to finish.", shot: "tracker" },
  { id: "f-help", title: "Real help", body: "Court dates and lawsuits go straight to people who can help.", shot: "help" },
] as const;

const faqs = [
  ["Is Take it back a lawyer?", "No. We explain your rights and prepare letters you review and send yourself. If your case needs a lawyer, like a court date, we'll point you to real help right away."],
  ["What can it help with?", "Medical bills, health insurance denials, landlord problems like deposits and repairs, and debt collectors."],
  ["What if they ignore my letter?", "We count their deadline too. When it passes, we help you write the follow-up from your case history."],
  ["Is my information safe?", "Your documents are stored privately, never sold and never used for ads. You can delete everything whenever you like."],
  ["Does it cost anything?", "Take it back is free while we're in early access. Premium plans with extras like certified mail are coming."],
];

function Shot({ kind }: { kind: (typeof features)[number]["shot"] }) {
  const box: React.CSSProperties = { height: 230, borderRadius: 18, overflow: "hidden", position: "relative", padding: 18, display: "flex", flexDirection: "column", gap: 10 };
  if (kind === "scan")
    return (
      <div style={{ ...box, background: "#222", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 140, height: 172, background: "#F2F2F2", borderRadius: 3, transform: "rotate(-3deg)", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ height: 6, width: "50%", background: "#BDBDBD", borderRadius: 3 }} />
          <span style={{ height: 4, background: "#D4D4D4", borderRadius: 2 }} />
          <span style={{ height: 4, width: "80%", background: "#D4D4D4", borderRadius: 2 }} />
          <span style={{ height: 4, background: "#D4D4D4", borderRadius: 2 }} />
        </div>
      </div>
    );
  if (kind === "found")
    return (
      <div style={{ ...box, background: "#F3F3F3" }}>
        <span className="serif" style={{ fontSize: 22 }}>What we <em className="o">found</em></span>
        <div style={{ background: "#FDEEE7", borderRadius: 14, padding: "10px 12px" }}>
          <span className="muted" style={{ display: "block", fontSize: 11 }}>You may owe up to</span>
          <span className="serif" style={{ fontSize: 26 }}>$1,762 less</span>
        </div>
        <span style={{ fontSize: 13, paddingBottom: 8, borderBottom: "1px solid #EBEBEB" }}>1 · Charged twice for one scan</span>
        <span style={{ fontSize: 13 }}>2 · Surprise out-of-network doctor</span>
      </div>
    );
  if (kind === "letter")
    return (
      <div style={{ ...box, background: "#FDEEE7", padding: "26px 40px 0" }}>
        <div className="paper" style={{ flex: 1, transform: "rotate(2deg)", padding: 18, display: "flex", flexDirection: "column", gap: 7 }}>
          <span className="muted" style={{ fontSize: 11 }}>October 9, 2026</span>
          <span style={{ height: 4, width: "70%", background: "#E2E2E2", borderRadius: 2 }} />
          <span style={{ height: 4, background: "#E2E2E2", borderRadius: 2 }} />
          <span style={{ height: 4, width: "85%", background: "#E2E2E2", borderRadius: 2 }} />
          <span className="hand" style={{ marginTop: 8, fontSize: 22 }}>Maria Lopez</span>
        </div>
      </div>
    );
  if (kind === "dates")
    return (
      <div style={{ ...box, background: "#F3F3F3", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <span style={{ fontSize: 13 }}>You send by Oct 11</span>
        <span className="serif" style={{ fontSize: 64, lineHeight: 1 }}>2 days</span>
        <span className="hand" style={{ fontSize: 22 }}>we'll nudge you</span>
      </div>
    );
  if (kind === "tracker")
    return (
      <div style={{ ...box, background: "#F3F3F3", gap: 14, fontSize: 14, padding: 22 }}>
        {["Second appeal drafted", "Their reply scanned", "First appeal sent", "Denial letter scanned"].map((t, i) => (
          <span key={t} className="row g12"><span style={{ width: 12, height: 12, borderRadius: 6, background: i === 0 ? "#BF4F28" : "#1A1A1A" }} />{t}</span>
        ))}
      </div>
    );
  return (
    <div style={{ ...box, background: "#F3F3F3", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <svg width="64" height="64" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="22" fill="#fff" /><circle cx="22" cy="10" r="6" fill="#1A1A1A" /><circle cx="17" cy="24" r="1.8" fill="#1A1A1A" /><circle cx="27" cy="24" r="1.8" fill="#1A1A1A" /><path d="M17 30c3 3 7 3 10 0" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" /></svg>
      <span style={{ fontSize: 15, fontWeight: 500 }}>Legal aid near you</span>
    </div>
  );
}

function Phone() {
  return (
    <div style={{ width: 300, height: 620, borderRadius: 46, background: "#1A1A1A", padding: 10, boxShadow: "0 6px 12px rgba(26,26,26,0.1)", flex: "none" }}>
      <div className="rot" role="img" aria-label="App screens: today's briefing, what we found, and a case tracker">
        <div>
          <span className="serif" style={{ fontSize: 30 }}>Today</span>
          <div style={{ border: "1px solid #EBEBEB", borderRadius: 18, padding: 14 }}>
            <span className="serif" style={{ fontStyle: "italic", fontSize: 17, color: "#BF4F28", display: "block" }}>Morning, Maria —</span>
            <span style={{ fontSize: 13 }}>Your Summit appeal is ready to send.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "#FDEEE7", borderRadius: 16, padding: 12 }}><span className="muted" style={{ display: "block", fontSize: 11 }}>Next deadline</span><span className="serif" style={{ fontSize: 30 }}>2 days</span></div>
            <div style={{ background: "#F3F3F3", borderRadius: 16, padding: 12 }}><span className="muted" style={{ display: "block", fontSize: 11 }}>Taken back</span><span className="serif" style={{ fontSize: 30 }}>$1,340</span></div>
          </div>
          <span style={{ background: "#BF4F28", color: "#fff", borderRadius: 999, padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>Review your Summit appeal</span>
          <div className="stack" style={{ fontSize: 13 }}>
            <span style={{ padding: "10px 0", borderBottom: "1px solid #EBEBEB" }}>Summit Health Plan · MRI</span>
            <span style={{ padding: "10px 0", borderBottom: "1px solid #EBEBEB" }}>Riverside Medical · ER bill</span>
            <span style={{ padding: "10px 0" }}>Harbor Point · deposit</span>
          </div>
        </div>
        <div>
          <span className="tag tag-orange" style={{ alignSelf: "flex-start" }}>Medical bill</span>
          <span className="serif" style={{ fontSize: 30 }}>What we <em className="o">found</em></span>
          <div style={{ background: "#FDEEE7", borderRadius: 16, padding: 14 }}><span className="muted" style={{ display: "block", fontSize: 11 }}>You may owe up to</span><span className="serif" style={{ fontSize: 32 }}>$1,762 less</span></div>
          <div className="stack" style={{ fontSize: 13 }}>
            <span style={{ padding: "10px 0", borderBottom: "1px solid #EBEBEB" }}>1 · Charged twice for one scan</span>
            <span style={{ padding: "10px 0", borderBottom: "1px solid #EBEBEB" }}>2 · Surprise out-of-network doctor</span>
            <span style={{ padding: "10px 0" }}>3 · You may qualify for charity care</span>
          </div>
          <span style={{ marginTop: 6, background: "#BF4F28", color: "#fff", borderRadius: 999, padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>Write my letter</span>
        </div>
        <div>
          <span className="tag tag-gray" style={{ alignSelf: "flex-start" }}>Insurance denial</span>
          <span className="serif" style={{ fontSize: 28 }}>Summit Health Plan</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "#FDEEE7", borderRadius: 16, padding: 12 }}><span style={{ display: "block", fontSize: 11, color: "#A8441F" }}>You send by</span><span className="serif" style={{ fontSize: 28 }}>2 days</span></div>
            <div style={{ border: "1px solid #EBEBEB", borderRadius: 16, padding: 12 }}><span className="muted" style={{ display: "block", fontSize: 11 }}>Then they have</span><span className="serif" style={{ fontSize: 28 }}>30 days</span></div>
          </div>
          <div className="stack g12" style={{ fontSize: 13 }}>
            {["Second appeal drafted", "Their reply: denial upheld", "First appeal delivered", "Denial letter scanned"].map((t, i) => (
              <span key={t} className="row g8"><span style={{ width: 10, height: 10, borderRadius: 5, background: i === 0 ? "#BF4F28" : "#1A1A1A" }} />{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Note({ text, side }: { text: string; side: "left" | "right" }) {
  const left = side === "left";
  return (
    <div className="hide-sm" style={{ position: "absolute", ...(left ? { left: -10, top: 70 } : { right: -6, bottom: 90 }), display: "flex", flexDirection: "column", alignItems: left ? "flex-end" : "flex-start", transform: `rotate(${left ? -4 : 3}deg)` }}>
      {!left && (
        <svg width="70" height="40" viewBox="0 0 70 40" aria-hidden="true"><path d="M66 34C48 30 26 22 10 6" fill="none" stroke="#5E5E5E" strokeWidth="1.8" strokeLinecap="round" /><path d="M8 16L10 6l10 2" fill="none" stroke="#5E5E5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
      <span className="hand muted" style={{ fontSize: 26, lineHeight: 1.1, whiteSpace: "pre-line" }}>{text}</span>
      {left && (
        <svg width="70" height="40" viewBox="0 0 70 40" aria-hidden="true"><path d="M4 6c18 2 40 10 58 28" fill="none" stroke="#5E5E5E" strokeWidth="1.8" strokeLinecap="round" /><path d="M52 32l10 2-2-10" fill="none" stroke="#5E5E5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="wrap-1200 row wrap g32" style={{ paddingTop: 88, paddingBottom: 112, gap: 64 }}>
          <div className="stack g20" style={{ flex: "1 1 500px", minWidth: 0 }}>
            <span className="eyebrow" style={{ fontSize: 13 }}>Medical bills · insurance · landlords · collectors</span>
            <h1 className="h-xl">They count on you giving up. Take it <em className="o">back</em>.</h1>
            <p className="lede">Snap a photo of the bill, denial or notice. We explain your rights in plain words, write your reply, and keep track until it's settled.</p>
            <div className="row wrap g12" style={{ marginTop: 6 }}>
              <CtaLink href="/login?mode=signup">Start free</CtaLink>
              <Link href="/login" className="btn-plain" style={{ minHeight: 52 }}>I have an account</Link>
            </div>
            <span className="muted small">Works on any phone or computer. Information and self-help tools, not legal advice.</span>
          </div>
          <div style={{ flex: "1 1 380px", minWidth: 0, display: "flex", justifyContent: "center", position: "relative", padding: "20px 0" }}>
            <Note side="left" text={"your day, in\none sentence"} />
            <Note side="right" text={"deadlines,\ncounted for you"} />
            <Phone />
          </div>
        </section>

        <div aria-label="Benefits" style={{ overflow: "hidden", borderTop: "1px solid #EBEBEB", borderBottom: "1px solid #EBEBEB", padding: "18px 0" }}>
          <div className="tick serif" style={{ fontSize: 22, whiteSpace: "nowrap" }}>
            {[...benefits, ...benefits].map((b, i) => (
              <span key={i} aria-hidden={i >= benefits.length} className="row g32">
                <span>{b}</span>
                <span style={{ color: "#BF4F28" }}>·</span>
              </span>
            ))}
          </div>
        </div>

        <section id="features" className="wrap-1200 stack g24" style={{ paddingTop: 120 }}>
          <div className="stack g8">
            <span className="eyebrow" style={{ fontSize: 13 }}>Features</span>
            <h2 className="h-l" style={{ maxWidth: 720 }}>From scary letter to <em className="o">settled</em>.</h2>
          </div>
          <nav aria-label="Jump to a feature" className="chips">
            {features.map((f, i) => (
              <a key={f.id} href={`#${f.id}`} className={`chip${i === 0 ? " on" : ""}`}>{f.title}</a>
            ))}
          </nav>
        </section>
        <div className="carousel" style={{ maxWidth: 1248, margin: "0 auto" }}>
          <div>
            {features.map((f) => (
              <article key={f.id} id={f.id} className="card stack g16" style={{ padding: "14px 14px 22px", borderRadius: 26 }}>
                <Shot kind={f.shot} />
                <div className="stack g8" style={{ padding: "0 8px" }}>
                  <h3 className="serif" style={{ margin: 0, fontSize: 26 }}>{f.title}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: 15 }}>{f.body}</p>
                  {f.shot === "tracker" && <Link href="/features/case-tracker" style={{ fontSize: 14, fontWeight: 500, color: "#A8441F" }}>See how it works</Link>}
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className="wrap-1200 stack g32" style={{ paddingTop: 120, paddingBottom: 120 }}>
          <div className="stack g8">
            <span className="eyebrow" style={{ fontSize: 13 }}>How it works</span>
            <h2 className="h-l">Three steps, <em className="o">no lawyer-speak</em>.</h2>
          </div>
          <ol className="grid-auto" style={{ margin: 0, padding: 0, listStyle: "none", gap: 36 }}>
            {[
              ["Snap the letter", "Answer a few quick questions. That's the hard part done."],
              ["Read what's wrong", "Plain words, your rights and your deadline. Then send the letter we wrote."],
              ["Let us keep watch", "When they reply or go quiet, we help you take the next step."],
            ].map(([t, b], i) => (
              <li key={t} className="stack g8" style={{ borderTop: "1px solid #1A1A1A", paddingTop: 22 }}>
                <span className="serif" style={{ fontSize: 46, lineHeight: 1, color: "#BF4F28" }}>{i + 1}</span>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>{t}</h3>
                <p className="muted" style={{ margin: 0, fontSize: 16 }}>{b}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" style={{ background: "#F5F5F5" }}>
          <div className="wrap-1200 stack g32" style={{ paddingTop: 112, paddingBottom: 112 }}>
            <div className="stack g8">
              <span className="eyebrow" style={{ fontSize: 13 }}>Pricing</span>
              <h2 className="h-l">Keep <em className="o">every dollar</em> you save.</h2>
              <p className="lede">No cut of your savings. Free while we're in early access.</p>
            </div>
            <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              <div className="card stack g12" style={{ padding: 30, borderRadius: 26 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Free</h3>
                <span className="serif" style={{ fontSize: 56, lineHeight: 1 }}>$0</span>
                <p className="muted" style={{ margin: 0, fontSize: 15 }}>Scan, understand and track your fights, with letters written for you.</p>
                <Link href="/login?mode=signup" className="btn-plain" style={{ alignSelf: "flex-start", marginTop: 8, borderColor: "#1A1A1A", minHeight: 48 }}>Start free</Link>
              </div>
              <div className="card stack g12" style={{ padding: 30, borderRadius: 26, border: "2px solid #1A1A1A", position: "relative" }}>
                <span className="tag tag-ink" style={{ position: "absolute", top: -14, left: 26, fontSize: 13, padding: "6px 14px" }}>Coming soon</span>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Premium</h3>
                <span className="serif" style={{ fontSize: 56, lineHeight: 1 }}>$9.99<span className="muted" style={{ fontFamily: "var(--sans)", fontSize: 16 }}> a month</span></span>
                <p className="muted" style={{ margin: 0, fontSize: 15 }}>Or $59 a year. Certified mail, family members and more. Early users get a free trial.</p>
                <CtaLink href="/login?mode=signup">Join free now</CtaLink>
              </div>
            </div>
            <div className="card" style={{ padding: "8px 12px", borderRadius: 26 }}>
              <table className="pt">
                <thead><tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col">Premium</th></tr></thead>
                <tbody>
                  {[
                    ["Scan and plain-English answers", "Included", "Included"],
                    ["Deadline tracking", "Included", "Included"],
                    ["Letters written for you", "Included", "Included"],
                    ["Their replies explained", "Included", "Included"],
                    ["Case packet for legal aid", "Included", "Included"],
                    ["People on your account", "Just you", "Up to 4"],
                    ["Certified mail sent for you", "—", "Coming soon"],
                  ].map(([f, a, b]) => (
                    <tr key={f}><td>{f}</td><td data-label="Free">{a}</td><td data-label="Premium">{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="faq" className="stack g24" style={{ maxWidth: 820, margin: "0 auto", padding: "120px 24px 0" }}>
          <div className="stack g8">
            <span className="eyebrow" style={{ fontSize: 13 }}>Help</span>
            <h2 className="h-l">Good <em className="o">questions</em></h2>
          </div>
          <div className="stack g8">
            {faqs.map(([q, a], i) => (
              <details key={q} className="faq" open={i === 0}>
                <summary>
                  {q}
                  <svg className="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                </summary>
                <p className="muted" style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.6 }}>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <CtaBand title="Got a bill that feels" italic="wrong?" sub="Find out in a minute. It's free to start." />
      </main>
      <SiteFooter />
    </>
  );
}
