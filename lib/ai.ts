import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

export function aiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const SYSTEM = `You help ordinary people in the United States understand bills, insurance denials, landlord notices and debt collection letters, and push back when something is wrong.
Rules:
- Write in plain, warm, short sentences. Sentence case. No legal jargon unless you explain it.
- You are not a lawyer and do not give legal advice. Give general information about rights and options.
- Only state a law or rule if you are confident it applies. Name it in plain words (for example "the No Surprises Act", "the Fair Debt Collection Practices Act").
- Never invent account numbers, names, dates or amounts that are not in the document. Use [BRACKETED PLACEHOLDERS] for anything unknown.
- Set red_flag to true when the person may need a human right away: an eviction filing or court date, a lawsuit or summons, wage garnishment, a utility shutoff, discrimination, or a denial of urgent or life-threatening care.`;

export type MediaInput = { mime: string; base64: string };

function mediaBlock(m: MediaInput): Anthropic.ContentBlockParam {
  if (m.mime === "application/pdf") {
    return { type: "document", source: { type: "base64", media_type: "application/pdf", data: m.base64 } };
  }
  const mt = (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(m.mime)
    ? m.mime
    : "image/jpeg") as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  return { type: "image", source: { type: "base64", media_type: mt, data: m.base64 } };
}

async function callTool<T>(name: string, description: string, schema: Record<string, unknown>, content: Anthropic.ContentBlockParam[]): Promise<T> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    tools: [{ name, description, input_schema: schema as Anthropic.Tool.InputSchema }],
    tool_choice: { type: "tool", name },
    messages: [{ role: "user", content }],
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("No structured answer from the model");
  return block.input as T;
}

export interface Analysis {
  category: "medical" | "insurance" | "landlord" | "debt" | "other";
  title: string;
  counterparty: string | null;
  amount_at_stake: number | null;
  document_date: string | null;
  summary: string;
  findings: { title: string; detail: string; amount: number | null; rule_name: string | null }[];
  potential_savings: number | null;
  red_flag: boolean;
  red_flag_reason: string | null;
  next_steps: { title: string; detail: string; letter_kind: string | null }[];
}

const analysisSchema = {
  type: "object",
  properties: {
    category: { type: "string", enum: ["medical", "insurance", "landlord", "debt", "other"] },
    title: { type: "string", description: "Short case name like 'Riverside Medical · ER bill' (max 40 chars)" },
    counterparty: { type: ["string", "null"], description: "Who sent it" },
    amount_at_stake: { type: ["number", "null"] },
    document_date: { type: ["string", "null"], description: "Date on the document, YYYY-MM-DD" },
    summary: { type: "string", description: "Two plain sentences: what this is and what it asks of the person" },
    findings: {
      type: "array",
      description: "Up to 5 problems, errors, or rights that apply, most valuable first. Empty if nothing looks wrong.",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Max 6 words" },
          detail: { type: "string", description: "One plain sentence" },
          amount: { type: ["number", "null"], description: "Dollar amount this finding could save, if any" },
          rule_name: { type: ["string", "null"], description: "Plain name of the law or rule, only if confident" },
        },
        required: ["title", "detail", "amount", "rule_name"],
      },
    },
    potential_savings: { type: ["number", "null"] },
    red_flag: { type: "boolean" },
    red_flag_reason: { type: ["string", "null"] },
    next_steps: {
      type: "array",
      description: "2-3 options in order of what to try first",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          letter_kind: { type: ["string", "null"], description: "dispute | appeal | followup | complaint | validation | repair | deposit | null" },
        },
        required: ["title", "detail", "letter_kind"],
      },
    },
  },
  required: ["category", "title", "counterparty", "amount_at_stake", "document_date", "summary", "findings", "potential_savings", "red_flag", "red_flag_reason", "next_steps"],
};

export async function analyzeDocument(media: MediaInput[], context: string): Promise<Analysis> {
  return callTool<Analysis>(
    "record_analysis",
    "Record what this document is, what looks wrong, and what the person can do.",
    analysisSchema,
    [...media.map(mediaBlock), { type: "text", text: `Here is what the person told us:\n${context}\n\nRead the document and record your analysis.` }]
  );
}

export interface ReplyAnalysis {
  what_it_says: string;
  whats_missing: string | null;
  what_it_means: string;
  outcome: "won" | "partial" | "denied" | "needs_info" | "other";
  amount_resolved: number | null;
  red_flag: boolean;
  red_flag_reason: string | null;
  next_steps: { title: string; detail: string; letter_kind: string | null }[];
}

export async function analyzeReply(media: MediaInput[], caseContext: string): Promise<ReplyAnalysis> {
  return callTool<ReplyAnalysis>(
    "record_reply",
    "Explain the other side's reply in plain words and what to do next.",
    {
      type: "object",
      properties: {
        what_it_says: { type: "string" },
        whats_missing: { type: ["string", "null"] },
        what_it_means: { type: "string" },
        outcome: { type: "string", enum: ["won", "partial", "denied", "needs_info", "other"] },
        amount_resolved: { type: ["number", "null"] },
        red_flag: { type: "boolean" },
        red_flag_reason: { type: ["string", "null"] },
        next_steps: analysisSchema.properties.next_steps,
      },
      required: ["what_it_says", "whats_missing", "what_it_means", "outcome", "amount_resolved", "red_flag", "red_flag_reason", "next_steps"],
    },
    [...media.map(mediaBlock), { type: "text", text: `This is the other side's reply in an ongoing case.\n${caseContext}` }]
  );
}

export interface DraftLetter {
  recipient: string;
  subject: string;
  body: string;
}

export async function draftLetter(caseContext: string, kind: string, senderName: string): Promise<DraftLetter> {
  return callTool<DraftLetter>(
    "record_letter",
    "Write the letter the person will review, sign and send.",
    {
      type: "object",
      properties: {
        recipient: { type: "string", description: "Who it goes to, e.g. 'Riverside Medical Center · Patient Billing'" },
        subject: { type: "string", description: "Re: line" },
        body: { type: "string", description: "Full letter text from greeting to sign-off, plain text, short paragraphs, firm and polite, under 350 words. Sign with the sender's name. Use [PLACEHOLDERS] for unknown account numbers or addresses." },
      },
      required: ["recipient", "subject", "body"],
    },
    [{ type: "text", text: `Write a ${kind} letter for this case.\nSender: ${senderName || "[YOUR NAME]"}\n${caseContext}\nAsk for the specific fix, cite rules only where the case notes support them, ask for a written response, and request copies of anything the person is entitled to (itemized bill, claim file, validation of the debt) when relevant.` }]
  );
}
