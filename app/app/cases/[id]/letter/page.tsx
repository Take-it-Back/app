import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plan";
import Upsell from "@/components/Upsell";
import { BackLink } from "@/components/ui";
import { WriteLetterButton } from "@/components/CaseActions";
import LetterEditor from "./LetterEditor";
import type { LetterRow } from "@/lib/types";

export default async function LetterPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ id?: string; note?: string }> }) {
  const { id } = await params;
  const { id: letterId, note } = await searchParams;
  const { supabase, user } = await requireUser();
  if (!(await getPlan(supabase, user.id)).premium) {
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

  return (
    <main className="app-main">
      <div className="row between">
        <BackLink href={`/app/cases/${id}`} />
        {letter && <Link href={`/app/cases/${id}/letter/print?id=${letter.id}`} className="btn-plain" target="_blank">Print or save PDF</Link>}
      </div>
      <h1 className="page-title" style={{ fontSize: 38, margin: "6px 0 16px" }}>Your <em className="o">letter</em></h1>
      {note && <p className="panel-gray" style={{ margin: "0 0 16px", fontSize: 14 }}>{note}</p>}
      {letter ? (
        <LetterEditor letter={letter} caseId={id} />
      ) : (
        <div className="stack g16">
          <p className="muted" style={{ margin: 0 }}>No letter yet for {c.title}.</p>
          <WriteLetterButton caseId={id} />
        </div>
      )}
    </main>
  );
}
