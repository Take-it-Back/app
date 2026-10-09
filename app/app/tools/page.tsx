import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plan";
import { Avatar } from "@/components/ui";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = { title: "More" };

function Glyph({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
}

export default async function ToolsPage() {
  const { supabase, user } = await requireUser();
  const [{ data: p }, plan] = await Promise.all([
    supabase.from("profiles").select("full_name, is_admin").eq("id", user.id).maybeSingle(),
    getPlan(supabase, user.id),
  ]);
  const groups = Array.from(new Set(TOOLS.map((t) => t.group)));

  return (
    <main className="app-main">
      <h1 className="page-title" style={{ marginBottom: 18 }}>More</h1>
      <div className="stack g24">
        <Link href="/app/you" className="card row g12" style={{ textDecoration: "none", alignItems: "center", borderRadius: 22 }}>
          <Avatar size={48} />
          <span className="stack grow" style={{ minWidth: 0 }}>
            <span style={{ fontWeight: 500, fontSize: 16 }}>{p?.full_name || "Your account"}</span>
            <span className="muted small" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</span>
          </span>
          <span className={`tag ${plan.premium ? "tag-orange" : "tag-gray"}`}>{plan.premium ? "Premium" : "Free"}</span>
        </Link>

        {groups.map((g) => (
          <section key={g}>
            <div className="sec-head"><h2>{g}</h2></div>
            <div className="tool-grid">
              {TOOLS.filter((t) => t.group === g && (!t.admin || p?.is_admin)).map((t) => (
                <Link key={t.href} href={t.href} className={`tool${t.tone === "orange" ? " o" : ""}`}>
                  <span className="tool-ico"><Glyph d={t.icon} /></span>
                  <span className="stack g4" style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{t.name}{t.premium && !plan.premium ? <span className="pill-pro">Premium</span> : null}</span>
                    <span className="muted small">{t.blurb}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {!plan.premium && (
          <Link href="/app/upgrade" className="panel-orange stack g4" style={{ textDecoration: "none" }}>
            <span className="serif" style={{ fontSize: 22 }}>Try <em className="o">Premium</em> free for 7 days</span>
            <span className="small" style={{ color: "#4A4A4A" }}>Letters, deadlines, complaints, call scripts and more.</span>
          </Link>
        )}
      </div>
    </main>
  );
}
