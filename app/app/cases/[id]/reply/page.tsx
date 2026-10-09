import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import Upsell from "@/components/Upsell";
import { BackLink } from "@/components/ui";
import { WriteLetterButton } from "@/components/CaseActions";
import { shortDate } from "@/lib/format";
import type { ReplyAnalysis } from "@/lib/ai";

export default async function ReplyPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ doc?: string; note?: string }> }) {
  const { id } = await params;
  const { doc, note } = await searchParams;
  const { supabase, user } = await requireUser();
  if (!(await getCasePremium(supabase, user.id, id))) {
    return (
      <main className="app-main">
        <BackLink href={`/app/cases/${id}`} />
        <h1 className="page-title" style={{ fontSize: 38, margin: "6px 0 20px" }}>Their <em className="o">reply</em></h1>
        <Upsell title="We'll read their reply for you" body="Premium explains what they said, whether it's a win, and writes your next letter." />
      </main>
    );
  }
  let q = supabase.from("documents").select("id, analysis, created_at").eq("case_id", id).eq("kind", "reply");
  q = doc ? q.eq("id", doc) : q.order("created_at", { ascending: false }).limit(1);
  const [{ data: docs }, { data: c }] = await Promise.all([q, supabase.from("cases").select("title, category, red_flag").eq("id", id).maybeSingle()]);
  if (!c) notFound();
  const d = docs?.[0];
  const a = (d?.analysis || null) as ReplyAnalysis | null;

  return (
    <main className="app-main">
      <div className="row between">
        <BackLink href={`/app/cases/${id}`} />
        {d && <span className="muted small">Added {shortDate(d.created_at)}</span>}
      </div>
      <div className="stack g16" style={{ marginTop: 6 }}>
        <div className="stack g4">
          <h1 className="page-title" style={{ fontSize: 38 }}>Their <em className="o">reply</em>, in plain words</h1>
          <span className="muted small">{c.title}</span>
        </div>
        {note && <p className="panel-gray" style={{ margin: 0, fontSize: 14 }}>{note}</p>}
        {a ? (
          <>
            {a.red_flag && (
              <Link href="/app/help" className="panel-orange stack g4" style={{ textDecoration: "none" }}>
                <span className="eyebrow" style={{ color: "#A8441F" }}>This may need a real person</span>
                <span style={{ fontSize: 15 }}>{a.red_flag_reason}</span>
              </Link>
            )}
            <div className="stack">
              {[["What it says", a.what_it_says], ["What's missing", a.whats_missing], ["What it means", a.what_it_means]].filter(([, v]) => v).map(([k, v], i, arr) => (
                <div key={k} className="stack g4" style={{ padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #EBEBEB" : 0 }}>
                  <span className="eyebrow">{k}</span>
                  <p style={{ margin: 0, fontSize: 16 }}>{v}</p>
                </div>
              ))}
            </div>
            {a.outcome === "won" ? (
              <div className="paper" style={{ alignSelf: "center", padding: "24px 20px 18px", transform: "rotate(1.5deg)", maxWidth: 300 }}>
                <span className="tape" />
                <span className="hand" style={{ fontSize: 26 }}>looks like you won! close the case on the case page.</span>
              </div>
            ) : (
              <span className="hand muted" style={{ fontSize: 24, alignSelf: "center" }}>a “no” on round one is normal — keep going</span>
            )}
            {a.next_steps?.length > 0 && (
              <section className="card">
                <span className="eyebrow">Your next step</span>
                <ol className="stack" style={{ margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                  {a.next_steps.map((s, i) => (
                    <li key={i} className="row g12" style={{ padding: "12px 0", borderBottom: i < a.next_steps.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                      <span className="serif" style={{ fontSize: 20, color: i === 0 ? "#BF4F28" : "#5E5E5E", width: 16 }}>{i + 1}</span>
                      <span className="stack g4"><span style={{ fontWeight: 500 }}>{s.title}</span><span className="muted small">{s.detail}</span></span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {a.outcome !== "won" && <WriteLetterButton caseId={id} kind={a.next_steps?.[0]?.letter_kind || "followup"} label="Write my next letter" />}
          </>
        ) : (
          <p className="muted" style={{ margin: 0 }}>We saved their reply to your case. When automatic reading is on, we'll explain it here.</p>
        )}
        <Link href={`/app/cases/${id}`} className="btn-plain" style={{ alignSelf: "center" }}>Back to the case</Link>
      </div>
    </main>
  );
}
