import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { SupportForm } from "@/components/Support";
import { StatusTag } from "@/components/SupportThread";

export const metadata: Metadata = { title: "Support" };

export default async function AppSupportPage({ searchParams }: { searchParams: Promise<{ topic?: string; case?: string }> }) {
  const { topic, case: caseId } = await searchParams;
  const { supabase } = await requireUser();
  const [{ data: tickets }, { data: cases }] = await Promise.all([
    supabase.from("support_tickets").select("id, number, subject, status, user_unread, last_message_at").order("last_message_at", { ascending: false }).limit(50),
    supabase.from("cases").select("id, title").order("created_at", { ascending: false }).limit(50),
  ]);
  return (
    <main id="main" className="app-main">
      <div className="stack g20">
        <h1 className="page-title">Support</h1>
        {tickets && tickets.length > 0 && (
          <section className="stack">
            <div className="sec-head"><h2>Your messages</h2></div>
            {tickets.map((t) => (
              <Link key={t.id} href={`/app/support/${t.id}`} className="list-row" style={{ alignItems: "center" }}>
                <span className="stack grow" style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>{t.user_unread && <span aria-label="New reply" style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: "var(--orange)", marginRight: 8, verticalAlign: "middle" }} />}{t.subject}</span>
                  <span className="muted small">#{t.number}</span>
                </span>
                <StatusTag status={t.status} />
              </Link>
            ))}
          </section>
        )}
        <section className="card stack g12" style={{ borderRadius: 12 }}>
          <h2 className="serif" style={{ margin: 0, fontSize: 26 }}>{tickets?.length ? "Ask something new" : "Send us a message"}</h2>
          <SupportForm signedIn cases={cases || []} topic={topic} caseId={caseId} page="/app/support" />
        </section>
        <div className="stack">
          <Link href="/faq" className="list-row">Common questions</Link>
          <Link href="/status" className="list-row">Website and app status</Link>
          <Link href="/app/help" className="list-row">Free legal aid near you</Link>
        </div>
      </div>
    </main>
  );
}
