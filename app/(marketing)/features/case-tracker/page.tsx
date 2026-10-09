import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand, SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "Case tracker",
  description: "Every fight, from first letter to finished. Your deadlines and theirs, every reply and receipt, in one place.",
};

export default function CaseTrackerPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="wrap-1200 stack g16" style={{ paddingTop: 72 }}>
          <Link href="/#features" className="muted" style={{ fontSize: 14, textDecoration: "none", padding: "10px 0", alignSelf: "flex-start" }}>← All features</Link>
          <span className="eyebrow" style={{ fontSize: 13 }}>Case tracker</span>
          <h1 className="h-xl" style={{ maxWidth: 860, fontSize: "clamp(44px, 5.4vw, 70px)" }}>Every fight, from first letter to <em className="o">finished</em>.</h1>
          <p className="lede">Companies count on you losing track. Your case file remembers every date, letter and reply, so you don't have to.</p>
        </section>

        <section className="wrap-1200" style={{ paddingTop: 56 }}>
          <div style={{ position: "relative", background: "#F3F3F3", borderRadius: 32, padding: "56px 24px", display: "flex", justifyContent: "center" }}>
            <div className="hide-sm" style={{ position: "absolute", left: "8%", top: 120, transform: "rotate(-3deg)", textAlign: "right" }}>
              <span className="hand" style={{ fontSize: 28, lineHeight: 1.1, display: "block" }}>your deadline<br />and theirs</span>
              <svg width="90" height="44" viewBox="0 0 90 44" aria-hidden="true"><path d="M4 6c26 2 52 12 80 30" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" /><path d="M72 36l12 0-4-11" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="hide-sm" style={{ position: "absolute", right: "8%", bottom: 150, transform: "rotate(3deg)" }}>
              <svg width="90" height="44" viewBox="0 0 90 44" aria-hidden="true"><path d="M86 38C60 34 30 24 8 6" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" /><path d="M6 17L8 6l11 2" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="hand" style={{ fontSize: 28, lineHeight: 1.1, display: "block" }}>every step,<br />with proof</span>
            </div>
            <div role="img" aria-label="Case tracker screen" style={{ width: 320, height: 660, borderRadius: 48, background: "#1A1A1A", padding: 10, boxShadow: "0 6px 12px rgba(26,26,26,0.1)" }}>
              <div className="stack g12" style={{ width: "100%", height: "100%", borderRadius: 38, background: "#fff", padding: "34px 20px" }}>
                <span className="tag tag-gray" style={{ alignSelf: "flex-start" }}>Insurance denial</span>
                <span className="serif" style={{ fontSize: 28, lineHeight: 1.05 }}>Summit Health Plan</span>
                <span className="muted small">MRI coverage · $2,950 at stake</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                  {["#1A1A1A", "#1A1A1A", "#BF4F28", "#EBEBEB"].map((c, i) => <span key={i} style={{ height: 4, borderRadius: 2, background: c }} />)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#FDEEE7", borderRadius: 16, padding: 12 }}><span style={{ display: "block", fontSize: 11, color: "#A8441F" }}>You send by Oct 11</span><span className="serif" style={{ fontSize: 30 }}>2 days</span></div>
                  <div style={{ border: "1px solid #EBEBEB", borderRadius: 16, padding: 12 }}><span className="muted" style={{ display: "block", fontSize: 11 }}>Then they have</span><span className="serif" style={{ fontSize: 30 }}>30 days</span></div>
                </div>
                <div className="stack g12" style={{ fontSize: 13.5, marginTop: 4 }}>
                  {[["Today", "Second appeal drafted"], ["Oct 3", "Their reply: denial upheld"], ["Sep 8", "First appeal delivered"], ["Sep 2", "Denial letter scanned"]].map(([d, t], i) => (
                    <span key={t} className="row g12" style={{ alignItems: "flex-start" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 5, background: i === 0 ? "#BF4F28" : "#1A1A1A", marginTop: 4, flex: "none" }} />
                      <span className="stack"><span className="muted" style={{ fontSize: 11 }}>{d}</span>{t}</span>
                    </span>
                  ))}
                </div>
                <span style={{ marginTop: "auto", background: "#BF4F28", color: "#fff", borderRadius: 999, padding: "14px 18px", fontSize: 14, fontWeight: 500 }}>Review second appeal</span>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap-1200 row wrap g32" style={{ paddingTop: 112, paddingBottom: 96, alignItems: "flex-start", gap: 56 }}>
          <div className="stack g16" style={{ flex: "1 1 420px" }}>
            <span className="eyebrow" style={{ fontSize: 13 }}>The story</span>
            <h2 className="serif" style={{ margin: 0, fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: 1.1 }}>Round one is rarely the <em className="o">last</em> round.</h2>
            <p className="lede" style={{ fontSize: 17 }}>A denial gets upheld. A landlord goes quiet. A collector sends the same letter again. That's usually when people give up.</p>
            <p className="lede" style={{ fontSize: 17 }}>Your case file keeps going. It knows what you sent and when they owe you an answer. When they reply, snap it and we'll explain it and help with the next letter.</p>
          </div>
          <ul className="stack" style={{ flex: "1 1 360px", margin: 0, padding: 0, listStyle: "none" }}>
            {[
              ["Both clocks, counted", "Your deadlines and theirs, front and center."],
              ["The next letter, ready", "Scan their reply and we draft your answer from the whole history."],
              ["One packet for help", "Hand legal aid a tidy printout of everything, in one tap."],
            ].map(([t, b], i) => (
              <li key={t} className="row g16" style={{ padding: "20px 0", borderBottom: i < 2 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                <span className={`ico${i === 1 ? " o" : ""}`} style={{ width: 44, height: 44 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{i === 0 ? <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> : i === 1 ? <><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></> : <><path d="M6 3h9l3 3v15H6z" /><path d="M9 12h6" /><path d="M9 16h4" /></>}</svg>
                </span>
                <span className="stack g4"><span style={{ fontWeight: 500, fontSize: 18 }}>{t}</span><span className="muted" style={{ fontSize: 15 }}>{b}</span></span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ background: "#F3F3F3" }}>
          <div className="wrap-1200 stack g24" style={{ paddingTop: 96, paddingBottom: 96 }}>
            <div className="stack g8">
              <span className="eyebrow" style={{ fontSize: 13 }}>Related</span>
              <h2 className="serif" style={{ margin: 0, fontSize: "clamp(32px, 3.6vw, 46px)" }}>Works <em className="o">well</em> with</h2>
            </div>
            <div className="grid-auto">
              {[["Deadline keeper", "Every date, counted down."], ["Ready letters", "Firm, polite, ready to send."], ["Real help", "When it needs a person."]].map(([t, b]) => (
                <Link key={t} href="/#features" className="card stack g8" style={{ textDecoration: "none", padding: 24 }}>
                  <span className="serif" style={{ fontSize: 24 }}>{t}</span>
                  <span className="muted" style={{ fontSize: 15 }}>{b}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CtaBand title="Start your first case" italic="today." />
      </main>
      <SiteFooter />
    </>
  );
}
