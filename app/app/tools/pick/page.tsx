import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { BackLink } from "@/components/ui";
import { CategoryIcon, StatusTag } from "@/components/ui";
import { CATEGORY_INFO } from "@/lib/rules";
import type { CaseRow } from "@/lib/types";

const ALLOWED = ["write", "calls", "escalate", "small-claims", "share", "found", "docs", "packet"];

export default async function PickCase({ searchParams }: { searchParams: Promise<{ to?: string; label?: string }> }) {
  const { to = "", label = "Pick a case" } = await searchParams;
  if (!ALLOWED.includes(to)) redirect("/app/tools");
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("cases").select("*").not("status", "in", "(won,settled,closed)").order("updated_at", { ascending: false });
  const cases = (data || []) as CaseRow[];
  if (cases.length === 1) redirect(`/app/cases/${cases[0].id}/${to}`);

  return (
    <main className="app-main">
      <BackLink href="/app/tools" />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 36 }}>{label.slice(0, 60)}</h1>
        <span className="muted" style={{ fontSize: 15 }}>Which case is this for?</span>
      </div>
      {cases.length ? (
        <div className="card" style={{ padding: "4px 18px" }}>
          {cases.map((c) => (
            <Link key={c.id} href={`/app/cases/${c.id}/${to}`} className="list-row">
              <span className="ico"><CategoryIcon category={c.category} /></span>
              <span className="stack grow" style={{ minWidth: 0 }}>
                <span style={{ fontWeight: 500, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
                <span className="muted small">{CATEGORY_INFO[c.category].label}{c.counterparty ? ` · ${c.counterparty}` : ""}{c.user_id !== user.id ? " · shared" : ""}</span>
              </span>
              <StatusTag status={c.status} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="stack g12">
          <p className="muted" style={{ margin: 0 }}>You don&apos;t have an open case yet.</p>
          <Link href="/app/scan" className="btn-plain" style={{ alignSelf: "flex-start" }}>Scan a document</Link>
        </div>
      )}
    </main>
  );
}
