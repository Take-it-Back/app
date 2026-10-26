import { notFound } from "next/navigation";
import CaseTabs from "@/components/CaseTabs";
import { requireUser } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function CaseLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  // A case that doesn't exist or isn't yours (or shared with you) is a real 404 on every case page.
  if (!UUID.test(id)) notFound();
  const { supabase } = await requireUser();
  const { data } = await supabase.from("cases").select("id").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="case-wrap">
      <CaseTabs id={id} />
      {children}
      <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.55, maxWidth: 680, margin: "8px auto 24px", padding: "0 20px" }}>
        Take it back is not a law firm and is not a substitute for the advice of an attorney. Letters are self-help documents you review, change and send in your own name. If you&apos;ve been sued, have a court date or face eviction, contact <a href="https://www.lawhelp.org" target="_blank" rel="noopener noreferrer">free legal aid</a> right away.
      </p>
    </div>
  );
}
