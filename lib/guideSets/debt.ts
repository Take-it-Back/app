import type { Guide } from "../guides";

// Debt and courts/complaints guides. General information, not legal advice.
// State-specific numbers are left to each state's own law and court site.
export const DEBT_GUIDES: Guide[] = [
  {
    slug: "how-to-stop-debt-collector-calls",
    category: "debt",
    icon: "phone",
    kind: "letter",
    title: "How to stop debt collector calls (with a sample letter)",
    description: "You can tell a debt collector in writing to stop contacting you. Here is how the letter works, what it does not do, and a sample you can copy.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "The calls keep coming and you want them to stop. Under the federal Fair Debt Collection Practices Act (FDCPA), you can send a collector a written request to stop contacting you, and they have to honor it with a few narrow exceptions.",
    blocks: [
      {
        h: "What a cease-communication letter does",
        p: [
          "Once a collector receives your written request, they must stop contacting you about the debt. They may still write once to confirm they got your letter, or to tell you about a specific step such as a lawsuit.",
          "The letter does not erase the debt. The collector can still sue you, report the debt to the credit bureaus where the law allows, and sell the account. If you want to dispute the debt or ask for proof, do that first or at the same time, because after a stop request the collector has less reason to write to you.",
        ],
      },
      {
        h: "Before you send it",
        list: [
          "Make sure the debt is yours and the amount is right. If you are not sure, send a debt validation letter first.",
          "Check whether you were just served with court papers. A stop letter will not stop a lawsuit, and the deadline to respond to a lawsuit is short.",
          "Consider whether you want to hear from them at all. If you plan to negotiate, a stop letter can make that harder.",
          "Keep a log of dates and times of every call, plus any voicemails and letters.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Write the letter", "Keep it short. Include the collector's name, your name and address, the account number from their letter, and one clear sentence asking them to stop contacting you."],
          ["Send it with proof", "Use certified mail with a return receipt, and keep a copy. The date they receive it is the date that counts."],
          ["Keep records of any contact after that", "Save voicemails, screenshots of texts and envelopes. Note the date and what was said."],
          ["Report violations", "If they keep calling, file a complaint with the CFPB (consumerfinance.gov/complaint) and your state attorney general. The FDCPA lets you sue a collector that breaks the rules, and a lawyer or legal aid office can tell you if you have a case."],
        ],
      },
      {
        h: "Sample letter",
        p: [
          "[YOUR NAME]\n[YOUR ADDRESS]\n[DATE]\n\n[COLLECTOR NAME]\n[COLLECTOR ADDRESS]\n\nRe: Account number [ACCOUNT NUMBER]\n\nUnder the Fair Debt Collection Practices Act, 15 U.S.C. 1692c(c), I am asking you to stop contacting me about this account. Please do not call me, text me or write to me, except as the law allows.\n\nSincerely,\n[YOUR NAME]",
        ],
      },
    ],
    faqs: [
      ["Does this work on the original creditor?", "No. The FDCPA covers third-party collectors and many debt buyers, not usually the company you first owed. Some states have laws that cover original creditors, so check with your attorney general."],
      ["Can they still call after I send it?", "They may contact you only to confirm receipt or to tell you about a specific action, like a lawsuit. Other calls break the rule, and you should log them."],
      ["Will the debt go away?", "No. The debt stays, and so does the collector's right to sue if the deadline to sue has not passed."],
      ["Is there another way to limit calls?", "Yes. You can tell a collector in writing which times or channels you do not want, or that you only want to be contacted in writing. A CFPB rule called Regulation F also limits how often a collector may call you about a debt, and sets rules for texts and emails. Rules like this change, so check consumerfinance.gov."],
    ],
    cta: "Scan the collector's letter and Take it Back will draft a stop-contact or validation letter and track the dates for you.",
  },
  {
    slug: "zombie-debt-old-debt-comes-back",
    category: "debt",
    icon: "clock",
    kind: "explainer",
    title: "Zombie debt: what to do when old debt comes back",
    description: "A collector contacts you about a debt from years ago. Learn what zombie debt is, how a payment can restart the clock in some states, and what to do first.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "A letter shows up about a debt you thought was long gone. This is often called zombie debt: an old debt, sometimes already past the legal time limit to sue, that a collector is trying to bring back to life.",
    blocks: [
      {
        h: "What makes it zombie debt",
        p: [
          "Every state sets a time limit, called the statute of limitations, for how long a creditor can sue over a debt. After it passes, the debt is called time-barred. The debt still exists, but a collector generally cannot win a lawsuit over it if you raise the time limit as a defense in court.",
          "Collectors are not allowed to sue, or threaten to sue, on a debt they know is time-barred. Time limits differ by state and by type of debt, so look up your state's rule before you decide what to do.",
        ],
      },
      {
        h: "The trap: a payment can restart the clock",
        p: [
          "In many states, a small payment, a written promise to pay, or sometimes even signing a document that acknowledges the debt can restart the time limit. A collector may ask for a small \"good faith\" payment for this reason. Do not pay or agree to anything until you know the debt is yours and where it stands.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Do not admit the debt on the phone", "Say you want everything in writing. Do not confirm the account, give bank details or agree to a payment."],
          ["Send a debt validation letter within 30 days", "Under the FDCPA you have 30 days after the first collector notice to dispute the debt in writing and ask for proof. The collector must pause collection until they respond."],
          ["Find the date of your last payment or activity", "Look for the last payment you made or the date you first missed a payment. That date is usually what the time limit and the credit report clock run from."],
          ["Look up your state's time limit", "Check your state's court website or attorney general. The statute-of-limitations guide on this site has more detail."],
          ["If you are sued, respond", "A time-barred debt is still a defense you must raise yourself. If you skip the court date, the court may enter a judgment against you. Call legal aid or a consumer lawyer right away."],
        ],
      },
      {
        h: "Credit reports are a separate clock",
        p: [
          "Under the Fair Credit Reporting Act, most negative items can stay on your credit report for seven years from the first missed payment that led to the debt. That clock is separate from the lawsuit clock. A payment on an old debt does not restart the seven-year credit reporting period.",
        ],
      },
    ],
    faqs: [
      ["Can a collector still contact me about a time-barred debt?", "Yes, they can ask you to pay. They cannot sue or threaten to sue, and they cannot lie about the debt."],
      ["Is it illegal to pay a time-barred debt?", "No, it is your choice. Just know that in many states a payment can restart the time limit, so think carefully before sending money."],
      ["Does the debt disappear when the time limit passes?", "No. You may still owe it, and a collector may keep asking. What changes is whether a court will enforce it if you raise the time limit."],
    ],
    cta: "Upload the collector's letter and Take it Back will help you check the dates, draft a validation letter and track your deadline.",
  },
  {
    slug: "how-to-settle-a-debt-with-a-collector",
    category: "debt",
    icon: "coin",
    kind: "letter",
    title: "How to negotiate and settle a debt with a collector",
    description: "Collectors often accept less than the full balance. Here is how to prepare, what to ask for in writing, and a sample settlement offer letter.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "You owe the debt and cannot pay all of it. Many collectors, especially debt buyers who paid a small fraction of the balance, will accept a smaller lump sum. A few careful steps protect you from paying and then hearing from them again.",
    blocks: [
      {
        h: "Before you make an offer",
        list: [
          "Confirm the debt is yours and the amount is correct. Ask for validation in writing if you have not already.",
          "Check the time limit to sue in your state. If the debt is time-barred, a payment can restart the clock in many states.",
          "Decide what you can pay in one lump sum. Collectors usually accept less for a quick payment than for a payment plan.",
          "Do not give the collector access to your bank account. Pay by a method you control, such as a money order or a one-time payment you initiate.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Start low and leave room", "Many people start by offering a fraction of the balance and move up. There is no set rate. What works depends on who owns the debt and how old it is."],
          ["Put the offer in writing", "Phone calls are easy to deny later. Send a letter or use the collector's secure portal, and save a copy."],
          ["Get the agreement in writing before you pay", "The written agreement should name the account, the amount, the due date and say the payment settles the debt in full."],
          ["Pay in the agreed way and keep proof", "Keep the receipt, the confirmation number and the cleared check or bank record."],
          ["Ask for a letter confirming the debt is settled", "Request it after payment. Check your credit reports afterward to see that the account shows as settled and the balance as zero."],
        ],
      },
      {
        h: "Sample settlement offer letter",
        p: [
          "[YOUR NAME]\n[YOUR ADDRESS]\n[DATE]\n\n[COLLECTOR NAME]\n[COLLECTOR ADDRESS]\n\nRe: Account number [ACCOUNT NUMBER]\n\nI am writing to offer a settlement of this account. I can pay $[AMOUNT] in one payment by [DATE] if you will accept it as payment in full. This offer is not an acknowledgment that I owe the full balance.\n\nIf you accept, please send a written agreement stating that the payment will fully resolve this account and that you will report the balance as zero. I will not send payment until I receive that agreement.\n\nSincerely,\n[YOUR NAME]",
        ],
      },
      {
        h: "Know the side effects",
        p: [
          "Forgiven debt can count as taxable income. A creditor that cancels $600 or more generally sends a Form 1099-C, and the IRS has exceptions such as insolvency. A tax preparer can tell you how it applies to you.",
          "A settled account can still appear on your credit report. It usually looks better than an unpaid collection, but it does not erase the history.",
        ],
      },
    ],
    faqs: [
      ["Should I pay part now to show good faith?", "Be careful. A partial payment can restart the time limit in some states, and the collector may keep the money without agreeing to a settlement. Get the terms in writing first."],
      ["Can a settlement hurt my credit?", "The late payments and collection stay on your report for the normal period. A settled or paid account may look better to lenders than an open one, but it is not a guarantee."],
      ["What if they will not accept my offer?", "You can raise the offer, wait, or ask for a payment plan. If the debt is old or you think it is not valid, you can also dispute it."],
    ],
    cta: "Take it Back can turn your numbers into a settlement letter and remind you to get the agreement in writing before you pay.",
  },
  {
    slug: "wage-garnishment-what-to-do",
    category: "debt",
    icon: "briefcase",
    kind: "explainer",
    title: "Wage garnishment: what it is and what to do",
    description: "Wage garnishment means money is taken from your paycheck to pay a debt. Learn when it can happen, the federal limits, and what to do right away.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "Your employer says they got a court order to take money out of your paycheck. That is wage garnishment. It is serious, but you have rights, and acting quickly gives you the most options.",
    blocks: [
      {
        h: "How garnishment usually works",
        p: [
          "For most consumer debts like credit cards, medical bills and personal loans, a creditor has to sue you, win a court judgment, and then get a court order before your employer can take money from your pay. A collector who threatens to garnish you without a lawsuit is usually bluffing.",
          "Some debts work differently. Federal student loans, unpaid federal taxes, child support and some other government debts can be collected without a regular court judgment. If this is your situation, ask for the rules that apply to that kind of debt.",
        ],
      },
      {
        h: "Federal limits on how much",
        p: [
          "Under the federal Consumer Credit Protection Act, ordinary garnishment for consumer debt is capped at the smaller of two amounts: 25 percent of your disposable earnings (pay after required taxes), or the amount your weekly disposable earnings exceed 30 times the federal minimum wage. Many states set lower limits or protect more of your pay, so check your state's rules.",
          "Your employer cannot fire you because of one garnishment, though protection for multiple garnishments is limited.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Read the papers", "Look for the court name, case number, the creditor's name and any deadline to object. Garnishment notices often have a short window to respond."],
          ["Call legal aid or a consumer lawyer today", "Many legal aid offices handle garnishment. Search lawhelp.org or ask your state bar for a referral."],
          ["Check whether your income is protected", "Social Security, SSI, VA benefits and many other federal benefits are generally protected from private creditors. Your state may protect more."],
          ["File an objection or claim of exemption if you qualify", "Courts have forms for this, often called a claim of exemption or a request for hearing. The court clerk or legal aid can help you find it."],
          ["Ask about a payment arrangement", "Some creditors will agree to a payment plan in place of garnishment. Get it in writing and ask the court to release the order once it is in place."],
        ],
      },
      {
        h: "If the judgment was a surprise",
        p: [
          "If you never got the lawsuit papers, tell the court and a lawyer right away. A judgment entered because you were never properly served can sometimes be reopened, but the time to ask is limited and set by state law.",
        ],
      },
    ],
    faqs: [
      ["Can my employer garnish me without a court order?", "For most consumer debts, no. A creditor needs a judgment and a court order first. Some government debts have their own process."],
      ["Can I stop garnishment by filing bankruptcy?", "Filing bankruptcy often puts an automatic stop on most collections, including garnishment. It has major consequences, so talk to a bankruptcy lawyer or legal aid first."],
      ["Does garnishment end by itself?", "It continues until the debt is paid, the judgment is vacated or ended, or a court order stops it. Ask the court about the status if you are unsure."],
    ],
    cta: "Scan your garnishment notice and Take it Back will help you find the deadline and organize your paperwork for a lawyer or legal aid.",
  },
  {
    slug: "bank-levy-protected-funds-explained",
    category: "debt",
    icon: "bank",
    kind: "rights",
    title: "Bank account levy: what is protected and what to do",
    description: "A creditor with a judgment may freeze your bank account. Learn what money is usually protected, how to claim it, and the steps to take right away.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "You tried to use your debit card and found your account frozen. A bank levy is when a creditor with a court judgment has a court order the bank to hold your money. Some of the money in the account may be protected, and you can usually ask for it back.",
    blocks: [
      {
        h: "How a levy works",
        p: [
          "For most consumer debts, a creditor must first sue and win a judgment. Then they ask a court for an order that tells your bank to freeze funds up to the judgment amount. Government agencies can levy for certain debts such as taxes without going through the same steps.",
          "The bank must usually send you notice, and you generally have a limited window to claim that the money is protected. The notice and timeline depend on your state and on who is collecting.",
        ],
      },
      {
        h: "Money that is often protected",
        list: [
          "Social Security, SSI, VA benefits and some other federal benefits that were deposited directly into your account. A federal rule requires banks to automatically protect a set amount of recently deposited federal benefits. Ask your bank how it applies the rule, and ask legal aid to confirm the current details.",
          "Child support you received, in many states",
          "Public assistance and unemployment benefits, in many states",
          "A basic amount of money in the account, in some states",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Get the paperwork", "Ask the bank for a copy of the levy or garnishment order. Note the court, case number and deadline to respond."],
          ["Do not ignore it", "The deadline to claim your exemption is often short. Missing it can mean the creditor gets the money."],
          ["Gather proof the money is protected", "Collect benefit award letters and bank statements showing where each deposit came from. Keep protected money in an account that is separate from other money when you can."],
          ["File a claim of exemption", "Courts usually have a form for this. The clerk's office or legal aid can show you where it is."],
          ["Get help", "Call legal aid, a consumer lawyer or your state's court self-help center. Search lawhelp.org to find free help near you."],
        ],
      },
      {
        h: "Basic protections for the future",
        p: [
          "Open a separate account for protected benefits if you can, and avoid mixing them with wages or other deposits. Do not move money around in a panic. If you have questions about an account at the same bank where you owe money, a lawyer can explain whether the bank may take money for what you owe it.",
        ],
      },
    ],
    faqs: [
      ["Can a collector freeze my account without suing me?", "For most consumer debts, no. A collector who says they will empty your account without a lawsuit is usually making an empty threat. Government debts such as taxes, student loans and child support work differently."],
      ["How long can my account stay frozen?", "It depends on your state and the order. If you file a claim of exemption on time, a court usually decides what must be released."],
      ["Will the bank charge me a fee?", "Banks often charge a fee when they process a levy. Ask for it in writing and ask whether it can be waived if the funds were protected."],
    ],
    cta: "Take it Back can help you organize your proof of protected income and track the deadline to respond to a levy.",
  },
  {
    slug: "sued-by-a-debt-collector-what-to-do",
    category: "debt",
    icon: "gavel",
    kind: "how-to",
    title: "Sued by a debt collector? What to do right now",
    description: "If a debt collector sues you, do not ignore it. Here is how to read the papers, respond on time, check the debt, and find free legal help.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "Someone handed you court papers with your name on them. A debt collection lawsuit is stressful, but you can respond. The most important rule is simple: do not ignore it. If you do not respond, the court can enter a default judgment against you, which can lead to garnishment or a bank levy.",
    blocks: [
      {
        h: "What the papers are",
        p: [
          "You usually get a summons (the notice that you are being sued) and a complaint (the claim saying what you owe). The summons lists how many days you have to respond. That deadline is set by your state and your court, so read it closely and count from the day you were served.",
          "Some collectors file suits knowing many people will not answer. A big share of debt cases end in default for this reason. Responding changes the situation, even if you owe the money.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Write down the deadline", "Put the response date on your calendar today. If the papers are unclear, call the court clerk and ask how to respond. The clerk cannot give legal advice but can explain the process."],
          ["Call legal aid or a consumer lawyer", "Many legal aid offices and bar associations help with debt lawsuits for free or low cost. Search lawhelp.org or ask the court's self-help center. Do this first, before the deadline."],
          ["Check whether the collector is the right one", "Ask for proof they own the debt and that the amount is right. Many cases are weak because the collector cannot show who owns the debt."],
          ["File an answer in court", "An answer is your written response. It can admit or deny each claim and raise defenses, such as the time limit to sue. The court or legal aid can give you the forms."],
          ["Go to every hearing", "Missing a hearing can lead to a judgment against you. If you cannot go, contact the court before the date."],
          ["Consider settlement", "You can often negotiate before the hearing. Get any deal in writing, and ask that the case be dismissed once you have paid."],
        ],
      },
      {
        h: "Possible defenses",
        list: [
          "The time limit to sue has passed",
          "The collector cannot prove it owns the debt or the amount",
          "The debt is not yours, or is the result of identity theft",
          "You already paid it or settled it",
          "You were never properly served with the papers",
        ],
      },
      {
        h: "Be careful with texts and emails about the suit",
        p: [
          "Check that the court papers are real. Scammers sometimes pretend to be collectors or courts. Look up the court's phone number yourself and ask whether a case exists under your name.",
        ],
      },
    ],
    faqs: [
      ["What if I owe the money?", "You can still respond. You may be able to settle, set up a payment plan or ask for protections the court allows."],
      ["What happens if I do not respond?", "The court can enter a default judgment. That can allow the collector to garnish wages or levy bank accounts, depending on your state."],
      ["Where can I get free legal help?", "Try your local legal aid office, your state bar's referral service, a court self-help center or lawhelp.org."],
    ],
    cta: "Upload your court papers and Take it Back will highlight the response deadline and help you prepare questions for legal aid.",
  },
  {
    slug: "pay-for-delete-and-goodwill-letters",
    category: "debt",
    icon: "envelope",
    kind: "letter",
    title: "Pay-for-delete and goodwill letters: do they work?",
    description: "A pay-for-delete or goodwill letter asks a creditor to remove a negative mark. Neither is guaranteed. Here is how to ask politely and what to expect.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "You paid or plan to pay an old debt and you want the negative mark off your credit report. Two requests are common: pay-for-delete and a goodwill letter. Both are only requests. A creditor can say no, and neither is guaranteed.",
    blocks: [
      {
        h: "What each one is",
        p: [
          "Pay-for-delete: you offer to pay a collection account if the collector agrees to ask the credit bureaus to remove it. Credit bureaus and many creditors discourage this, and some collectors refuse on principle. Under the Fair Credit Reporting Act, creditors must report accurate information, which is why many will not agree.",
          "Goodwill letter: after you have paid, or if you had one late payment, you write to the creditor and politely ask them to remove or update the mark as a courtesy. It works most often when the mistake was a one-time slip and your record since is clean.",
        ],
      },
      {
        h: "How to ask",
        steps: [
          ["Decide which one fits", "Use pay-for-delete before you pay a collection. Use a goodwill letter after a payment was late, or after you have paid."],
          ["Get any deal in writing before you pay", "If a collector agrees to delete, get the promise in writing. A phone promise is hard to prove."],
          ["Be brief and polite", "Say what happened, what you have done since, and what you are asking for. Do not threaten or demand."],
          ["Send it to the right place", "Write to the creditor or collector, not the credit bureau. Ask for a customer-service or credit-reporting address."],
          ["Check your reports later", "Look at your free reports at annualcreditreport.com in a couple of months to see whether anything changed."],
        ],
      },
      {
        h: "Sample goodwill letter",
        p: [
          "[YOUR NAME]\n[YOUR ADDRESS]\n[DATE]\n\n[CREDITOR NAME]\n[CREDITOR ADDRESS]\n\nRe: Account number [ACCOUNT NUMBER]\n\nI am writing to ask for a goodwill adjustment to my credit report. In [MONTH, YEAR], my payment was late because [SHORT, HONEST REASON]. Since then I have paid on time and [PAID IN FULL / KEPT THE ACCOUNT CURRENT].\n\nIf you are able to remove the late payment from my credit report, I would be grateful. Thank you for your time.\n\nSincerely,\n[YOUR NAME]",
        ],
      },
      {
        h: "What to expect",
        p: [
          "Many requests are turned down. If the answer is no, you can dispute any information that is actually wrong, and that is covered by law. If the information is correct, it generally stays until the reporting time ends, which is usually seven years from the first missed payment.",
        ],
      },
    ],
    faqs: [
      ["Is pay-for-delete legal?", "It is not clearly banned, but credit bureaus discourage it, and many collectors will not do it. Do not pay on the promise of a phone call alone."],
      ["Will a goodwill letter hurt me?", "No. The worst result is that they say no. Write once, politely, and do not send the same letter again and again."],
      ["Should I pay a debt just to remove it?", "Paying does not remove an accurate negative mark by itself. Paying may still be the right choice for other reasons, such as stopping calls or a lawsuit."],
    ],
    cta: "Take it Back can draft a goodwill or pay-for-delete letter and set a reminder to check your reports.",
  },
  {
    slug: "original-creditor-vs-debt-buyer-vs-collection-agency",
    category: "debt",
    icon: "search",
    kind: "explainer",
    title: "Original creditor vs debt buyer vs collection agency",
    description: "Three different kinds of companies can collect a debt. Here is how to tell them apart, why it matters, and which questions to ask.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "A letter arrives from a company you do not recognize, saying you owe money. Before you respond, find out who they are. The type of company changes which rules apply and what you should ask for.",
    blocks: [
      {
        h: "The three types",
        list: [
          "Original creditor: the company you first owed, such as a credit card issuer, a hospital or a phone company. It usually collects its own debts first.",
          "Collection agency: a company hired by the original creditor to collect, usually for a fee. The creditor still owns the debt.",
          "Debt buyer: a company that bought the debt, often for a small fraction of its value. It owns the account and may collect itself, hire an agency, or sue.",
        ],
      },
      {
        h: "Why the type matters",
        p: [
          "The federal Fair Debt Collection Practices Act (FDCPA) covers third-party collectors and many debt buyers, including the right to ask for validation and to make them stop contacting you. It usually does not apply to original creditors collecting their own debts, though state laws sometimes do.",
          "Debt buyers have to prove they own your account if you are sued. Records get lost when accounts are sold, so the amount and ownership can be wrong. That is one reason to ask for proof before paying anyone.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Read the letter for the name and account details", "Look for the original creditor's name, the account number and the balance. The first notice from a collector must include certain details, such as the amount and the creditor."],
          ["Ask who owns the debt", "Write to ask whether they are the owner or are collecting for someone else, and ask for the name and address of the original creditor."],
          ["Send a validation letter within 30 days", "The FDCPA gives you 30 days from the first notice to dispute in writing and ask for proof."],
          ["Check your credit report", "Get your free reports at annualcreditreport.com. See whether the account is listed, who reports it and whether the dates and amounts match your records."],
          ["Do not pay until you know who is owed", "Paying the wrong company can mean you pay twice. Pay only after the debt is validated, and keep proof of payment."],
        ],
      },
      {
        h: "When the debt is passed along",
        p: [
          "A debt can be sold more than once. Each owner should report the account the same way and keep the original dates. If the balance has grown without a reason, ask in writing for an explanation of each added fee.",
        ],
      },
    ],
    faqs: [
      ["Can a debt buyer charge more than I owed?", "Only if the original agreement or the law allows it. Ask for an itemized breakdown of interest and fees."],
      ["Should I pay the original creditor or the collector?", "Ask for written confirmation of who now owns the account. If the original creditor still owns it, pay them. If it was sold, you pay the new owner."],
      ["Can a collector reach my employer or family?", "Only in narrow ways. A separate guide on this site explains what collectors may say to other people."],
    ],
    cta: "Scan any collector letter and Take it Back will tell you what to ask for and draft the validation letter.",
  },
  {
    slug: "debt-relief-and-credit-repair-scams",
    category: "debt",
    icon: "alert",
    kind: "checklist",
    title: "Debt relief and credit repair scams: warning signs",
    description: "Some companies charge big fees and promise to erase debt or fix your credit. Here are the warning signs, what the law says, and where to report them.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "You are behind on bills and an ad, call or text promises to wipe out your debt or clean up your credit. Some legitimate help exists, but this field has many scams. A few simple checks can keep you from paying for nothing.",
    blocks: [
      {
        h: "Warning signs",
        list: [
          "They ask for a fee before they have done anything",
          "They guarantee they will remove accurate negative information from your credit report. No one can promise that.",
          "They tell you to stop talking to your creditors and to stop paying, and to send money to them instead",
          "They say they have a secret government program or a special legal loophole",
          "They tell you to create a new credit identity or use a different tax ID number. That is illegal.",
          "They will not give you a written contract or explain your rights",
          "They pressure you to sign up today",
        ],
      },
      {
        h: "What the law says",
        p: [
          "The Credit Repair Organizations Act bars credit repair companies from charging you before they have done the work, requires a written contract, and gives you three business days to cancel. They also cannot tell you to lie to credit bureaus.",
          "The FTC's Telemarketing Sales Rule bans debt relief companies that sell by phone from collecting fees before they have settled or reduced at least one of your debts. Rules like this are updated over time, so check ftc.gov for the current version.",
          "You can fix errors on your credit report yourself, for free. The law gives you the right to dispute inaccurate information directly with the credit bureau.",
        ],
      },
      {
        h: "What to do instead",
        steps: [
          ["Try a nonprofit credit counselor", "Look for a reputable nonprofit credit counseling agency. Ask about all fees and read any agreement before you sign."],
          ["Contact your creditors directly", "Many offer hardship plans if you ask. Get any plan in writing."],
          ["Dispute credit report errors yourself", "Get free reports at annualcreditreport.com. Write to the bureau about any mistake. Bureaus generally have 30 days to investigate."],
          ["Get free legal help", "Legal aid offices can explain your options, including bankruptcy, without a sales pitch."],
        ],
      },
      {
        h: "Where to report",
        p: [
          "If you were scammed, report it to the FTC at reportfraud.ftc.gov and to your state attorney general. Ask your bank whether any payments can be disputed. Keep your contract, ads, emails and receipts.",
        ],
      },
    ],
    faqs: [
      ["Are all debt settlement companies scams?", "No, but many charge high fees and the results vary. Debt settlement can also hurt your credit and may have tax effects. Read the contract and ask about every fee."],
      ["Can someone really remove my negative items?", "Only if they are wrong or past the legal reporting period. Accurate information stays for the time the law allows."],
      ["I already paid a company. What now?", "Cancel in writing, ask for a refund, and report it to the FTC and your attorney general. Check with your bank about disputing a card charge."],
    ],
    cta: "Take it Back can read a contract or ad you were given and point out the warning signs before you pay anything.",
  },
  {
    slug: "debt-collector-contacting-family-or-employer",
    category: "debt",
    icon: "user",
    kind: "rights",
    title: "Debt collectors contacting your family or employer",
    description: "Collectors are limited in what they can tell your family, friends and employer. Here is what the law says and what to do if they cross the line.",
    kicker: "Debt & collectors",
    updated: "2026-10-20",
    intro: "Your boss or a relative says a debt collector called them about you. That is upsetting, and in most cases it breaks the rules. The Fair Debt Collection Practices Act (FDCPA) limits what collectors can say to other people.",
    blocks: [
      {
        h: "What collectors may and may not do",
        list: [
          "A collector may contact other people only to find out how to reach you, such as your address or phone number.",
          "They generally may not tell another person that you owe a debt.",
          "They generally may contact the same third party only once, unless that person asks for a call back or the collector believes the earlier answer was wrong or incomplete.",
          "They may not use a postcard or an envelope that shows they are a debt collector.",
          "They generally may talk about the debt with your spouse, and in some cases with a parent if you are a minor or with someone who has authority to handle your affairs.",
        ],
      },
      {
        h: "Contact at your job",
        p: [
          "A collector may not call you at work if they know or have reason to know your employer does not allow it. Tell them clearly, ideally in writing, that you cannot take these calls at work. After that, any call to your workplace is a violation.",
          "A collector cannot say you will be fired or threaten your job. Talking to your employer about a garnishment is different: that only happens after a court order.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Write down what happened", "Note the date, the time, who called and exactly what they said. Ask your family or boss to write down what they heard."],
          ["Tell the collector to stop contacting those people", "Send a letter that says not to contact your employer or family. Keep a copy and send it by certified mail."],
          ["Send a cease-communication letter if you want to", "That tells them to stop contacting you at all, with limited exceptions."],
          ["File complaints", "Report it to the CFPB at consumerfinance.gov/complaint and to your state attorney general."],
          ["Talk to a lawyer", "The FDCPA allows you to sue for violations, and a consumer lawyer or legal aid office can tell you if your facts qualify."],
        ],
      },
      {
        h: "What you can say to friends and family",
        p: [
          "If someone calls you about a relative's debt, you do not have to share any information. You can say, \"I'm not able to help with this. Please do not call this number again.\" You usually are not responsible for another adult's debt unless you co-signed or share an account, though some states have special rules for certain expenses.",
        ],
      },
    ],
    faqs: [
      ["Can a collector leave a message at my work?", "They can leave a message that does not reveal the debt. Messages that mention a debt to a coworker break the rules."],
      ["Do I owe my late spouse's debt?", "In general, debts are paid from the estate, not by relatives. State rules vary, so ask a lawyer or legal aid before paying anything."],
      ["Can I sue a collector that told my boss about my debt?", "The FDCPA lets people sue over violations, within a short time limit. Talk to a lawyer soon."],
    ],
    cta: "Take it Back can help you log the calls, draft the stop-contact letter and prepare a complaint.",
  },
  {
    slug: "how-to-file-in-small-claims-court",
    category: "courts-complaints",
    icon: "gavel",
    kind: "how-to",
    title: "How to file in small claims court, step by step",
    description: "Small claims court is built for people without lawyers. Here are the steps to file, serve the other side, prepare your evidence and present your case.",
    kicker: "Courts & complaints",
    updated: "2026-10-20",
    intro: "A business or person owes you money and will not pay. Small claims court is a simpler, cheaper way to ask a judge to decide. You do not need a lawyer, and the rules are written for regular people.",
    blocks: [
      {
        h: "Before you file",
        list: [
          "Check the dollar limit for small claims in your state. It differs a lot from place to place.",
          "Send a demand letter first. Many courts expect you to have asked for payment, and many disputes end here.",
          "Check the deadline to file. Each state sets time limits for different kinds of claims.",
          "Find the right defendant name and address. For a business, look up its registered name through your state's business records.",
          "Gather your evidence: contracts, receipts, photos, texts, emails and a timeline.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Find the right court", "Usually the court where the defendant lives or does business, or where the problem happened. Your state's court website explains how to find it."],
          ["Get and fill out the claim form", "The clerk's office or court website has it. Describe what happened and the amount you want in plain words."],
          ["Pay the filing fee", "Fees vary by state and claim size. If you cannot afford it, ask about a fee waiver."],
          ["Serve the other side", "The defendant must be formally told about the case. Your court explains the allowed methods, such as a sheriff, process server or certified mail. Keep proof of service."],
          ["Prepare your case", "Put your documents in order and make copies. Write a short outline of what you will say, in date order."],
          ["Go to the hearing", "Arrive early. State your facts briefly, show your proof and answer the judge's questions calmly. Bring witnesses if you have them."],
        ],
      },
      {
        h: "After the hearing",
        p: [
          "The judge may decide at the hearing or send the decision later. Winning a judgment does not mean you will be paid automatically. A separate guide on this site explains how to collect. If you lose, ask the clerk how to appeal and how long you have, as the window is often short.",
        ],
      },
    ],
    faqs: [
      ["Can I bring a lawyer?", "Some states do not allow lawyers in small claims court. Check your state's court rules."],
      ["What if the other side does not show up?", "You may get a default judgment, but the judge may still ask for proof. Bring your evidence anyway."],
      ["How much will it cost?", "Filing fees are usually modest, and some courts will waive them. You may be able to ask for those costs back if you win."],
    ],
    cta: "Take it Back can organize your evidence into a timeline and draft the demand letter you send before you file.",
  },
  {
    slug: "how-to-write-a-demand-letter",
    category: "courts-complaints",
    icon: "document",
    kind: "letter",
    title: "How to write a demand letter (with a sample)",
    description: "A clear, polite demand letter settles many disputes before court. Learn what to include, how to send it, and copy a sample you can fill in.",
    kicker: "Courts & complaints",
    updated: "2026-10-20",
    intro: "Someone owes you money or a fix, and calls have not worked. A demand letter puts your request in writing, gives a deadline and creates a record. Many disputes end here, and if not, the letter helps in court.",
    blocks: [
      {
        h: "What to include",
        list: [
          "Your name, address and contact information, and the date",
          "The other side's name and address",
          "A short, factual summary of what happened, in date order",
          "What you want, with a specific dollar amount or action",
          "A deadline, often 10 to 14 days, and what you will do if it is missed",
          "A list of papers you are attaching, such as receipts or photos",
        ],
      },
      {
        h: "Tone and tips",
        p: [
          "Keep it calm and specific. Stick to facts and leave out insults or threats. Judges read these letters, and a polite one makes you look reasonable.",
          "Only say you will take a step, like filing in small claims court, if you are ready to do it. Do not threaten things you cannot or will not do, and do not threaten criminal charges.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Write the letter", "Use the sample below. Keep it to one page if you can."],
          ["Attach copies, not originals", "Include receipts, contracts, photos and messages that support your claim."],
          ["Send it in a way you can prove", "Use certified mail with a return receipt. Send a copy by email too if you have the address."],
          ["Keep a copy and a log", "Save the letter, the mailing receipt and anything the other side says in response."],
          ["Follow up on the deadline", "If they do not respond, consider small claims court, a complaint to a government agency, or legal advice."],
        ],
      },
      {
        h: "Sample demand letter",
        p: [
          "[YOUR NAME]\n[YOUR ADDRESS]\n[DATE]\n\n[OTHER PARTY NAME]\n[OTHER PARTY ADDRESS]\n\nRe: [SHORT DESCRIPTION, e.g. unreturned deposit]\n\nOn [DATE], [WHAT HAPPENED IN ONE OR TWO SENTENCES]. Since then, [WHAT YOU DID TO FIX IT, e.g. I called on DATE and emailed on DATE].\n\nI am asking you to [PAY $AMOUNT / FIX THE PROBLEM BY DOING X] by [DEADLINE, at least 10 days away]. I have attached [LIST OF DOCUMENTS].\n\nIf I do not hear from you by that date, I may file a claim in small claims court and seek the amount owed plus court costs.\n\nSincerely,\n[YOUR NAME]\n[PHONE / EMAIL]",
        ],
      },
    ],
    faqs: [
      ["Do I need a lawyer to send a demand letter?", "No. Anyone can write one. A lawyer's letter can carry more weight, but a clear letter from you is often enough."],
      ["What if they do not answer?", "You can file in small claims court, report them to a state agency, or both. Your letter and proof of mailing will help."],
      ["Is a demand letter required before small claims?", "Some courts or state laws require it, and others do not. It helps in either case, so check your court's rules."],
    ],
    cta: "Tell Take it Back what happened and it will write the demand letter, add a deadline and keep your copy.",
  },
  {
    slug: "how-to-file-an-ftc-complaint",
    category: "courts-complaints",
    icon: "megaphone",
    kind: "how-to",
    title: "How to file an FTC complaint and what happens next",
    description: "The FTC takes reports about scams and unfair business practices. Learn how to file, what to include, and what to expect after you submit.",
    kicker: "Courts & complaints",
    updated: "2026-10-20",
    intro: "You were scammed or treated unfairly by a business and want to report it. The Federal Trade Commission (FTC) collects reports from consumers and uses them to spot patterns and bring cases. It is worth filing, but it works differently than most people expect.",
    blocks: [
      {
        h: "What the FTC does and does not do",
        p: [
          "The FTC does not resolve individual disputes or get your money back for you in most cases. Your report goes into a database that law enforcement uses to find patterns, investigate companies and sometimes bring cases. In some cases the FTC returns money to victims after a case ends.",
          "Because of that, file for two reasons: to help stop the company from doing this to others, and to create a record for your own case. Use other steps too, such as disputing a charge with your card issuer or contacting your state attorney general, if you want your own money back.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Gather your facts", "Collect the company's name, website, phone number, dates, amounts paid, how you paid, and any emails, texts or screenshots."],
          ["Go to reportfraud.ftc.gov", "The site asks what happened and walks you through questions. For identity theft, use identitytheft.gov instead, which helps you build a recovery plan."],
          ["Describe what happened plainly", "Give the facts in date order. Say what the company promised and what really happened."],
          ["Save your confirmation", "Keep the report number or the copy you are given."],
          ["Take your own steps", "Contact your bank or card issuer about disputing a charge, and consider filing with your state attorney general and the CFPB if it involves a financial product."],
        ],
      },
      {
        h: "What happens next",
        list: [
          "You may not hear back. The FTC does not contact everyone who files.",
          "Your report may be shared with federal, state and local law enforcement.",
          "If you gave money to a scammer, move quickly to tell your bank or card company, since time limits apply.",
          "Watch for follow-up scams. People who report fraud are sometimes contacted by fake \"recovery\" services that charge a fee.",
        ],
      },
    ],
    faqs: [
      ["Is it free to file?", "Yes. Never pay anyone to file an FTC report or to get your money back through the FTC."],
      ["Can I file for a debt collector?", "For debt collection, the CFPB and your state attorney general are often better places. You can file with the FTC as well."],
      ["Will filing hurt my own case?", "No. A report is a record. If you later sue or dispute a charge, a complaint with the date and details can help."],
    ],
    cta: "Take it Back can gather your dates and details into a clear complaint you can paste into the FTC form.",
  },
  {
    slug: "how-to-file-a-state-attorney-general-complaint",
    category: "courts-complaints",
    icon: "flag",
    kind: "how-to",
    title: "How to file a complaint with your state attorney general",
    description: "Your state attorney general takes consumer complaints and often asks the business to respond. Here is how to find the right office and file a useful complaint.",
    kicker: "Courts & complaints",
    updated: "2026-10-20",
    intro: "A business ignored you, and you want someone with authority to ask why. Your state attorney general's office has a consumer protection division that accepts complaints. Many will contact the business for you, which can lead to a response when your own letters did not.",
    blocks: [
      {
        h: "What an attorney general can do",
        p: [
          "Offices differ by state, but most can forward your complaint to the business and ask for a reply, offer informal mediation, track patterns of complaints and, if a business keeps breaking the law, investigate or sue.",
          "They usually do not act as your personal lawyer and may not be able to get you a refund. Still, a complaint creates a record, and businesses often respond faster to a state office than to a customer.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Find your office", "Go to usa.gov/state-consumer and pick your state. It lists consumer protection contacts. File in the state where you live or where the business is located."],
          ["Gather your documents", "Include your receipts, contracts, emails, photos and a short timeline of events. Copies, not originals."],
          ["Write a short summary", "Say what happened, when, what you paid, what you asked for and how the business responded. Keep it factual."],
          ["State what you want", "For example a refund of a specific amount, a repair or a cancelled charge."],
          ["Submit and save a copy", "Most states have an online form. Some accept mail. Keep your confirmation number and a copy of everything you send."],
          ["Respond to follow-up", "If the office asks for more information or forwards a reply, answer by their deadline."],
        ],
      },
      {
        h: "Other places to send the same facts",
        list: [
          "The CFPB (consumerfinance.gov/complaint) for banks, credit cards, loans, debt collectors and credit reports",
          "The FTC (reportfraud.ftc.gov) for scams and unfair practices",
          "Your state's insurance department for insurance companies",
          "A licensing board if the business is a licensed contractor, doctor or other licensed professional",
        ],
      },
    ],
    faqs: [
      ["Will the attorney general get my money back?", "Sometimes, but there is no guarantee. The office may mediate or press the business to respond. Small claims court may still be needed."],
      ["How long does it take?", "It varies by state and by office. Many offices post expected timelines on their complaint pages."],
      ["Do I need a lawyer?", "No. Complaint forms are made for consumers. A lawyer can help if a lot of money is at stake."],
    ],
    cta: "Take it Back can write your complaint summary and put your documents in order so you can submit them in minutes.",
  },
  {
    slug: "is-a-better-business-bureau-complaint-worth-it",
    category: "courts-complaints",
    icon: "check",
    kind: "explainer",
    title: "Is a Better Business Bureau complaint worth it?",
    description: "The BBB is a private nonprofit, not a government agency. Learn what a BBB complaint can and cannot do and when it is worth your time.",
    kicker: "Courts & complaints",
    updated: "2026-10-20",
    intro: "You are wondering whether to file a Better Business Bureau (BBB) complaint about a business. It is quick and free, and it works better in some cases than others. Knowing what it is helps you decide.",
    blocks: [
      {
        h: "What the BBB is",
        p: [
          "The BBB is a private nonprofit organization. It is not a government agency and it has no legal power to make a business pay you. Businesses can choose whether to take part, and many do, since a BBB profile is public and a rating can affect their reputation.",
          "When you file, the BBB sends your complaint to the business and asks for a response. You can then say whether the answer resolved the problem. The complaint and response may appear on the business's profile.",
        ],
      },
      {
        h: "When it can help",
        list: [
          "The business cares about its reputation, such as a local shop, contractor or retailer",
          "The problem is a refund, repair or billing dispute where a response from a company may fix it",
          "You have already tried to resolve it directly and have the dates and papers to show it",
          "You want a public record that other customers can see",
        ],
      },
      {
        h: "When to use something else",
        list: [
          "Fraud or scams: report to the FTC and your attorney general",
          "Banks, loans, credit reports and debt collectors: use the CFPB",
          "Insurance: use your state insurance department",
          "Money owed with a deadline: consider a demand letter, a card chargeback or small claims court, since a BBB complaint does not stop time limits from running",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Try to fix it directly first", "Write to the company and give a deadline. Keep copies."],
          ["Gather your facts", "Account number, dates, amounts and what you want."],
          ["File on the BBB website", "Search for the business and choose the file-a-complaint option. Describe the facts calmly and say what a fair fix looks like."],
          ["Respond to the company's reply", "Say whether you accept the response. If not, explain why in a short note."],
        ],
      },
    ],
    faqs: [
      ["Is a BBB complaint legally binding?", "No. The BBB cannot order a business to do anything."],
      ["Does it cost anything?", "No. Filing a complaint is free."],
      ["Will it hurt my other options?", "No. You can file with the BBB and also with a government agency or in small claims court."],
    ],
    cta: "Take it Back can draft a BBB complaint and the follow-up letter so your story stays clear and consistent.",
  },
  {
    slug: "how-to-collect-a-court-judgment",
    category: "courts-complaints",
    icon: "scale",
    kind: "how-to",
    title: "Collecting a judgment after you win in court",
    description: "A court judgment is a decision, not a payment. Learn the steps to ask for payment, and the tools courts may allow if the other side does not pay.",
    kicker: "Courts & complaints",
    updated: "2026-10-20",
    intro: "You won your case and the judge said the other side owes you money, but no check has come. This is common. In most places the court does not collect for you, so you need to take the next steps yourself.",
    blocks: [
      {
        h: "The first steps",
        steps: [
          ["Read the judgment carefully", "Note the amount, any interest, the date, and any deadline the judge set for payment or for appeals."],
          ["Wait out the appeal period", "The losing side often has a short time to appeal. Ask the clerk when it ends."],
          ["Send a payment request", "Write to the other side with the judgment amount and where to send payment. Keep a copy."],
          ["Keep a record of payments", "Log every payment received and report it if the court requires a notice that the judgment has been paid."],
          ["Ask the clerk about next steps", "The clerk can tell you what forms your court uses to enforce a judgment. They cannot give legal advice."],
        ],
      },
      {
        h: "Tools courts may allow",
        p: [
          "What is available depends on your state. Common tools include wage garnishment (an order for the employer to send part of the paycheck to you), a bank levy (an order to take money from the debtor's account), and a lien on property that can be paid when it is sold. Some places let you question the debtor under oath about their income and assets, which is often called a debtor's exam.",
          "Some income and property is protected from collection, such as certain benefits, and the amount varies by state. A creditor cannot take what the law protects.",
        ],
      },
      {
        h: "Be realistic",
        list: [
          "You can only collect if the other side has income or assets you can reach.",
          "Judgments expire in many states after a set number of years, and some can be renewed. Ask the clerk about the time limit.",
          "Many states add interest to a judgment, and the rate is set by state law.",
          "Collection costs are sometimes added to what the debtor owes, so keep your receipts.",
          "A lawyer or legal aid office can explain the options if the amount is large or the debtor is hiding assets.",
        ],
      },
      {
        h: "Do not collect on your own in risky ways",
        p: [
          "Do not take property, confront the debtor or contact their employer without a court order. Use the court's process, and follow the FDCPA-style rules of fairness: no harassment and no threats.",
        ],
      },
    ],
    faqs: [
      ["Can I get my filing fee back?", "Often the judgment includes court costs. Check the judgment, and ask the clerk how to claim them."],
      ["What if the other side files for bankruptcy?", "Bankruptcy can stop collection. Talk to a lawyer or legal aid, and watch for notices from the bankruptcy court."],
      ["How long do I have to collect?", "It depends on your state. Ask the clerk or look at the court's website for judgment expiration and renewal."],
    ],
    cta: "Take it Back can track your judgment dates and payment log, and help you write the payment request.",
  },
  {
    slug: "how-to-keep-records-and-evidence-for-a-dispute",
    category: "courts-complaints",
    icon: "clipboard",
    kind: "checklist",
    title: "How to keep records and evidence for any dispute",
    description: "Good records win more disputes than good arguments. This checklist shows what to save, how to organize it, and how to build a simple timeline.",
    kicker: "Courts & complaints",
    updated: "2026-10-20",
    intro: "You are in a dispute, and you can already tell it may take a while. Start a record now. It is easier to build a file as you go than to rebuild one later, and it works whether you are talking to a company, an agency or a judge.",
    blocks: [
      {
        h: "What to save",
        list: [
          "Contracts, leases, agreements, terms of service and any changes",
          "Bills, statements, receipts and proof of payment",
          "Letters, emails, texts, chat transcripts and voicemails",
          "Photos and videos with dates visible, if you can",
          "Names, job titles and direct numbers of people you talk to",
          "Account numbers, claim numbers and case numbers",
          "Proof of mailing: certified mail receipts, return receipts and tracking",
          "Notes on costs the problem caused you, such as missed work or repair bills",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Make one folder", "Use a paper folder, a computer folder or both. Put everything for this dispute in one place."],
          ["Back up each item", "Take screenshots of web pages and chats. Save emails as PDFs. Copy files to a second place."],
          ["Log every call", "Write the date, time, person, and what was said right after each call. Notes made at the time carry weight."],
          ["Move conversations to writing", "After a call, send an email that says what you understood, such as \"As we discussed today, you agreed to...\"."],
          ["Keep a timeline", "A one-page list of dates and events in order. It becomes the outline of your letter, complaint or court statement."],
          ["Send important letters by certified mail", "Keep the receipt with a copy of the letter."],
        ],
      },
      {
        h: "Be fair and careful",
        p: [
          "Recording a phone call is legal in some states only when everyone agrees, and the rules differ across states. Ask before you record, or take written notes instead.",
          "Do not alter documents or delete messages, even ones you think hurt you. Keep the file complete and honest. A calm, accurate record is the most useful kind.",
        ],
      },
      {
        h: "How long to keep it",
        p: [
          "Keep dispute files until the matter is resolved and the time to appeal or sue has passed, and ideally a few years after. Keep proof of any settlement or paid-off debt for longer.",
        ],
      },
    ],
    faqs: [
      ["Are texts and screenshots good evidence?", "They can be. Keep the whole conversation with dates and names visible, and save the original messages as well."],
      ["What if I lost some records?", "Ask the company for copies of statements, contracts and call notes. You can also request them from your bank or card issuer."],
      ["Should I give originals to an agency or court?", "Give copies. Keep the originals for yourself."],
    ],
    cta: "Upload your documents to Take it Back and it will sort them by date into a timeline you can use for any complaint or hearing.",
  },
];
