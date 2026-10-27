import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { CATEGORY_INFO, STATUS_INFO } from "@/lib/rules";
import { money, shortDate } from "@/lib/format";
import type { Category, CaseStatus } from "@/lib/types";
import AdminMfa from "@/components/AdminMfa";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

type Overview = {
  totals: Record<string, number>;
  by_category: Record<string, number>;
  users: { id: string; email: string; full_name: string | null; state: string | null; plan: string; plan_status: string | null; is_admin: boolean; created_at: string; last_sign_in_at: string | null; cases: number; letters: number }[];
  recent_cases: { id: string; title: string; category: Category; status: CaseStatus; amount_at_stake: number | null; created_at: string; email: string }[];
  funnel?: Record<string, number>;
  errors?: { area: string; message: string; path: string | null; created_at: string; email: string | null }[];
  ai_failures?: { area: string; message: string; path: string | null; created_at: string; email: string | null; case_title: string | null; category: Category | null }[];
  stuck_cases?: { id: string; title: string; category: Category; updated_at: string; email: string }[];
};

const AI_AREA: Record<string, string> = { analyze: "Scan", reply: "Reply read", letter: "Letter" };

export default async function AdminPage() {
  const { supabase, user } = await requireUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) notFound();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== "aal2") {
    return (
      <main id="main" className="app-main wide">
        <h1 className="page-title" style={{ marginBottom: 16 }}>Admin</h1>
        <AdminMfa />
      </main>
    );
  }
  const [{ data, error }, { data: costs }, { data: support }] = await Promise.all([supabase.rpc("admin_overview"), supabase.rpc("admin_ai_costs"), supabase.rpc("support_admin_list", { p_status: "open" })]);
  const openSupport = (support as { counts?: { open?: number } } | null)?.counts?.open ?? 0;
  // Estimated AI cost: token counts are exact; the per-million prices are settings (AI_PRICE_IN / AI_PRICE_OUT, in dollars).
  const pin = Number(process.env.AI_PRICE_IN || 2), pout = Number(process.env.AI_PRICE_OUT || 10);
  const costRows = ((costs as { kind: string; calls: number; avg_in: number; avg_out: number; model: string }[] | null) || []).map((c) => ({ ...c, cost: (Number(c.avg_in) * pin + Number(c.avg_out) * pout) / 1e6 }));
  if (error || !data) {
    return (
      <main id="main" className="app-main wide">
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
    ["Failed AI reads, 7d", String(t.ai_failed_7d ?? 0), `${t.ai_7d ? Math.round(((t.ai_failed_7d ?? 0) / t.ai_7d) * 100) : 0}% of ${t.ai_7d ?? 0} runs${t.stuck ? ` · ${t.stuck} stuck` : ""}`],
  ];
  const f = o.funnel || {};
  const steps: [string, number][] = [["Signed up", f.signed_up ?? 0], ["Scanned a document", f.scanned ?? 0], ["Wrote a letter", f.wrote_letter ?? 0], ["Sent a letter", f.sent_letter ?? 0], ["Premium", f.premium ?? 0]];
  const top = Math.max(1, steps[0][1]);
  const catTotal = Object.values(o.by_category).reduce((a, b) => a + b, 0) || 1;

  return (
    <main id="main" className="app-main wide">
      <div className="page-head" style={{ flexWrap: "wrap" }}>
        <h1 className="page-title">Admin</h1>
        <span className="row wrap g8"><Link href="/app/admin/support" className="btn-plain" style={openSupport ? { background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" } : undefined}>Support inbox{openSupport ? ` · ${openSupport} waiting` : ""}</Link><Link href="/status" className="btn-plain">Status</Link><Link href="/app/admin/rules" className="btn-plain">State rules review</Link><Link href="/app/admin/emails" className="btn-plain">Emails</Link><span className="tag tag-orange">Only admins see this</span></span>
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
              <p className="muted small" style={{ margin: "10px 0 0" }}>Estimated at ${pin} / ${pout} per million tokens in / out ({costRows[0]?.model}). Premium at $14.99 a month covers about {Math.floor(14.99 / Math.max(0.001, costRows.find((c) => c.kind === "analyze")?.cost || 0.05))} scans.</p>
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
          <span className="eyebrow">Failed AI reads</span>
          <p className="muted small" style={{ margin: "6px 0 0" }}>Scans, reply reads and letters where the AI didn&apos;t come back cleanly. The person got the template version instead.</p>
          <div className="stack" style={{ marginTop: 4 }}>
            {(o.stuck_cases || []).map((c) => (
              <div key={c.id} className="list-row" style={{ alignItems: "flex-start" }}>
                <span className="tag tag-orange">Stuck</span>
                <span className="stack grow" style={{ minWidth: 0 }}><span style={{ fontSize: 14 }}>{c.title} is still &ldquo;reading&rdquo;</span><span className="muted small">{CATEGORY_INFO[c.category]?.label} · {c.email} · since {shortDate(c.updated_at)}</span></span>
              </div>
            ))}
            {(o.ai_failures || []).map((e, i) => (
              <div key={i} className="list-row" style={{ alignItems: "flex-start" }}>
                <span className="tag tag-gray">{AI_AREA[e.area] || e.area}</span>
                <span className="stack grow" style={{ minWidth: 0 }}><span style={{ fontSize: 14, wordBreak: "break-word" }}>{e.message}</span><span className="muted small">{e.case_title ? `${e.case_title} · ` : ""}{e.category ? `${CATEGORY_INFO[e.category]?.label} · ` : ""}{e.email || "—"} · {shortDate(e.created_at)}</span></span>
              </div>
            ))}
            {!(o.ai_failures || []).length && !(o.stuck_cases || []).length && <p className="muted" style={{ margin: "8px 0 0" }}>No failed reads.</p>}
          </div>
        </section>
        <section className="card">
          <span className="eyebrow">Other errors</span>
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
