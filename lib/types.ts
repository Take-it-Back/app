export type Category = "medical" | "insurance" | "landlord" | "debt" | "other";
export type CaseStatus =
  | "analyzing"
  | "your_move"
  | "waiting"
  | "needs_help"
  | "won"
  | "settled"
  | "closed";

export interface Finding {
  title: string;
  detail: string;
  amount?: number | null;
  rule_name?: string | null;
  rule_url?: string | null;
}

export interface NextStep {
  title: string;
  detail: string;
  letter_kind?: string | null;
}

export interface CaseRow {
  id: string;
  user_id: string;
  category: Category;
  title: string;
  counterparty: string | null;
  amount_at_stake: number | null;
  status: CaseStatus;
  stage: number;
  received_date: string | null;
  insured: string | null;
  paid: string | null;
  user_state: string | null;
  summary: string | null;
  findings: Finding[];
  potential_savings: number | null;
  red_flag: boolean;
  red_flag_reason: string | null;
  next_steps: NextStep[];
  outcome_amount: number | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeadlineRow {
  id: string;
  case_id: string;
  title: string;
  due_date: string;
  owner: "you" | "them";
  done: boolean;
  rule_note: string | null;
}

export interface EventRow {
  id: string;
  case_id: string;
  kind: "event" | "note" | "call";
  title: string;
  detail: string | null;
  happened_at: string;
}

export interface LetterRow {
  id: string;
  case_id: string;
  kind: string;
  recipient: string | null;
  subject: string | null;
  body: string;
  status: "draft" | "sent";
  sent_at: string | null;
  sent_method: string | null;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  case_id: string;
  kind: "original" | "reply" | "proof" | "evidence" | "other";
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  label: string | null;
  analysis: Record<string, unknown> | null;
  created_at: string;
}
