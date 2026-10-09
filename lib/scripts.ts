import type { Category } from "./types";

// Phone scripts. General information, written to keep people calm, specific and on the record.
export type Script = { before: string[]; open: string; ask: string[]; avoid: string[]; close: string };

const COMMON_BEFORE = ["Have the letter or bill in front of you", "Find the account, claim or reference number", "Pen and paper, or this page open, to log the call"];
const COMMON_CLOSE = "Can I get your name, an ID or extension, and a reference number for this call? And can you send me what we agreed in writing?";

export const SCRIPTS: Record<Category, Script> = {
  medical: {
    before: [...COMMON_BEFORE, "Your insurance card and the explanation of benefits, if you have one"],
    open: "Hi, I'm calling about my bill, account number [ACCOUNT]. I have questions about some charges and I'd like to sort them out before anything goes to collections.",
    ask: [
      "Can you send me a fully itemized bill with the billing codes?",
      "Was this billed to my insurance, and what did they pay?",
      "I see [CHARGE] twice. Can you check whether that's a duplicate?",
      "Do you have a financial assistance or charity care program? Can you send me the application?",
      "Can you put a hold on the account while this is reviewed, so it doesn't go to collections?",
      "If I pay in full, is there a self-pay or prompt-pay discount?",
    ],
    avoid: ["Agreeing to pay on the call before you've seen the itemized bill", "Giving a card number for a payment you haven't decided on", "Accepting “it's correct” without a written explanation"],
    close: COMMON_CLOSE,
  },
  insurance: {
    before: [...COMMON_BEFORE, "The denial letter and your plan's member ID", "Your doctor's name and office phone"],
    open: "Hi, I'm calling about a denied claim, claim number [CLAIM]. I'd like to understand exactly why it was denied and how to appeal.",
    ask: [
      "What is the specific reason for the denial, and which policy or guideline was used?",
      "Was it reviewed by a doctor? Which specialty?",
      "What's my deadline to file an appeal, and where do I send it?",
      "Can you send me the full claim file and the criteria you used, free of charge?",
      "Is this an urgent situation that qualifies for an expedited appeal?",
      "Is my plan fully insured, or self-funded by my employer?",
    ],
    avoid: ["Accepting a verbal denial as final", "Missing the appeal deadline while waiting for a call back", "Paying the provider in full before the appeal is decided, unless you've agreed a refund"],
    close: COMMON_CLOSE,
  },
  landlord: {
    before: [...COMMON_BEFORE, "Your lease, move-in/move-out photos and any texts or emails"],
    open: "Hi, this is [YOUR NAME], tenant at [ADDRESS]. I'm calling about [my security deposit / a repair], and I'll follow up in writing after this call.",
    ask: [
      "When will I receive my deposit, or an itemized list of deductions?",
      "What exactly is each deduction for, and do you have receipts or photos?",
      "When will the repair be done, and who is doing it?",
      "Can you confirm that in an email or text today?",
    ],
    avoid: ["Agreeing to deductions on the phone", "Threats or arguments — stay factual, it helps you in court", "Relying on a verbal promise without a follow-up in writing"],
    close: "Thanks. I'll send you a short email confirming what we discussed today.",
  },
  debt: {
    before: [...COMMON_BEFORE, "The collector's letter and any earlier letters", "A note of when you last paid this account, if you know"],
    open: "Hi, I received a letter about account [REFERENCE]. I'm not confirming this debt. I'm calling to get information and I'll send my questions in writing.",
    ask: [
      "What is the name of the original creditor?",
      "What amount do you say is owed, and how much is interest and fees?",
      "What is your mailing address for written disputes?",
      "Please note on the account that I dispute this debt.",
    ],
    avoid: ["Saying “yes, that's my debt” — you don't have to confirm anything", "Making any payment, even a small one, before you know more (on old debts it can restart the time limit)", "Giving bank or card details", "Agreeing to a payment plan on the call"],
    close: "Please send everything in writing. I'll be disputing this by mail.",
  },
  other: {
    before: COMMON_BEFORE,
    open: "Hi, I'm calling about [ISSUE], reference [NUMBER]. I'd like to understand what happened and how to fix it.",
    ask: ["Can you explain exactly what this charge or decision is based on?", "What do I need to send to get it corrected?", "Can you send that to me in writing?"],
    avoid: ["Agreeing to anything you haven't seen in writing"],
    close: COMMON_CLOSE,
  },
};
