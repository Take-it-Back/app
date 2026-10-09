import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { BackLink } from "@/components/ui";
import { UploadButton } from "@/components/CaseActions";
import { shortDate } from "@/lib/format";
import type { DocumentRow, EventRow } from "@/lib/types";

const KIND_LABEL: Record<string, string> = { original: "From them", reply: "Their reply", proof: "Proof", evidence: "Your evidence", other: "Other" };

export default async function DocsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  const [{ data: c }, { data: docsData }, { data: notes }] = await Promise.all([
    supabase.from("cases").select("title").eq("id", id).maybeSingle(),
    supabase.from("documents").select("*").eq("case_id", id).order("created_at"),
    supabase.from("events").select("*").eq("case_id", id).in("kind", ["note", "call"]).order("happened_at", { ascending: false }),
  ]);
  if (!c) notFound();
  const docs = (docsData || []) as DocumentRow[];
  const { data: signed } = docs.length
    ? await supabase.storage.from("case-files").createSignedUrls(docs.map((d) => d.storage_path), 60 * 30)
    : { data: [] as { signedUrl: string | null }[] };

  return (
    <main className="app-main wide">
      <div className="row between">
        <BackLink href={`/app/cases/${id}`} />
        <UploadButton caseId={id} userId={user.id} kind="evidence" label="Add a file" />
      </div>
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>Documents</h1>
        <span className="muted small">{c.title} · {docs.length} {docs.length === 1 ? "file" : "files"}</span>
      </div>
      <div className="grid-tiles" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {docs.map((d, i) => {
          const url = signed?.[i]?.signedUrl || "#";
          const isImg = d.mime_type?.startsWith("image/");
          return (
            <a key={d.id} href={url} target="_blank" rel="noreferrer" className="card stack g8" style={{ padding: 12, borderRadius: 20, textDecoration: "none" }}>
              <div style={{ height: 120, borderRadius: 10, background: "#F3F3F3", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isImg && url !== "#" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span className="muted small">PDF</span>
                )}
              </div>
              <span className="stack"><span style={{ fontWeight: 500, fontSize: 14 }}>{d.label || d.file_name}</span><span className="muted" style={{ fontSize: 12 }}>{shortDate(d.created_at)} · {KIND_LABEL[d.kind]}</span></span>
            </a>
          );
        })}
      </div>
      {!!notes?.length && (
        <section className="card" style={{ marginTop: 20 }}>
          <span className="eyebrow">Notes</span>
          {(notes as EventRow[]).map((n) => (
            <div key={n.id} className="stack g4" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB" }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{n.title} · {shortDate(n.happened_at)}</span>
              {n.detail && <span className="muted small" style={{ whiteSpace: "pre-wrap" }}>{n.detail}</span>}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
