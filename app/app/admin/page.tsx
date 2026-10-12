import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { CATEGORY_INFO, STATUS_INFO } from "@/lib/rules";
import { money, shortDate } from "@/lib/format";
import type { Category, CaseStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

type Overview = {
  totals: Record<string, number>;
  by_category: Record<string, number>;
  users: { id: string; email: string; full_name: string | null; state: string | null; plan: string; plan_status: string | null; is_admin: boolean; created_at: string; last_sign_in_at: string | null; cases: number; letters: number }[];
  recent_cases: { id: string; title: string; category: Category; status: CaseStatus; amount_at_stake: number | null; created_at: string; email: string }[];
  funnel?: Record<string, number>;
  errors?: { area: string; message: string; path: string | null; created_at: string; email: string | null }[];
};

export default async function AdminPage() {
  const { supabase, user } = await requireUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) notFound();
  const [{ data, error }, { data: costs }] = await Promise.all([supabase.rpc("admin_overview"), supabase.rpc("admin_ai_costs")]);
  // Estimated AI cost: token counts are exact; the per-million prices are settings (AI_PRICE_IN / AI_PRICE_OUT, in dollars).
  const pin = Number(process.env.AI_PRICE_IN || 3), pout = Number(process.env.AI_PRICE_OUT || 15);
  const costRows = ((costs as { kind: string; calls: number; avg_in: number; avg_out: number; model: string }[] | null) || []).map((c) => ({ ...c, cost: (Number(c.avg_in) * pin + Number(c.avg_out) * pout) / 1e6 }));
  if (error || !data) {
    return (
      <main className="app-main wide">
        <h1 className="page-title">Admin</h1>
        <p className="error" role="alert">Couldn&apos;t load the overview: {error?.message || "no data"}</p>
      </main>
    );
  }
  const o = data as Overview;
  const t = o.totals;
  const conv = t.users ? Math.round((t.premium / t.users) * 100) : 0;
  const tiles: [string, string, string?][] = [
    ["Users", String(t.users)],
    ["Premium", String(t.premium), `${conv}% of users · ${t.trialing} on trial`],
    ["Cases", String(t.cases), `${t.cases_30d} in the last 30 days`],
    ["Open cases", String(t.open_cases), `${t.needs_help} need a person`],
    ["Letters", String(t.letters), `${t.letters_sent} sent`],
    ["Taken back", money(t.taken_back), `${money(t.in_play)} still in play`],
    ["AI runs, 24h", String(t.ai_24h ?? 0), `${t.errors_7d ?? 0} errors this week`],
  ];
  const f = o.funnel || {};
  const steps: [string, number][] = [["Signed up", f.signed_up ?? 0], ["Scanned a document", f.scanned ?? 0], ["Wrote a letter", f.wrote_letter ?? 0], ["Sent a letter", f.sent_letter ?? 0], ["Premium", f.premium ?? 0]];
  const top = Math.max(1, steps[0][1]);
  const catTotal = Object.values(o.by_category).reduce((a, b) => a + b, 0) || 1;

  return (
    <main className="app-main wide">
      <div className="page-head">
        <h1 className="page-title">Admin</h1>
        <span className="row g8"><Link href="/app/admin/rules" className="btn-plain">State rules review</Link><Link href="/app/admin/emails" className="btn-plain">Emails</Link><span className="tag tag-orange">Only admins see this</span></span>
      </div>

      <div className="stack g20">
        <div className="grid-tiles">
          {tiles.map(([label, value, sub], i) => (
            <div key={label} className={i === 1 ? "panel-orange stack" : "card stack"} style={{ borderRadius: 22 }}>
              <span className="small muted">{label}</span>
              <span className="big-num" style={{ fontSize: 38 }}>{value}</span>
              {sub && <span className="small muted">{sub}</span>}
            </div>
          ))}
        </div>

        <section className="card">
          <span className="eyebrow">Funnel</span>
          <div className="stack g12" style={{ marginTop: 12 }}>
            {steps.map(([label, n]) => (
              <div key={label} className="row g12">
                <span style={{ width: 150, fontSize: 14 }}>{label}</span>
                <span className="grow" style={{ height: 10, borderRadius: 5, background: "#F3F3F3", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: `${(n / top) * 100}%`, background: "#1A1A1A", borderRadius: 5 }} />
                </span>
                <span style={{ width: 70, textAlign: "right", fontWeight: 500 }}>{n} <span className="muted small">{Math.round((n / top) * 100)}%</span></span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <span className="eyebrow">AI cost per action · last 30 days</span>
          {costRows.length ? (
            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table className="pt" style={{ fontSize: 14 }}>
                <thead><tr><th scope="col">Action</th><th scope="col">Runs</th><th scope="col">Avg tokens in / out</th><th scope="col">Est. cost each</th></tr></thead>
                <tbody>{costRows.map((c) => <tr key={c.kind}><td>{c.kind === "analyze" ? "Scan" : c.kind === "letter" ? "Letter" : "Reply read"}</td><td data-label="Runs">{c.calls}</td><td data-label="Tokens">{Number(c.avg_in).toLocaleString()} / {Number(c.avg_out).toLocaleString()}</td><td data-label="Cost">${c.cost.toFixed(3)}</td></tr>)}</tbody>
              </table>
              <p className="muted small" style={{ margin: "10px 0 0" }}>Estimated at ${pin} / ${pout} per million tokens in / out ({costRows[0]?.model}). Premium at $9.99 a month covers about {Math.floor(9.99 / Math.max(0.001, costRows.find((c) => c.kind === "analyze")?.cost || 0.05))} scans.</p>
            </div>
          ) : <p className="muted" style={{ margin: "8px 0 0" }}>No AI runs yet. Numbers appear once the AI key is added and people scan.</p>}
        </section>

        <section className="card">
          <span className="eyebrow">Cases by fight</span>
          <div className="stack g12" style={{ marginTop: 12 }}>
            {(Object.keys(CATEGORY_INFO) as Category[]).filter((k) => o.by_category[k]).map((k) => {
              const n = o.by_category[k];
              return (
                <div key={k} className="row g12">
                  <span style={{ width: 130, fontSize: 14 }}>{CATEGORY_INFO[k].label}</span>
                  <span className="grow" style={{ height: 10, borderRadius: 5, background: "#F3F3F3", overflow: "hidden" }}>
                    <span style={{ display: "block", height: "100%", width: `${(n / catTotal) * 100}%`, background: "#BF4F28", borderRadius: 5 }} />
                  </span>
                  <span style={{ width: 32, textAlign: "right", fontWeight: 500 }}>{n}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card" style={{ padding: "16px 12px" }}>
          <span className="eyebrow" style={{ paddingLeft: 10 }}>Users · newest first</span>
          <div style={{ overflowX: "auto", marginTop: 8 }}>
            <table className="pt" style={{ fontSize: 14 }}>
              <thead><tr><th scope="col">Person</th><th scope="col">Plan</th><th scope="col">State</th><th scope="col">Cases</th><th scope="col">Letters</th><th scope="col">Joined</th><th scope="col">Last sign-in</th></tr></thead>
              <tbody>
                {o.users.map((u) => (
                  <tr key={u.id}>
                    <td><span className="stack"><span style={{ fontWeight: 500 }}>{u.full_name || "—"}{u.is_admin ? <span className="pill-pro">Admin</span> : null}</span><span className="muted small">{u.email}</span></span></td>
                    <td data-label="Plan"><span className={`tag ${u.plan === "premium" ? "tag-orange" : "tag-gray"}`}>{u.plan === "premium" ? `Premium${u.plan_status && u.plan_status !== "active" ? ` · ${u.plan_status}` : ""}` : "Free"}</span></td>
                    <td data-label="State">{u.state || "—"}</td>
                    <td data-label="Cases">{u.cases}</td>
                    <td data-label="Letters">{u.letters}</td>
                    <td data-label="Joined">{shortDate(u.created_at)}</td>
                    <td data-label="Last sign-in">{u.last_sign_in_at ? shortDate(u.last_sign_in_at) : "Never"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <span className="eyebrow">Latest cases</span>
          <div className="stack" style={{ marginTop: 4 }}>
            {o.recent_cases.map((c) => (
              <div key={c.id} className="list-row">
                <span className="stack grow"><span style={{ fontWeight: 500, fontSize: 15 }}>{c.title}</span><span className="muted small">{CATEGORY_INFO[c.category]?.label} · {c.email} · {shortDate(c.created_at)}</span></span>
                {c.amount_at_stake ? <span style={{ fontWeight: 500 }}>{money(c.amount_at_stake)}</span> : null}
                <span className={`tag ${STATUS_INFO[c.status]?.tone === "orange" ? "tag-orange" : "tag-gray"}`}>{STATUS_INFO[c.status]?.label || c.status}</span>
              </div>
            ))}
            {!o.recent_cases.length && <p className="muted">No cases yet.</p>}
          </div>
        </section>
        <section className="card">
          <span className="eyebrow">Recent errors</span>
          <div className="stack" style={{ marginTop: 4 }}>
            {(o.errors || []).map((e, i) => (
              <div key={i} className="list-row" style={{ alignItems: "flex-start" }}>
                <span className="tag tag-gray">{e.area}</span>
                <span className="stack grow" style={{ minWidth: 0 }}><span style={{ fontSize: 14, wordBreak: "break-word" }}>{e.message}</span><span className="muted small">{e.email || "—"} · {e.path || ""} · {shortDate(e.created_at)}</span></span>
              </div>
            ))}
            {!(o.errors || []).length && <p className="muted" style={{ margin: "8px 0 0" }}>No errors logged.</p>}
          </div>
        </section>
        <p className="muted small">Case contents and files stay private to each user; this page shows totals and titles only. <Link href="/app">Back to your cases</Link></p>
      </div>
    </main>
  );
}
