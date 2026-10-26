import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SupportThread, { StatusTag, type SupportMessage } from "@/components/SupportThread";
import { SupportReply } from "@/components/Support";
import { setSupportStatus } from "@/lib/supportActions";

export const metadata: Metadata = { title: "Your support request", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Thread = { id: string; number: number; subject: string; status: string; name: string | null; messages: SupportMessage[] };

/** A signed-out person's conversation, opened from the private link in their email. */
export default async function GuestThreadPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ new?: string }> }) {
  const [{ token }, { new: isNew }] = await Promise.all([params, searchParams]);
  if (!/^[a-f0-9]{48}$/.test(token)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.rpc("support_guest_thread", { p_token: token });
  if (!data) notFound();
  const t = data as Thread;
  const back = `/support/t/${token}`;
  return (
    <main id="main" className="stack g20" style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px" }}>
      <Link href="/support" className="muted small">← Support</Link>
      {isNew && <p className="notice" role="status" style={{ margin: 0 }}>Got it. We emailed you a copy of this link. Bookmark this page to check for our reply.</p>}
      <div className="stack g8">
        <span className="row g8 wrap" style={{ alignItems: "center" }}><span className="eyebrow">Request #{t.number}</span><StatusTag status={t.status} /></span>
        <h1 className="serif" style={{ margin: 0, fontSize: "clamp(30px, 4vw, 40px)", lineHeight: 1.15 }}>{t.subject}</h1>
      </div>
      <SupportThread messages={t.messages} />
      {t.status === "closed" ? (
        <form action={setSupportStatus} className="panel-gray row wrap g12" style={{ alignItems: "center", justifyContent: "space-between" }}>
          <span>This request is closed.</span>
          <input type="hidden" name="ticket" value={t.id} /><input type="hidden" name="token" value={token} /><input type="hidden" name="status" value="open" /><input type="hidden" name="back" value={back} />
          <button className="btn-plain">Reopen it</button>
        </form>
      ) : (
        <>
          <SupportReply ticket={t.id} token={token} back={back} />
          <form action={setSupportStatus}>
            <input type="hidden" name="ticket" value={t.id} /><input type="hidden" name="token" value={token} /><input type="hidden" name="status" value="closed" /><input type="hidden" name="back" value={back} />
            <button className="btn-text small">All sorted? Close this request</button>
          </form>
        </>
      )}
      <p className="muted small" style={{ margin: 0 }}>Anyone with this link can see this conversation, so don&apos;t share it.</p>
    </main>
  );
}
