import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { BackLink, CtaLink } from "@/components/ui";
import { CATEGORY_INFO } from "@/lib/rules";
import { money, shortDate } from "@/lib/format";
import type { CaseRow } from "@/lib/types";

export default async function WonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const [{ data }, { count: letters }] = await Promise.all([
    supabase.from("cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("letters").select("id", { count: "exact", head: true }).eq("case_id", id).eq("status", "sent"),
  ]);
  if (!data) notFound();
  const c = data as CaseRow;
  const days = c.closed_at ? Math.max(1, Math.round((new Date(c.closed_at).getTime() - new Date(c.created_at).getTime()) / 86400000)) : null;
  const won = c.status === "won" || c.status === "settled";

  return (
    <main className="app-main">
      <BackLink href="/app/cases" />
      <div className="stack g20" style={{ marginTop: 6 }}>
        <div className="stack g8">
          <span className="tag tag-gray" style={{ alignSelf: "flex-start" }}>{CATEGORY_INFO[c.category].label}</span>
          <h1 className="page-title" style={{ fontSize: 38 }}>{won ? <>You took it <em className="o">back</em>.</> : <>Case <em className="o">closed</em>.</>}</h1>
        </div>
        <div className="panel-gray stack center" style={{ alignItems: "center", padding: "26px 22px", position: "relative", borderRadius: 26 }}>
          <span className="small">{c.status === "settled" ? "Settled" : won ? "Saved or recovered" : "Closed"}</span>
          <span className="serif" style={{ fontSize: 72, lineHeight: 1.05 }}>{c.outcome_amount ? money(c.outcome_amount) : "Done"}</span>
          <span className="small muted">{c.title}{c.closed_at ? ` · closed ${shortDate(c.closed_at)}` : ""}</span>
          {won && (
            <div className="paper" style={{ position: "absolute", right: -6, bottom: -26, transform: "rotate(3deg)", padding: "16px 16px 10px" }}>
              <span className="tape" style={{ width: 56, marginLeft: -28 }} />
              <span className="hand" style={{ fontSize: 26 }}>you did that.</span>
            </div>
          )}
        </div>
        <div className="stack" style={{ marginTop: 18 }}>
          <span className="eyebrow" style={{ marginBottom: 4 }}>How it went</span>
          <div className="row between" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB" }}><span>Letters sent</span><span style={{ fontWeight: 500 }}>{letters ?? 0}</span></div>
          {days && <div className="row between" style={{ padding: "12px 0" }}><span>Start to finish</span><span style={{ fontWeight: 500 }}>{days} {days === 1 ? "day" : "days"}</span></div>}
        </div>
        <CtaLink href="/app" variant="orange" block>Back to today</CtaLink>
        <Link href={`/app/cases/${id}/packet`} className="btn-text" style={{ alignSelf: "center" }}>Save a copy of everything</Link>
      </div>
    </main>
  );
}
