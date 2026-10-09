import type { CaseRow, Category } from "./types";
import { longDate, money } from "./format";
import { addDays } from "./rules";

// Every letter the app can write. Used by the letter menu, the AI drafter and the plain templates.

export type Sender = { name: string; address?: string | null; phone?: string | null };
export type LetterGroup = "Fight it" | "Lower the bill" | "Get your records" | "Follow up" | "Escalate";

export type LetterKind = {
  key: string;
  label: string;
  blurb: string;
  group: LetterGroup;
  categories: Category[] | "all";
  /** Extra instructions for the AI drafter. */
  guide: string;
  /** What the other side owes after it's sent. */
  their?: { days: number; title: string; note: string };
  caution?: string;
};

export const LETTER_KINDS: LetterKind[] = [
  // Medical bills
  { key: "dispute", label: "Dispute the bill", blurb: "Point out the errors and ask them to fix and re-bill.", group: "Fight it", categories: ["medical"], guide: "Dispute specific charges, ask for a corrected itemized bill, and ask them to hold the account from collections while it is reviewed." },
  { key: "itemized_bill", label: "Ask for an itemized bill", blurb: "Every line, with billing codes. The first step on any big bill.", group: "Get your records", categories: ["medical"], guide: "Request a fully itemized bill with CPT/HCPCS codes, dates of service and the amount billed to insurance, and a hold on collections until it arrives." },
  { key: "discount", label: "Ask for a lower bill", blurb: "Request a self-pay or prompt-pay discount on what's left.", group: "Lower the bill", categories: ["medical"], guide: "Politely ask for a reduction of the balance (self-pay, prompt-pay or hardship discount), propose a specific lower amount if the case gives one, and ask for written confirmation of any agreed amount." },
  { key: "payment_plan", label: "Ask for a payment plan", blurb: "Spread it out with no interest, and stop collections.", group: "Lower the bill", categories: ["medical", "debt"], guide: "Ask for an interest-free monthly payment plan at an amount the person can afford ([MONTHLY AMOUNT]), ask that the account not be sent to or reported by collections while the plan is kept, and ask for the terms in writing. For a debt collector, do not admit the debt is valid beyond what the person chooses." },
  { key: "charity_care", label: "Apply for financial help", blurb: "Ask for their charity care policy and an application.", group: "Lower the bill", categories: ["medical"], guide: "Ask for the hospital's financial assistance (charity care) policy and application, say the person wants to be screened for assistance, and ask them to pause billing and collections while the application is reviewed." },
  { key: "records_request", label: "Request your medical records", blurb: "Your right under HIPAA. They generally have 30 days.", group: "Get your records", categories: ["medical", "insurance"], guide: "Request a copy of the person's medical records (or designated record set) under their HIPAA right of access, in electronic form if available, for the dates of service in the case. Note that providers generally must respond within 30 days.", their: { days: 30, title: "Your records are due", note: "Under HIPAA, providers generally have 30 days to provide records (one 30-day extension is allowed)." } },
  // Insurance
  { key: "appeal", label: "Appeal the denial", blurb: "Ask them to reverse it, with your doctor's support.", group: "Fight it", categories: ["insurance"], guide: "Write an internal appeal of the denial: state the service, claim number, why it is medically necessary, reference the doctor's support, ask for a reviewer in the same specialty, and request the claim file and criteria used." },
  { key: "external_review", label: "Ask for an outside review", blurb: "An independent doctor decides, not your plan.", group: "Escalate", categories: ["insurance"], guide: "Request an external (independent) review of the final internal denial, summarize why the service is medically necessary, and ask the plan to forward the case file to the independent review organization.", their: { days: 45, title: "Outside review decision", note: "Standard external reviews are generally decided within 45 days; urgent ones much faster." } },
  { key: "claim_file", label: "Request your claim file", blurb: "Everything they used to deny you, free of charge.", group: "Get your records", categories: ["insurance"], guide: "Request, free of charge, a complete copy of the claim file: all documents, records, guidelines, criteria and reviewer notes used in the decision, and the name and credentials of each reviewer." },
  // Landlords
  { key: "demand", label: "Demand your deposit or a fix", blurb: "A firm, dated demand that starts their clock.", group: "Fight it", categories: ["landlord"], guide: "Write a demand letter: the facts with dates, what the law in the person's state generally requires, the exact amount or fix demanded, a deadline of 14 days, and that the person may file in small claims court if it is not resolved." },
  { key: "repair_request", label: "Request repairs in writing", blurb: "Creates the record you need if they ignore it.", group: "Fight it", categories: ["landlord"], guide: "Request specific repairs in writing, describe the problem and when it started, note any health or safety impact, give a reasonable deadline, and ask for written confirmation of when the work will be done.", their: { days: 14, title: "Repairs should be scheduled", note: "Suggested follow-up date. Urgent safety repairs may require faster action under your state's rules." } },
  // Debt collectors
  { key: "validation", label: "Make them prove it", blurb: "Ask for proof. They must pause collecting until they answer.", group: "Fight it", categories: ["debt"], guide: "Dispute the debt and request validation: the original creditor, an itemization of the amount, and proof they are authorized to collect. Ask them to stop collection until they validate. Do not admit the debt." },
  { key: "cease_contact", label: "Tell them to stop contacting you", blurb: "In writing, they must stop, except to confirm or say what's next.", group: "Fight it", categories: ["debt"], guide: "Tell the collector in writing to stop all communication about the account, except as the law allows (to confirm they will stop, or to notify of a specific action). Do not admit the debt.", caution: "This stops calls, but it doesn't make the debt go away, and they can still sue. Ask them to prove it first if you're unsure it's yours." },
  { key: "settlement_offer", label: "Offer to settle for less", blurb: "Propose a lump sum to close it for good.", group: "Lower the bill", categories: ["debt"], guide: "Offer a lump-sum settlement of [OFFER AMOUNT] to resolve the account in full, require written agreement before any payment, ask that it be reported as paid in full or deleted, and state that this is not an admission that the debt is valid.", caution: "On an old debt, a payment or a written promise to pay can restart the time limit in some states. Check the time limit first." },
  // Everyone
  { key: "followup", label: "Follow up", blurb: "They went quiet. A short, firm nudge.", group: "Follow up", categories: "all", guide: "Write a short, firm follow-up referencing the earlier letter and date, noting no response has been received, restating the request, and giving a new deadline of 10 days before escalating to a regulator." },
  { key: "complaint", label: "Complaint to a regulator", blurb: "File with the agency that oversees them.", group: "Escalate", categories: "all", guide: "Write the text for a complaint to a government agency: who the company is, what happened with dates and amounts, what the person already did to resolve it (letters and calls), and the specific outcome wanted. Neutral, factual, under 300 words, first person.", their: { days: 15, title: "Company response to your complaint", note: "Agencies forward complaints to the company; many companies respond within 15 days. Check the agency portal for updates." } },
  { key: "credit_dispute", label: "Dispute your credit report", blurb: "Ask a credit bureau to fix or remove the item.", group: "Escalate", categories: "all", guide: "Write a credit report dispute to the credit bureau: identify the person, the company that reported the item and the partial account number, explain why it is inaccurate or should be removed, ask for it to be corrected or deleted, and ask for a free copy of the updated report.", their: { days: 30, title: "Credit bureau results due", note: "Credit bureaus generally must investigate within 30 days of receiving a dispute." } },
  { key: "small_claims_statement", label: "Small claims statement", blurb: "Your side of the story, ready for the court form.", group: "Escalate", categories: "all", guide: "Write a plain statement of claim for small claims court: who the defendant is, the facts in date order, the amount claimed and how it was calculated, and the evidence attached. Neutral and factual." },
];

export const kindInfo = (key: string) => LETTER_KINDS.find((k) => k.key === key);
export const kindsFor = (cat: Category) => LETTER_KINDS.filter((k) => k.categories === "all" || k.categories.includes(cat));

export const BUREAUS = {
  equifax: { name: "Equifax", address: "Equifax Information Services, LLC\nP.O. Box 740256\nAtlanta, GA 30374-0256", online: "https://www.equifax.com/personal/credit-report-services/credit-dispute/" },
  experian: { name: "Experian", address: "Experian\nP.O. Box 4500\nAllen, TX 75013", online: "https://www.experian.com/disputes/main.html" },
  transunion: { name: "TransUnion", address: "TransUnion Consumer Solutions\nP.O. Box 2000\nChester, PA 19016-2000", online: "https://www.transunion.com/credit-disputes/dispute-your-credit" },
} as const;
export type BureauKey = keyof typeof BUREAUS;

export type Agency = { key: string; name: string; what: string; url: string; phone?: string; categories: Category[]; note?: string };

export const AGENCIES: Agency[] = [
  { key: "cms_nsa", name: "No Surprises Help Desk (CMS)", what: "Surprise medical bills and out-of-network charges at in-network facilities.", url: "https://www.cms.gov/medical-bill-rights/help/submit-a-complaint", phone: "1-800-985-3059", categories: ["medical", "insurance"] },
  { key: "state_insurance", name: "Your state insurance department", what: "Denied claims and slow or unfair handling by insurance companies.", url: "https://content.naic.org/state-insurance-departments", categories: ["insurance"], note: "Covers most individual and small-employer plans. Large employer plans are usually the Department of Labor." },
  { key: "dol_ebsa", name: "U.S. Department of Labor (EBSA)", what: "Health plans from large employers that pay claims themselves.", url: "https://www.dol.gov/agencies/ebsa", phone: "1-866-444-3272", categories: ["insurance"] },
  { key: "cfpb", name: "Consumer Financial Protection Bureau", what: "Debt collectors, credit reports, and medical debt in collections.", url: "https://www.consumerfinance.gov/complaint/", categories: ["debt", "medical"], note: "For credit report errors, dispute with the credit bureau first." },
  { key: "ftc", name: "Federal Trade Commission", what: "Abusive or deceptive debt collectors and scams.", url: "https://reportfraud.ftc.gov/", categories: ["debt"] },
  { key: "hhs_ocr", name: "HHS Office for Civil Rights", what: "Providers that refuse or delay your medical records.", url: "https://www.hhs.gov/hipaa/filing-a-complaint/index.html", categories: ["medical"] },
  { key: "state_ag", name: "Your state attorney general", what: "Consumer protection complaints against any business, including landlords.", url: "https://www.naag.org/find-my-ag/", categories: ["medical", "insurance", "landlord", "debt"] },
  { key: "code_enforcement", name: "Your city or county code enforcement", what: "Unsafe conditions and repairs your landlord ignores. Search your city name and “code enforcement.”", url: "https://www.usa.gov/local-governments", categories: ["landlord"] },
];
export const agencyFor = (key?: string | null) => AGENCIES.find((a) => a.key === key);

function sign(s: Sender) {
  return `\n\nSincerely,\n${s.name || "[YOUR NAME]"}\n${s.address || "[YOUR ADDRESS]"}${s.phone ? `\n${s.phone}` : ""}`;
}

function issues(c: CaseRow) {
  return c.findings?.length ? "\n\n" + c.findings.map((f, i) => `${i + 1}. ${f.title}${f.amount ? ` (${money(f.amount)})` : ""}: ${f.detail}`).join("\n") : "";
}

/** Plain, editable letters used when AI drafting is off or fails. */
export function templateFor(c: CaseRow, kind: string, s: Sender, extra: { agency?: string; bureau?: BureauKey; history?: string } = {}) {
  const who = c.counterparty || "[COMPANY NAME]";
  const today = longDate(new Date().toISOString());
  const head = (to: string) => `${today}\n\n${to}\n\n`;
  const acct = c.category === "insurance" ? "claim [CLAIM NUMBER]" : c.category === "debt" ? "reference [REFERENCE NUMBER]" : c.category === "landlord" ? "[PROPERTY ADDRESS]" : "account [ACCOUNT NUMBER]";
  const amt = c.amount_at_stake ? money(c.amount_at_stake) : "[AMOUNT]";
  const S = sign(s);
  switch (kind) {
    case "itemized_bill":
      return { recipient: `${who} · Patient Billing`, subject: `Request for itemized bill, ${acct}`, body: `${head(`${who}\nPatient Billing\n[THEIR ADDRESS]`)}To the billing department,\n\nPlease send me a fully itemized bill for ${acct}, including each charge, the date of service, the CPT or HCPCS code, and the amount billed to and paid by my insurance.\n\nPlease hold this account from collections until I have received and reviewed the itemized bill.${S}` };
    case "discount":
      return { recipient: `${who} · Patient Billing`, subject: `Request to reduce balance, ${acct}`, body: `${head(`${who}\nPatient Billing\n[THEIR ADDRESS]`)}To the billing department,\n\nI am writing about my balance of ${amt} on ${acct}. Paying this in full would be a serious hardship.\n\nI am asking you to reduce the balance to [OFFER AMOUNT] through a self-pay, prompt-pay or hardship discount. If you agree, please confirm the reduced amount in writing before I pay.\n\nPlease hold the account from collections while you review this request.${S}` };
    case "payment_plan":
      return { recipient: who, subject: `Request for a payment plan, ${acct}`, body: `${head(`${who}\n[THEIR ADDRESS]`)}Hello,\n\nI am writing about ${acct}. I am asking for an interest-free payment plan of [MONTHLY AMOUNT] per month.\n\nPlease confirm the plan terms in writing, and confirm that the account will not be sent to collections or reported to credit bureaus while I keep to the plan.${c.category === "debt" ? "\n\nThis letter is not an acknowledgment that I owe this debt." : ""}${S}` };
    case "charity_care":
      return { recipient: `${who} · Financial Assistance`, subject: `Request for financial assistance, ${acct}`, body: `${head(`${who}\nFinancial Assistance Office\n[THEIR ADDRESS]`)}To the financial assistance office,\n\nPlease send me your financial assistance (charity care) policy and application, and screen me for assistance for ${acct}.\n\nPlease pause billing and collection activity on this account while my application is reviewed.${S}` };
    case "records_request":
      return { recipient: `${who} · Medical Records`, subject: "Request for my medical records", body: `${head(`${who}\nMedical Records / Health Information Management\n[THEIR ADDRESS]`)}To the records department,\n\nUnder my right of access under HIPAA, I request a copy of my medical records, including billing records, for dates of service [DATES]. I would like them in electronic form if available.\n\nMy date of birth is [DATE OF BIRTH]. Please tell me in writing if you need anything else to process this request.${S}` };
    case "claim_file":
      return { recipient: `${who} · Appeals`, subject: `Request for claim file, ${acct}`, body: `${head(`${who}\nAppeals Department\n[THEIR ADDRESS]`)}To the appeals department,\n\nPlease send me, free of charge, a complete copy of the claim file for ${acct}, including all documents, records, internal guidelines and criteria used in your decision, and the name and credentials of each person who reviewed it.${S}` };
    case "external_review":
      return { recipient: `${who} · Appeals`, subject: `Request for external review, ${acct}`, body: `${head(`${who}\nAppeals Department\n[THEIR ADDRESS]`)}To the appeals department,\n\nI request an external review by an independent review organization of your final decision to deny ${acct}.${issues(c)}\n\nPlease forward my complete case file to the independent reviewer and confirm in writing when you have done so.${S}` };
    case "appeal":
      return { recipient: `${who} · Appeals`, subject: `Appeal of denied ${acct}`, body: `${head(`${who}\nAppeals Department\n[THEIR ADDRESS]`)}To the appeals department,\n\nI am appealing your decision to deny coverage for [SERVICE] on [DATE OF SERVICE], ${acct}.${issues(c)}\n\nMy doctor's notes, attached, explain why this care is medically necessary. Please have a reviewer in the same specialty review this appeal, and send me a copy of the claim file and criteria you used.${S}` };
    case "demand":
      return { recipient: who, subject: `Demand regarding ${acct}`, body: `${head(`${who}\n[THEIR ADDRESS]`)}Hello,\n\nI am writing about my tenancy at ${acct}.${issues(c)}\n\nI demand ${amt !== "[AMOUNT]" ? `payment of ${amt}` : "[WHAT YOU WANT]"} within 14 days of this letter. If this is not resolved, I may file a claim in small claims court. I am keeping copies of all correspondence.${S}` };
    case "repair_request":
      return { recipient: who, subject: `Repair request, ${acct}`, body: `${head(`${who}\n[THEIR ADDRESS]`)}Hello,\n\nI am requesting repairs at ${acct}:\n\n1. [PROBLEM], first noticed on [DATE].\n\nPlease make these repairs by [DATE] and confirm in writing when the work will be done.${S}` };
    case "validation":
      return { recipient: who, subject: `Dispute and request for validation, ${acct}`, body: `${head(`${who}\n[THEIR ADDRESS]`)}To whom it may concern,\n\nI dispute this debt and request validation. Please send me the name of the original creditor, an itemization of the amount you claim, and proof that you are authorized to collect it.${issues(c)}\n\nUntil you validate the debt, please stop collection activity. Please contact me only in writing.${S}` };
    case "cease_contact":
      return { recipient: who, subject: `Request to stop contact, ${acct}`, body: `${head(`${who}\n[THEIR ADDRESS]`)}To whom it may concern,\n\nPlease stop all communication with me about ${acct}, except as the law allows.\n\nThis letter is not an acknowledgment that I owe this debt.${S}` };
    case "settlement_offer":
      return { recipient: who, subject: `Settlement offer, ${acct}`, body: `${head(`${who}\n[THEIR ADDRESS]`)}To whom it may concern,\n\nTo resolve ${acct}, I offer a one-time payment of [OFFER AMOUNT] as settlement in full.\n\nIf you accept, please send written agreement that this payment resolves the account in full and that it will be reported as paid in full (or deleted) with the credit bureaus. I will not pay until I receive this agreement in writing.\n\nThis offer is not an acknowledgment that I owe this debt.${S}` };
    case "followup":
      return { recipient: who, subject: `Follow-up: ${acct}`, body: `${head(`${who}\n[THEIR ADDRESS]`)}Hello,\n\nI wrote to you on [DATE OF FIRST LETTER] about ${acct} and have not received a response.\n\nPlease respond in writing within 10 days. If I do not hear from you, I will file a complaint with the appropriate regulator.${S}` };
    case "complaint": {
      const a = agencyFor(extra.agency);
      return { recipient: a?.name || "[AGENCY]", subject: `Complaint about ${who}`, body: `I am filing a complaint about ${who}.\n\nWhat happened: ${c.summary || "[DESCRIBE WHAT HAPPENED]"}${issues(c)}\n\nWhat I have done: ${extra.history || "[LETTERS AND CALLS, WITH DATES]"}\n\nWhat I want: [THE FIX YOU WANT, e.g. remove the charge, approve the claim, return my deposit].\n\n${s.name || "[YOUR NAME]"}` };
    }
    case "credit_dispute": {
      const b = BUREAUS[extra.bureau || "equifax"];
      return { recipient: b.name, subject: `Dispute of inaccurate information`, body: `${head(b.address)}To ${b.name},\n\nI am disputing an item on my credit report.\n\nName: ${s.name || "[YOUR NAME]"}\nAddress: ${s.address || "[YOUR ADDRESS]"}\nDate of birth: [DATE OF BIRTH]\nLast four of SSN: [LAST 4]\n\nItem: ${who}, account ending [LAST 4 OF ACCOUNT]\n\nThis item is inaccurate because [REASON — e.g. it is not my debt, it is being disputed, it was paid, or medical debt that should not appear].${issues(c)}\n\nPlease investigate, correct or delete this item, and send me a free copy of my updated report. A copy of my ID and supporting documents are enclosed.${S}` };
    }
    case "small_claims_statement":
      return { recipient: "Small claims court", subject: `Statement of claim against ${who}`, body: `Plaintiff: ${s.name || "[YOUR NAME]"}\nDefendant: ${who}\nAmount claimed: ${amt}\n\nWhat happened:\n${c.summary || "[FACTS IN DATE ORDER]"}${issues(c)}\n\nWhat I did to resolve it: ${extra.history || "[LETTERS SENT, WITH DATES]"}\n\nHow I calculated the amount: [CALCULATION]\n\nEvidence attached: [LIST — lease, photos, letters, receipts]` };
    default: {
      // Category default: the main "fight it" letter
      const main = c.category === "insurance" ? "appeal" : c.category === "debt" ? "validation" : c.category === "landlord" ? "demand" : "dispute";
      if (main !== "dispute" && kind !== main) return templateFor(c, main, s, extra);
      return { recipient: `${who} · Patient Billing`, subject: `Dispute of bill, ${acct}`, body: `${head(`${who}\nPatient Billing\n[THEIR ADDRESS]`)}To the billing department,\n\nI am writing to dispute the bill for ${acct}.${issues(c)}\n\nPlease correct these errors, send me a corrected, fully itemized bill, and tell me in writing whether I qualify for financial assistance. Please do not send this account to collections while it is under dispute.${S}` };
    }
  }
}

export function theirDeadlineFor(kind: string, fallback: { title: string; due: string; note: string }, sent: string) {
  const k = kindInfo(kind);
  if (!k?.their) return fallback;
  return { title: k.their.title, due: addDays(sent, k.their.days), note: k.their.note };
}

export function senderAddress(p: { address_line1?: string | null; address_line2?: string | null; address_city?: string | null; address_state?: string | null; address_zip?: string | null } | null | undefined) {
  if (!p?.address_line1) return null;
  return [p.address_line1, p.address_line2, `${p.address_city || ""}${p.address_city ? ", " : ""}${p.address_state || ""} ${p.address_zip || ""}`.trim()].filter(Boolean).join("\n");
}
