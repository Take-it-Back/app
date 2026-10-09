import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import { BackLink } from "@/components/ui";
import Upsell from "@/components/Upsell";
import { WriteLetterCard } from "@/components/CaseActions";
import { AGENCIES, BUREAUS, kindsFor, type BureauKey } from "@/lib/letters";
import type { CaseRow } from "@/lib/types";

export default async function EscalatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const [{ data: cd }, premium] = await Promise.all([supabase.from("cases").select("*").eq("id", id).maybeSingle(), getCasePremium(supabase, user.id, id)]);
  if (!cd) notFound();
  const c = cd as CaseRow;
  const agencies = AGENCIES.filter((a) => a.categories.includes(c.category === "other" ? "debt" : c.category));
  const extraKinds = kindsFor(c.category).filter((k) => k.group === "Escalate" && !["complaint", "credit_dispute", "small_claims_statement"].includes(k.key));
  const showCredit = c.category === "debt" || c.category === "medical";

  return (
    <main className="app-main">
      <BackLink href={`/app/cases/${id}`} />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>Turn up the <em className="o">pressure</em></h1>
        <span className="muted" style={{ fontSize: 15 }}>When letters aren&apos;t enough, these get a company&apos;s attention.</span>
      </div>

      <div className="stack g24">
        <section>
          <div className="sec-head"><h2>File a complaint</h2></div>
          <p className="muted" style={{ margin: "0 0 12px", fontSize: 15 }}>Regulators forward your complaint to the company, and companies usually have to respond. It&apos;s free.</p>
          <div className="stack g12">
            {agencies.map((a) => (
              <div key={a.key} className="card stack g8" style={{ borderRadius: 22 }}>
                <span className="row between g8" style={{ alignItems: "flex-start" }}>
                  <span className="stack g4"><span style={{ fontWeight: 600, fontSize: 16 }}>{a.name}</span><span className="muted small">{a.what}</span></span>
                </span>
                {a.note && <span className="small" style={{ color: "#A8441F" }}>{a.note}</span>}
                <span className="row wrap g8">
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="btn-plain">Open their complaint page ↗</a>
                  {a.phone && <a href={`tel:${a.phone.replace(/[^0-9]/g, "")}`} className="btn-plain">Call {a.phone}</a>}
                </span>
                {premium ? (
                  <WriteLetterCard caseId={id} kind="complaint" target={a.key} title="Write my complaint" blurb="We write what to paste into their form, from your case history." />
                ) : null}
              </div>
            ))}
          </div>
          {!premium && <div style={{ marginTop: 12 }}><Upsell compact title="We'll write the complaint from your case history" /></div>}
        </section>

        {premium && extraKinds.length > 0 && (
          <section>
            <div className="sec-head"><h2>Go over their head</h2></div>
            <div className="stack g8">{extraKinds.map((k) => <WriteLetterCard key={k.key} caseId={id} kind={k.key} title={k.label} blurb={k.blurb} />)}</div>
          </section>
        )}

        {showCredit && (
          <section>
            <div className="sec-head"><h2>Fix your credit report</h2></div>
            <p className="muted" style={{ margin: "0 0 12px", fontSize: 15 }}>If this shows up on your credit report and it&apos;s wrong, disputed or paid, ask each bureau to fix it. They generally must investigate within 30 days.</p>
            {premium ? (
              <div className="stack g8">
                {(Object.keys(BUREAUS) as BureauKey[]).map((b) => (
                  <WriteLetterCard key={b} caseId={id} kind="credit_dispute" target={b} title={`Dispute with ${BUREAUS[b].name}`} blurb={BUREAUS[b].address.split("\n").slice(1).join(", ")} />
                ))}
                <p className="muted small" style={{ margin: "4px 0 0" }}>Check your reports for free first at <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">annualcreditreport.com</a>.</p>
              </div>
            ) : (
              <Upsell compact title="Dispute letters to all three credit bureaus" />
            )}
          </section>
        )}

        <Link href={`/app/cases/${id}/small-claims`} className="card stack g4" style={{ textDecoration: "none", borderRadius: 22, background: "#FAFAFA" }}>
          <span className="serif" style={{ fontSize: 24 }}>Small claims <em className="o">kit</em></span>
          <span className="muted small">{c.category === "landlord" ? "Deposit still not back? Get ready to file, step by step." : "When they owe you money and won't pay, small claims court is built for people without lawyers."}</span>
        </Link>

        <Link href="/app/help" className="panel-orange stack g4" style={{ textDecoration: "none" }}>
          <span style={{ fontWeight: 600 }}>Being sued, or have a court date?</span>
          <span className="small" style={{ color: "#4A4A4A" }}>Don&apos;t wait. Find free legal help now.</span>
        </Link>
      </div>
    </main>
  );
}
