import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import { BackLink } from "@/components/ui";
import Upsell from "@/components/Upsell";
import { SCRIPTS } from "@/lib/scripts";
import { logCall } from "@/lib/actions";
import { shortDate } from "@/lib/format";
import type { CaseRow, EventRow } from "@/lib/types";

export default async function CallsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: cd }, { data: ev }, premium] = await Promise.all([
    supabase.from("cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("events").select("*").eq("case_id", id).eq("kind", "call").order("happened_at", { ascending: false }),
    getCasePremium(supabase, user.id, id),
  ]);
  if (!cd) notFound();
  const c = cd as CaseRow;
  const s = SCRIPTS[c.category] || SCRIPTS.other;
  const calls = (ev || []) as EventRow[];

  return (
    <main className="app-main">
      <BackLink href={`/app/cases/${id}`} />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>Before you <em className="o">call</em></h1>
        <span className="muted" style={{ fontSize: 15 }}>{c.counterparty || c.title}</span>
      </div>

      <div className="stack g24">
        <section>
          <div className="sec-head"><h2>Have ready</h2></div>
          <ul className="band stack" style={{ margin: 0, listStyle: "none", padding: "10px 18px" }}>
            {s.before.map((b) => <li key={b} className="row g8" style={{ padding: "6px 0", fontSize: 15 }}><span style={{ color: "#BF4F28" }}>✓</span>{b}</li>)}
          </ul>
        </section>

        <section>
          <div className="sec-head"><h2>Say this first</h2></div>
          <p className="panel-orange" style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>&ldquo;{s.open}&rdquo;</p>
        </section>

        <section>
          <div className="sec-head"><h2>Ask</h2></div>
          <ol className="card stack" style={{ margin: 0, padding: "6px 18px", listStyle: "none" }}>
            {s.ask.map((q, i) => (
              <li key={q} className="row g12" style={{ padding: "12px 0", borderBottom: i < s.ask.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                <span className="serif" style={{ fontSize: 20, color: "#BF4F28", width: 18 }}>{i + 1}</span>
                <span style={{ fontSize: 15 }}>{q}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <div className="sec-head"><h2>Don&apos;t</h2></div>
          <ul className="card stack" style={{ margin: 0, padding: "6px 18px", listStyle: "none", borderColor: "#F3D5C8" }}>
            {s.avoid.map((a, i) => <li key={a} className="row g8" style={{ padding: "10px 0", borderBottom: i < s.avoid.length - 1 ? "1px solid #EBEBEB" : 0, fontSize: 15, alignItems: "flex-start" }}><span style={{ color: "#A8441F", fontWeight: 700 }}>✕</span>{a}</li>)}
          </ul>
        </section>

        <section>
          <div className="sec-head"><h2>To finish</h2></div>
          <p className="panel-gray" style={{ margin: 0, fontSize: 16 }}>&ldquo;{s.close}&rdquo;</p>
        </section>

        <section>
          <div className="sec-head"><h2>Log this call</h2></div>
          {!premium ? (
            <Upsell compact title="Keep a record of every call, with follow-up reminders" />
          ) : (
            <form action={logCall.bind(null, id)} className="card stack g12">
              {saved && <p className="notice" role="status">Call saved to your timeline.</p>}
              <label className="field"><span>Who you spoke to</span><input name="rep" className="input" placeholder="e.g. Dana in billing" /></label>
              <label className="field"><span>Reference number</span><input name="ref" className="input" placeholder="e.g. 88213" /></label>
              <label className="field"><span>What they said or promised</span><textarea name="detail" className="input" rows={3} placeholder="e.g. Will remove the duplicate charge within 2 weeks" /></label>
              <label className="field"><span>Follow up by (optional)</span><input name="follow" type="date" className="input" style={{ maxWidth: 220 }} /></label>
              <button className="btn-plain" style={{ alignSelf: "flex-start", background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Save call</button>
            </form>
          )}
        </section>

        {calls.length > 0 && (
          <section>
            <div className="sec-head"><h2>Past calls <span className="n">{calls.length}</span></h2></div>
            <div className="card" style={{ padding: "4px 18px" }}>
              {calls.map((e) => (
                <div key={e.id} className="list-row" style={{ alignItems: "flex-start" }}>
                  <span className="stack grow"><span style={{ fontWeight: 500 }}>{e.title}</span>{e.detail && <span className="muted small" style={{ whiteSpace: "pre-wrap" }}>{e.detail}</span>}</span>
                  <span className="muted small">{shortDate(e.happened_at)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        <p className="muted small">General information, not legal advice. Some states require consent to record calls; take notes instead.</p>
      </div>
    </main>
  );
}
