import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { BackLink } from "@/components/ui";
import PrintButton from "@/components/PrintButton";
import { CATEGORY_INFO } from "@/lib/rules";
import { longDate, money, shortDate } from "@/lib/format";
import type { CaseRow, DeadlineRow, DocumentRow, EventRow, LetterRow } from "@/lib/types";

export default async function PacketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const [{ data: cd }, { data: ev }, { data: lt }, { data: dl }, { data: dc }, { data: profile }] = await Promise.all([
    supabase.from("cases").select("*").eq("id", id).maybeSingle(),
    supabase.from("events").select("*").eq("case_id", id).order("happened_at"),
    supabase.from("letters").select("*").eq("case_id", id).eq("status", "sent").order("sent_at"),
    supabase.from("deadlines").select("*").eq("case_id", id).order("due_date"),
    supabase.from("documents").select("*").eq("case_id", id).order("created_at"),
    supabase.from("profiles").select("full_name, state").eq("id", user.id).maybeSingle(),
  ]);
  if (!cd) notFound();
  const c = cd as CaseRow;
  const docs = (dc || []) as DocumentRow[];
  const { data: signed } = docs.length ? await supabase.storage.from("case-files").createSignedUrls(docs.map((d) => d.storage_path), 60 * 60) : { data: [] as { signedUrl: string | null }[] };

  return (
    <main className="app-main" style={{ maxWidth: 820 }}>
      <div className="no-print row between" style={{ marginBottom: 16 }}>
        <BackLink href={`/app/cases/${id}`} />
        <PrintButton label="Print or save as PDF" />
      </div>
      <div className="no-print panel-gray" style={{ marginBottom: 24, fontSize: 14 }}>One tidy packet for legal aid, a lawyer or a regulator. Print it, or choose “Save as PDF”. Photos of your documents print at the end.</div>

      <article className="stack g20" style={{ fontSize: 14 }}>
        <header className="stack g4" style={{ borderBottom: "2px solid #1A1A1A", paddingBottom: 12 }}>
          <span className="eyebrow">Case packet · prepared {longDate(new Date().toISOString())}</span>
          <h1 className="serif" style={{ margin: 0, fontSize: 32 }}>{c.title}</h1>
          <span>{CATEGORY_INFO[c.category].label}{c.counterparty ? ` · ${c.counterparty}` : ""}{c.amount_at_stake ? ` · ${money(c.amount_at_stake)} at stake` : ""}</span>
          <span className="muted">Prepared by {profile?.full_name || "the account holder"}{profile?.state ? `, ${profile.state}` : ""}</span>
        </header>

        {c.summary && <section><h2 className="serif" style={{ fontSize: 20, margin: "0 0 6px" }}>Summary</h2><p style={{ margin: 0 }}>{c.summary}</p></section>}

        {c.findings?.length > 0 && (
          <section>
            <h2 className="serif" style={{ fontSize: 20, margin: "0 0 6px" }}>Issues found</h2>
            <ol style={{ margin: 0, paddingLeft: 20 }}>{c.findings.map((f, i) => <li key={i}><strong>{f.title}.</strong> {f.detail}{f.rule_name ? ` (${f.rule_name})` : ""}</li>)}</ol>
          </section>
        )}

        <section>
          <h2 className="serif" style={{ fontSize: 20, margin: "0 0 6px" }}>Timeline</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {((ev || []) as EventRow[]).map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #EBEBEB" }}>
                  <td style={{ padding: "6px 8px 6px 0", whiteSpace: "nowrap", verticalAlign: "top" }}>{longDate(e.happened_at)}</td>
                  <td style={{ padding: "6px 0" }}>{e.title}{e.detail ? ` — ${e.detail}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="serif" style={{ fontSize: 20, margin: "0 0 6px" }}>Deadlines</h2>
          <ul style={{ margin: 0, paddingLeft: 20 }}>{((dl || []) as DeadlineRow[]).map((d) => <li key={d.id}>{shortDate(d.due_date)} — {d.title} ({d.owner === "you" ? "mine" : "theirs"}{d.done ? ", done" : ""})</li>)}</ul>
        </section>

        {((lt || []) as LetterRow[]).map((l) => (
          <section key={l.id} style={{ breakBefore: "page" }}>
            <h2 className="serif" style={{ fontSize: 20, margin: "0 0 6px" }}>Letter sent {shortDate(l.sent_at)}{l.sent_method ? ` by ${l.sent_method}` : ""}</h2>
            <div style={{ fontFamily: "Georgia, serif", whiteSpace: "pre-wrap", lineHeight: 1.55, border: "1px solid #EBEBEB", borderRadius: 8, padding: 16 }}>{l.subject ? `${l.subject}\n\n` : ""}{l.body}</div>
          </section>
        ))}

        {docs.length > 0 && (
          <section style={{ breakBefore: "page" }}>
            <h2 className="serif" style={{ fontSize: 20, margin: "0 0 6px" }}>Documents</h2>
            <div className="stack g16">
              {docs.map((d, i) => (
                <figure key={d.id} style={{ margin: 0, breakInside: "avoid" }}>
                  <figcaption className="muted small" style={{ marginBottom: 6 }}>{d.label || d.file_name} · {shortDate(d.created_at)}</figcaption>
                  {d.mime_type?.startsWith("image/") && signed?.[i]?.signedUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={signed[i].signedUrl!} alt={d.label || "Document"} style={{ maxWidth: "100%", border: "1px solid #EBEBEB" }} />
                  ) : (
                    <a href={signed?.[i]?.signedUrl || "#"}>Open PDF: {d.file_name}</a>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}
        <p className="muted small" style={{ borderTop: "1px solid #EBEBEB", paddingTop: 12 }}>Prepared with Take it back, a self-help tool. Not legal advice.</p>
      </article>
    </main>
  );
}
