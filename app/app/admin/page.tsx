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
};

export default async function AdminPage() {
  const { supabase, user } = await requireUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) notFound();
  const { data, error } = await supabase.rpc("admin_overview");
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
  ];
  const catTotal = Object.values(o.by_category).reduce((a, b) => a + b, 0) || 1;

  return (
    <main className="app-main wide">
      <div className="page-head">
        <h1 className="page-title">Admin</h1>
        <span className="tag tag-orange">Only admins see this</span>
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
        <p className="muted small">Case contents and files stay private to each user; this page shows totals and titles only. <Link href="/app">Back to your cases</Link></p>
      </div>
    </main>
  );
}
