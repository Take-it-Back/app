import { STATUS_LABEL } from "@/lib/supportTopics";

export type SupportMessage = { from_staff: boolean; body: string; created_at: string };

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }).format(new Date(iso)) + " ET";

export function StatusTag({ status }: { status: string }) {
  return <span className={`tag ${status === "waiting" ? "tag-orange" : status === "closed" ? "tag-gray" : "tag-ink"}`}>{STATUS_LABEL[status] || status}</span>;
}

/** A support conversation, oldest first. `staffView` flips which side is "you". */
export default function SupportThread({ messages, staffView = false }: { messages: SupportMessage[]; staffView?: boolean }) {
  return (
    <ol className="stack g12" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {messages.map((m, i) => {
        const mine = staffView ? m.from_staff : !m.from_staff;
        return (
          <li key={i} className="stack g4" style={{ alignItems: mine ? "flex-end" : "flex-start" }}>
            <span className="muted" style={{ fontSize: 12 }}>{m.from_staff ? "Take it back support" : staffView ? "Customer" : "You"} · {when(m.created_at)}</span>
            <div style={{ maxWidth: 620, whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 15, lineHeight: 1.55, padding: "12px 16px", borderRadius: 18, background: m.from_staff ? "var(--orange-soft)" : "var(--gray-soft)" }}>{m.body}</div>
          </li>
        );
      })}
    </ol>
  );
}
