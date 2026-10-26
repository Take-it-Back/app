import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import AdminMfa from "@/components/AdminMfa";
import SupportThread, { StatusTag, type SupportMessage } from "@/components/SupportThread";
import { SupportReply } from "@/components/Support";
import { setSupportStatus } from "@/lib/supportActions";
import { PLATFORM_LABEL, topicLabel } from "@/lib/supportTopics";

export const metadata: Metadata = { title: "Support request", robots: { index: false } };

type Ticket = { id: string; number: number; email: string; name: string | null; topic: string; subject: string; status: string; platform: string; page: string | null; case_id: string | null; signed_in: boolean; plan: string | null; created_at: string; messages: SupportMessage[] };

export default async function AdminSupportThread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase, user } = await requireUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) notFound();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== "aal2") {
    return <main id="main" className="app-main wide"><h1 className="page-title" style={{ marginBottom: 16 }}>Support request</h1><AdminMfa /></main>;
  }
  const { data } = await supabase.rpc("support_admin_thread", { p_ticket: id });
  if (!data) notFound();
  const t = data as Ticket;
  const back = `/app/admin/support/${id}`;
  const statusButton = (status: string, label: string) => (
    <form action={setSupportStatus}>
      <input type="hidden" name="ticket" value={t.id} /><input type="hidden" name="status" value={status} /><input type="hidden" name="back" value={back} />
      <button className="btn-plain" style={{ minHeight: 40, fontSize: 14 }}>{label}</button>
    </form>
  );
  return (
    <main id="main" className="app-main wide">
      <div className="stack g20" style={{ maxWidth: 820 }}>
        <Link href="/app/admin/support" className="muted small">← Support inbox</Link>
        <div className="stack g8">
          <span className="row g8 wrap" style={{ alignItems: "center" }}><span className="eyebrow">Request #{t.number}</span><StatusTag status={t.status} /></span>
          <h1 className="page-title" style={{ fontSize: 30, margin: 0 }}>{t.subject}</h1>
          <span className="muted small">
            {t.name ? `${t.name} · ` : ""}<a href={`mailto:${t.email}`}>{t.email}</a> · {t.signed_in ? `account, ${t.plan || "free"}` : "no account"} · {topicLabel(t.topic)} · {PLATFORM_LABEL[t.platform] || t.platform}{t.page ? ` · ${t.page}` : ""}
            {t.case_id ? <> · case {t.case_id.slice(0, 8)}</> : null}
          </span>
        </div>
        <SupportThread messages={t.messages} staffView />
        <SupportReply ticket={t.id} back={back} staff />
        <div className="row wrap g8">
          {t.status !== "closed" && statusButton("closed", "Close")}
          {t.status !== "open" && statusButton("open", "Mark waiting on us")}
          {t.status === "open" && statusButton("waiting", "Mark waiting on them")}
        </div>
        <p className="muted small" style={{ margin: 0 }}>Never ask for passwords or full card numbers. Don&apos;t give legal advice; point people to legal aid for court dates and lawsuits.</p>
      </div>
    </main>
  );
}
