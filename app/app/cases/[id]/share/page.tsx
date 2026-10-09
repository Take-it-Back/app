import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import { BackLink } from "@/components/ui";
import Upsell from "@/components/Upsell";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import CopyButton from "@/components/CopyButton";
import { inviteHelper, removeHelper } from "@/lib/actions";
import { shortDate } from "@/lib/format";

type Share = { id: string; helper_email: string; helper_id: string | null; accepted_at: string | null; created_at: string; owner_id: string };

export default async function SharePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ err?: string; sent?: string }> }) {
  const { id } = await params;
  const { err, sent } = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: c }, { data: sh }, premium, { data: me }] = await Promise.all([
    supabase.from("cases").select("id, title, user_id").eq("id", id).maybeSingle(),
    supabase.from("case_shares").select("*").eq("case_id", id).order("created_at"),
    getCasePremium(supabase, user.id, id),
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
  ]);
  if (!c) notFound();
  const owner = c.user_id === user.id;
  const shares = (sh || []) as Share[];
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.takeitback.app";
  const inviteText = (email: string) =>
    `${me?.full_name || "I"} added you as a helper on "${c.title}" in Take it back. Create a free account with ${email} at ${site}/login?mode=signup and it will show up in your cases.`;

  return (
    <main className="app-main">
      <BackLink href={`/app/cases/${id}`} />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>Get a <em className="o">helper</em></h1>
        <span className="muted" style={{ fontSize: 15 }}>Let a family member or friend see this case, write letters and keep track with you.</span>
      </div>

      {!owner ? (
        <div className="stack g16">
          <p className="panel-gray" style={{ margin: 0 }}>You&apos;re helping on this case. The person who added you can remove you at any time.</p>
          {shares.filter((s) => s.helper_id === user.id).map((s) => (
            <form key={s.id} action={removeHelper.bind(null, s.id, id)}>
              <ConfirmSubmit message="Stop helping on this case? It will disappear from your cases." className="btn-text" style={{ color: "#A8441F" }}>Leave this case</ConfirmSubmit>
            </form>
          ))}
        </div>
      ) : !premium ? (
        <Upsell title="Fight it together" body="Add a family member or friend so they can see the case, write letters and get reminders with you." />
      ) : (
        <div className="stack g24">
          {err && <p className="error" role="alert">{err}</p>}
          {sent && <p className="notice" role="status">Added. Send them the invite below so they know to sign up with that email.</p>}
          <form action={inviteHelper.bind(null, id)} className="card stack g12">
            <label className="field"><span>Their email</span><input name="email" type="email" required className="input" placeholder="name@example.com" autoComplete="off" /></label>
            <button className="btn-plain" style={{ alignSelf: "flex-start", background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Add helper</button>
            <span className="muted small">They&apos;ll see this case only, not your other cases. They can&apos;t delete it.</span>
          </form>

          <section>
            <div className="sec-head"><h2>Helpers <span className="n">{shares.length}</span></h2></div>
            {!shares.length && <p className="muted">No one yet.</p>}
            <div className="stack g8">
              {shares.map((s) => (
                <div key={s.id} className="card stack g8" style={{ borderRadius: 20 }}>
                  <span className="row between g8">
                    <span className="stack" style={{ minWidth: 0 }}><span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}>{s.helper_email}</span><span className="muted small">{s.accepted_at ? `Joined ${shortDate(s.accepted_at)}` : `Invited ${shortDate(s.created_at)} · waiting for them to sign in`}</span></span>
                    <span className={`tag ${s.accepted_at ? "tag-orange" : "tag-gray"}`}>{s.accepted_at ? "Helping" : "Invited"}</span>
                  </span>
                  {!s.accepted_at && (
                    <span className="row wrap g8">
                      <CopyButton text={inviteText(s.helper_email)} label="Copy invite" />
                      <a className="btn-plain" href={`mailto:${encodeURIComponent(s.helper_email)}?subject=${encodeURIComponent("Can you help me with this?")}&body=${encodeURIComponent(inviteText(s.helper_email))}`}>Email invite</a>
                      <a className="btn-plain" href={`sms:?&body=${encodeURIComponent(inviteText(s.helper_email))}`}>Text invite</a>
                    </span>
                  )}
                  <form action={removeHelper.bind(null, s.id, id)}>
                    <ConfirmSubmit message={`Remove ${s.helper_email} from this case?`} className="btn-text small" style={{ color: "#A8441F" }}>Remove</ConfirmSubmit>
                  </form>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
