import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { BackLink, CtaLink } from "@/components/ui";
import { WriteLetterButton } from "@/components/CaseActions";
import { CATEGORY_INFO } from "@/lib/rules";
import { money, shortDate } from "@/lib/format";
import type { CaseRow, DeadlineRow } from "@/lib/types";

export default async function FoundPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ note?: string }> }) {
  const { id } = await params;
  const { note } = await searchParams;
  const { supabase } = await requireUser();
  const [{ data }, { data: dl }] = await Promise.all([
    supabase.from("cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("deadlines").select("*").eq("case_id", id).eq("owner", "you").eq("done", false).order("due_date").limit(1),
  ]);
  if (!data) notFound();
  const c = data as CaseRow;
  const d = (dl?.[0] || null) as DeadlineRow | null;
  const hasFindings = c.findings?.length > 0;

  return (
    <main className="app-main">
      <div className="row between">
        <BackLink href={`/app/cases/${id}`} />
        <span className="tag tag-orange">{CATEGORY_INFO[c.category].label}</span>
      </div>
      <div className="stack g16" style={{ marginTop: 6 }}>
        <div className="stack g4">
          <h1 className="page-title" style={{ fontSize: 38 }}>What we <em className="o">found</em></h1>
          <span className="muted" style={{ fontSize: 14 }}>{[c.title, c.amount_at_stake ? money(c.amount_at_stake) : null].filter(Boolean).join(" · ")}</span>
        </div>

        {note && <p className="panel-gray" style={{ margin: 0, fontSize: 14 }}>{note}</p>}

        {c.red_flag && (
          <Link href="/app/help" className="panel-orange stack g4" style={{ textDecoration: "none" }}>
            <span className="eyebrow" style={{ color: "#A8441F" }}>Please read this first</span>
            <span style={{ fontSize: 15 }}>{c.red_flag_reason || "This may need a real person quickly."} Tap to find legal aid.</span>
          </Link>
        )}

        {c.summary && <p style={{ margin: 0, fontSize: 17 }}>{c.summary}</p>}

        {c.potential_savings ? (
          <div className="panel-orange stack" style={{ position: "relative" }}>
            <span className="small muted">You may owe up to</span>
            <span className="big-num">{money(c.potential_savings)} less</span>
            <span className="hand" style={{ position: "absolute", right: 16, top: 12, fontSize: 22, color: "#A8441F", transform: "rotate(5deg)" }}>worth a letter</span>
          </div>
        ) : null}

        {hasFindings ? (
          <ol className="stack" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {c.findings.map((f, i) => (
              <li key={i} className="row g12" style={{ padding: "14px 0", borderBottom: i < c.findings.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                <span className="serif" style={{ fontSize: 20, color: "#BF4F28", width: 18 }}>{i + 1}</span>
                <span className="stack g4 grow">
                  <span className="row between g8"><span style={{ fontWeight: 500, fontSize: 15 }}>{f.title}</span>{f.amount ? <span style={{ fontWeight: 500 }}>{money(f.amount)}</span> : null}</span>
                  <span className="muted small">{f.detail}</span>
                  {f.rule_name && <span className="small" style={{ color: "#A8441F", fontWeight: 500 }}>{f.rule_name}</span>}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted" style={{ margin: 0 }}>We didn't spot a clear error, but you can still ask questions, request an itemized bill or appeal. A letter helps either way.</p>
        )}

        {d && (
          <div className="panel-gray row g12" style={{ padding: "12px 14px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            <span style={{ fontSize: 14 }}>{d.title} by <strong style={{ fontWeight: 600 }}>{shortDate(d.due_date)}</strong>. <span className="muted">{d.rule_note}</span></span>
          </div>
        )}

        {c.red_flag ? <CtaLink href="/app/help" variant="orange" block>Find real help now</CtaLink> : <WriteLetterButton caseId={id} kind={c.next_steps?.[0]?.letter_kind || (c.category === "insurance" ? "appeal" : c.category === "debt" ? "validation" : "dispute")} />}
        <p className="muted small center" style={{ margin: 0 }}>Information, not legal advice. Check every date against your own letter.</p>
      </div>
    </main>
  );
}
