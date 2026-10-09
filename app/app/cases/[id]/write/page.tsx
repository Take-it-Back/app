import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import { BackLink } from "@/components/ui";
import Upsell from "@/components/Upsell";
import { WriteLetterCard } from "@/components/CaseActions";
import { kindsFor, kindInfo, type LetterGroup } from "@/lib/letters";
import { shortDate } from "@/lib/format";
import type { CaseRow, LetterRow } from "@/lib/types";

const ORDER: LetterGroup[] = ["Fight it", "Lower the bill", "Get your records", "Follow up"];

export default async function WritePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const [{ data: cd }, { data: lt }, premium] = await Promise.all([
    supabase.from("cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("letters").select("*").eq("case_id", id).order("created_at", { ascending: false }),
    getCasePremium(supabase, user.id, id),
  ]);
  if (!cd) notFound();
  const c = cd as CaseRow;
  const letters = (lt || []) as LetterRow[];
  const kinds = kindsFor(c.category).filter((k) => k.group !== "Escalate");

  return (
    <main className="app-main">
      <BackLink href={`/app/cases/${id}`} />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>Your <em className="o">letters</em></h1>
        <span className="muted" style={{ fontSize: 15 }}>{c.title}{c.counterparty ? ` · ${c.counterparty}` : ""}</span>
      </div>

      {letters.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <div className="sec-head"><h2>Written so far <span className="n">{letters.length}</span></h2></div>
          <div className="card" style={{ padding: "4px 18px" }}>
            {letters.map((l) => (
              <Link key={l.id} href={`/app/cases/${id}/letter?id=${l.id}`} className="list-row">
                <span className="stack grow" style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>{l.subject || kindInfo(l.kind)?.label || l.kind}</span>
                  <span className="muted small">{kindInfo(l.kind)?.label || l.kind} · {l.status === "sent" ? `Sent ${shortDate(l.sent_at)}` : "Draft"}</span>
                </span>
                <span className={`tag ${l.status === "sent" ? "tag-gray" : "tag-orange"}`}>{l.status === "sent" ? "Sent" : "Draft"}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!premium ? (
        <Upsell title="Pick a letter. We'll write it." body="Disputes, appeals, payment plans, discounts, records requests and follow-ups, written from your case and ready to send." />
      ) : (
        <div className="stack g24">
          {ORDER.map((g) => {
            const list = kinds.filter((k) => k.group === g);
            if (!list.length) return null;
            return (
              <section key={g}>
                <div className="sec-head"><h2>{g}</h2></div>
                <div className="stack g8">
                  {list.map((k) => <WriteLetterCard key={k.key} caseId={id} kind={k.key} title={k.label} blurb={k.blurb} caution={k.caution} />)}
                </div>
              </section>
            );
          })}
          <Link href={`/app/cases/${id}/escalate`} className="panel-gray stack g4" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 600 }}>Need more pressure?</span>
            <span className="muted small">File a complaint with a regulator, dispute your credit report or get ready for small claims.</span>
          </Link>
        </div>
      )}
    </main>
  );
}
