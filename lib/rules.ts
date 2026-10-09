import type { Category, CaseStatus } from "./types";

/**
 * Deadline rules. These are plain-language defaults, not legal advice.
 * Every rule here should be reviewed by a licensed attorney before launch,
 * and users can always edit the date on their case.
 */
export const CATEGORY_INFO: Record<
  Category,
  { label: string; stages: string[] }
> = {
  medical: { label: "Medical bill", stages: ["Scanned", "Dispute sent", "Follow-up", "Settled"] },
  insurance: { label: "Insurance denial", stages: ["Scanned", "Appeal 1", "Appeal 2", "Outside review"] },
  landlord: { label: "Landlord", stages: ["Scanned", "Letter sent", "Follow-up", "Complaint"] },
  debt: { label: "Debt collector", stages: ["Scanned", "Dispute sent", "Follow-up", "Complaint"] },
  other: { label: "Other", stages: ["Scanned", "Letter sent", "Follow-up", "Done"] },
};

export const STATUS_INFO: Record<CaseStatus, { label: string; tone: "orange" | "gray" | "ink" }> = {
  analyzing: { label: "Reading it", tone: "gray" },
  your_move: { label: "Your move", tone: "orange" },
  waiting: { label: "Waiting on them", tone: "gray" },
  needs_help: { label: "Needs a person", tone: "orange" },
  won: { label: "Won", tone: "ink" },
  settled: { label: "Settled", tone: "ink" },
  closed: { label: "Closed", tone: "gray" },
};

export function addDays(dateISO: string, days: number) {
  const d = new Date(dateISO + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Your first deadline after a document arrives. */
export function firstDeadline(category: Category, received: string, insured?: string | null) {
  switch (category) {
    case "insurance":
      return {
        title: "Send your appeal",
        due: addDays(received, 180),
        note: "Most plans allow 180 days to appeal a denial. Check your letter for the exact date.",
      };
    case "debt":
      return {
        title: "Dispute the debt in writing",
        due: addDays(received, 30),
        note: "You usually have about 30 days from the collector's notice to dispute it. Check the date on the notice.",
      };
    case "medical":
      if (insured === "no")
        return {
          title: "Dispute the bill",
          due: addDays(received, 120),
          note: "If you were uninsured and the bill is $400+ over your estimate, you have 120 days to dispute it. Replying sooner keeps it out of collections.",
        };
      return {
        title: "Send your dispute letter",
        due: addDays(received, 30),
        note: "Suggested date. Replying within 30 days helps keep the bill out of collections.",
      };
    case "landlord":
      return {
        title: "Send your letter",
        due: addDays(received, 14),
        note: "Suggested date. Rules vary by state, so act quickly.",
      };
    default:
      return { title: "Send your letter", due: addDays(received, 30), note: "Suggested date." };
  }
}

/** How long the other side typically has after your letter is delivered. */
export function theirDeadline(category: Category, sent: string) {
  switch (category) {
    case "insurance":
      return { title: "Their decision on your appeal", due: addDays(sent, 30), note: "Plans usually decide within 30 days for care you haven't had yet, 60 days for care you've had." };
    case "debt":
      return { title: "Check for their proof of the debt", due: addDays(sent, 30), note: "Once you dispute in writing, they must stop collecting until they verify the debt." };
    case "landlord":
      return { title: "Their reply is due", due: addDays(sent, 14), note: "Suggested follow-up date." };
    default:
      return { title: "Their reply is due", due: addDays(sent, 30), note: "Suggested follow-up date." };
  }
}

export function daysUntil(dateISO: string) {
  const today = new Date();
  const t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const d = new Date(dateISO + "T00:00:00Z").getTime();
  return Math.round((d - t) / 86400000);
}
