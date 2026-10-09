import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import Upsell from "@/components/Upsell";
import { BackLink } from "@/components/ui";
import { WriteLetterButton } from "@/components/CaseActions";
import LetterEditor from "./LetterEditor";
import type { LetterRow } from "@/lib/types";
import { shortDate } from "@/lib/format";

export default async function LetterPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ id?: string; note?: string }> }) {
  const { id } = await params;
  const { id: letterId, note } = await searchParams;
  const { supabase, user } = await requireUser();
  if (!(await getCasePremium(supabase, user.id, id))) {
    return (
      <main className="app-main">
        <BackLink href={`/app/cases/${id}`} />
        <h1 className="page-title" style={{ fontSize: 38, margin: "6px 0 20px" }}>Your <em className="o">letter</em></h1>
        <Upsell title="Want us to write the letter?" body="Premium drafts a firm, polite letter that cites the right rules, ready to print or email." />
      </main>
    );
  }
  const { data: c } = await supabase.from("cases").select("id, title, category").eq("id", id).maybeSingle();
  if (!c) notFound();
  let q = supabase.from("letters").select("*").eq("case_id", id);
  q = letterId ? q.eq("id", letterId) : q.order("created_at", { ascending: false }).limit(1);
  const { data } = await q;
  const letter = (data?.[0] || null) as LetterRow | null;
  const { data: sends } = letter ? await supabase.from("sends").select("id, method, status, error, created_at, to_name, fax_number").eq("letter_id", letter.id).order("created_at", { ascending: false }) : { data: [] };

  return (
    <main className="app-main">
      <div className="row between">
        <BackLink href={`/app/cases/${id}`} />
        {letter && <Link href={`/app/cases/${id}/letter/print?id=${letter.id}`} className="btn-plain" target="_blank">Print or save PDF</Link>}
      </div>
      <h1 className="page-title" style={{ fontSize: 38, margin: "6px 0 16px" }}>Your <em className="o">letter</em></h1>
      {note && <p className="panel-gray" style={{ margin: "0 0 16px", fontSize: 14 }}>{note}</p>}
      {letter ? (
        <div className="stack g20">
          <LetterEditor letter={letter} caseId={id} />
          {(sends || []).filter((x) => x.status !== "pending_payment").map((x) => (
            <div key={x.id} className={x.status === "failed" ? "panel-orange stack g8" : "panel-gray stack g4"}>
              <span style={{ fontWeight: 600 }}>{x.method === "mail" ? "Certified mail" : "Fax"} · {x.status === "sent" ? "sent" : x.status === "failed" ? "didn't go through" : "processing"}</span>
              <span className="small muted">{x.method === "mail" ? `To ${x.to_name}` : `To ${x.fax_number}`} · {shortDate(x.created_at)}</span>
              {x.status === "failed" && (
                <form action="/api/send/retry" method="post" className="row g8 wrap">
                  <input type="hidden" name="send_id" value={x.id} />
                  <button className="btn-plain" style={{ background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Try again</button>
                  <span className="small muted">{x.error}</span>
                </form>
              )}
            </div>
          ))}
          {letter.status !== "sent" && !["complaint", "small_claims_statement"].includes(letter.kind) && (
            <Link href={`/app/cases/${id}/letter/send?id=${letter.id}`} className="card row g12" style={{ textDecoration: "none", borderRadius: 22, alignItems: "center" }}>
              <span className="tool-ico" style={{ background: "#FDEEE7", color: "#A8441F" }}>✉</span>
              <span className="stack g4 grow"><span style={{ fontWeight: 600 }}>Send it for me</span><span className="muted small">Certified mail with tracking, or fax. No printer needed.</span></span>
              <span style={{ color: "#BF4F28", fontSize: 18 }}>→</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="stack g16">
          <p className="muted" style={{ margin: 0 }}>No letter yet for {c.title}.</p>
          <WriteLetterButton caseId={id} />
        </div>
      )}
    </main>
  );
}
