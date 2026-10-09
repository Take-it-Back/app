import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import { BackLink } from "@/components/ui";
import Upsell from "@/components/Upsell";
import { WriteLetterCard } from "@/components/CaseActions";
import { kindInfo } from "@/lib/letters";
import { money, shortDate } from "@/lib/format";
import type { CaseRow, DocumentRow, LetterRow } from "@/lib/types";

export default async function SmallClaimsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const [{ data: cd }, { data: lt }, { data: dc }, { data: prof }, premium] = await Promise.all([
    supabase.from("cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("letters").select("*").eq("case_id", id).order("created_at"),
    supabase.from("documents").select("*").eq("case_id", id).order("created_at"),
    supabase.from("profiles").select("state").eq("id", user.id).maybeSingle(),
    getCasePremium(supabase, user.id, id),
  ]);
  if (!cd) notFound();
  const c = cd as CaseRow;
  const letters = (lt || []) as LetterRow[];
  const docs = (dc || []) as DocumentRow[];
  const sentDemand = letters.find((l) => l.status === "sent" && ["demand", "dispute", "validation", "followup"].includes(l.kind));
  const state = c.user_state || prof?.state || "your state";

  const evidence: [string, boolean, string][] = [
    ["Your demand letter, and proof it was sent", !!sentDemand, sentDemand ? `Sent ${shortDate(sentDemand.sent_at)}${sentDemand.sent_method ? ` by ${sentDemand.sent_method}` : ""}` : "Send one first. Courts like to see you tried."],
    ["Their letters, bills or notices", docs.some((d) => d.kind === "original" || d.kind === "reply"), `${docs.filter((d) => d.kind === "original" || d.kind === "reply").length} in your case file`],
    ["Photos, receipts or your lease", docs.some((d) => d.kind === "evidence" || d.kind === "proof"), "Add them in Files"],
    ["A dated timeline of what happened", true, "Your case packet has one ready to print"],
  ];

  return (
    <main className="app-main">
      <BackLink href={`/app/cases/${id}/escalate`} />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>Small claims <em className="o">kit</em></h1>
        <span className="muted" style={{ fontSize: 15 }}>{c.counterparty || c.title}{c.amount_at_stake ? ` · ${money(c.amount_at_stake)}` : ""}</span>
      </div>

      <div className="stack g24">
        <p className="panel-gray" style={{ margin: 0, fontSize: 15 }}>
          Small claims court is built for people without lawyers. The limit on how much you can claim depends on the state, from about $2,500 to $25,000, so check the limit for {state} before you file.
        </p>

        <section>
          <div className="sec-head"><h2>Your evidence</h2></div>
          <ul className="card stack" style={{ margin: 0, padding: "6px 18px", listStyle: "none" }}>
            {evidence.map(([t, ok, note], i) => (
              <li key={t} className="row g12" style={{ padding: "12px 0", borderBottom: i < evidence.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                <span style={{ width: 24, height: 24, borderRadius: 12, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: ok ? "#1A1A1A" : "#FDEEE7", color: ok ? "#fff" : "#A8441F", fontSize: 13, fontWeight: 700 }}>{ok ? "✓" : "!"}</span>
                <span className="stack"><span style={{ fontWeight: 500 }}>{t}</span><span className="muted small">{note}</span></span>
              </li>
            ))}
          </ul>
          <div className="row wrap g8" style={{ marginTop: 10 }}>
            <Link href={`/app/cases/${id}/docs`} className="btn-plain">Add files</Link>
            <Link href={`/app/cases/${id}/packet`} className="btn-plain">Print case packet</Link>
            {!sentDemand && <Link href={`/app/cases/${id}/write`} className="btn-plain">Write a demand letter</Link>}
          </div>
        </section>

        <section>
          <div className="sec-head"><h2>Your statement</h2></div>
          {premium ? (
            <WriteLetterCard caseId={id} kind="small_claims_statement" title="Write my statement of claim" blurb="What happened, how much and why, ready to copy onto the court form." />
          ) : (
            <Upsell compact title="We'll write your statement of claim from your case" />
          )}
          {letters.filter((l) => l.kind === "small_claims_statement").map((l) => (
            <Link key={l.id} href={`/app/cases/${id}/letter?id=${l.id}`} className="list-row">{kindInfo(l.kind)?.label} · {shortDate(l.created_at)}</Link>
          ))}
        </section>

        <section>
          <div className="sec-head"><h2>Steps to file</h2></div>
          <ol className="band stack" style={{ margin: 0, listStyle: "none", padding: "6px 18px" }}>
            {[
              ["Find your court", `Search “${state} small claims court” plus your county. File where the other side is, or where it happened.`],
              ["Fill in the claim form", "Copy in your statement. Ask for the amount owed plus court costs."],
              ["Pay the filing fee", "It varies by court. Ask about a fee waiver if money is tight."],
              ["Serve the other side", "The court tells you how: usually certified mail or a sheriff or process server."],
              ["Go to your hearing", "Bring three copies of everything: one for you, one for the judge, one for them."],
            ].map(([t, b], i) => (
              <li key={t} className="row g12" style={{ padding: "12px 0", alignItems: "flex-start", borderBottom: i < 4 ? "1px solid #E4E4E4" : 0 }}>
                <span className="serif" style={{ fontSize: 22, color: "#BF4F28", width: 18 }}>{i + 1}</span>
                <span className="stack g4"><span style={{ fontWeight: 500 }}>{t}</span><span className="muted small">{b}</span></span>
              </li>
            ))}
          </ol>
        </section>

        <p className="muted small">General information, not legal advice. Free help is often available: <a href="https://www.lawhelp.org" target="_blank" rel="noopener noreferrer">LawHelp.org</a> lists legal aid by state.</p>
      </div>
    </main>
  );
}
