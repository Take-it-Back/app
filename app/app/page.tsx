import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
import { CtaLink, PlusIcon } from "@/components/ui";
import Greeting from "@/components/Greeting";
import CaseRowLink from "@/components/CaseRowLink";
import { daysUntil } from "@/lib/rules";
import { firstName, money, relDays } from "@/lib/format";
import type { CaseRow, DeadlineRow } from "@/lib/types";
import { getPlan } from "@/lib/plan";
import Upsell from "@/components/Upsell";
import InstallPrompt from "@/components/InstallPrompt";

export default async function Today({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const { upgraded } = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: profile }, { data: casesData }, { data: dlData }, { data: letters }, plan] = await Promise.all([
    supabase.from("profiles").select("full_name, morning_briefing").eq("id", user.id).maybeSingle(),
    supabase.from("cases").select("*").order("updated_at", { ascending: false }),
    supabase.from("deadlines").select("*").eq("done", false).order("due_date"),
    supabase.from("letters").select("id, case_id, status").eq("status", "draft").order("created_at", { ascending: false }),
    getPlan(supabase, user.id),
  ]);
  const toast = upgraded ? <p className="notice" role="status" style={{ marginTop: 0 }}>Welcome to Premium. Letters, deadlines and reply help are now switched on.</p> : null;
  const cases = (casesData || []) as CaseRow[];
  const deadlines = (dlData || []) as DeadlineRow[];
  const name = firstName(profile?.full_name);
  const open = cases.filter((c) => !["won", "settled", "closed"].includes(c.status));
  const won = cases.filter((c) => c.status === "won" || c.status === "settled");
  const takenBack = won.reduce((s, c) => s + Number(c.outcome_amount || 0), 0);
  const inPlay = open.reduce((s, c) => s + Number(c.amount_at_stake || 0), 0);
  const nextYours = deadlines.find((d) => d.owner === "you");
  const nextTheirs = deadlines.find((d) => d.owner === "them");
  const byCase = new Map<string, DeadlineRow>();
  deadlines.forEach((d) => !byCase.has(d.case_id) && byCase.set(d.case_id, d));
  const caseOf = (id?: string) => cases.find((c) => c.id === id);
  const draftCase = letters?.length ? caseOf(letters[0].case_id) : undefined;
  const needsHelp = open.find((c) => c.status === "needs_help");

  let briefing = "Nothing needs you today. Enjoy it.";
  const bits: string[] = [];
  if (needsHelp) bits.push(`${needsHelp.title} may need a real person — please look today`);
  else if (draftCase) bits.push(`your letter for ${draftCase.title} is ready to send`);
  else if (nextYours) bits.push(`${nextYours.title.toLowerCase()} for ${caseOf(nextYours.case_id)?.title || "a case"} in ${relDays(daysUntil(nextYours.due_date))}`);
  if (nextTheirs) {
    const party = caseOf(nextTheirs.case_id)?.counterparty || caseOf(nextTheirs.case_id)?.title || "The other side";
    bits.push(`${party} owes you a reply by ${new Date(nextTheirs.due_date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`);
  }
  if (bits.length) briefing = bits.join(", and ").replace(/^./, (s) => s.toUpperCase()) + ".";

  if (!cases.length) {
    return (
      <main className="app-main">
        <div className="page-head">
          <h1 className="page-title">Today</h1>
          <Link href="/app/scan" aria-label="Add a document" className="icon-btn"><PlusIcon /></Link>
        </div>
        {toast}
        <InstallPrompt />
        <div className="card stack g8"><Greeting name={name} style={{ fontSize: 22 }} /><p style={{ margin: 0 }}>Nothing needs you today. Enjoy it.</p></div>
        <div className="stack g12 center" style={{ alignItems: "center", marginTop: 72 }}>
          <svg width="120" height="88" viewBox="0 0 120 88" aria-hidden="true"><path d="M14 52h92l-8 28H22z" fill="#fff" stroke="#1A1A1A" strokeWidth="1.8" strokeLinejoin="round" /><path d="M14 52l10-16h72l10 16" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinejoin="round" /><path d="M44 52a16 6 0 0 0 32 0" fill="none" stroke="#1A1A1A" strokeWidth="1.8" /><circle cx="92" cy="18" r="8" fill="#FDEEE7" stroke="#BF4F28" strokeWidth="1.8" /></svg>
          <span className="hand" style={{ fontSize: 34, lineHeight: 1 }}>a clear desk</span>
          <p className="muted" style={{ margin: 0, maxWidth: 300 }}>When a bill, denial or notice shows up, snap it and we'll take it from there.</p>
          <div style={{ marginTop: 8 }}><CtaLink href="/app/scan" variant="orange">Scan your first document</CtaLink></div>
        </div>
      </main>
    );
  }

  const cta = needsHelp
    ? { href: `/app/cases/${needsHelp.id}`, label: "See what to do now" }
    : draftCase
      ? { href: `/app/cases/${draftCase.id}/letter`, label: `Review your ${draftCase.title.split(" · ")[0]} letter` }
      : nextYours
        ? { href: `/app/cases/${nextYours.case_id}`, label: `Open ${caseOf(nextYours.case_id)?.title.split(" · ")[0] || "your case"}` }
        : { href: "/app/scan", label: "Scan a new document" };

  return (
    <main className="app-main wide">
      <div className="page-head">
        <h1 className="page-title">Today</h1>
        <Link href="/app/scan" aria-label="Add a document" className="icon-btn"><PlusIcon /></Link>
      </div>

      <div className="stack g20">
        {toast}
        <InstallPrompt />
        {profile?.morning_briefing !== false && (
          <div className="card stack g8" style={{ borderRadius: 24 }}>
            <Greeting name={name} style={{ fontSize: 24 }} />
            <p style={{ margin: 0, fontSize: 17 }}>{briefing}</p>
          </div>
        )}

        <div className="stats">
          <div className="panel-orange stack">
            <span className="small" style={{ color: "#A8441F" }}>Next deadline</span>
            <span className="big-num">{nextYours ? relDays(daysUntil(nextYours.due_date)) : "—"}</span>
            <span className="small muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextYours ? caseOf(nextYours.case_id)?.title : "Nothing due"}</span>
          </div>
          <div className="panel-gray stack">
            <span className="small">Taken back</span>
            <span className="big-num">{money(takenBack)}</span>
            <span className="small muted">from {won.length} {won.length === 1 ? "win" : "wins"}</span>
          </div>
          <div className="card stack" style={{ borderRadius: 22 }}>
            <span className="small muted">Open fights</span>
            <span className="big-num">{open.length}</span>
          </div>
          <div className="card stack" style={{ borderRadius: 22 }}>
            <span className="small muted">Still in play</span>
            <span className="big-num">{money(inPlay)}</span>
          </div>
        </div>

        <div style={{ maxWidth: 520 }}>
          <CtaLink href={cta.href} variant="orange" block>{cta.label}</CtaLink>
        </div>

        <nav aria-label="Shortcuts" className="quick">
          <Link href="/app/scan" className="o">+ Scan a document</Link>
          <Link href="/app/help">Get real help</Link>
          <Link href="/app/dates">All dates</Link>
          <Link href="/app/tools">Tools</Link>
        </nav>

        {!plan.premium && <Upsell compact title="Let Premium write the letters and keep every date" />}

        <div className="split">
          <section className="a">
            <div className="sec-head"><h2>Your fights <span className="n">{open.length}</span></h2><Link href="/app/cases">See all</Link></div>
            <div className="card" style={{ padding: "4px 18px" }}>
              {open.slice(0, 8).map((c) => <CaseRowLink key={c.id} c={c} deadline={byCase.get(c.id)} />)}
              {!open.length && <p className="muted">No open fights. Nice.</p>}
            </div>
          </section>
          <section className="b">
            <div className="sec-head"><h2>Coming up</h2><Link href="/app/dates">Calendar</Link></div>
            <div className="band">
              {deadlines.slice(0, 5).map((d) => {
                const n = daysUntil(d.due_date);
                return (
                  <Link key={d.id} href={`/app/cases/${d.case_id}`} className="list-row">
                    <span className="serif" style={{ width: 52, fontSize: 26, lineHeight: 1, color: d.owner === "you" && n <= 3 ? "#A8441F" : "#1A1A1A" }}>{n < 0 ? "late" : `${n}d`}</span>
                    <span className="stack grow" style={{ minWidth: 0 }}><span style={{ fontWeight: 500, fontSize: 15 }}>{d.title}</span><span className="muted small">{caseOf(d.case_id)?.title}</span></span>
                    <span className={`tag ${d.owner === "you" ? "tag-orange" : "tag-gray"}`}>{d.owner === "you" ? "Yours" : "Theirs"}</span>
                  </Link>
                );
              })}
              {!deadlines.length && <p className="muted">No dates coming up.</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
