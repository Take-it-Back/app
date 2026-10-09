import type { CaseRow } from "./types";
import { longDate } from "./format";

/** Plain fallback letters used when AI drafting isn't available. */
export function templateLetter(c: CaseRow, kind: string, name: string) {
  const who = c.counterparty || "[COMPANY NAME]";
  const sign = `\n\nThank you,\n${name || "[YOUR NAME]"}\n[YOUR ADDRESS]\n[YOUR PHONE]`;
  const head = `${longDate(new Date().toISOString())}\n\n${who}\n[THEIR ADDRESS]\n\n`;
  const issues = c.findings?.length
    ? "\n\nSpecifically:\n" + c.findings.map((f, i) => `${i + 1}. ${f.title}: ${f.detail}`).join("\n")
    : "";
  switch (c.category) {
    case "medical":
      return {
        recipient: `${who} · Patient Billing`,
        subject: `Re: Dispute of bill, account [ACCOUNT NUMBER]`,
        body: `${head}To the billing department,\n\nI am writing to dispute the bill for account [ACCOUNT NUMBER].${issues}\n\nPlease send me a fully itemized bill with billing codes, correct any errors, and tell me in writing whether I qualify for financial assistance. Please do not send this account to collections while it is under dispute.${sign}`,
      };
    case "insurance":
      return {
        recipient: `${who} · Appeals`,
        subject: `Re: ${kind === "appeal" ? "Appeal of" : "Request about"} claim [CLAIM NUMBER]`,
        body: `${head}To the appeals department,\n\nI am appealing your decision to deny coverage for claim [CLAIM NUMBER] for [SERVICE] on [DATE OF SERVICE].${issues}\n\nPlease review this decision, and send me, free of charge, a copy of my claim file and the criteria you used. Please reply in writing.${sign}`,
      };
    case "landlord":
      return {
        recipient: `${who}`,
        subject: `Re: [PROPERTY ADDRESS]`,
        body: `${head}Hello,\n\nI am writing about my tenancy at [PROPERTY ADDRESS].${issues}\n\nPlease respond in writing by [DATE] with how you will resolve this. I am keeping copies of all correspondence.${sign}`,
      };
    case "debt":
      return {
        recipient: `${who}`,
        subject: `Re: Dispute and request for validation, reference [REFERENCE NUMBER]`,
        body: `${head}To whom it may concern,\n\nI dispute this debt and request validation. Please send me the name of the original creditor, the amount owed with an itemization, and proof that you are authorized to collect it.${issues}\n\nUntil you validate the debt, please stop collection activity. Please contact me only in writing.${sign}`,
      };
    default:
      return {
        recipient: who,
        subject: "Re: [SUBJECT]",
        body: `${head}Hello,\n\nI am writing about [ISSUE].${issues}\n\nPlease reply in writing.${sign}`,
      };
  }
}
