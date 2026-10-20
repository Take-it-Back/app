// State-by-state pages built from the sourced tables in lib/state-law/*.json and lib/deposits.ts.
// Nothing here is typed in by hand: every number comes from those tables, so fixing a table fixes every page.
// General information, not legal advice.
import { DEPOSIT_RULES, depositRule } from "./deposits";
import { debtTimeLimit, landlordRule, medicalRule, insuranceRule, smallClaimsRule, RULES_CHECKED } from "./stateLaw";
import { stateSlug } from "./legalAid";
import { money } from "./format";
import type { ProblemSlug } from "./marketing";

export { RULES_CHECKED };

/** 50 states plus DC. Puerto Rico data is thin, so it has no page. */
export const LAW_STATES = Object.keys(DEPOSIT_RULES);
export const lawStateSlug = stateSlug;
export const lawStateFromSlug = (slug: string) => LAW_STATES.find((s) => stateSlug(s) === slug) || null;

export type Fact = { label: string; text: string; url?: string };
export type LawContent = {
  /** The most useful single fact, shown on the state hub and in the index table. */
  facts: Fact[];
  federal?: Fact[];
  steps: [string, string][];
  faqs: [string, string][];
  /** Years for the time-limit checker, debt topic only. */
  years?: number;
  source?: string;
};

export type LawTopic = {
  slug: string;
  name: string;
  problem: ProblemSlug;
  /** Pages about bills, insurance or care: analytics stays off. */
  health: boolean;
  guide: string;
  cta: string;
  indexTitle: string;
  indexDesc: string;
  indexLede: string;
  indexNote: string;
  cols: [string, (s: string) => string][];
  stateTitle: (s: string) => string;
  stateDesc: (s: string) => string;
  stateLede: (s: string) => string;
  build: (s: string) => LawContent;
};

const cap = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
/** Source tables use some shorthand; spell it out for readers. */
const URLTA_NOTE = " (URLTA is the Uniform Residential Landlord and Tenant Act, which only some areas have adopted.)";
const plain = (t: string) => (t.includes("URLTA") ? `${t}${URLTA_NOTE}` : t);
const stop = (t: string) => (/[.!?]$/.test(t) ? t : `${t}.`);

const scFact = (s: string): Fact | null => {
  const sc = smallClaimsRule(s);
  return sc ? { label: "Small claims limit", text: `${money(sc.limit)} in the ${sc.court}. Filing fee ${sc.fee}.`, url: sc.url } : null;
};

/* ------------------------------------------------------------------ security deposits */
const deposit: LawTopic = {
  slug: "security-deposit",
  name: "Security deposits",
  problem: "landlords",
  health: false,
  guide: "how-to-get-your-security-deposit-back",
  cta: "Tell us about your deposit and we'll write the demand letter for your state.",
  indexTitle: "Security deposit laws by state",
  indexDesc: "Return deadline, deposit limit and penalty for a landlord who keeps your deposit, in all 50 states and DC. Pick your state for the full rules.",
  indexLede: "Every state sets a deadline for returning your deposit and most add a penalty for keeping it wrongly. Pick your state.",
  indexNote: "Compiled from state statutes and 50-state surveys. Exceptions apply and laws change; check your state's statute for your situation.",
  cols: [
    ["Deadline", (s) => depositRule(s)?.text ?? "—"],
    ["Deposit limit", (s) => landlordRule(s)?.cap ?? "No state cap found"],
  ],
  stateTitle: (s) => `Security deposit laws in ${s}: deadline and penalties`,
  stateDesc: (s) => `How long a landlord in ${s} has to return your security deposit, the most they can charge, and what happens if they keep it. Plus a step-by-step plan.`,
  stateLede: (s) => `What ${s} law says about getting your security deposit back, and what to do if your landlord doesn't.`,
  build: (s) => {
    const d = depositRule(s);
    const l = landlordRule(s);
    const facts: Fact[] = [];
    const deadline = d && d.days !== null ? cap(d.text) : "No fixed deadline in state law. Ask for it back in writing and give a date, such as 14 days.";
    facts.push({ label: "Deadline to return it", text: deadline });
    facts.push({ label: "Most a landlord can charge", text: l?.cap ?? "We didn't find a state cap. Check your lease and any city rules.", url: l?.url });
    if (l?.penalty) facts.push({ label: "If they keep it wrongly", text: l.penalty, url: l.url });
    if (l?.interest) facts.push({ label: "Interest on your deposit", text: l.interest, url: l.url });
    const sc = scFact(s);
    if (sc) facts.push(sc);
    const sci = smallClaimsRule(s);
    return {
      facts,
      steps: [
        ["Photograph everything at move-out", "Take dated photos and video of every room. Keep your move-in checklist and any emails about the unit's condition."],
        ["Send your forwarding address in writing", "In several states the landlord's deadline starts when they have it. Email or mail it and keep a copy."],
        ["Count the days", d && d.days !== null ? `In ${s}: ${d.text}. Write the date on your calendar.` : `${s} has no fixed deadline in state law, so set your own in the letter, such as 14 days.`],
        ["Send a demand letter", "If the deadline passes or the deductions look wrong, send a dated letter that names the amount you want back and the date you expect it."],
        ["File in small claims court", sci ? `${s} small claims handles claims up to ${money(sci.limit)} and you don't need a lawyer.` : "Small claims court is built for people without a lawyer."],
      ],
      faqs: [
        [`How long does a landlord in ${s} have to return a security deposit?`, d && d.days !== null ? `In ${s}: ${stop(d.text)} The clock often starts at move-out or when you give a forwarding address, so send your address in writing.` : `${s} has no fixed deadline in state law. Send a written request with a date, such as 14 days, and keep a copy.`],
        [`What happens if my landlord in ${s} keeps my deposit without a good reason?`, l?.penalty ? `${stop(l.penalty)} Penalties usually need proof the landlord acted in bad faith or on purpose, so keep your photos and move-out records.${sci ? ` Small claims court in ${s} takes cases up to ${money(sci.limit)}.` : ""}` : `You can sue for the deposit in small claims court.${sci ? ` In ${s} the limit is ${money(sci.limit)}.` : ""} Check the state statute for any penalty on top.`],
        [`Is there a limit on how much deposit a landlord can charge in ${s}?`, l?.cap ? stop(l.cap) : `We didn't find a state cap for ${s}. Your lease and any city rules may set one.`],
        ["Can my landlord deduct for normal wear and tear?", "Usually not. Faded paint, light carpet wear and small nail holes are normal use. Damage beyond that, unpaid rent and cleaning needed to match move-in condition can be deducted."],
      ],
      source: l?.url,
    };
  },
};

/* ------------------------------------------------------------------ repairs, rent withholding, entry */
const repairs: LawTopic = {
  slug: "tenant-repairs",
  name: "Repairs and tenant rights",
  problem: "landlords",
  health: false,
  guide: "how-to-demand-repairs-from-your-landlord",
  cta: "Landlord won't fix it? We'll write the repair demand for your state.",
  indexTitle: "Tenant repair rights by state",
  indexDesc: "Repair and deduct, rent withholding, landlord entry notice and protection from retaliation in all 50 states and DC.",
  indexLede: "Your state decides whether you can fix a problem and deduct the cost, how much notice a landlord must give before entering, and when payback for complaining is illegal.",
  indexNote: "Compiled from state statutes and tenant-law surveys. Using repair and deduct or withholding rent the wrong way can lead to an eviction case, so follow the notice steps exactly. URLTA is the Uniform Residential Landlord and Tenant Act, which only some areas of Kentucky and Tennessee have adopted.",
  cols: [
    ["Repair and deduct", (s) => landlordRule(s)?.repair_deduct ?? "No state rule found"],
    ["Notice to enter", (s) => landlordRule(s)?.entry ?? "Not set by state law"],
  ],
  stateTitle: (s) => `Tenant repair rights in ${s}`,
  stateDesc: (s) => `What a tenant in ${s} can do when a landlord won't make repairs: repair and deduct, withholding rent, entry notice and protection from retaliation.`,
  stateLede: (s) => `What ${s} law lets you do when something in your rental is broken and your landlord won't fix it.`,
  build: (s) => {
    const l = landlordRule(s);
    const facts: Fact[] = [];
    facts.push({ label: "Repair and deduct", text: plain(l?.repair_deduct ?? "We didn't find a state rule that lets you fix it and deduct the cost."), url: l?.url });
    facts.push({ label: "Holding back rent", text: l?.withhold ? plain(`${stop(l.withhold)} Withholding rent can lead to an eviction case, so get advice first.`) : "We didn't find a state rule that lets you hold back rent. Doing it anyway can lead to eviction.", url: l?.url });
    facts.push({ label: "Notice before they enter", text: plain(l?.entry ?? "State law doesn't set a number of hours. Courts expect reasonable notice."), url: l?.url });
    facts.push({ label: "Protection from payback", text: plain(l?.retaliation ?? "We didn't find a state rule against retaliation. Ask legal aid about local protections."), url: l?.url });
    const sc = scFact(s);
    if (sc) facts.push(sc);
    return {
      facts,
      steps: [
        ["Ask in writing", "Send a dated letter or email that describes the problem, the room and the date it started. Keep a copy. A text or phone call is hard to prove later."],
        ["Photograph it and keep a log", "Take dated photos and write down every contact with the landlord. Courts and inspectors look for this."],
        ["Give a reasonable time to fix it", "Many states expect 14 to 30 days for ordinary repairs and much less for no heat, no water or no working lock."],
        ["Call code enforcement", "A city or county inspector's written report is strong evidence and sometimes triggers rent protections."],
        ["Pick a remedy with advice", l?.repair_deduct || l?.withhold ? `${s} has some self-help rules, but each has strict steps. Call legal aid or a tenant group before you use one.` : `${s} has few self-help rules, so reporting to code enforcement and small claims are the usual routes. Call legal aid before you stop paying rent.`],
      ],
      faqs: [
        [`Can I fix something and deduct the cost from my rent in ${s}?`, l?.repair_deduct ? plain(`${stop(l.repair_deduct)} The notice steps and dollar limits matter, so follow them exactly and keep receipts.`) : `We didn't find a state law that allows repair and deduct in ${s}. Check with legal aid before you try it.`],
        [`Can I withhold rent in ${s} if my landlord won't make repairs?`, l?.withhold ? plain(`${stop(l.withhold)} Withholding rent is risky: if a court decides you did it wrongly, you can be evicted for nonpayment. Get advice first.`) : `We didn't find a state law that allows it in ${s}. Withholding rent without legal protection can lead to an eviction case.`],
        [`How much notice does a landlord in ${s} have to give before coming in?`, l?.entry ? plain(`${stop(l.entry)} Emergencies are the usual exception.`) : `State law in ${s} doesn't set a specific number of hours. Your lease may, and courts expect reasonable notice.`],
        [`Can my landlord in ${s} punish me for complaining?`, l?.retaliation ? plain(stop(l.retaliation)) : `We didn't find a clear state rule for ${s}. Courts in many states still treat payback for a good-faith complaint as a defense in eviction cases.`],
      ],
      source: l?.url,
    };
  },
};

/* ------------------------------------------------------------------ debt time limits */
const debt: LawTopic = {
  slug: "debt-time-limit",
  name: "Debt time limits",
  problem: "debt-collectors",
  health: false,
  guide: "statute-of-limitations-on-debt-by-state",
  cta: "Is your debt too old? Scan the letter and we'll check your state's time limit.",
  indexTitle: "Debt time limits: find your state's rules",
  indexDesc: "How many years a debt collector has to sue you in all 50 states and DC, and whether a payment can restart the clock.",
  indexLede: "Every state limits how long a creditor or collector has to sue over a debt. Pick your state to see the limit and the traps.",
  indexNote: "Written contracts and credit cards; some debts, like medical debt, differ. Federal student loans have no time limit. Laws change; check your state's statute or ask legal aid before relying on a date.",
  cols: [
    ["Years to sue", (s) => debtTimeLimit(s)?.span.replace(" depending on the type of debt", "") ?? "—"],
    ["Payment restarts the clock?", (s) => { const r = debtTimeLimit(s)?.rule.revival; return r === "none" ? "No" : r === "payment" ? "Yes, a payment" : r === "writing" ? "Yes, a signed promise" : "Yes, a payment or written promise"; }],
  ],
  stateTitle: (s) => `Statute of limitations on debt in ${s}`,
  stateDesc: (s) => `How many years a debt collector has to sue you in ${s}, whether a payment restarts the clock, and what to do if the debt is too old or you've been sued.`,
  stateLede: (s) => `How long a creditor or debt collector has to sue you in ${s}, and what can restart the clock.`,
  build: (s) => {
    const t = debtTimeLimit(s);
    if (!t) return { facts: [], steps: [], faqs: [] };
    const r = t.rule;
    const facts: Fact[] = [{ label: "Time limit to sue", text: `${cap(t.span)}.`, url: r.source }];
    if (r.written !== r.open) facts.push({ label: "By type of debt", text: `${r.written} years for written contracts. ${r.open} years for open accounts such as most credit cards. Which one applies depends on the debt.`, url: r.source });
    facts.push({ label: "Can a payment restart it?", text: r.revival === "none" ? t.revival : `${t.revival} In many states a payment only restarts a clock that is still running and can't bring back a debt that has already expired.`, url: r.source });
    if (r.barred_extinguished) facts.push({ label: "Extra state protection", text: `${s} limits collecting on debts past the time limit.`, url: r.source });
    if (r.disclosure) facts.push({ label: "They must warn you", text: "Collectors must tell you in writing if a debt is too old to sue on.", url: r.source });
    if (r.note) facts.push({ label: "Also note", text: r.note.replace(/\bSOL\b/g, "the time limit"), url: r.source });
    return {
      facts,
      federal: [
        { label: "Federal rule", text: "Debt collectors may not sue or threaten to sue on a debt that is past the time limit, in any state." },
        { label: "Credit reports", text: "Old debts generally drop off a credit report 7 years after the first missed payment, whatever the state's time limit." },
      ],
      steps: [
        ["Find the date of your last payment", "The clock usually starts at your last payment or the first payment you missed, depending on the state and the debt. Check old statements."],
        ["Do the math", `The limit in ${s} is ${t.span}. Add that to the start date.`],
        ["Don't pay or sign anything yet", t.revival],
        ["Send a letter if it's too old", "Say the debt appears to be past the time limit, that you don't acknowledge it, and ask them to stop contacting you. Send it by certified mail."],
        ["Answer any lawsuit", "If you're sued, respond by the deadline on the court papers and raise the time limit as a defense. Courts usually don't apply it unless you do."],
      ],
      faqs: [
        [`How long can a debt collector sue me in ${s}?`, `${cap(t.span)}. ${(r.note || "").replace(/\bSOL\b/g, "the time limit")}`.trim()],
        [`Does a payment restart the time limit in ${s}?`, `${t.revival} In many states a payment only restarts a clock that is still running and can't bring back a debt that has already expired.`],
        ["Can I be sued on a debt that's past the time limit?", "A collector can still file, and the time limit is a defense you have to raise. Federal rules bar collectors from suing or threatening to sue on a time-barred debt. If you get court papers, respond by the deadline and call legal aid."],
        ["Does a debt past the time limit go away?", "Usually not. In most states the debt still exists and a collector can ask you to pay, but they can't win a lawsuit on it. It can also stay on your credit report for 7 years."],
      ],
      years: t.years,
      source: r.source,
    };
  },
};

/* ------------------------------------------------------------------ medical debt */
const medical: LawTopic = {
  slug: "medical-debt",
  name: "Medical debt",
  problem: "medical-bills",
  health: true,
  guide: "how-to-dispute-a-medical-bill",
  cta: "Scan your bill and we'll point out what looks wrong.",
  indexTitle: "Medical debt laws by state",
  indexDesc: "State limits on medical debt: credit reporting bans, interest caps, hospital financial assistance and collection rules, for all 50 states and DC.",
  indexLede: "More states are limiting what hospitals and collectors can do with medical bills. Pick your state to see what applies.",
  indexNote: "Many of these laws have income limits or apply only to certain providers, and some are being challenged in court. A blank means we found no notable state rule, not that none exists.",
  cols: [
    ["Credit reports", (s) => (medicalRule(s)?.credit ? "State limit" : "Federal rules only")],
    ["Hospital aid", (s) => (medicalRule(s)?.charity ? "State rules" : "Federal rules only")],
  ],
  stateTitle: (s) => `Medical debt laws in ${s}: credit reports and hospital aid`,
  stateDesc: (s) => `What ${s} law says about medical debt: credit reporting, interest caps, hospital aid, surprise bills and collections. Plus federal rules.`,
  stateLede: (s) => `The rules that protect you from a medical bill in ${s}, from state law and federal law.`,
  build: (s) => {
    const m = medicalRule(s);
    const facts: Fact[] = [];
    if (m?.credit) facts.push({ label: "Medical debt and credit", text: m.credit, url: m.url });
    if (m?.charity) facts.push({ label: "Free or discounted hospital care", text: m.charity, url: m.url });
    if (m?.interest) facts.push({ label: "Interest limit", text: m.interest, url: m.url });
    if (m?.collections) facts.push({ label: "Collection limits", text: m.collections, url: m.url });
    if (m?.surprise) facts.push({ label: "Surprise bills", text: `${m.surprise}. This applies to state-regulated plans. Job-based plans that pay claims themselves follow the federal rules.`, url: m.url });
    if (!facts.length) facts.push({ label: "State rules", text: `We didn't find a medical debt law in ${s} beyond the federal rules below. That doesn't mean none exists, so ask legal aid or the state attorney general.`, url: m?.url });
    return {
      facts,
      federal: [
        { label: "Surprise bills", text: "The No Surprises Act protects you from most surprise bills for emergency care and for out-of-network doctors at an in-network hospital. It does not cover ground ambulances." },
        { label: "Nonprofit hospitals", text: "Nonprofit hospitals must have a written financial assistance policy. Before most serious collection actions they must wait 120 days from the first bill and check whether you qualify." },
        { label: "Credit bureaus", text: "Equifax, Experian and TransUnion don't report paid medical collections, medical collections under $500, or medical debt less than a year past due." },
      ],
      steps: [
        ["Ask for an itemized bill", "Request every charge with its billing code. A summary bill can hide mistakes."],
        ["Compare it to your insurance statement", "Your explanation of benefits (EOB) shows what your plan paid and what you owe. The two should match."],
        ["Ask about financial assistance", m?.charity ? `Hospitals in ${s} have specific rules on free and discounted care. Ask for the application before you pay.` : "Ask the hospital for its financial assistance application, even if you think you earn too much."],
        ["Dispute errors in writing", "List each error and the fix you want. Ask in writing that the bill be held from collections while they review it."],
        ["Make a collector validate it", "If the bill goes to collections, send a validation request within 30 days of their first notice."],
      ],
      faqs: [
        [`Can medical debt go on my credit report in ${s}?`, m?.credit ? `${stop(m.credit)} The three credit bureaus also have their own policy of leaving off paid medical collections, those under $500, and debt less than a year past due.` : `${s} has no state ban that we found. The three credit bureaus still leave off paid medical collections, medical collections under $500, and medical debt less than a year past due.`],
        [`Is there a cap on interest for medical debt in ${s}?`, m?.interest ? stop(m.interest) : `We didn't find a state interest cap for medical debt in ${s}. Check your payment plan or judgment for the rate, and ask if the hospital will waive interest.`],
        [`Does ${s} require hospitals to offer free or discounted care?`, m?.charity ? stop(m.charity) : `We didn't find a state rule in ${s}. Nonprofit hospitals are still required by federal law to have a financial assistance policy, so ask for it.`],
        ["Should I pay a medical bill I'm disputing?", "Usually not until the dispute is settled. Ask the billing office in writing to hold the account from collections while they review it."],
      ],
      source: m?.url,
    };
  },
};

/* ------------------------------------------------------------------ insurance appeals */
const insurance: LawTopic = {
  slug: "insurance-appeals",
  name: "Insurance denials",
  problem: "insurance-denials",
  health: true,
  guide: "how-to-appeal-a-health-insurance-denial",
  cta: "Scan your denial and we'll write the appeal.",
  indexTitle: "Health insurance appeals: find your state",
  indexDesc: "Who to complain to, how outside review works and how long you have to appeal a health insurance denial or a Medicaid decision, in all 50 states and DC.",
  indexLede: "Where you appeal a denied claim depends on your state and the kind of plan you have. Pick your state.",
  indexNote: "State rules apply to plans regulated by the state. Large employer plans that pay claims themselves follow the federal process.",
  cols: [
    ["State regulator", (s) => insuranceRule(s)?.dept ?? "—"],
    ["Medicaid hearing deadline", (s) => { const i = insuranceRule(s); return i ? `${i.medicaid_days} days` : "—"; }],
  ],
  stateTitle: (s) => `How to appeal a health insurance denial in ${s}`,
  stateDesc: (s) => `Where to file an insurance complaint in ${s}, how outside review works, and the Medicaid fair hearing deadline. Step-by-step help appealing a denied claim.`,
  stateLede: (s) => `Who to appeal to when a health plan denies your claim in ${s}, and how long you have.`,
  build: (s) => {
    const i0 = insuranceRule(s);
    const i = i0 ? { ...i0, external_review: i0.external_review.replace(/\s*\(NAIC-style\)/, "") } : null;
    const facts: Fact[] = [];
    if (i) {
      facts.push({ label: "Outside review", text: `${i.external_review.replace(/\.$/, "")}. This applies to plans regulated by the state.`, url: i.complaint_url });
      facts.push({ label: "State regulator", text: `${i.dept} takes complaints about insurers.`, url: i.complaint_url });
      facts.push({ label: `If it's ${i.medicaid_name}`, text: `Ask for a fair hearing within ${i.medicaid_days} days of the notice.${i.note ? ` ${i.note}` : ""}`, url: i.medicaid_url });
    } else {
      facts.push({ label: "State regulator", text: `Contact the ${s} insurance department about a denial from a state-regulated plan.` });
    }
    return {
      facts,
      federal: [
        { label: "Internal appeal", text: "You generally have 180 days from the denial notice to file an appeal with your plan." },
        { label: "Plan deadlines", text: "Plans generally must decide within 30 days for care you haven't had yet and 60 days for care you've had. Urgent cases get a decision within 72 hours." },
        { label: "Job-based plans that pay claims themselves", text: "State insurance departments can't help with these. Call the U.S. Department of Labor at 1-866-444-3272 (askebsa.dol.gov)." },
      ],
      steps: [
        ["Read the denial letter", "Find the reason, the claim number and your appeal deadline."],
        ["Ask for your claim file", "You can request the documents and criteria the plan used, free of charge."],
        ["Get your doctor's support", "A letter explaining why the care is medically necessary is often the strongest part of an appeal."],
        ["File the internal appeal", "Answer each reason for the denial and ask for a reviewer in the same specialty. Keep proof of when you sent it."],
        ["Ask for outside review", i ? `If the plan upholds the denial, ${i.external_review.replace(/\.$/, "").toLowerCase()}.` : "If the plan upholds the denial, request an independent external review, generally within 4 months."],
      ],
      faqs: [
        [`Who regulates health insurance in ${s}?`, i ? `${i.dept}. It takes complaints about insurers and plans regulated by the state. Large employer plans that pay claims themselves are overseen by the U.S. Department of Labor instead.` : `The ${s} insurance department. Large employer plans that pay claims themselves are overseen by the U.S. Department of Labor instead.`],
        [`Can I get an outside review of a denial in ${s}?`, i ? `${stop(i.external_review)} The reviewer is independent of your plan and the plan must follow the decision.` : "Yes. After the internal appeal you can generally ask for an independent external review within 4 months."],
        [`What if my coverage is ${i?.medicaid_name ?? "Medicaid"}?`, i ? `Ask for a fair hearing within ${i.medicaid_days} days of the notice. ${i.note}`.trim() : "Medicaid uses a state fair hearing system. The notice you received lists the deadline."],
        ["How long do I have to appeal?", "Usually 180 days from the denial notice for an internal appeal. Check your letter, because some plans give less time for certain decisions."],
      ],
      source: i?.complaint_url,
    };
  },
};

/* ------------------------------------------------------------------ small claims */
const smallclaims: LawTopic = {
  slug: "small-claims",
  name: "Small claims court",
  problem: "landlords",
  health: false,
  guide: "small-claims-court-limits-by-state",
  cta: "Getting ready for small claims? We'll write your statement and build your evidence packet.",
  indexTitle: "Small claims court: find your state's limit and fees",
  indexDesc: "The most you can sue for in small claims court, the court's name, filing fees and whether lawyers are allowed, in all 50 states and DC.",
  indexLede: "Small claims court is built for people without lawyers. Pick your state to see the limit, the fee and where to file.",
  indexNote: "Limits are for individuals and were checked against state court sites. Several states are raising their limits; confirm with your court before filing.",
  cols: [
    ["Limit", (s) => { const r = smallClaimsRule(s); return r ? money(r.limit) : "—"; }],
    ["Filing fee", (s) => smallClaimsRule(s)?.fee ?? "—"],
  ],
  stateTitle: (s) => `Small claims court in ${s}: limit and fees`,
  stateDesc: (s) => `The most you can sue for in ${s} small claims court, the filing fee, whether lawyers are allowed and how to file without a lawyer.`,
  stateLede: (s) => `What you can sue for in ${s} small claims court and what it costs.`,
  build: (s) => {
    const sc = smallClaimsRule(s);
    const facts: Fact[] = [];
    if (sc) {
      facts.push({ label: "Most you can ask for", text: money(sc.limit), url: sc.url });
      facts.push({ label: "Court", text: sc.court, url: sc.url });
      facts.push({ label: "Filing fee", text: sc.fee, url: sc.url });
      facts.push({ label: "Lawyers", text: sc.lawyers === "allowed" ? "Allowed, but not needed" : sc.lawyers === "not allowed" ? "Not allowed at the hearing" : "Limited. Ask the court clerk.", url: sc.url });
      if (sc.note) facts.push({ label: "Also note", text: sc.note, url: sc.url });
    }
    return {
      facts,
      steps: [
        ["Send a demand letter first", "Many judges want to see you tried to settle. A clear letter with a deadline often gets you paid without court."],
        ["Gather your evidence", "Letters, receipts, photos, your lease or bill, and a dated timeline."],
        ["File in the right place", sc ? `In ${s} that is the ${sc.court}, usually where the other side lives or where it happened. Ask the clerk about a fee waiver if money is tight.` : "Usually where the other side lives or where it happened. Ask the clerk about a fee waiver if money is tight."],
        ["Serve them and show up", "The court explains how to serve the papers. Bring three copies of everything to the hearing."],
      ],
      faqs: [
        [`What is the small claims limit in ${s}?`, sc ? `${money(sc.limit)} for individuals in the ${sc.court}.${sc.note ? ` ${sc.note}` : ""}` : "Check your state court's website for the current limit."],
        [`How much does it cost to file in ${s}?`, sc ? `${sc.fee}. If money is tight, ask the clerk for a fee waiver.` : "Fees vary by court. Ask the clerk about a fee waiver."],
        [`Can I use a lawyer in ${s} small claims court?`, sc ? (sc.lawyers === "allowed" ? "Yes, but you don't need one. The process is designed so you can do it yourself." : sc.lawyers === "not allowed" ? "No. Lawyers generally can't represent either side at the hearing, so you'll speak for yourself." : "Only in limited situations. Ask the court clerk. The process is designed so you can do it yourself.") : "The process is designed so you can do it yourself."],
        ["What if I'm owed more than the limit?", "You can usually still file in small claims if you give up the amount over the limit, or file in a higher court where the rules are more formal."],
      ],
      source: sc?.url,
    };
  },
};

export const LAW_TOPICS: LawTopic[] = [deposit, repairs, debt, medical, insurance, smallclaims];
export const topicBySlug = (slug: string) => LAW_TOPICS.find((t) => t.slug === slug);

/** True for pages about bills, insurance or care, where analytics must stay off (see health data privacy memo). */
export const HEALTH_LAW_TOPICS = LAW_TOPICS.filter((t) => t.health).map((t) => t.slug);
