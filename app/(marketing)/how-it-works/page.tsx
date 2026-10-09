import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site";
import { Desktop, Phone } from "@/components/screens";
import { PageHead } from "@/components/Faq";
import type { ScenarioKey, ShotKind } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "How it works",
  description: "Snap the letter, see what's wrong, send the letter we write, and let us track every deadline and reply until it's settled.",
};

const STEPS: { n: string; title: string; italic: string; body: string; points: string[]; shots: [ShotKind, ScenarioKey][]; plan: string }[] = [
  { n: "1", title: "Snap the", italic: "letter", body: "Take a photo of the bill, denial or notice, or upload a PDF. Then answer three quick questions about your state, insurance and when it arrived.", points: ["Photos, PDFs and screenshots", "Several pages at once", "About a minute, start to finish"], shots: [["scan", "insurance"], ["questions", "insurance"]], plan: "Free and Premium" },
  { n: "2", title: "See where you", italic: "stand", body: "We read every line and explain what's going on in plain words: what looks wrong, what you may be owed, and your deadline.", points: ["A two-sentence summary", "Problems found, with the rule behind each", "Court dates and lawsuits flagged first"], shots: [["free", "insurance"], ["found", "insurance"]], plan: "Summary free · full details in Premium" },
  { n: "3", title: "Send the", italic: "letter", body: "We write a firm, polite letter that names the right rules. Edit anything, ask for a rewrite, then print, save as PDF or email it.", points: ["Disputes, appeals, demands, validation requests", "Built from your whole case", "Mark it sent to start their clock"], shots: [["letter", "insurance"]], plan: "Premium" },
  { n: "4", title: "We keep", italic: "watch", body: "Your case file tracks your deadlines and theirs, and emails you before anything is due. Add calls and notes as you go.", points: ["Both clocks, counted down", "Email reminders", "A dated timeline of everything"], shots: [["tracker", "insurance"], ["dates", "insurance"]], plan: "Premium" },
  { n: "5", title: "Answer their", italic: "reply", body: "When they write back, snap it. We tell you if it's a win, what they skipped, and write your next letter. If it needs a person, we'll find you help.", points: ["Win, partial or no, in one word", "Follow-ups and second appeals", "A printable case packet for legal aid"], shots: [["reply", "insurance"], ["packet", "insurance"]], plan: "Premium" },
];

export default function HowItWorks() {
  return (
    <main>
      <PageHead eyebrow="How it works" title="One denied MRI, from letter to" italic="settled" after="." lede="Here's how a real kind of fight plays out in Take it back, screen by screen. The same steps work for bills, landlords and collectors." />

      {STEPS.map((st, i) => (
        <section key={st.n} className="m-section">
          <div className="panel-sec open">
          <div className="inner row wrap" style={{ gap: 48, alignItems: "center", flexDirection: i % 2 ? "row-reverse" : "row" }}>
            <div className="stack g16" style={{ flex: "1 1 400px", minWidth: 0 }}>
              <span className="row g12"><span className="serif" style={{ fontSize: 64, lineHeight: 0.9, color: "#BF4F28" }}>{st.n}</span><span className={st.plan === "Premium" ? "pill-pro" : "pill-free"} style={{ marginLeft: 0 }}>{st.plan}</span></span>
              <h2 className="h-l" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>{st.title} <em className="o">{st.italic}</em></h2>
              <p className="lede" style={{ fontSize: 17 }}>{st.body}</p>
              <ul className="stack g8" style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {st.points.map((p) => (
                  <li key={p} className="row g8"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BF4F28" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>{p}</li>
                ))}
              </ul>
            </div>
            <div className={`shot-stage${i % 2 ? "" : " orange"}`} style={{ flex: "1 1 460px", minWidth: 0 }}>
              {st.shots.map(([k, s], j) => (
                <div key={k} className={j > 0 ? "side" : undefined} style={j > 0 ? { transform: "rotate(3deg)" } : undefined}>
                  <Phone kind={k} s={s} size={j > 0 ? "sm" : "md"} label={`Step ${st.n}: ${k}`} />
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>
      ))}

      <section className="m-section">
        <div className="panel-sec open">
        <div className="inner stack g20">
        <h2 className="h-l" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>And on your <em className="o">computer</em></h2>
        <Desktop s="insurance" />
        <p className="muted" style={{ margin: 0 }}>Everything syncs. <Link href="/features">See every feature</Link> or <Link href="/pricing">compare plans</Link>.</p>
        </div>
        </div>
      </section>

      <CtaBand title="Ready for round" italic="one?" sub="Scan your letter free and see where you stand." />
    </main>
  );
}
