import type { ProblemSlug } from "./marketing";

// Plain-English guides for search. General information, not legal advice.
export type GuideBlock = { h: string; p?: string[]; list?: string[]; steps?: [string, string][] };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  updated: string;
  problem: ProblemSlug;
  intro: string;
  blocks: GuideBlock[];
  faqs: [string, string][];
  cta: string;
  depositTable?: boolean;
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-dispute-a-medical-bill",
    title: "How to dispute a medical bill, step by step",
    description: "Medical bills often contain errors. Here's how to get an itemized bill, spot double charges and surprise fees, ask for financial help and dispute the bill in writing.",
    kicker: "Medical bills",
    updated: "2026-10-11",
    problem: "medical-bills",
    intro: "A confusing medical bill isn't the final word. Hospitals and doctors make billing mistakes, and you have the right to see every charge and ask for corrections before you pay.",
    blocks: [
      {
        h: "Step by step",
        steps: [
          ["Don't pay yet", "Paying first makes refunds harder. Call the billing office, say you're reviewing the bill, and ask them to hold it from collections."],
          ["Ask for an itemized bill", "Request every charge with its date, billing code (CPT or HCPCS) and what was billed to insurance. A summary bill hides mistakes."],
          ["Compare it to your insurance statement", "Your explanation of benefits (EOB) shows what your plan paid and what you owe. The bill should match it."],
          ["Look for common errors", "Duplicate charges, services you didn't get, the wrong number of days, and out-of-network charges at an in-network hospital."],
          ["Ask about financial assistance", "Nonprofit hospitals must have a written financial assistance (charity care) policy. Ask for the application, even if you think you earn too much."],
          ["Dispute in writing", "Send a short letter listing each error and the fix you want, and keep a copy. Written disputes create a record calls don't."],
        ],
      },
      {
        h: "Surprise bills from out-of-network doctors",
        p: ["Under the federal No Surprises Act, you generally can't be billed more than your in-network share for emergency care, or for out-of-network doctors at an in-network hospital you didn't choose. If you get one of these bills, say so in your dispute and contact the No Surprises Help Desk at 1-800-985-3059."],
      },
      {
        h: "Medical debt and your credit report",
        p: ["The three national credit bureaus don't report paid medical collections or medical collections under $500, and unpaid medical debt isn't added until it's a year old. That gives you time to dispute without it hurting your credit."],
      },
    ],
    faqs: [
      ["Should I pay a medical bill I'm disputing?", "Usually not until the dispute is resolved. Ask the billing office in writing to hold the account from collections while they review it."],
      ["How long do I have to dispute a medical bill?", "There's often no single legal deadline, but act within 30 days so it doesn't go to collections. If you were uninsured and got a good faith estimate, you can dispute a bill that's $400 or more above it within 120 days."],
      ["Can I negotiate a medical bill?", "Yes. Many providers offer self-pay or prompt-pay discounts and interest-free payment plans. Ask, and get any agreement in writing before you pay."],
    ],
    cta: "Scan your bill and we'll point out what looks wrong.",
  },
  {
    slug: "how-to-appeal-a-health-insurance-denial",
    title: "How to appeal a health insurance denial",
    description: "A denied claim isn't final. Learn the appeal deadlines, what to include, how long insurers have to decide, and when you can ask for an outside review.",
    kicker: "Insurance denials",
    updated: "2026-10-11",
    problem: "insurance-denials",
    intro: "Insurers deny claims every day for reasons that don't hold up. Most people never appeal, but you have the right to, and an outside reviewer can overrule your plan.",
    blocks: [
      {
        h: "Step by step",
        steps: [
          ["Read the denial letter", "Find the exact reason, the claim number and the appeal deadline. Most plans give you 180 days from the denial to file an internal appeal."],
          ["Ask for your claim file", "You can request, free of charge, the documents and criteria the plan used. It shows you what to answer."],
          ["Get your doctor's support", "A letter or notes from your doctor explaining why the care is medically necessary is often the strongest part of an appeal."],
          ["Write the appeal", "Name the service, date and claim number, answer the reason for the denial point by point, and ask for a reviewer in the same specialty."],
          ["Track their deadline", "Plans generally must decide within 30 days for care you haven't had yet and 60 days for care you've already had, or 72 hours if it's urgent."],
          ["Ask for an external review", "If the final internal appeal is denied, you can usually request an independent external review, generally within 4 months. The plan must follow the reviewer's decision."],
        ],
      },
      {
        h: "Who to complain to",
        p: ["For most individual and small-employer plans, contact your state insurance department. Large employer plans that pay claims themselves are overseen by the U.S. Department of Labor (EBSA). For surprise out-of-network bills, contact the No Surprises Help Desk at 1-800-985-3059."],
      },
    ],
    faqs: [
      ["How long do I have to appeal a denied claim?", "Usually 180 days from the denial notice for an internal appeal under ACA rules, though check your letter. External review requests are generally due within 4 months of the final internal denial."],
      ["Do insurance appeals work?", "Often, especially with your doctor's notes. Many denials are for missing paperwork or coding, which an appeal can fix."],
      ["What if it's urgent?", "Ask for an expedited (urgent) appeal. Plans generally must decide within 72 hours, and you can request an expedited external review at the same time."],
    ],
    cta: "Scan your denial and we'll write the appeal.",
  },
  {
    slug: "how-to-get-your-security-deposit-back",
    title: "How to get your security deposit back",
    description: "Your landlord has a deadline to return your deposit or explain deductions. Here's how to document move-out, send a demand letter and take it to small claims if needed.",
    kicker: "Landlords",
    updated: "2026-10-11",
    problem: "landlords",
    intro: "Every state limits how long a landlord can hold your deposit and what they can deduct for. Normal wear and tear usually isn't a valid deduction.",
    blocks: [
      {
        h: "Step by step",
        steps: [
          ["Document move-out", "Take dated photos and video of every room, and keep your move-in checklist if you have one."],
          ["Give a forwarding address in writing", "In many states the landlord's clock depends on it. Email or mail it and keep a copy."],
          ["Know your state's deadline", "Most states give landlords 14 to 60 days. See the table by state below."],
          ["Send a demand letter", "If the deadline passes or deductions look unfair, send a dated letter asking for the amount owed within 14 days."],
          ["Go to small claims court", "Small claims is built for people without lawyers. Some states let you recover extra if a deposit was kept in bad faith."],
        ],
      },
      {
        h: "What landlords usually can't deduct",
        list: ["Normal wear and tear: faded paint, light carpet wear, small nail holes", "Cleaning beyond returning the unit to its move-in condition", "Repairs for damage that was there when you moved in", "Charges without an itemized list, in states that require one"],
      },
    ],
    faqs: [
      ["How long does a landlord have to return a security deposit?", "It depends on the state, usually 14 to 60 days after move-out. See our state-by-state table."],
      ["What if my landlord never returned my deposit?", "Send a written demand with a deadline. If they don't pay, you can file in small claims court, and some states award extra damages for bad-faith withholding."],
    ],
    cta: "Tell us about your deposit and we'll write the demand letter.",
  },
  {
    slug: "security-deposit-return-deadlines-by-state",
    title: "Security deposit return deadlines by state",
    description: "How long landlords have to return a security deposit in all 50 states and DC, in one table, with what to do if they're late.",
    kicker: "Landlords",
    updated: "2026-10-11",
    problem: "landlords",
    intro: "Here's how long landlords generally have to return a security deposit, or explain deductions, after you move out. The clock often starts at move-out or when you give a forwarding address.",
    blocks: [
      {
        h: "If your landlord misses the deadline",
        p: ["Send a written demand letter that names the deadline and asks for the full deposit within 14 days. If they still don't pay, small claims court is the next step. Laws change and exceptions apply, so check your state's statute or ask a local tenant group if a lot of money is at stake."],
      },
    ],
    faqs: [
      ["Which state has the shortest deposit deadline?", "Several states give landlords about two weeks, including New York, Hawaii, Nebraska and Vermont, while Alabama and Arkansas allow 60 days."],
    ],
    cta: "Deposit late? We'll write the demand letter for your state.",
    depositTable: true,
  },
  {
    slug: "debt-validation-letter",
    title: "Debt validation: how to make a debt collector prove it",
    description: "A debt collector has to prove you owe the debt. Learn your 30-day window, what a validation request does, and what not to say to a collector.",
    kicker: "Debt collectors",
    updated: "2026-10-11",
    problem: "debt-collectors",
    intro: "Debts are bought and sold, and records get lost. Federal law gives you the right to make a collector show what they're collecting and why, before you pay anything.",
    blocks: [
      {
        h: "Step by step",
        steps: [
          ["Find the validation notice", "Collectors must send a notice with the amount, the creditor and your rights. It's usually in the first letter, or within 5 days of first contact."],
          ["Dispute within 30 days", "If you dispute in writing within the 30-day period on that notice, the collector must stop collecting until it sends you verification."],
          ["Ask for specifics", "Ask for the original creditor, an itemization of the amount, and proof they have the right to collect it."],
          ["Check the time limit", "Every state limits how long a debt can be sued on. Collectors can't sue or threaten to sue on debt that's past that limit."],
          ["Keep it in writing", "Send letters by certified mail and log every call. You can also tell a collector in writing to stop contacting you."],
        ],
      },
      {
        h: "What not to do",
        list: ["Don't confirm the debt is yours on the phone", "Don't make a small payment to make calls stop. On an old debt it can restart the time limit in some states", "Don't give bank or card details to a collector you haven't verified", "Don't ignore court papers. If you're sued, respond by the deadline and get legal help"],
      },
      {
        h: "Where to complain",
        p: ["Report collectors who break the rules to the Consumer Financial Protection Bureau, the FTC and your state attorney general."],
      },
    ],
    faqs: [
      ["What is a debt validation letter?", "A written request asking a collector to prove the debt: who the original creditor is, how much is owed and that they have the right to collect. Sent within the 30-day validation period, it pauses collection until they respond."],
      ["What if they never validate the debt?", "They shouldn't keep collecting until they do. If they continue, you can file a complaint with the CFPB and your state attorney general."],
    ],
    cta: "Got a collection letter? We'll write the validation request.",
  },
  {
    slug: "no-surprises-act-explained",
    title: "The No Surprises Act, explained",
    description: "What the No Surprises Act protects you from, which bills it covers, how good faith estimates work if you're uninsured, and how to file a complaint.",
    kicker: "Medical bills",
    updated: "2026-10-11",
    problem: "medical-bills",
    intro: "Since January 1, 2022, the federal No Surprises Act has protected most people from surprise out-of-network bills. Here's what it covers and how to use it.",
    blocks: [
      {
        h: "What it covers",
        list: ["Emergency care, including at an out-of-network emergency room", "Out-of-network doctors at an in-network hospital or surgery center, like anesthesiologists or radiologists, unless you gave advance written consent where allowed", "Air ambulance services (ground ambulances aren't covered)"],
      },
      {
        h: "What you pay",
        p: ["For covered surprise bills, you only owe your normal in-network cost-sharing: your copay, coinsurance or deductible. The provider and your insurer settle the rest between themselves."],
      },
      {
        h: "If you're uninsured or paying yourself",
        p: ["You have the right to a good faith estimate before scheduled care. If the final bill is at least $400 more than the estimate, you can start a dispute within 120 days of the bill."],
      },
      {
        h: "How to complain",
        p: ["Call the No Surprises Help Desk at 1-800-985-3059 or file online with CMS. Include the bill, your insurance statement and any estimate you were given."],
      },
    ],
    faqs: [
      ["Does the No Surprises Act cover ground ambulances?", "No. Air ambulances are covered, but ground ambulance bills are not, though some states have their own protections."],
      ["Can a doctor ask me to waive my No Surprises protections?", "For some non-emergency care, out-of-network providers can ask for written consent in advance. They can't for emergency care, or for services like anesthesia and radiology at an in-network facility."],
    ],
    cta: "Got a surprise bill? Scan it and we'll check it.",
  },
  {
    slug: "how-to-file-a-cfpb-complaint",
    title: "How to file a complaint with the CFPB",
    description: "The Consumer Financial Protection Bureau forwards your complaint to the company and tracks its response. Here's what it covers and how to file a strong complaint.",
    kicker: "Debt collectors",
    updated: "2026-10-11",
    problem: "debt-collectors",
    intro: "The CFPB is a federal agency that takes complaints about debt collectors, credit reports, banks and other financial companies. It's free, and companies generally have to respond.",
    blocks: [
      {
        h: "What you can complain about",
        list: ["Debt collection, including medical debt in collections", "Credit reports (dispute with the credit bureau first)", "Credit cards, bank accounts, loans and mortgages", "Money transfers and prepaid cards"],
      },
      {
        h: "Step by step",
        steps: [
          ["Try the company first", "Send a written dispute and keep a copy. Regulators take complaints more seriously when you've tried to resolve it."],
          ["Gather your documents", "Letters, bills, account statements and a short timeline with dates."],
          ["File online", "Go to consumerfinance.gov/complaint, choose the product, and describe what happened and what you want."],
          ["Watch for the response", "The CFPB sends your complaint to the company. Companies generally respond within 15 days, and you can tell the CFPB if you disagree."],
        ],
      },
    ],
    faqs: [
      ["Does filing a CFPB complaint work?", "Often. Companies generally must respond, and many resolve complaints to avoid regulatory attention. Your complaint also helps the CFPB spot patterns."],
      ["Is it free?", "Yes. Filing a complaint with the CFPB is free."],
    ],
    cta: "We'll write your complaint from your case history.",
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guidesFor = (problem: ProblemSlug) => GUIDES.filter((g) => g.problem === problem);
