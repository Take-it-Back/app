import Link from "next/link";
import { CategoryIcon, StatusTag } from "./ui";
import { money, shortDate } from "@/lib/format";
import { daysUntil } from "@/lib/rules";
import type { CaseRow, DeadlineRow } from "@/lib/types";

export function caseHref(c: CaseRow) {
  if (c.status === "won" || c.status === "settled") return `/app/cases/${c.id}/won`;
  return `/app/cases/${c.id}`;
}

export function nextLine(c: CaseRow, d?: DeadlineRow) {
  if (d) return `${d.owner === "you" ? d.title : d.title} · ${shortDate(d.due_date)}`;
  if (c.status === "won" || c.status === "settled") return c.outcome_amount ? `${money(c.outcome_amount)} back` : "Done";
  return c.amount_at_stake ? `${money(c.amount_at_stake)} at stake` : c.summary?.slice(0, 50) || "";
}

export default function CaseRowLink({ c, deadline, showDays, viewerId }: { c: CaseRow; deadline?: DeadlineRow; showDays?: boolean; viewerId?: string }) {
  const days = deadline ? daysUntil(deadline.due_date) : null;
  return (
    <Link href={caseHref(c)} className="list-row">
      <span className={`ico${c.status === "your_move" || c.status === "needs_help" ? " o" : ""}`}>
        <CategoryIcon category={c.category} />
      </span>
      <span className="stack grow">
        <span style={{ fontWeight: 500, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.is_demo ? <span className="pill-free" style={{ marginLeft: 0, marginRight: 6 }}>Sample</span> : null}{viewerId && c.user_id !== viewerId ? <span className="pill-pro" style={{ marginLeft: 0, marginRight: 6 }}>Shared</span> : null}{c.title}</span>
        <span className="muted small" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nextLine(c, deadline)}</span>
      </span>
      {showDays && days !== null ? (
        <span className="stack" style={{ alignItems: "flex-end" }}>
          <span className="serif" style={{ fontSize: 22, lineHeight: 1, color: days <= 3 && deadline?.owner === "you" ? "#A8441F" : "#1A1A1A" }}>{days < 0 ? "late" : `${days}d`}</span>
          <span className="muted" style={{ fontSize: 11.5 }}>{deadline?.owner === "you" ? "left" : "for them"}</span>
        </span>
      ) : (
        <StatusTag status={c.status} />
      )}
    </Link>
  );
}
