import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
import { daysUntil } from "@/lib/rules";
import { todayISO } from "@/lib/format";
import type { DeadlineRow } from "@/lib/types";

function dayParts(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  return { day: d.getUTCDate(), mon: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }), dow: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }) };
}

export default async function DatesPage() {
  const { supabase } = await requireUser();
  const [{ data: dl }, { data: cases }] = await Promise.all([
    supabase.from("deadlines").select("*").eq("done", false).order("due_date"),
    supabase.from("cases").select("id, title"),
  ]);
  const deadlines = (dl || []) as DeadlineRow[];
  const title = (id: string) => cases?.find((c) => c.id === id)?.title || "";
  const today = todayISO();
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
  const late = deadlines.filter((d) => daysUntil(d.due_date) < 0);
  const thisWeek = deadlines.filter((d) => { const n = daysUntil(d.due_date); return n >= 0 && n < 7; });
  const later = deadlines.filter((d) => daysUntil(d.due_date) >= 7);

  const Row = ({ d }: { d: DeadlineRow }) => {
    const p = dayParts(d.due_date);
    const n = daysUntil(d.due_date);
    return (
      <Link href={`/app/cases/${d.case_id}`} className="list-row">
        <span className="stack" style={{ width: 52, alignItems: "center", flex: "none" }}>
          <span className="serif" style={{ fontSize: 30, lineHeight: 1, color: d.owner === "you" && n <= 3 ? "#A8441F" : "#1A1A1A" }}>{p.day}</span>
          <span className="muted" style={{ fontSize: 11.5 }}>{n < 7 && n >= 0 ? p.dow : p.mon}</span>
        </span>
        <span className="stack grow"><span style={{ fontWeight: 500, fontSize: 15 }}>{d.title}</span><span className="muted small">{title(d.case_id)}</span></span>
        <span className={`tag ${d.owner === "you" ? "tag-orange" : "tag-gray"}`}>{d.owner === "you" ? "Yours" : "Theirs"}</span>
      </Link>
    );
  };

  return (
    <main className="app-main">
      <div className="page-head"><h1 className="page-title">Dates</h1></div>
      <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", textAlign: "center", padding: "14px 10px", marginBottom: 20 }}>
        {week.map((iso, i) => {
          const p = dayParts(iso);
          const has = deadlines.some((d) => d.due_date === iso);
          return (
            <div key={iso} className="stack g4" style={{ alignItems: "center" }}>
              <span className="muted" style={{ fontSize: 11.5 }}>{p.dow}</span>
              {i === 0 ? <span style={{ width: 32, height: 32, borderRadius: 16, background: "#1A1A1A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{p.day}</span> : <span style={{ fontSize: 15, lineHeight: "32px" }}>{p.day}</span>}
              <span style={{ width: 6, height: 6, borderRadius: 3, background: has ? "#BF4F28" : "transparent" }} />
            </div>
          );
        })}
      </div>
      {!deadlines.length && (
        <div className="stack g8 center" style={{ alignItems: "center", paddingTop: 40 }}>
          <span className="hand" style={{ fontSize: 32 }}>a calm calendar</span>
          <p className="muted" style={{ margin: 0 }}>Dates appear here when you start a case.</p>
        </div>
      )}
      {[["Overdue", late], ["This week", thisWeek], ["Later", later]].map(([label, list]) =>
        (list as DeadlineRow[]).length ? (
          <section key={label as string} className="stack" style={{ marginBottom: 18 }}>
            <span className="eyebrow">{label as string}</span>
            {(list as DeadlineRow[]).map((d) => <Row key={d.id} d={d} />)}
          </section>
        ) : null
      )}
      {!!deadlines.length && (
        <div className="panel-gray row g12" style={{ marginTop: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
          <span style={{ fontSize: 14 }}>Dates are suggestions based on common rules. The date on your own letter, plan or lease always wins.</span>
        </div>
      )}
    </main>
  );
}
