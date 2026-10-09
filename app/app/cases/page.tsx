import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
import { PlusIcon } from "@/components/ui";
import CaseRowLink from "@/components/CaseRowLink";
import { CATEGORY_INFO } from "@/lib/rules";
import type { CaseRow, DeadlineRow, Category } from "@/lib/types";

const FILTERS = [
  ["all", "All"],
  ["move", "Your move"],
  ["waiting", "Waiting"],
  ["done", "Done"],
] as const;

export default async function CasesPage({ searchParams }: { searchParams: Promise<{ f?: string; c?: string }> }) {
  const { f = "all", c: cat } = await searchParams;
  const { supabase } = await requireUser();
  const [{ data: casesData }, { data: dl }] = await Promise.all([
    supabase.from("cases").select("*").order("updated_at", { ascending: false }),
    supabase.from("deadlines").select("*").eq("done", false).order("due_date"),
  ]);
  let cases = (casesData || []) as CaseRow[];
  if (cat && cat in CATEGORY_INFO) cases = cases.filter((x) => x.category === (cat as Category));
  const byCase = new Map<string, DeadlineRow>();
  ((dl || []) as DeadlineRow[]).forEach((d) => !byCase.has(d.case_id) && byCase.set(d.case_id, d));

  const groups = [
    { key: "move", label: "Your move", items: cases.filter((x) => ["your_move", "needs_help", "analyzing"].includes(x.status)) },
    { key: "waiting", label: "Waiting on them", items: cases.filter((x) => x.status === "waiting") },
    { key: "done", label: "Done", items: cases.filter((x) => ["won", "settled", "closed"].includes(x.status)) },
  ].filter((g) => f === "all" || g.key === f);

  const q = (v: string) => `/app/cases?f=${v}${cat ? `&c=${cat}` : ""}`;

  return (
    <main className="app-main">
      <div className="page-head">
        <h1 className="page-title">{cat && cat in CATEGORY_INFO ? CATEGORY_INFO[cat as Category].label : "Cases"}</h1>
        <Link href="/app/scan" aria-label="New case" className="icon-btn"><PlusIcon /></Link>
      </div>
      <nav aria-label="Filter" className="chips" style={{ marginBottom: 18 }}>
        {FILTERS.map(([v, l]) => (
          <Link key={v} href={q(v)} className={`chip${f === v ? " on" : ""}`} aria-current={f === v ? "page" : undefined}>{l}{v === "all" ? ` ${cases.length}` : ""}</Link>
        ))}
      </nav>
      {!cases.length ? (
        <div className="stack g12 center" style={{ alignItems: "center", paddingTop: 48 }}>
          <span className="hand" style={{ fontSize: 32 }}>nothing here yet</span>
          <p className="muted" style={{ margin: 0 }}>Scan a bill, denial or notice to start a case.</p>
          <Link href="/app/scan" className="btn-plain">Scan a document</Link>
        </div>
      ) : (
        <div className="stack">
          {groups.map((g) => (
            <section key={g.key} className="stack" style={{ marginBottom: 18 }}>
              <span className="eyebrow" style={{ margin: "4px 0" }}>{g.label} · {g.items.length}</span>
              {g.items.map((c) => <CaseRowLink key={c.id} c={c} deadline={byCase.get(c.id)} showDays={g.key !== "done" && byCase.has(c.id)} />)}
              {!g.items.length && <span className="muted small" style={{ padding: "8px 0" }}>Nothing here.</span>}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
