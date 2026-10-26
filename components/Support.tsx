"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { createSupportTicket, replySupportTicket } from "@/lib/supportActions";
import { SUPPORT_TOPICS as TOPICS } from "@/lib/supportTopics";

/** Contact form. Signed out it asks for a name and email; signed in it can attach one of the person's cases. */
export function SupportForm({ signedIn, cases = [], topic, caseId, page }: { signedIn: boolean; cases?: { id: string; title: string }[]; topic?: string; caseId?: string; page?: string }) {
  const [state, action] = useActionState(createSupportTicket, undefined);
  return (
    <form action={action} className="stack g12">
      {!signedIn && (
        <div className="row wrap g12">
          <label className="field grow" style={{ minWidth: 220 }}><span style={{ fontSize: 14 }}>Your name</span><input name="name" className="input" autoComplete="name" maxLength={120} /></label>
          <label className="field grow" style={{ minWidth: 220 }}><span style={{ fontSize: 14 }}>Email (we reply here)</span><input name="email" type="email" required className="input" autoComplete="email" maxLength={254} /></label>
        </div>
      )}
      <label className="field">
        <span style={{ fontSize: 14 }}>What's it about?</span>
        <select name="topic" className="input" defaultValue={topic || "other"}>
          {TOPICS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </label>
      {signedIn && cases.length > 0 && (
        <label className="field">
          <span style={{ fontSize: 14 }}>Which case? (optional)</span>
          <select name="case_id" className="input" defaultValue={caseId || ""}>
            <option value="">Not about a case</option>
            {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
      )}
      <label className="field"><span style={{ fontSize: 14 }}>Subject</span><input name="subject" className="input" maxLength={160} placeholder="A few words" /></label>
      <label className="field">
        <span style={{ fontSize: 14 }}>Your message</span>
        <textarea name="message" className="input" rows={6} required minLength={10} maxLength={5000} placeholder="What happened, and what you expected. Leave out account numbers and passwords." />
      </label>
      {/* Hidden from people; bots fill it in. */}
      <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {page && <input type="hidden" name="page" value={page} />}
      {state?.error && <p className="error" role="alert" style={{ margin: 0 }}>{state.error}</p>}
      <SubmitButton className="btn btn-ink" pendingText="Sending…" style={{ alignSelf: "flex-start" }}>Send message</SubmitButton>
      <span className="muted small">A person reads every message. We usually reply within one business day{signedIn ? ", here and by email." : " by email."}</span>
    </form>
  );
}

/** Reply box under a conversation. */
export function SupportReply({ ticket, token, back, staff = false }: { ticket: string; token?: string; back: string; staff?: boolean }) {
  const [state, action] = useActionState(replySupportTicket, undefined);
  return (
    <form action={action} className="stack g8">
      <input type="hidden" name="ticket" value={ticket} />
      {token && <input type="hidden" name="token" value={token} />}
      <input type="hidden" name="back" value={back} />
      <label className="field">
        <span style={{ fontSize: 14 }}>{staff ? "Your reply (they get it by email too)" : "Add a message"}</span>
        <textarea name="body" className="input" rows={staff ? 7 : 4} required maxLength={5000} />
      </label>
      {state?.error && <p className="error" role="alert" style={{ margin: 0 }}>{state.error}</p>}
      <SubmitButton className="btn-plain" pendingText="Sending…" style={{ alignSelf: "flex-start", background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>{staff ? "Send reply" : "Send"}</SubmitButton>
    </form>
  );
}
