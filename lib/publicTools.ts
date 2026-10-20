// Data for the free tools. Everything here comes from federal rules already described (and fact-checked) in the guides.
// Tools run in the browser only; nothing a person types is saved or sent.

export type DeadlineItem = {
  id: string;
  label: string;
  /** What the clock starts from, in the reader's words. */
  from: string;
  days: number;
  /** "calendar" counts every day. "sundays" skips Sundays (Cooling-Off Rule). */
  count: "calendar" | "sundays";
  note: string;
  guide?: string;
};

export const DEADLINES: DeadlineItem[] = [
  { id: "collector", label: "Dispute a debt with a collector", from: "the day you got the collector's first notice", days: 30, count: "calendar", note: "Disputing in writing inside this window makes the collector stop collecting until they send proof. You can still dispute later, but you lose this protection.", guide: "debt-validation-letter" },
  { id: "card-error", label: "Dispute a credit card billing error", from: "the day the statement with the error was mailed or sent", days: 60, count: "calendar", note: "Send the dispute in writing to the address for billing errors on your statement.", guide: "dispute-unauthorized-credit-card-charge" },
  { id: "debit-report", label: "Report unauthorized debit or electronic transfers", from: "the day the statement showing them was sent", days: 60, count: "calendar", note: "Reporting faster limits what you can lose. Tell the bank as soon as you see it.", guide: "debit-card-fraud-liability-and-deadlines" },
  { id: "debit-lost", label: "Report a lost or stolen debit card to keep losses to $50", from: "the day you learned the card was lost or stolen", days: 2, count: "calendar", note: "Counted in business days under the federal rule. Call the bank right away; do not wait.", guide: "debit-card-fraud-liability-and-deadlines" },
  { id: "cooling-off", label: "Cancel a door-to-door sale", from: "the day you signed", days: 3, count: "sundays", note: "Sundays and federal holidays do not count, so check for a holiday. Cancel in writing and keep proof you sent it.", guide: "cooling-off-rule-cancel-door-to-door-sale" },
  { id: "bureau", label: "Hear back from a credit bureau", from: "the day the bureau got your dispute", days: 30, count: "calendar", note: "Up to 45 days if you send extra information during the first 30. If they don't answer, escalate.", guide: "how-to-dispute-credit-report-errors" },
  { id: "appeal", label: "Appeal a health insurance denial (first appeal)", from: "the day you got the denial notice", days: 180, count: "calendar", note: "Many plans give at least this long. Check your notice, since your plan may set a date. Urgent care can be reviewed much faster.", guide: "how-to-appeal-a-health-insurance-denial" },
  { id: "medicare", label: "Ask Medicare to redetermine a denied claim", from: "the day you got the Medicare Summary Notice", days: 120, count: "calendar", note: "This is the first level of a Medicare appeal. Check medicare.gov for the current steps.", guide: "medicare-appeals-levels-explained" },
  { id: "gfe", label: "Dispute a bill far above your good faith estimate", from: "the date of the bill", days: 120, count: "calendar", note: "Applies to uninsured and self-pay patients whose bill is $400 or more above the estimate.", guide: "good-faith-estimate-for-uninsured-and-self-pay-patients" },
  { id: "special", label: "Sign up for marketplace coverage after losing job coverage", from: "the day your coverage ended", days: 60, count: "calendar", note: "Check healthcare.gov for the current rules for your situation.", guide: "lost-job-based-health-insurance-cobra-special-enrollment" },
  { id: "hud", label: "File a housing discrimination complaint with HUD", from: "the day of the last discriminatory act", days: 365, count: "calendar", note: "HUD gives one year. Some states and cities set shorter or longer limits.", guide: "housing-discrimination-how-to-file-hud-complaint" },
  { id: "eeoc", label: "File a job discrimination charge with the EEOC", from: "the day of the discriminatory act", days: 180, count: "calendar", note: "This stretches to 300 days in many states. Act early, because the limit is strict.", guide: "workplace-retaliation-how-to-file-a-complaint" },
  { id: "osha", label: "File a safety retaliation complaint with OSHA", from: "the day you were fired or punished", days: 30, count: "calendar", note: "Some other retaliation laws have different limits. Act quickly.", guide: "workplace-retaliation-how-to-file-a-complaint" },
];

/** Add days to a yyyy-mm-dd date, either every day or skipping Sundays. */
export function addDeadline(start: string, days: number, count: "calendar" | "sundays"): Date | null {
  const d = new Date(start + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  if (count === "calendar") { d.setUTCDate(d.getUTCDate() + days); return d; }
  let left = days;
  while (left > 0) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() !== 0) left--; }
  return d;
}

/** Add weekdays (skips Saturday and Sunday). */
export function addWeekdays(start: string, days: number): Date | null {
  const d = new Date(start + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  let left = days;
  while (left > 0) { d.setUTCDate(d.getUTCDate() + 1); const w = d.getUTCDay(); if (w !== 0 && w !== 6) left--; }
  return d;
}

export const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export type LetterField = { id: string; label: string; placeholder?: string; multiline?: boolean; optional?: boolean };
export type LetterTemplate = {
  id: string;
  label: string;
  to: string;
  fields: LetterField[];
  build: (v: Record<string, string>) => string[];
  guide?: string;
};

const f = (v: Record<string, string>, k: string, fallback: string) => (v[k] || "").trim() || fallback;
const sign = (v: Record<string, string>) => ["Sincerely,", f(v, "name", "[YOUR NAME]"), f(v, "address", "[YOUR ADDRESS]")];
const head = (v: Record<string, string>, who: string) => [f(v, "date", "[DATE]"), "", who, "", f(v, "ref", "") ? `Re: Account or reference number ${f(v, "ref", "")}` : "Re: [ACCOUNT OR REFERENCE NUMBER]", ""];

const COMMON: LetterField[] = [
  { id: "name", label: "Your name" },
  { id: "address", label: "Your address", optional: true },
  { id: "to", label: "Who you're writing to", placeholder: "Company or office name" },
  { id: "ref", label: "Account or reference number", optional: true },
  { id: "date", label: "Today's date", placeholder: "October 20, 2026", optional: true },
];

export const LETTERS: LetterTemplate[] = [
  {
    id: "itemized", label: "Ask for an itemized medical bill", to: "Billing office", guide: "how-to-get-an-itemized-medical-bill",
    fields: [...COMMON, { id: "service", label: "Date and place of service", placeholder: "March 2 emergency visit" }],
    build: (v) => [
      ...head(v, f(v, "to", "[BILLING OFFICE]")),
      "To the billing office:", "",
      `I am asking for a fully itemized statement for the services I received on ${f(v, "service", "[DATE OF SERVICE]")}. Please include each charge with its date, billing code and the amount billed, and the claim form sent to my insurer if I have one.`,
      "Please place my account on hold and do not send it to collections until I have had time to review the itemized statement.",
      "Please send it to the address above within 30 days. I can be reached to discuss this at [PHONE OR EMAIL].", "",
      ...sign(v),
    ],
  },
  {
    id: "validation", label: "Ask a debt collector to prove the debt", to: "Debt collector", guide: "debt-validation-letter",
    fields: [...COMMON, { id: "amount", label: "Amount they say you owe", optional: true }],
    build: (v) => [
      ...head(v, f(v, "to", "[COLLECTOR NAME]")),
      "To whom it may concern:", "",
      `I received a notice from you dated [DATE OF NOTICE]${f(v, "amount", "") ? ` saying I owe ${f(v, "amount", "")}` : ""}. I am disputing this debt and I am asking you to validate it.`,
      "Please send me the name of the original creditor, the amount you say I owe and how you calculated it, and proof that you have the right to collect it. Until you do, please stop collection efforts on this debt.",
      "Please contact me only in writing at the address above.", "",
      ...sign(v),
    ],
  },
  {
    id: "credit", label: "Dispute an error on your credit report", to: "Credit bureau", guide: "how-to-dispute-credit-report-errors",
    fields: [...COMMON, { id: "item", label: "The item that is wrong", placeholder: "Account name and number" }, { id: "why", label: "Why it is wrong", multiline: true }],
    build: (v) => [
      ...head(v, f(v, "to", "[CREDIT BUREAU NAME]")),
      "To whom it may concern:", "",
      `I am disputing information on my credit report: ${f(v, "item", "[ITEM]")}.`,
      f(v, "why", "[EXPLAIN WHAT IS WRONG AND WHAT IT SHOULD SAY]"),
      "Please investigate this item, correct or delete it if it cannot be verified, and send me the results and a free copy of my updated report. I have enclosed copies of my supporting documents.", "",
      ...sign(v),
      "Enclosed: [LIST YOUR DOCUMENTS]",
    ],
  },
  {
    id: "billing", label: "Dispute a charge with a company", to: "Company", guide: "dispute-unauthorized-credit-card-charge",
    fields: [...COMMON, { id: "amount", label: "Amount of the charge" }, { id: "what", label: "What went wrong", multiline: true }, { id: "ask", label: "What you want", placeholder: "A refund of the charge" }],
    build: (v) => [
      ...head(v, f(v, "to", "[COMPANY NAME]")),
      "To whom it may concern:", "",
      `I am writing to dispute a charge of ${f(v, "amount", "[AMOUNT]")} on my account.`,
      f(v, "what", "[DESCRIBE WHAT HAPPENED, WITH DATES]"),
      `I am asking for ${f(v, "ask", "[WHAT YOU WANT]")}. Please reply in writing within 14 days. I have kept copies of my records.`, "",
      ...sign(v),
    ],
  },
  {
    id: "refund", label: "Ask for a refund", to: "Company", guide: "store-refuses-refund-your-rights",
    fields: [...COMMON, { id: "item", label: "What you bought", placeholder: "Item or service, date and price" }, { id: "why", label: "Why you want a refund", multiline: true }],
    build: (v) => [
      ...head(v, f(v, "to", "[COMPANY NAME]")),
      "To whom it may concern:", "",
      `I am asking for a refund for ${f(v, "item", "[WHAT YOU BOUGHT, DATE AND PRICE]")}.`,
      f(v, "why", "[WHY YOU WANT A REFUND]"),
      "Please refund the full amount to my original payment method and confirm in writing within 14 days.", "",
      ...sign(v),
    ],
  },
  {
    id: "cancel", label: "Cancel a subscription or membership", to: "Company", guide: "cancel-subscription-free-trial-trap",
    fields: [...COMMON, { id: "what", label: "What you're cancelling", placeholder: "Membership or plan name" }],
    build: (v) => [
      ...head(v, f(v, "to", "[COMPANY NAME]")),
      "To whom it may concern:", "",
      `I am cancelling ${f(v, "what", "[MEMBERSHIP OR SUBSCRIPTION]")}, effective immediately. Please stop all future charges and confirm the cancellation in writing.`,
      "If any charges are made after today, I will dispute them with my card company or bank and ask for a refund.", "",
      ...sign(v),
    ],
  },
  {
    id: "repairs", label: "Ask your landlord for repairs", to: "Landlord", guide: "how-to-demand-repairs-from-your-landlord",
    fields: [{ id: "name", label: "Your name" }, { id: "address", label: "Rental address" }, { id: "to", label: "Landlord or manager's name" }, { id: "date", label: "Today's date", optional: true, placeholder: "October 20, 2026" }, { id: "problem", label: "What needs fixing", multiline: true, placeholder: "Describe each problem and when it started" }],
    build: (v) => [
      f(v, "date", "[DATE]"), "",
      f(v, "to", "[LANDLORD OR MANAGER]"), "",
      `Re: Repairs needed at ${f(v, "address", "[RENTAL ADDRESS]")}`, "",
      "Dear landlord:", "",
      "I am writing to ask for repairs to my home. The problems are:",
      f(v, "problem", "[DESCRIBE EACH PROBLEM AND WHEN IT STARTED]"),
      "Please fix these as soon as possible and tell me in writing when the work will be done. I will allow access at reasonable times with notice. I am keeping a copy of this letter and photos of the problems.", "",
      "Sincerely,", f(v, "name", "[YOUR NAME]"),
    ],
  },
  {
    id: "deposit", label: "Ask for your security deposit back", to: "Landlord", guide: "security-deposit-demand-letter-template",
    fields: [{ id: "name", label: "Your name" }, { id: "address", label: "Rental address you moved out of" }, { id: "forward", label: "Where to send the deposit", placeholder: "Your new mailing address" }, { id: "to", label: "Landlord or manager's name" }, { id: "date", label: "Today's date", optional: true, placeholder: "October 20, 2026" }, { id: "moveout", label: "Move-out date", placeholder: "September 30, 2026" }, { id: "amount", label: "Deposit amount", optional: true }],
    build: (v) => [
      f(v, "date", "[DATE]"), "",
      f(v, "to", "[LANDLORD OR MANAGER]"), "",
      `Re: Security deposit for ${f(v, "address", "[RENTAL ADDRESS]")}`, "",
      "Dear landlord:", "",
      `I moved out of the home above on ${f(v, "moveout", "[MOVE-OUT DATE]")}. I paid a security deposit${f(v, "amount", "") ? ` of ${f(v, "amount", "")}` : ""}. I have not received it or an itemized list of deductions.`,
      `Please return my deposit and send any itemized list of deductions to ${f(v, "forward", "[NEW MAILING ADDRESS]")}. State law sets the deadline for this, and many states allow a penalty when a landlord misses it.`,
      "If I do not hear from you within 14 days, I will consider my options, which may include small claims court.", "",
      "Sincerely,", f(v, "name", "[YOUR NAME]"),
    ],
  },
];
