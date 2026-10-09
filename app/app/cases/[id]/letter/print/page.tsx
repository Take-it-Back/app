import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import PrintButton from "@/components/PrintButton";

export default async function PrintLetter({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ id?: string }> }) {
  const { id } = await params;
  const { id: letterId } = await searchParams;
  const { supabase } = await requireUser();
  let q = supabase.from("letters").select("subject, body, recipient").eq("case_id", id);
  q = letterId ? q.eq("id", letterId) : q.order("created_at", { ascending: false }).limit(1);
  const { data } = await q;
  const l = data?.[0];
  if (!l) notFound();
  return (
    <main className="app-main" style={{ maxWidth: 720 }}>
      <div className="no-print row between" style={{ marginBottom: 24 }}>
        <span className="muted small">Print it, or choose “Save as PDF” in the print window.</span>
        <PrintButton />
      </div>
      <article style={{ fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
        {l.subject && <p style={{ fontWeight: 700, marginTop: 0 }}>{l.subject}</p>}
        {l.body}
      </article>
    </main>
  );
}
