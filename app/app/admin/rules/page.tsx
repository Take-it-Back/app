import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { BackLink } from "@/components/ui";
import { TABLES, RULES_CHECKED } from "@/lib/stateLaw";
import { DEPOSIT_RULES } from "@/lib/deposits";
import compliance from "@/lib/state-law/compliance.json";

export const metadata: Metadata = { title: "State rules review", robots: { index: false } };

const NAMES: Record<string, string> = {
  deposit: "Deposit return deadlines",
  debt: "Debt: time limit to sue",
  smallclaims: "Small claims court",
  landlord: "Tenant rights",
  medical: "Medical debt",
  insurance: "Insurance appeals and Medicaid hearings",
};

function cell(v: unknown) {
  if (v === null || v === undefined || v === "") return <span className="muted">—</span>;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  const s = String(v);
  if (/^https?:\/\//.test(s)) return <a href={s} target="_blank" rel="noopener noreferrer">Source</a>;
  return s;
}

export default async function RulesReview({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { supabase, user } = await requireUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) notFound();
  const { t = "debt" } = await searchParams;
  const all: Record<string, Record<string, unknown>> = { deposit: DEPOSIT_RULES as Record<string, unknown>, ...(TABLES as Record<string, Record<string, unknown>>) };
  const table = all[t] || all.debt;
  const meta = table._meta as Record<string, unknown> | undefined;
  const rows = Object.entries(table).filter(([k]) => k !== "_meta") as [string, Record<string, unknown>][];
  const cols = Array.from(new Set(rows.flatMap(([, r]) => Object.keys(r))));

  return (
    <main id="main" className="app-main wide">
      <BackLink href="/app/admin" />
      <div className="stack g8" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title">State rules review</h1>
        <p className="muted" style={{ margin: 0, maxWidth: 680 }}>Every state rule the app shows people, with its source, checked {RULES_CHECKED}. Share this with your lawyer: anything they correct goes in lib/state-law and updates the whole app.</p>
      </div>
      <nav className="chips" aria-label="Tables" style={{ marginBottom: 16 }}>
        {Object.keys(all).map((k) => <a key={k} href={`?t=${k}`} className="chip" aria-current={k === t ? "page" : undefined} style={k === t ? { background: "#1A1A1A", color: "#fff" } : undefined}>{NAMES[k]}</a>)}
      </nav>
      {meta && (
        <details className="card" style={{ marginBottom: 16 }}>
          <summary className="btn-text" style={{ listStyle: "none", justifyContent: "flex-start" }}>Sources and caveats</summary>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, margin: "12px 0 0" }}>{JSON.stringify(meta, null, 2)}</pre>
        </details>
      )}
      <div className="card" style={{ padding: "8px 12px", overflowX: "auto" }}>
        <table className="pt" style={{ fontSize: 13.5 }}>
          <thead><tr><th scope="col">State</th>{cols.map((c) => <th key={c} scope="col">{c.replace(/_/g, " ")}</th>)}</tr></thead>
          <tbody>
            {rows.map(([state, r]) => (
              <tr key={state}><td style={{ fontWeight: 500 }}>{state}</td>{cols.map((c) => <td key={c} data-label={c}>{cell(r[c])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="card stack g8" style={{ marginTop: 20 }}>
        <span className="eyebrow">Compliance notes</span>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, margin: 0 }}>{JSON.stringify(compliance, null, 2)}</pre>
      </section>
    </main>
  );
}
