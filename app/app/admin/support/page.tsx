import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import AdminMfa from "@/components/AdminMfa";
import { StatusTag } from "@/components/SupportThread";
import { PLATFORM_LABEL, topicLabel } from "@/lib/supportTopics";

export const metadata: Metadata = { title: "Support inbox", robots: { index: false } };

type Row = { id: string; number: number; email: string; name: string | null; topic: string; subject: string; status: string; platform: string; signed_in: boolean; last_message_at: string; last_body: string | null; last_from_staff: boolean; messages: number };
type List = { counts: Record<string, number>; tickets: Row[] };

const TABS: [string, string][] = [["open", "Waiting on us"], ["waiting", "We replied"], ["closed", "Closed"], ["all", "All"]];
const ago = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return m < 60 ? `${Math.max(m, 1)}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};

export default async function SupportInbox({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  const tab = TABS.some(([k]) => k === s) ? (s as string) : "open";
  const { supabase, user } = await requireUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) notFound();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== "aal2") {
    return <main id="main" className="app-main wide"><h1 className="page-title" style={{ marginBottom: 16 }}>Support inbox</h1><AdminMfa /></main>;
  }
  const { data, error } = await supabase.rpc("support_admin_list", { p_status: tab === "all" ? null : tab });
  const list = data as List | null;
  return (
    <main id="main" className="app-main wide">
      <div className="stack g20">
        <Link href="/app/admin" className="muted small">← Admin</Link>
        <h1 className="page-title" style={{ margin: 0 }}>Support inbox</h1>
        <nav aria-label="Filter" className="row wrap g8">
          {TABS.map(([k, l]) => (
            <Link key={k} href={`/app/admin/support?s=${k}`} className={`tag ${tab === k ? "tag-ink" : "tag-gray"}`} style={{ textDecoration: "none", padding: "8px 14px", fontSize: 14 }} aria-current={tab === k ? "page" : undefined}>
              {l}{k !== "all" && list ? ` · ${list.counts[k] ?? 0}` : ""}
            </Link>
          ))}
        </nav>
        {error && <p className="error" role="alert">Couldn&apos;t load requests: {error.message}</p>}
        {list && list.tickets.length === 0 && <p className="muted">Nothing here.</p>}
        <div className="stack">
          {list?.tickets.map((t) => (
            <Link key={t.id} href={`/app/admin/support/${t.id}`} className="list-row" style={{ alignItems: "flex-start" }}>
              <span className="stack g4 grow" style={{ minWidth: 0 }}>
                <span className="row wrap g8" style={{ alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>#{t.number} {t.subject}</span>
                  <StatusTag status={t.status} />
                </span>
                <span className="muted small">{t.name ? `${t.name} · ` : ""}{t.email}{t.signed_in ? "" : " (no account)"} · {topicLabel(t.topic)} · {PLATFORM_LABEL[t.platform] || t.platform} · {t.messages} message{t.messages === 1 ? "" : "s"}</span>
                {t.last_body && <span className="small" style={{ color: "#4A4A4A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.last_from_staff ? "You: " : ""}{t.last_body}</span>}
              </span>
              <span className="muted small" style={{ whiteSpace: "nowrap" }}>{ago(t.last_message_at)}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
