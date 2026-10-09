// Content for the marketing site. Kept in one place so every page stays consistent.

export type ScenarioKey = "medical" | "insurance" | "renters" | "debt";

export type Scenario = {
  key: ScenarioKey;
  tag: string;
  counterparty: string;
  title: string;
  amount: string;
  savings: string;
  summary: string;
  findings: { title: string; amount?: string; rule?: string }[];
  letter: { to: string; subject: string; lines: string[] };
  you: { label: string; days: string; date: string };
  them: { label: string; days: string };
  timeline: { date: string; text: string }[];
  reply: { verdict: string; said: string; next: string };
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  medical: {
    key: "medical",
    tag: "Medical bill",
    counterparty: "Riverside Medical",
    title: "ER visit · March 2",
    amount: "$4,180",
    savings: "$1,762",
    summary: "This ER bill has a double charge and a surprise out-of-network fee you shouldn't have to pay.",
    findings: [
      { title: "Charged twice for one CT scan", amount: "$1,240", rule: "Duplicate billing" },
      { title: "Surprise out-of-network doctor", amount: "$522", rule: "No Surprises Act" },
      { title: "You may qualify for charity care", rule: "Hospital financial assistance" },
    ],
    letter: {
      to: "Riverside Medical, Patient Billing",
      subject: "Dispute of charges, account #44821",
      lines: ["I am writing to dispute two charges on my bill dated March 18.", "The CT scan on line 14 appears twice. Please remove the duplicate.", "Under the No Surprises Act, I should only owe my in-network amount."],
    },
    you: { label: "Ask for an itemized bill", days: "5 days", date: "Oct 14" },
    them: { label: "Their reply due", days: "30 days" },
    timeline: [
      { date: "Today", text: "Charity care form sent" },
      { date: "Sep 30", text: "They removed the double charge" },
      { date: "Sep 12", text: "Dispute letter delivered" },
      { date: "Sep 9", text: "ER bill scanned" },
    ],
    reply: { verdict: "Partly fixed", said: "They removed the $1,240 double charge but kept the out-of-network fee.", next: "Send a No Surprises Act letter for the last $522." },
  },
  insurance: {
    key: "insurance",
    tag: "Insurance denial",
    counterparty: "Summit Health Plan",
    title: "MRI coverage denied",
    amount: "$2,950",
    savings: "$2,950",
    summary: "Your plan denied an MRI as not medically necessary. You have the right to appeal, and your doctor's notes help.",
    findings: [
      { title: "Denied without a doctor's review", rule: "ACA appeal rights" },
      { title: "Your doctor's notes support it", rule: "Medical necessity" },
      { title: "You can ask for an outside review", rule: "External review" },
    ],
    letter: {
      to: "Summit Health Plan, Appeals",
      subject: "Request for internal appeal, claim #SH-20931",
      lines: ["I am appealing the denial of my MRI dated August 28.", "My doctor ordered this scan after six weeks of treatment did not help.", "Please have a doctor in the same specialty review this appeal."],
    },
    you: { label: "Send your appeal", days: "2 days", date: "Oct 11" },
    them: { label: "Their decision due", days: "30 days" },
    timeline: [
      { date: "Today", text: "Second appeal drafted" },
      { date: "Oct 3", text: "Their reply: denial upheld" },
      { date: "Sep 8", text: "First appeal delivered" },
      { date: "Sep 2", text: "Denial letter scanned" },
    ],
    reply: { verdict: "They said no", said: "They upheld the denial, but didn't address your doctor's notes.", next: "Ask for an external review. An outside doctor decides." },
  },
  renters: {
    key: "renters",
    tag: "Landlord",
    counterparty: "Harbor Point Apartments",
    title: "Security deposit kept",
    amount: "$1,800",
    savings: "$1,800",
    summary: "Your landlord kept your whole deposit without a list of damages. In most states that's not allowed.",
    findings: [
      { title: "No itemized list in time", rule: "State deposit law" },
      { title: "Normal wear and tear charged", amount: "$650", rule: "Wear and tear" },
      { title: "You may be owed a penalty", rule: "Bad-faith withholding" },
    ],
    letter: {
      to: "Harbor Point Apartments, Management",
      subject: "Demand for return of security deposit",
      lines: ["I moved out on August 31 and returned my keys the same day.", "I have not received an itemized list of deductions within the time the law requires.", "Please return my full $1,800 deposit within 14 days."],
    },
    you: { label: "Send demand letter", days: "3 days", date: "Oct 12" },
    them: { label: "Their deadline", days: "14 days" },
    timeline: [
      { date: "Today", text: "Small claims packet ready" },
      { date: "Sep 28", text: "No reply by their deadline" },
      { date: "Sep 14", text: "Demand letter delivered" },
      { date: "Sep 10", text: "Move-out photos added" },
    ],
    reply: { verdict: "They need more", said: "They want proof of the apartment's condition when you left.", next: "Send your move-out photos with a short reply." },
  },
  debt: {
    key: "debt",
    tag: "Debt collector",
    counterparty: "Apex Recovery",
    title: "Old credit card debt",
    amount: "$2,312",
    savings: "$2,312",
    summary: "A collector says you owe an old card balance. They have to prove it, and it may be too old to sue over.",
    findings: [
      { title: "They haven't proven you owe it", rule: "FDCPA validation" },
      { title: "It may be past the time limit", rule: "Statute of limitations" },
      { title: "Don't pay yet", rule: "Paying can restart the clock" },
    ],
    letter: {
      to: "Apex Recovery LLC",
      subject: "Request for debt validation, ref #AR-77310",
      lines: ["I am responding to your letter dated September 22.", "Please send proof that I owe this debt and that you have the right to collect it.", "Until you do, please stop collection activity."],
    },
    you: { label: "Ask them to prove it", days: "21 days", date: "Oct 30" },
    them: { label: "They must pause", days: "Until proof" },
    timeline: [
      { date: "Today", text: "No proof sent, collection paused" },
      { date: "Sep 29", text: "Validation request delivered" },
      { date: "Sep 25", text: "Collector letter scanned" },
    ],
    reply: { verdict: "They backed off", said: "They closed the account and won't report it to the credit bureaus.", next: "Keep this letter. We've saved it to your case." },
  },
};

export type FeatureSlug = "scan" | "plain-answers" | "letters" | "deadline-keeper" | "case-tracker" | "reply-decoder" | "case-packet" | "real-help";

export type Feature = {
  slug: FeatureSlug;
  name: string;
  short: string;
  headline: [string, string];
  lede: string;
  plan: "free" | "premium" | "both";
  planNote: string;
  shot: ShotKind;
  shots: [ShotKind, ScenarioKey][];
  story: string[];
  benefits: [string, string][];
  related: FeatureSlug[];
};

export type ShotKind = "today" | "scan" | "questions" | "found" | "free" | "letter" | "dates" | "tracker" | "reply" | "packet" | "help";

export const FEATURES: Feature[] = [
  {
    slug: "scan",
    name: "Snap & scan",
    short: "Photo, PDF or screenshot. We pull out every date and dollar.",
    headline: ["Just take a", "photo"],
    lede: "Point your phone at the bill, denial or notice. We read it, find the dates and amounts, and ask a few quick questions.",
    plan: "both",
    planNote: "Free includes 3 scans a month. Premium is unlimited.",
    shot: "scan",
    shots: [["scan", "medical"], ["questions", "medical"], ["found", "medical"]],
    story: [
      "Most people put scary letters in a drawer. Not because they don't care, but because they're long, confusing and written to make you give up.",
      "Snap it instead. Take it back reads the whole thing, even multi-page PDFs, and works out what kind of problem it is, who sent it and what's at stake.",
    ],
    benefits: [["Any format", "Phone photos, PDFs, screenshots, several pages at once."], ["Three quick questions", "Your state, your insurance, when it arrived. That's it."], ["Private by default", "Files are stored privately and never sold or used for ads."]],
    related: ["plain-answers", "letters", "case-tracker"],
  },
  {
    slug: "plain-answers",
    name: "Plain answers",
    short: "What's wrong, what you may be owed and the rule behind it.",
    headline: ["Know where you", "stand"],
    lede: "No legal jargon. We explain what the letter actually means, what looks wrong and what you can do next.",
    plan: "both",
    planNote: "Free shows the summary and general next steps. Premium shows every problem in full, with amounts and the rule behind it.",
    shot: "found",
    shots: [["found", "medical"], ["free", "insurance"], ["found", "renters"]],
    story: [
      "A medical bill can have a double charge on page three. A denial can skip a step the law requires. A collector may be chasing a debt that's too old.",
      "We check for the things that go wrong most often and tell you in plain words, with the dollar amount and the rule that backs you up.",
    ],
    benefits: [["The short version first", "One or two sentences that tell you what's going on."], ["The rule behind it", "No Surprises Act, FDCPA, deposit laws and more, named for you."], ["Red flags, fast", "Court dates and lawsuits get flagged at the top, right away."]],
    related: ["scan", "letters", "real-help"],
  },
  {
    slug: "letters",
    name: "Ready letters",
    short: "Firm, polite letters you review, sign and send.",
    headline: ["The letter,", "written for you"],
    lede: "Disputes, appeals, demand letters, validation requests and follow-ups. Written from your case, citing the right rules, ready to print or email.",
    plan: "premium",
    planNote: "Letters are part of Premium.",
    shot: "letter",
    shots: [["letter", "insurance"], ["letter", "renters"], ["letter", "debt"]],
    story: [
      "Companies treat a clear, specific letter very differently from a phone call. It creates a record, and it starts their clock.",
      "We write it for you in your voice: calm, firm and specific. You can edit any word, ask for a rewrite, then print, save as PDF or email it.",
    ],
    benefits: [["Built from your case", "Uses what we found, your history and their replies."], ["Edit or rewrite", "Change anything, or tell us what to add and we'll redo it."], ["Print, PDF or email", "Mark it sent and we start counting their deadline."]],
    related: ["deadline-keeper", "reply-decoder", "case-tracker"],
  },
  {
    slug: "deadline-keeper",
    name: "Deadline keeper",
    short: "Your dates and theirs, counted down and remembered.",
    headline: ["Never miss a", "deadline"],
    lede: "Appeals, disputes and deposits all run on the clock. We work out your deadlines from the rules, track theirs too, and remind you before anything is due.",
    plan: "premium",
    planNote: "Deadline tracking and reminders are part of Premium. Free shows the general rule.",
    shot: "dates",
    shots: [["dates", "insurance"], ["today", "medical"], ["tracker", "renters"]],
    story: [
      "Miss an appeal window by one day and you can lose the right to appeal. Companies know most people don't track this.",
      "We do. Every case gets your deadline, worked out from the rules for that kind of problem. When you send a letter, we start counting theirs.",
    ],
    benefits: [["Both clocks", "What you owe them and what they owe you, side by side."], ["Email reminders", "A nudge before anything is due, not after."], ["Your whole week", "One calendar view across every fight."]],
    related: ["case-tracker", "letters", "reply-decoder"],
  },
  {
    slug: "case-tracker",
    name: "Case tracker",
    short: "Every letter, reply and receipt, start to finish.",
    headline: ["Every fight, start to", "finish"],
    lede: "Companies count on you losing track. Your case file remembers every date, letter and reply, so you don't have to.",
    plan: "premium",
    planNote: "Case tracking is part of Premium.",
    shot: "tracker",
    shots: [["tracker", "insurance"], ["tracker", "medical"], ["tracker", "debt"]],
    story: [
      "A denial gets upheld. A landlord goes quiet. A collector sends the same letter again. That's usually when people give up.",
      "Your case file keeps going. It knows what you sent, when they owe you an answer and what to do next. Calls and notes go on the timeline too.",
    ],
    benefits: [["Progress at a glance", "Four clear stages from first letter to settled."], ["A full timeline", "Letters, replies, calls and notes, all dated."], ["Taken back", "See exactly how much you've saved or recovered."]],
    related: ["deadline-keeper", "reply-decoder", "case-packet"],
  },
  {
    slug: "reply-decoder",
    name: "Reply decoder",
    short: "Snap their answer. We tell you if it's a win and what's next.",
    headline: ["Understand their", "reply"],
    lede: "When they write back, snap it. We tell you what they said in plain words, whether it's a win, and write your next letter.",
    plan: "premium",
    planNote: "Reading replies is part of Premium.",
    shot: "reply",
    shots: [["reply", "insurance"], ["reply", "renters"], ["reply", "debt"]],
    story: [
      "Replies are often written to sound final when they aren't. \"Denial upheld\" usually just means round one is over.",
      "We read their reply against your original letter, point out what they didn't answer, and line up the next step.",
    ],
    benefits: [["Win, partial or no", "A clear verdict in one word."], ["What they skipped", "We check it against what you asked for."], ["Next letter, ready", "Follow-ups written from the whole history."]],
    related: ["letters", "case-tracker", "real-help"],
  },
  {
    slug: "case-packet",
    name: "Case packet",
    short: "One tidy printout for legal aid, a regulator or court.",
    headline: ["Everything in one", "packet"],
    lede: "If you need a lawyer, a regulator or small claims court, hand them one clean packet with your timeline, letters and documents.",
    plan: "premium",
    planNote: "The case packet is part of Premium.",
    shot: "packet",
    shots: [["packet", "renters"], ["tracker", "renters"], ["help", "renters"]],
    story: [
      "Legal aid offices are busy. The people who get helped fastest are the ones who show up organized.",
      "Your packet puts the summary, the timeline, every letter and every document in order. Print it or save it as a PDF in one tap.",
    ],
    benefits: [["Summary up top", "Who, what, how much and what you've done."], ["Dated timeline", "Every step, in order, with proof."], ["All your files", "Their letters and yours, attached."]],
    related: ["case-tracker", "real-help", "letters"],
  },
  {
    slug: "real-help",
    name: "Real help",
    short: "Court dates and lawsuits go straight to people who can help.",
    headline: ["When it needs a", "person"],
    lede: "Some things shouldn't be handled alone. If we see a court date, an eviction or a lawsuit, we flag it and point you to free legal help.",
    plan: "free",
    planNote: "Included free, always.",
    shot: "help",
    shots: [["help", "renters"], ["free", "debt"], ["packet", "debt"]],
    story: [
      "We're not a law firm, and we're honest about it. Some notices move fast and need a real person.",
      "When we spot one, it goes to the top in plain words, with links to legal aid, tenant hotlines and consumer agencies near you.",
    ],
    benefits: [["Flagged right away", "Evictions, lawsuits and court dates come first."], ["Free help near you", "Legal aid, tenant unions and state agencies."], ["Always free", "Safety features are never behind a paywall."]],
    related: ["plain-answers", "case-packet", "scan"],
  },
];

export const featureBySlug = (slug: string) => FEATURES.find((f) => f.slug === slug);

export type ProblemSlug = "medical-bills" | "insurance-denials" | "landlords" | "debt-collectors";

export type Problem = {
  slug: ProblemSlug;
  scenario: ScenarioKey;
  name: string;
  menu: string;
  headline: [string, string];
  lede: string;
  catches: [string, string][];
  rules: [string, string][];
  steps: [string, string][];
  faqs: [string, string][];
};

export const PROBLEMS: Problem[] = [
  {
    slug: "medical-bills",
    scenario: "medical",
    name: "Hospitals & medical bills",
    menu: "Overcharges, surprise bills, billing errors",
    headline: ["Medical bills that don't add", "up"],
    lede: "Studies find errors on a large share of hospital bills. We check yours for double charges, surprise out-of-network fees and help you may qualify for.",
    catches: [
      ["Duplicate charges", "The same scan, test or supply billed twice."],
      ["Surprise out-of-network bills", "A doctor you didn't choose at an in-network hospital."],
      ["Charity care you qualify for", "Nonprofit hospitals must offer financial help."],
      ["Missing itemized bill", "You have the right to see every line."],
      ["Wrong insurance processing", "Billed before your plan paid its share."],
      ["Collections too early", "Bills sent to collections while you're disputing."],
    ],
    rules: [["No Surprises Act", "Limits surprise out-of-network bills for emergencies and in-network facilities."], ["Hospital financial assistance", "Nonprofit hospitals must have a written charity care policy."], ["Price transparency", "Hospitals must publish their prices."]],
    steps: [["Snap the bill", "Add every page, plus your insurance statement if you have it."], ["See what's wrong", "Double charges, surprise fees and the rule behind each one."], ["Send the dispute", "Ask for an itemized bill, a correction or charity care."]],
    faqs: [["Should I pay the bill while I dispute it?", "Ask for an itemized bill and a hold on collections first. We'll tell you the deadline on your bill and help you write the request."], ["What if it's already in collections?", "You can still dispute it. Collectors have to prove the debt, and medical debt has extra credit reporting protections."]],
  },
  {
    slug: "insurance-denials",
    scenario: "insurance",
    name: "Insurance companies",
    menu: "Denied claims, stalled appeals, lowball payments",
    headline: ["Denied? That's not the", "end"],
    lede: "Many people never appeal a denied claim, but appeals often succeed. We explain why you were denied, write the appeal and track every deadline.",
    catches: [
      ["Not medically necessary", "Often reversed with your doctor's notes."],
      ["Missing prior authorization", "Sometimes the provider's job, not yours."],
      ["Out-of-network denials", "Emergencies and surprise bills have protections."],
      ["Coding errors", "A wrong code can trigger an automatic denial."],
      ["Missed appeal steps", "Plans must tell you how to appeal and by when."],
      ["External review rights", "An outside doctor can overrule your plan."],
    ],
    rules: [["Internal appeal", "You can ask your plan to reconsider, usually within 180 days."], ["External review", "An independent reviewer can overturn the denial."], ["Urgent care appeals", "Faster decisions when your health can't wait."]],
    steps: [["Snap the denial", "Add the letter or the explanation of benefits."], ["Understand the reason", "Plain words, plus what usually wins this kind of appeal."], ["Appeal on time", "We write it, count their deadline and help with round two."]],
    faqs: [["How long do I have to appeal?", "Usually 180 days from the denial for an internal appeal, but plans vary. We'll pull the date from your letter."], ["What if my appeal is denied too?", "You can usually ask for an external review, where an outside doctor decides. We'll help you write it."]],
  },
  {
    slug: "landlords",
    scenario: "renters",
    name: "Landlords",
    menu: "Kept deposits, ignored repairs, illegal fees",
    headline: ["Get your deposit", "back"],
    lede: "Kept deposits, ignored repairs, surprise fees and scary notices. We explain your rights in your state and write the letter that gets a landlord's attention.",
    catches: [
      ["Kept security deposits", "Most states require an itemized list by a deadline."],
      ["Normal wear and tear", "Landlords usually can't charge for it."],
      ["Ignored repairs", "Heat, water and safety repairs have rules."],
      ["Illegal fees", "Some fees aren't allowed or are capped."],
      ["Notices and evictions", "We flag these right away and find you help."],
      ["Retaliation", "Landlords can't punish you for asking for repairs."],
    ],
    rules: [["Deposit return deadlines", "Often 14 to 30 days, depending on your state."], ["Warranty of habitability", "Your home must be safe and livable."], ["Bad-faith penalties", "Some states let you recover extra if a deposit is kept unfairly."]],
    steps: [["Snap the notice or lease", "Add move-out photos and texts if you have them."], ["Know your state's rules", "Deadlines and limits for where you live."], ["Send a demand", "Then we track their deadline and help with small claims."]],
    faqs: [["What if I get an eviction notice?", "We flag it right away and point you to free tenant help near you. Eviction deadlines are short, so please act quickly."], ["Can I take my landlord to small claims?", "Often, yes. Your case packet gives you everything organized to file."]],
  },
  {
    slug: "debt-collectors",
    scenario: "debt",
    name: "Debt collectors",
    menu: "Unproven debts, old debts, harassment",
    headline: ["Make them", "prove it"],
    lede: "Collectors have to follow strict rules. We help you ask for proof, spot old debts and stop harassment, without saying anything that hurts you.",
    catches: [
      ["Unproven debts", "You can ask them to validate it first."],
      ["Debts that are too old", "Past the time limit, they usually can't sue."],
      ["Wrong amounts", "Added fees and interest that aren't allowed."],
      ["Harassment", "Calls at odd hours, threats or calling your work."],
      ["Credit report errors", "Wrong or outdated debts can be disputed."],
      ["Lawsuits", "We flag court papers right away and find you help."],
    ],
    rules: [["FDCPA", "Federal rules on how collectors can contact you and what they must prove."], ["Validation request", "Ask within 30 days and they must pause until they prove it."], ["Statute of limitations", "Each state limits how long a debt can be sued on."]],
    steps: [["Snap the letter", "Add any earlier letters or texts from them."], ["Know your rights", "Whether it's proven, how old it is and what not to say."], ["Ask for proof", "We write the request and track their response."]],
    faqs: [["Should I pay a small amount to make them stop?", "Not before you know more. In many states a payment can restart the time limit on an old debt."], ["What if they're suing me?", "Don't ignore it. We'll flag the court date and point you to free legal help right away."]],
  },
];

export const problemBySlug = (slug: string) => PROBLEMS.find((p) => p.slug === slug);

export const PLAN_ROWS: [string, string, string][] = [
  ["Scan bills, denials and notices", "3 a month", "Unlimited"],
  ["Plain-English summary", "Yes", "Yes"],
  ["General next steps and red flags", "Yes", "Yes"],
  ["Free legal aid finder", "Yes", "Yes"],
  ["Every problem in full, with the rule", "Titles only", "Yes"],
  ["Letters written for you", "—", "Yes"],
  ["Deadline tracking and reminders", "General rule only", "Yes"],
  ["Case tracker and timeline", "—", "Yes"],
  ["Their replies read and explained", "—", "Yes"],
  ["Document vault and case packet", "—", "Yes"],
];

export const FAQ_GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "The basics",
    items: [
      ["What is Take it back?", "An app that helps you fight back against hospitals, insurance companies, landlords and debt collectors. Snap the letter, get your rights in plain words, send the letter we write, and we track it until it's settled."],
      ["Is Take it back a lawyer?", "No. We explain your rights and prepare letters you review and send yourself. If your case needs a lawyer, like a court date, we'll point you to real help right away."],
      ["Who is it for?", "Patients, policyholders, renters and consumers in the US who are up against a bill, denial or notice that feels wrong. We never work for the other side. No legal knowledge needed."],
      ["Does it work on my phone?", "Yes. It works in any browser on a phone or computer. Nothing to install."],
    ],
  },
  {
    title: "Plans and pricing",
    items: [
      ["What's free?", "Up to 3 scans a month, a plain-English summary, general next steps, red flags and the legal aid finder."],
      ["What does Premium add?", "Every problem in full with the rule behind it, letters written for you, deadline tracking and reminders, reply decoding, your case file and a printable case packet."],
      ["How much is Premium?", "$9.99 a month or $59 a year, with a 7-day free trial. Cancel anytime."],
      ["Do you take a cut of what I save?", "Never. You keep 100% of what you save or recover."],
    ],
  },
  {
    title: "Privacy and safety",
    items: [
      ["Is my information safe?", "Your documents are stored privately, never sold and never used for ads. You can download or delete everything whenever you like."],
      ["Who can see my documents?", "Only you. Files are stored in a private bucket tied to your account."],
      ["What if my situation is urgent?", "Court dates, lawsuits and evictions are flagged at the top with links to free legal help. That's always free."],
    ],
  },
];
