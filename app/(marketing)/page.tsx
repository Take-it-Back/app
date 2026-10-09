import Link from "next/link";
import { CtaLink } from "@/components/ui";
import { CtaBand } from "@/components/site";
import { Desktop, Peek, Phone } from "@/components/screens";
import FeatureIcon from "@/components/FeatureIcon";
import { FAQ_GROUPS, FEATURES, PROBLEMS, type ProblemSlug, type ShotKind } from "@/lib/marketing";

const PROBLEM_PEEK: Record<ProblemSlug, { kind: ShotKind; tone: "gray" | "orange" | "ink" }> = {
  "medical-bills": { kind: "found", tone: "orange" },
  "insurance-denials": { kind: "letter", tone: "gray" },
  landlords: { kind: "tracker", tone: "ink" },
  "debt-collectors": { kind: "reply", tone: "orange" },
};

const STEPS = [
  { kind: "scan", s: "medical", title: "Snap the letter", body: "A photo, PDF or screenshot of the bill, denial or notice." },
  { kind: "found", s: "medical", title: "See what's wrong", body: "Plain words, the dollar amount and the rule that backs you up." },
  { kind: "letter", s: "insurance", title: "Send the letter", body: "Firm, polite and written for you. Print, PDF or email." },
  { kind: "tracker", s: "insurance", title: "We keep watch", body: "Your deadlines and theirs, every reply and note in one place." },
  { kind: "reply", s: "renters", title: "Answer their reply", body: "Snap it. We say if it's a win and write the next letter." },
] as const;

export default function Home() {
  return (
    <main>
      <section className="wrap-1200 row wrap" style={{ paddingTop: "clamp(48px, 7vw, 88px)", gap: 56, alignItems: "center" }}>
        <div className="stack g20" style={{ flex: "1 1 480px", minWidth: 0 }}>
          <span className="eyebrow" style={{ fontSize: 13 }}>Fight back against hospitals · insurers · landlords · debt collectors</span>
          <h1 className="h-xl">They count on you giving up. Take it <em className="o">back</em>.</h1>
          <p className="lede">
            Take it back reads the unfair bill, denial or notice you got, tells you what's wrong in plain English, writes the letter to fight it, and tracks every deadline until it's settled.
          </p>
          <div className="row wrap g12" style={{ marginTop: 6 }}>
            <CtaLink href="/login?mode=signup">Start free</CtaLink>
            <Link href="/how-it-works" className="btn-plain" style={{ minHeight: 52 }}>See how it works</Link>
          </div>
          <span className="muted small">Free to start. Works on any phone or computer. Information and self-help tools, not legal advice.</span>
        </div>
        <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, position: "relative" }}>
          <div className="hide-sm" style={{ marginBottom: 40, transform: "rotate(-4deg)" }}><Phone kind="scan" s="medical" size="sm" label="Scanning a hospital bill" /></div>
          <Phone kind="found" s="medical" label="What we found on a hospital bill: $1,762 less" />
          <span className="hand hide-sm" style={{ position: "absolute", left: 0, top: 0, fontSize: 26, transform: "rotate(-5deg)", color: "#A8441F" }}>found in a minute</span>
        </div>
      </section>

      <section className="wrap-1200 stack g24 m-section">
        <div className="stack g8">
          <span className="eyebrow" style={{ fontSize: 13 }}>Who we fight</span>
          <h2 className="h-l" style={{ maxWidth: 860 }}>Four industries that win <em className="o">by default</em>.</h2>
          <p className="lede">Not because they're right, but because their letters are confusing and their deadlines are short. We're on your side against all four.</p>
        </div>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
          {PROBLEMS.map((p) => (
            <Link key={p.slug} href={`/fight/${p.slug}`} className="problem-card">
              <Peek kind={PROBLEM_PEEK[p.slug].kind} s={p.scenario} tone={PROBLEM_PEEK[p.slug].tone} />
              <span className="stack g4" style={{ padding: "0 8px" }}>
                <span className="row g8"><span className="ico o" style={{ width: 32, height: 32, borderRadius: 10 }}><FeatureIcon slug={p.slug} size={16} /></span><span className="serif" style={{ fontSize: 24 }}>{p.name}</span></span>
                <span className="muted" style={{ fontSize: 15 }}>{p.menu}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#A8441F", marginTop: 4 }}>Fight back →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec open">
          <div className="inner row wrap between g16" style={{ marginBottom: 28, alignItems: "flex-end" }}>
            <div className="stack g8">
              <span className="eyebrow" style={{ fontSize: 13 }}>What it does</span>
              <h2 className="h-l">From scary letter to <em className="o">settled</em>.</h2>
            </div>
            <Link href="/how-it-works" className="btn-plain">Walk through a full case</Link>
          </div>
          <div className="strip">
            <div>
              {STEPS.map((st, i) => (
                <figure key={st.title}>
                  <Phone kind={st.kind} s={st.s} size="sm" label={st.title} />
                  <figcaption className="stack g4">
                    <span className="row g8"><span className="serif" style={{ fontSize: 26, color: "#BF4F28", lineHeight: 1 }}>{i + 1}</span><span style={{ fontWeight: 500, fontSize: 17 }}>{st.title}</span></span>
                    <span className="muted">{st.body}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="m-section">
        <div className="panel-sec ink">
          <div className="inner stack g24">
            <div className="row wrap between g16" style={{ alignItems: "flex-end" }}>
              <div className="stack g8">
                <span className="eyebrow" style={{ fontSize: 13, color: "#F0A07E" }}>Features</span>
                <h2 className="h-l">Everything in <em style={{ color: "#F0A07E" }}>one</em> place.</h2>
              </div>
              <CtaLink href="/features" variant="light">All features</CtaLink>
            </div>
            <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
              {FEATURES.map((f) => (
                <Link key={f.slug} href={`/features/${f.slug}`} className="card-ink">
                  <span className="row between">
                    <span className="ico o"><FeatureIcon slug={f.slug} /></span>
                    {f.plan === "premium" ? <span className="pill-pro">Premium</span> : f.plan === "free" ? <span className="pill-free">Free</span> : <span className="pill-free">Free + Premium</span>}
                  </span>
                  <span className="serif" style={{ fontSize: 24 }}>{f.name}</span>
                  <span style={{ fontSize: 15, color: "#BDBDBD" }}>{f.short}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="m-section">
        <div>
          <div className="wrap-1200 row wrap g32" style={{ alignItems: "center", gap: 48 }}>
            <div className="stack g16" style={{ flex: "1 1 320px" }}>
              <span className="eyebrow" style={{ fontSize: 13 }}>Phone and computer</span>
              <h2 className="h-l" style={{ fontSize: "clamp(34px, 3.8vw, 50px)" }}>Snap it on your phone. <em className="o">Finish</em> it at your desk.</h2>
              <p className="lede" style={{ fontSize: 17 }}>Your cases sync everywhere. Edit letters on a big screen, print your case packet, and see every fight at a glance.</p>
            </div>
            <div className="shot-stage" style={{ flex: "2 1 520px", minWidth: 0, display: "block", padding: "clamp(20px, 3vw, 40px)" }}><Desktop s="insurance" /></div>
          </div>
        </div>
      </section>

      <section className="wrap-1200 stack g24 m-section">
        <div className="stack g8">
          <span className="eyebrow" style={{ fontSize: 13 }}>Pricing</span>
          <h2 className="h-l">Start free. Upgrade when you're ready to <em className="o">fight</em>.</h2>
        </div>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div className="card stack g12" style={{ padding: 30, borderRadius: 26 }}>
            <span style={{ fontWeight: 500, fontSize: 18 }}>Free</span>
            <span className="serif" style={{ fontSize: 52, lineHeight: 1 }}>$0</span>
            <p className="muted" style={{ margin: 0 }}>Know where you stand. 3 scans a month, a plain-English summary, general next steps and red flags.</p>
            <Link href="/login?mode=signup" className="btn-plain" style={{ alignSelf: "flex-start", minHeight: 48, borderColor: "#1A1A1A" }}>Start free</Link>
          </div>
          <div className="card stack g12" style={{ padding: 30, borderRadius: 26, border: "2px solid #BF4F28" }}>
            <span style={{ fontWeight: 500, fontSize: 18 }}>Premium</span>
            <span className="serif" style={{ fontSize: 52, lineHeight: 1 }}>$9.99<span className="muted" style={{ fontFamily: "var(--sans)", fontSize: 16 }}> a month</span></span>
            <p className="muted" style={{ margin: 0 }}>We do the work. Letters written for you, every deadline tracked, replies explained. Or $59 a year.</p>
            <CtaLink href="/pricing" variant="orange">Try 7 days free</CtaLink>
          </div>
        </div>
      </section>

      <section className="wrap-1200 m-section">
        <div className="trust">
          {[
            ["100%", "You keep 100%", "We never take a cut of what you save or recover."],
            ["0", "Ads, ever", "Your documents are never sold or used for ads. Delete everything anytime."],
            ["Free", "Real help, always", "We're not a law firm. Court dates and lawsuits go straight to real help, free."],
          ].map(([n, t, b]) => (
            <div key={t}>
              <span className="num">{n}</span>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>{t}</h3>
              <p className="muted" style={{ margin: 0, fontSize: 16 }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stack g24 m-section" style={{ maxWidth: 820, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <div className="stack g8">
          <span className="eyebrow" style={{ fontSize: 13 }}>Questions</span>
          <h2 className="h-l">Good <em className="o">questions</em></h2>
        </div>
        <div className="stack g8">
          {[...FAQ_GROUPS[0].items, FAQ_GROUPS[1].items[2]].map(([q, a], i) => (
            <details key={q} className="faq" open={i === 0}>
              <summary>
                {q}
                <svg className="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
              </summary>
              <p className="muted" style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.6 }}>{a}</p>
            </details>
          ))}
        </div>
        <Link href="/faq" style={{ fontWeight: 500 }}>More questions →</Link>
      </section>

      <CtaBand title="Got a bill that feels" italic="wrong?" sub="Find out where you stand in a minute. It's free to start." />
    </main>
  );
}
