import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import SupportThread, { StatusTag } from "@/components/SupportThread";
import { SupportReply } from "@/components/Support";
import { setSupportStatus } from "@/lib/supportActions";

export const metadata: Metadata = { title: "Support request" };

export default async function AppSupportThread({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const [{ id }, { new: isNew }] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireUser();
  const [{ data: t }, { data: messages }] = await Promise.all([
    supabase.from("support_tickets").select("id, number, subject, status, user_unread").eq("id", id).maybeSingle(),
    supabase.from("support_messages").select("from_staff, body, created_at").eq("ticket_id", id).order("created_at"),
  ]);
  if (!t) notFound();
  if (t.user_unread) await supabase.rpc("support_mark_read", { p_ticket: id });
  const back = `/app/support/${id}`;
  return (
    <main id="main" className="app-main">
      <div className="stack g20">
        <Link href="/app/support" className="muted small">← Support</Link>
        {isNew && <p className="notice" role="status" style={{ margin: 0 }}>Got it. We&apos;ll reply here and by email, usually within one business day.</p>}
        <div className="stack g8">
          <span className="row g8 wrap" style={{ alignItems: "center" }}><span className="eyebrow">Request #{t.number}</span><StatusTag status={t.status} /></span>
          <h1 className="page-title" style={{ fontSize: 30, margin: 0 }}>{t.subject}</h1>
        </div>
        <SupportThread messages={messages || []} />
        {t.status === "closed" ? (
          <form action={setSupportStatus} className="panel-gray row wrap g12" style={{ alignItems: "center", justifyContent: "space-between" }}>
            <span>This request is closed.</span>
            <input type="hidden" name="ticket" value={t.id} /><input type="hidden" name="status" value="open" /><input type="hidden" name="back" value={back} />
            <button className="btn-plain">Reopen it</button>
          </form>
        ) : (
          <>
            <SupportReply ticket={t.id} back={back} />
            <form action={setSupportStatus}>
              <input type="hidden" name="ticket" value={t.id} /><input type="hidden" name="status" value="closed" /><input type="hidden" name="back" value={back} />
              <button className="btn-text small">All sorted? Close this request</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
