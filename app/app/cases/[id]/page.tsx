import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { BackLink, CategoryIcon, CtaLink, StatusTag } from "@/components/ui";
import { UploadButton, WriteLetterButton } from "@/components/CaseActions";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import { CATEGORY_INFO, daysUntil } from "@/lib/rules";
import { money, relDays, shortDate } from "@/lib/format";
import { addDeadline, addNote, closeCase, deleteCase, toggleDeadline, updateCaseBasics, updateDeadline } from "@/lib/actions";
import type { CaseRow, DeadlineRow, EventRow, LetterRow } from "@/lib/types";
import { getPlan } from "@/lib/plan";
import Upsell from "@/components/Upsell";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const [{ data: cData }, { data: dl }, { data: ev }, { data: lt }, { count: docCount }, plan] = await Promise.all([
    supabase.from("cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("deadlines").select("*").eq("case_id", id).order("due_date"),
    supabase.from("events").select("*").eq("case_id", id).order("happened_at", { ascending: false }),
    supabase.from("letters").select("*").eq("case_id", id).order("created_at", { ascending: false }),
    supabase.from("documents").select("id", { count: "exact", head: true }).eq("case_id", id),
    getPlan(supabase, user.id),
  ]);
  if (!cData) notFound();
  const c = cData as CaseRow;
  const deadlines = (dl || []) as DeadlineRow[];
  const events = (ev || []) as EventRow[];
  const letters = (lt || []) as LetterRow[];
  const draft = letters.find((l) => l.status === "draft");
  const yours = deadlines.find((d) => d.owner === "you" && !d.done);
  const theirs = deadlines.find((d) => d.owner === "them" && !d.done);
  const info = CATEGORY_INFO[c.category];
  const done = ["won", "settled", "closed"].includes(c.status);

  if (!plan.premium) {
    return (
      <main className="app-main">
        <BackLink href="/app/cases" />
        <div className="stack g8" style={{ margin: "8px 0 20px" }}>
          <span className="tag tag-gray row g4" style={{ alignSelf: "flex-start" }}><CategoryIcon category={c.category} size={14} />{info.label}</span>
          <h1 className="page-title" style={{ fontSize: 36 }}>{c.title}</h1>
          <span className="muted" style={{ fontSize: 15 }}>{[c.counterparty, c.amount_at_stake ? `${money(c.amount_at_stake)} at stake` : null].filter(Boolean).join(" · ")}</span>
        </div>
        <div className="stack g20">
          {c.red_flag && (
            <Link href="/app/help" className="panel-orange stack g4" style={{ textDecoration: "none" }}>
              <span className="eyebrow" style={{ color: "#A8441F" }}>This may need a real person</span>
              <span style={{ fontSize: 15 }}>{c.red_flag_reason || "Something here moves fast."} Tap for help finding legal aid.</span>
            </Link>
          )}
          {c.summary && <p style={{ margin: 0, fontSize: 17 }}>{c.summary}</p>}
          <CtaLink href={`/app/cases/${id}/found`} variant="ink" block>See where you stand</CtaLink>
          <Upsell title="Track this fight from start to finish" />
          <form action={deleteCase.bind(null, id)}>
            <ConfirmSubmit message="Delete this case and its files? This can't be undone." className="btn-text" style={{ color: "#A8441F" }}>Delete this case and its files</ConfirmSubmit>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="app-main wide">
      <div className="row between no-print">
        <BackLink href="/app/cases" />
      </div>

      <div className="stack g8" style={{ margin: "8px 0 20px" }}>
        <div className="row g8 wrap">
          <span className="tag tag-gray row g4"><CategoryIcon category={c.category} size={14} />{info.label}</span>
          <StatusTag status={c.status} />
        </div>
        <h1 className="page-title" style={{ fontSize: 36 }}>{c.title}</h1>
        <span className="muted" style={{ fontSize: 15 }}>
          {[c.counterparty, c.amount_at_stake ? `${money(c.amount_at_stake)} at stake` : null].filter(Boolean).join(" · ")}
        </span>
      </div>

      {c.red_flag && !done && (
        <Link href="/app/help" className="panel-orange stack g4" style={{ textDecoration: "none", marginBottom: 20 }}>
          <span className="eyebrow" style={{ color: "#A8441F" }}>This may need a real person</span>
          <span style={{ fontSize: 15 }}>{c.red_flag_reason || "Something here moves fast."} Tap for help finding legal aid.</span>
        </Link>
      )}

      <ol aria-label="Progress" style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, maxWidth: 560 }}>
        {info.stages.map((s, i) => (
          <li key={s} className="stack g4">
            <span style={{ height: 4, borderRadius: 2, background: i + 1 < c.stage ? "#1A1A1A" : i + 1 === c.stage ? "#BF4F28" : "#EBEBEB" }} />
            <span style={{ fontSize: 11.5, fontWeight: i + 1 === c.stage ? 600 : 400, color: i + 1 === c.stage ? "#1A1A1A" : "#5E5E5E" }}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="split">
        <div className="a stack g20">
          {!done && (
            <div className="stats" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", maxWidth: 640 }}>
              <div className="panel-orange stack">
                <span className="small" style={{ color: "#A8441F" }}>{yours ? `${yours.title} by ${shortDate(yours.due_date)}` : "Your deadline"}</span>
                <span className="big-num">{yours ? relDays(daysUntil(yours.due_date)) : "—"}</span>
              </div>
              <div className="card stack" style={{ borderRadius: 22 }}>
                <span className="small muted">{theirs ? `${theirs.title}` : "Their deadline"}</span>
                <span className="big-num">{theirs ? relDays(daysUntil(theirs.due_date)) : "—"}</span>
                {theirs && <span className="small muted">by {shortDate(theirs.due_date)}</span>}
              </div>
            </div>
          )}

          {!done && (
            <div className="stack g12" style={{ maxWidth: 520 }}>
              {draft ? (
                <CtaLink href={`/app/cases/${id}/letter?id=${draft.id}`} variant="orange" block>Review your letter</CtaLink>
              ) : c.status === "waiting" ? (
                <>
                  <UploadButton caseId={id} userId={user.id} kind="reply" label="They replied — add their letter" analyze />
                  <span className="hand muted" style={{ fontSize: 20 }}>no reply by the date? we'll help you follow up</span>
                  <WriteLetterButton caseId={id} kind="followup" label="Write a follow-up" variant="ink" />
                </>
              ) : (
                <WriteLetterButton caseId={id} kind={c.next_steps?.[0]?.letter_kind || (c.category === "insurance" ? "appeal" : c.category === "debt" ? "validation" : "dispute")} />
              )}
              {c.findings?.length > 0 && <Link href={`/app/cases/${id}/found`} style={{ fontSize: 15, fontWeight: 500 }}>See what we found</Link>}
            </div>
          )}

          {c.next_steps?.length > 0 && !done && (
            <section>
              <div className="sec-head"><h2>Your options</h2></div>
              <div className="band">
              <ol className="stack" style={{ margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                {c.next_steps.map((s, i) => (
                  <li key={i} className="row g12" style={{ padding: "14px 0", borderBottom: i < c.next_steps.length - 1 ? "1px solid #EBEBEB" : 0, alignItems: "flex-start" }}>
                    <span className="serif" style={{ fontSize: 20, color: i === 0 ? "#BF4F28" : "#5E5E5E", width: 16 }}>{i + 1}</span>
                    <span className="stack g4 grow"><span style={{ fontWeight: 500 }}>{s.title}</span><span className="muted small">{s.detail}</span></span>
                  </li>
                ))}
              </ol>
              </div>
            </section>
          )}

          <section>
            <div className="sec-head"><h2>Timeline</h2></div>
            <div className="card">
            <div style={{ marginTop: 12 }}>
              {events.length === 0 && <p className="muted" style={{ margin: 0 }}>Nothing yet.</p>}
              {events.map((e, i) => (
                <div key={e.id} className="tl-item">
                  <div className="tl-rail"><span className={`tl-dot${i === 0 ? " o" : ""}`} />{i < events.length - 1 && <span className="tl-line" />}</div>
                  <div className="tl-body stack">
                    <span className="muted" style={{ fontSize: 12 }}>{shortDate(e.happened_at)}{e.kind !== "event" ? ` · ${e.kind}` : ""}</span>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{e.title}</span>
                    {e.detail && <span className="muted small" style={{ whiteSpace: "pre-wrap" }}>{e.detail}</span>}
                  </div>
                </div>
              ))}
            </div>
            <details style={{ marginTop: 8 }}>
              <summary className="btn-plain" style={{ display: "inline-flex", listStyle: "none" }}>Add a note or call</summary>
              <form action={addNote.bind(null, id)} className="stack g12" style={{ marginTop: 12 }}>
                <div className="chips">
                  <label className="chip"><input type="radio" name="kind" value="note" defaultChecked />Note</label>
                  <label className="chip"><input type="radio" name="kind" value="call" />Phone call</label>
                </div>
                <input name="title" className="input" placeholder="e.g. Called billing, spoke to Dana" required aria-label="Title" />
                <textarea name="detail" className="input" rows={3} placeholder="Reference numbers, what they said…" aria-label="Details" />
                <button className="btn-plain" style={{ alignSelf: "flex-start", background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Save note</button>
              </form>
            </details>
          </div>
          </section>
        </div>

        <div className="b stack g20">
          <section>
            <div className="sec-head"><h2>Dates</h2></div>
            <div className="card">
            <div className="stack" style={{ marginTop: 4 }}>
              {deadlines.map((d) => (
                <div key={d.id} className="stack g8" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB" }}>
                  <div className="row between g8">
                    <span className="stack">
                      <span style={{ fontWeight: 500, fontSize: 15, textDecoration: d.done ? "line-through" : "none", color: d.done ? "#5E5E5E" : "#1A1A1A" }}>{d.title}</span>
                      <span className="muted small">{shortDate(d.due_date)} · {d.owner === "you" ? "yours" : "theirs"}</span>
                    </span>
                    <form action={toggleDeadline.bind(null, d.id, !d.done)}>
                      <button className="btn-plain" style={{ minHeight: 40, fontSize: 13 }}>{d.done ? "Undo" : "Done"}</button>
                    </form>
                  </div>
                  {d.rule_note && <span className="muted small">{d.rule_note}</span>}
                  {!d.done && (
                    <form action={updateDeadline.bind(null, d.id)} className="row g8">
                      <label className="sr" htmlFor={`due-${d.id}`}>Change date</label>
                      <input id={`due-${d.id}`} type="date" name="due_date" defaultValue={d.due_date} className="input" style={{ minHeight: 40, padding: "6px 12px", maxWidth: 180 }} />
                      <button className="btn-text small">Change date</button>
                    </form>
                  )}
                </div>
              ))}
              <details style={{ marginTop: 10 }}>
                <summary className="btn-text" style={{ listStyle: "none", justifyContent: "flex-start" }}>+ Add a date</summary>
                <form action={addDeadline.bind(null, id)} className="stack g8" style={{ marginTop: 8 }}>
                  <input name="title" className="input" placeholder="What's due?" required aria-label="What's due" />
                  <input name="due_date" type="date" className="input" required aria-label="Date" />
                  <div className="chips">
                    <label className="chip"><input type="radio" name="owner" value="you" defaultChecked />Mine</label>
                    <label className="chip"><input type="radio" name="owner" value="them" />Theirs</label>
                  </div>
                  <button className="btn-plain" style={{ alignSelf: "flex-start" }}>Add date</button>
                </form>
              </details>
            </div>
          </div>
          </section>

          {letters.length > 0 && (
            <section>
              <div className="sec-head"><h2>Letters</h2></div>
              <div className="card">
              <div className="stack" style={{ marginTop: 4 }}>
                {letters.map((l) => (
                  <Link key={l.id} href={`/app/cases/${id}/letter?id=${l.id}`} className="list-row">
                    <span className="stack grow"><span style={{ fontWeight: 500, fontSize: 15 }}>{l.subject || l.kind}</span><span className="muted small">{l.status === "sent" ? `Sent ${shortDate(l.sent_at)}${l.sent_method ? ` · ${l.sent_method}` : ""}` : "Draft"}</span></span>
                    <span className={`tag ${l.status === "sent" ? "tag-gray" : "tag-orange"}`}>{l.status === "sent" ? "Sent" : "Draft"}</span>
                  </Link>
                ))}
              </div>
              </div>
            </section>
          )}

          {!done && (
            <section className="card stack g12" style={{ background: "#FAFAFA" }}>
              <span className="serif" style={{ fontSize: 22 }}>How did it <em className="o">end</em>?</span>
              <form action={closeCase.bind(null, id)} className="stack g12">
                <div className="chips">
                  <label className="chip"><input type="radio" name="outcome" value="won" defaultChecked />Won</label>
                  <label className="chip"><input type="radio" name="outcome" value="settled" />Settled</label>
                  <label className="chip"><input type="radio" name="outcome" value="closed" />Let it go</label>
                </div>
                <label className="field"><span style={{ fontSize: 14 }}>Money saved or recovered</span><input name="amount" inputMode="decimal" className="input" placeholder="$0" /></label>
                <button className="btn-plain" style={{ alignSelf: "flex-start" }}>Close this case</button>
              </form>
            </section>
          )}

          <details className="card">
            <summary className="btn-text" style={{ listStyle: "none", justifyContent: "flex-start" }}>Edit details</summary>
            <form action={updateCaseBasics.bind(null, id)} className="stack g12" style={{ marginTop: 12 }}>
              <label className="field"><span style={{ fontSize: 14 }}>Case name</span><input name="title" defaultValue={c.title} className="input" /></label>
              <label className="field"><span style={{ fontSize: 14 }}>Who it's with</span><input name="counterparty" defaultValue={c.counterparty || ""} className="input" /></label>
              <label className="field"><span style={{ fontSize: 14 }}>Amount at stake</span><input name="amount_at_stake" defaultValue={c.amount_at_stake ?? ""} inputMode="decimal" className="input" /></label>
              <button className="btn-plain" style={{ alignSelf: "flex-start" }}>Save</button>
            </form>
            <form action={deleteCase.bind(null, id)} style={{ marginTop: 16, borderTop: "1px solid #EBEBEB", paddingTop: 12 }}>
              <ConfirmSubmit message="Delete this case, its letters and all its files? This can't be undone." className="btn-text" style={{ color: "#A8441F" }}>Delete this case and its files</ConfirmSubmit>
            </form>
          </details>
        </div>
      </div>
    </main>
  );
}
