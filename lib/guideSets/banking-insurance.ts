import type { Guide } from "../guides";

// Banking, fraud and insurance guides. Same rules as lib/guides.ts: plain English, general information, not legal advice.
// Insurance is regulated state by state, so these guides describe the process and point to the state insurance department.
export const BANKING_INSURANCE_GUIDES: Guide[] = [
  {
    slug: "dispute-unauthorized-credit-card-charge",
    category: "banking-fraud",
    icon: "card",
    kind: "letter",
    title: "How to dispute a credit card charge you didn't make",
    description: "Federal law lets you dispute a wrong or unauthorized credit card charge. Learn the 60-day rule, where to send the notice, and a sample dispute letter.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "You found a charge on your credit card statement that you didn't make, or one that is wrong. The Fair Credit Billing Act is the federal law that lets you dispute it, and the clock starts when the statement is sent, so move quickly.",
    blocks: [
      {
        h: "What the law covers and the 60-day rule",
        p: [
          "The Fair Credit Billing Act covers billing errors on credit cards. That includes charges you didn't authorize, charges for the wrong amount, items you never received, math mistakes, and payments that weren't credited.",
          "To get the full protection, your written notice must reach the card issuer within 60 days after it sent the first statement that showed the error. Call right away to lock the card, but also send the written notice. Calling alone does not start the legal clock.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Call the number on the back of the card", "Report the charge, lock or replace the card, and write down the date, the name of the person and a reference number."],
          ["Send a written dispute", "Find the \"billing errors\" address on your statement. It is often different from the payment address. Many issuers also take disputes through their app or website, but a letter by certified mail leaves a clear record."],
          ["Include the details", "Your name and account number, the date and amount of the charge, the merchant name, and why you think it is an error. Don't send originals of any receipts."],
          ["Keep paying the rest of the bill", "You can hold back the disputed amount, but pay everything else on time so you don't get late fees on the undisputed part."],
          ["Watch the deadlines", "The issuer must confirm in writing that it got your notice within 30 days. It must then fix the error or explain why it believes the charge is correct within two billing cycles, and no later than 90 days."],
        ],
      },
      {
        h: "While the dispute is open",
        p: [
          "The issuer can't try to collect the disputed amount, charge you interest on it, or treat the account as delinquent because of it. For unauthorized use, federal law caps what you can owe at $50, and many issuers charge nothing.",
        ],
      },
      {
        h: "Sample dispute letter",
        p: [
          "[YOUR NAME]\n[YOUR ADDRESS]\n[DATE]",
          "[CARD ISSUER NAME]\nAttn: Billing Errors\n[BILLING ERRORS ADDRESS FROM YOUR STATEMENT]",
          "Re: Billing error on account number [LAST 4 DIGITS]",
          "I am writing to dispute a charge on my statement dated [STATEMENT DATE]. The charge is $[AMOUNT] from [MERCHANT NAME] on [CHARGE DATE]. I did not authorize this charge [OR: describe the error, such as 'I was billed twice' or 'I never received the item'].",
          "Under the Fair Credit Billing Act, please investigate this charge, remove it and any related interest and fees from my account while you investigate, and send me a written response. Please do not report the amount as delinquent while the dispute is open.",
          "Sincerely,\n[YOUR NAME]\n[PHONE NUMBER]",
        ],
      },
    ],
    faqs: [
      ["What if the 60 days have passed?", "The federal deadline protects you best, but many issuers still look at late disputes under their own policies and card network rules. Ask anyway, and say when you first noticed the charge."],
      ["What if the issuer says the charge is valid?", "Ask for the evidence it relied on, in writing. If you still disagree, tell the issuer in writing soon after you get the explanation, and file a complaint at consumerfinance.gov/complaint."],
      ["Does this work for debit cards?", "No. Debit cards fall under a different law with different deadlines and liability limits. See our guide on debit card fraud."],
    ],
    cta: "Scan your statement and Take it Back can help you write the dispute letter and track the 30-day and 90-day deadlines.",
  },
  {
    slug: "debit-card-fraud-liability-and-deadlines",
    category: "banking-fraud",
    icon: "shield",
    kind: "rights",
    title: "Debit card fraud: how much you can lose and how fast to report",
    description: "How much you could owe after unauthorized debit card or bank transfers under Regulation E, the 2-day and 60-day deadlines, and what the bank must do.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "Someone used your debit card or your bank account number, and the money is already gone from your checking account. A federal rule called Regulation E limits what you can lose, but the limit depends on how fast you tell the bank.",
    blocks: [
      {
        h: "How much you can lose",
        p: ["Regulation E is the federal rule that implements the Electronic Fund Transfer Act. It covers debit cards, ATM withdrawals, and other electronic transfers from your bank account. For unauthorized transfers, the amount you can lose depends on timing:"],
        list: [
          "Tell the bank within 2 business days of learning your card was lost or stolen: your loss is capped at $50.",
          "Tell the bank after 2 business days but within 60 days of the statement that shows the transfer: your loss can be up to $500.",
          "Wait longer than 60 days after the statement was sent: you can lose all unauthorized transfers made after that 60-day window, with no cap.",
        ],
      },
      {
        h: "What to do right away",
        steps: [
          ["Call your bank's fraud line", "Use the number on the back of your card or the bank's official website. Ask the bank to lock or replace the card and flag the unauthorized transactions."],
          ["Say the word \"unauthorized\"", "Tell the bank which transfers you didn't make, with dates and amounts. Write down the name of the person and a claim number."],
          ["Follow up in writing", "Some banks ask for written confirmation within about 10 business days. Send it even if they don't ask, and keep a copy."],
          ["Change your passwords and PIN", "Update online banking, your email, and any app linked to the account. Turn on two-step sign-in."],
          ["Ask the bank to waive fees caused by the fraud", "If the theft made your account go negative, ask in writing that overdraft fees be reversed."],
        ],
      },
      {
        h: "What the bank has to do",
        p: [
          "After you report an error, the bank generally has 10 business days to investigate. If it needs more time, it has to give you a temporary credit for the disputed amount while it finishes, and can then take up to 45 days. Some cases, such as new accounts, point-of-sale and foreign transactions, can take longer.",
          "When the investigation ends, the bank must tell you the result. If it decides there was no error, ask for its explanation and the documents it used, and file a complaint at consumerfinance.gov/complaint if you disagree.",
        ],
      },
      {
        h: "When it may not count as unauthorized",
        p: [
          "If you handed your card and PIN to someone, or sent money yourself after being tricked, the bank may treat the transfer as authorized. That is a harder fight. Our guide on payment app scams covers it. Many card networks also advertise their own zero-liability policies, which can be better than the federal minimum, so ask what your card offers.",
        ],
      },
    ],
    faqs: [
      ["Is a debit card riskier than a credit card?", "Often, yes. The money leaves your account right away, and you may have to cover bills while the bank investigates. With a credit card, the disputed money is the issuer's while you argue about it."],
      ["Does it matter if my card was still in my wallet?", "The loss limits can differ when only the account number was stolen and the card was never lost. The 60-day window from your statement is the safest deadline to follow."],
      ["Can I just call, or do I need to write?", "A call is a good first step, but follow it with a written notice so there is a record of the date you reported the problem."],
    ],
    cta: "Take it Back can help you draft the written notice to your bank and keep track of the 10-day and 45-day investigation deadlines.",
  },
  {
    slug: "zelle-venmo-cash-app-scam-refund-options",
    category: "banking-fraud",
    icon: "coin",
    kind: "explainer",
    title: "Scammed on Zelle, Venmo or Cash App: can you get money back?",
    description: "A realistic look at refunds for payment app scams. Learn the difference between unauthorized and authorized payments, who to call first, and what to report.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "You sent money through Zelle, Venmo or Cash App and now you think it was a scam. Recovery is possible in some cases and unlikely in others, and the first hour matters. Rules and bank policies for these payments change often, so ask each company what it offers today.",
    blocks: [
      {
        h: "Two very different situations",
        p: [
          "Unauthorized means someone got into your account, or used your card or login, and sent money without your permission. Federal rules (Regulation E) protect you here, and you have a strong claim. See our guide on debit card fraud for the deadlines.",
          "Authorized means you sent the money yourself, even if you were tricked into it. Federal error rules generally do not require the bank or app to refund a payment you made yourself. Some banks and apps refund these cases anyway under their own policies, and some scam types get more sympathy than others, but you should not count on it.",
        ],
      },
      {
        h: "What to do right now",
        steps: [
          ["Call your bank first", "Tell them the payment was a scam or unauthorized, give the time, amount and the other person's name, email or phone. Ask them to contact the receiving bank to try to freeze the money."],
          ["Report it inside the app", "Use Zelle through your bank, or the support section in Venmo or Cash App. Report the account that received the money and ask for a dispute or fraud claim."],
          ["Stop talking to the scammer", "Don't send more money, even if they say it will release your funds or fix the problem."],
          ["Save everything", "Screenshots of messages, the payment confirmation, the profile, phone numbers and any listing or ad."],
          ["File reports", "Report at reportfraud.ftc.gov. A police report helps, and you can file a complaint at consumerfinance.gov/complaint if your bank refuses to help."],
        ],
      },
      {
        h: "Scams that show up again and again",
        list: [
          "A caller says they are from your bank's fraud team and tells you to send money to yourself or to \"secure\" your account",
          "A buyer overpays and asks you to send back the difference",
          "A seller posts a deal, takes payment and disappears",
          "A rental listing asks for a deposit before you've seen the unit",
          "Someone says they sent money to you by mistake and asks you to return it",
        ],
      },
      {
        h: "Be realistic about recovery",
        p: [
          "Most instant payments are not reversible. Scammers often move the money out within minutes. Recovery is most likely when you report very fast and the money is still in the receiving account. If a company says it can recover your money for a fee, that is usually a second scam.",
        ],
      },
    ],
    faqs: [
      ["Does Venmo or Cash App protect purchases?", "Some apps offer purchase protection for eligible goods paid for in a way the app allows, and not for payments to friends and family. Read the app's current terms before you rely on it."],
      ["Should I contact my bank or the app first?", "Your bank first if the payment came from your bank account or card, then the app. Both can matter."],
      ["Will filing a report get my money back?", "A report rarely returns the money on its own, but it creates a record, can help the bank's claim, and helps investigators spot repeat scammers."],
    ],
    cta: "Take it Back can help you write the fraud claim to your bank and keep a timeline of who you contacted and when.",
  },
  {
    slug: "fight-bank-overdraft-and-nsf-fees",
    category: "banking-fraud",
    icon: "scissors",
    kind: "letter",
    title: "How to fight bank overdraft and NSF fees",
    description: "Ask your bank to refund overdraft or NSF fees. Learn what to check, how to ask by phone or letter, and when to file a complaint. Includes a sample letter.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "Your bank charged you an overdraft or returned item fee, maybe several at once. Banks refund these more often than people expect, especially if you ask politely, ask in writing and have a reason. A 2024 federal rule that would have capped overdraft fees at the largest banks was repealed by Congress in 2025, so most limits come from your account terms, your state and the debit card opt-in rule below.",
    blocks: [
      {
        h: "Two fees, two meanings",
        p: [
          "An overdraft fee is what the bank charges when it pays a transaction even though your balance is too low. An NSF (non-sufficient funds) fee is what it charges when it refuses to pay. You can sometimes be charged the same fee again if a merchant resubmits the same payment.",
        ],
      },
      {
        h: "Check these before you call",
        list: [
          "Opt-in: for ATM withdrawals and one-time debit card purchases, federal rules say the bank can only charge an overdraft fee if you agreed to overdraft coverage. Checks and automatic payments are treated differently.",
          "Repeat fees: look for the same item charged more than once.",
          "Your real balance: if you had enough money when the purchase was made but the bank posted other items first or counted a deposit hold, ask for a review.",
          "Fraud or a bank error: a fee caused by a fraudulent charge or by the bank's own mistake should be reversed.",
          "Your account terms: the fee schedule shows the amount, the daily limit and any grace period or cushion.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Call and ask for a refund", "Say: \"I'd like a one-time courtesy refund of these overdraft fees.\" Be polite, give the dates and amounts, and ask the person's name."],
          ["Ask about the pattern", "If you are a long-time customer, mention it. If you see a reason the fee was wrong, state it."],
          ["Write it down if they say no", "Send a short letter or secure message and ask for a supervisor review."],
          ["Escalate", "File a complaint at consumerfinance.gov/complaint. The bank has to respond, and a complaint often gets a second look."],
          ["Fix the cause", "Turn on low-balance alerts, link savings, or ask about an account that declines purchases instead of charging fees."],
        ],
      },
      {
        h: "Sample letter",
        p: [
          "[YOUR NAME]\n[ADDRESS]\n[DATE]",
          "[BANK NAME]\nAttn: Customer Service\n[ADDRESS]",
          "Re: Request to refund overdraft fees on account ending [LAST 4 DIGITS]",
          "I was charged [NUMBER] overdraft/NSF fees totaling $[TOTAL] between [DATES]. I am asking you to refund these fees. [ADD YOUR REASON: for example, 'I did not opt in to overdraft coverage for debit card purchases,' 'the same item was charged twice,' or 'the fees came from a fraudulent charge'].",
          "I have been a customer since [YEAR] and would like to keep my account in good standing. Please reply in writing with your decision.",
          "Sincerely,\n[YOUR NAME]\n[PHONE NUMBER]",
        ],
      },
    ],
    faqs: [
      ["Is a bank required to refund overdraft fees?", "Not usually. Refunds are mostly the bank's choice, unless the fee broke a rule, such as charging for debit card overdraft without your opt-in."],
      ["Will asking hurt my account?", "No. A courtesy refund request does not affect your credit. Overdraft fees themselves are not reported to the credit bureaus, though unpaid negative balances can be sent to collections."],
      ["What if my account is now negative?", "Pay it down or ask for a payment plan before the bank closes the account. Unpaid negative balances can be reported to ChexSystems, which can make it hard to open a new account."],
    ],
    cta: "Scan your statement and Take it Back can point out repeat fees and write the refund request for you.",
  },
  {
    slug: "bank-froze-or-closed-my-account-what-to-do",
    category: "banking-fraud",
    icon: "bank",
    kind: "explainer",
    title: "Bank froze or closed your account: what you can do",
    description: "Why banks freeze or close accounts, how to get your money back, what to ask the bank, and where to file a complaint if you can't get answers.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "You tried to use your account and it was frozen or closed, and maybe the bank won't tell you why. You are still owed your money, but you may need to ask in the right way and keep a paper trail.",
    blocks: [
      {
        h: "Why it happens",
        list: [
          "The bank suspects fraud or unusual activity, such as a large deposit or a series of transfers",
          "A deposited check came back or a deposit was reported as unauthorized",
          "A court order, tax levy or garnishment has been served on the bank",
          "The bank could not verify your identity or address",
          "A negative balance stayed unpaid for a long time",
          "The bank decided the account carried too much risk, which it can do under most account agreements",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Call and ask what is needed to lift the hold", "Write down the name, date and what they say. Ask what documents would end the review and how long it normally takes."],
          ["Ask for the balance", "If the bank closes the account, it should send you your remaining money. If it only froze the account, ask when the hold will end. Either way, ask how and when the money will reach you, by check or transfer."],
          ["Ask for the reason in writing", "Banks sometimes cannot explain a fraud review, but they should be able to tell you whether a legal order or an ordinary review is the cause."],
          ["Check for a legal order", "If the hold came from a garnishment or levy, you should have been sent papers. Some federal benefits, such as Social Security, are protected from most creditors. Tell the bank, and contact legal aid quickly if it won't release them."],
          ["Move direct deposits and bills", "Open a new account elsewhere and update your employer, benefits and autopay, so you don't miss payments."],
        ],
      },
      {
        h: "If the bank won't help",
        p: [
          "File a complaint at consumerfinance.gov/complaint. Banks must respond to these, and a complaint often reaches someone with authority. You can also complain to the regulator for your type of bank, such as your state banking department, or for credit unions the National Credit Union Administration. If a large sum is stuck, or you could lose housing or food money, call a legal aid office.",
        ],
      },
      {
        h: "After a closure",
        p: [
          "Some banks report closed accounts to ChexSystems or similar services, which other banks check when you apply for an account. You can get your report free once a year, and correct errors under the Fair Credit Reporting Act. If you owe money to the closed account, pay or settle it and ask the bank to update the report.",
        ],
      },
    ],
    faqs: [
      ["Can a bank close my account without telling me why?", "Often yes. Most account agreements let either side end the relationship, usually with some notice. You can still demand your funds."],
      ["How long can a bank keep my money frozen?", "It depends on the reason. A fraud review can last days or weeks. A legal order lasts until the court or agency releases it. Ask for a timeline, and push if it passes."],
      ["Will the bank tell me if it filed a report on me?", "Federal law generally bars banks from telling you if they filed a suspicious activity report. They can still tell you what steps they need from you."],
    ],
    cta: "Take it Back can help you write to the bank, request your funds in writing and prepare a CFPB complaint.",
  },
  {
    slug: "wire-transfer-and-gift-card-scam-recovery",
    category: "banking-fraud",
    icon: "tag",
    kind: "how-to",
    title: "Sent a wire or gift cards to a scammer? Act on these steps",
    description: "If you wired money or bought gift cards for a scammer, here's who to call in the first hour, what to report, and what recovery is realistic.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "You sent a wire transfer or gift card numbers to someone and now you think it was a scam. The money is hard to get back, but speed makes a real difference. Call your bank or the card company first, before you do anything else.",
    blocks: [
      {
        h: "If you sent a wire transfer",
        steps: [
          ["Call your bank's wire or fraud department right now", "Ask for a wire recall. Give the date, amount, the recipient's name and bank, and say it was fraud. The faster you call, the more likely the money is still there."],
          ["Ask the bank to contact the receiving bank", "The sending bank can ask the other bank to hold the funds. It can't force it, but fast action sometimes works."],
          ["Ask for the request in writing", "Get a reference number and send a follow-up message that repeats what you reported and when."],
          ["File reports", "Report at reportfraud.ftc.gov and at ic3.gov, the FBI's internet crime site. Wire fraud reports to law enforcement can matter most when the sum is large."],
        ],
      },
      {
        h: "If you bought gift cards or sent the codes",
        steps: [
          ["Call the gift card company", "Use the number on the back of the card or the company's official site. Give the card numbers and say they were used in a scam. If the money has not been spent, the company may be able to freeze the balance."],
          ["Keep the receipt and the cards", "The store and the card company can use the purchase information. Ask the store if it can help, since some retailers have a fraud process."],
          ["Report it", "File a report at reportfraud.ftc.gov. If you paid for the cards with a credit card, tell that issuer too. Your protection is limited when you chose the purchase, but ask."],
        ],
      },
      {
        h: "If you paid with crypto",
        p: [
          "Contact the exchange or ATM company you used right away and report the wallet address that received the money. Crypto transfers are very hard to reverse, so treat this as a report, not a refund request.",
        ],
      },
      {
        h: "Protect yourself from the next call",
        list: [
          "Scammers often return posing as someone who can get your money back for a fee. Don't pay.",
          "Government agencies and utilities do not demand wires or gift cards.",
          "If you shared your Social Security number, bank login or ID, see our identity theft recovery plan.",
          "Tell a family member. Shame keeps many people quiet, and scammers count on it.",
        ],
      },
    ],
    faqs: [
      ["Is a wire transfer reversible?", "Rarely, once the receiving bank has paid out the money. A wire recall works best within the first hours, so call right away."],
      ["Does the bank have to refund a wire I authorized?", "Federal error rules usually don't apply to a wire you sent yourself. Some banks refund in special cases, such as when staff missed clear warning signs, so ask."],
      ["Who can I report this to besides the police?", "The FTC at reportfraud.ftc.gov, the FBI's IC3 at ic3.gov, and your state attorney general's consumer protection office."],
    ],
    cta: "Take it Back can help you write the recall request and keep a timeline of every call and report.",
  },
  {
    slug: "identity-theft-recovery-plan-step-by-step",
    category: "banking-fraud",
    icon: "user",
    kind: "checklist",
    title: "Identity theft recovery plan: what to do first",
    description: "A step-by-step plan for identity theft: report at identitytheft.gov, freeze your credit, dispute fraudulent accounts and protect your tax return.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "Someone used your name, Social Security number or accounts without your permission. It feels huge, but recovery follows a set order. The Federal Trade Commission runs identitytheft.gov, which builds a personal recovery plan and the reports you need.",
    blocks: [
      {
        h: "The first day",
        steps: [
          ["Report at identitytheft.gov", "Answer the questions and it creates an FTC identity theft report and a step-by-step plan. Save or print both. The report is useful proof with banks, bureaus and collectors."],
          ["Freeze your credit", "A credit freeze stops new lenders from opening accounts in your name. It is free, and you set it up with each bureau: Equifax, Experian and TransUnion. A fraud alert is a lighter option: an initial alert lasts one year, and an extended alert lasts seven years if you have an identity theft report."],
          ["Contact the companies involved", "Call the fraud department of each bank, card issuer or store where fraud happened. Ask them to close or freeze the account, and ask for confirmation in writing."],
          ["Change passwords", "Start with email, banking and phone accounts. Use unique passwords and turn on two-step sign-in."],
        ],
      },
      {
        h: "The first few weeks",
        steps: [
          ["Check your credit reports", "Get them free at annualcreditreport.com. Look for accounts, addresses and inquiries you don't recognize."],
          ["Ask the bureaus to block fraudulent information", "Under the Fair Credit Reporting Act, you can send each bureau your identity theft report and ask it to block information that resulted from the theft."],
          ["Dispute with the companies that furnished the data", "Send the lender or collector your identity theft report and ask them to correct the record and stop collecting."],
          ["Check other records", "Look at your tax records, medical bills and benefits statements. If someone filed a tax return in your name, ask the IRS about its identity theft process."],
        ],
      },
      {
        h: "Keep a log",
        p: [
          "Write down every call, with the date, the name, the company and what they promised. Send follow-up letters by certified mail where you can. If a collector contacts you about a debt that isn't yours, tell them in writing that it is identity theft, and include your report.",
        ],
      },
      {
        h: "When to get more help",
        p: [
          "If a debt collector sues you, you receive wage garnishment papers, or someone used your identity to commit a crime, talk to a lawyer or legal aid office. A police report can help but isn't needed in every case. Some creditors ask for one.",
        ],
      },
    ],
    faqs: [
      ["Does a credit freeze cost money?", "No. Federal law makes credit freezes free at all three bureaus. You can lift one temporarily when you apply for credit."],
      ["How long does recovery take?", "Simple cases can be settled in weeks. Cases with several accounts or tax problems can take months, so keep your log and your copies."],
      ["Do I need a police report?", "Not always. The FTC identity theft report is accepted by many companies and bureaus. Some still ask for a police report, so file one if they do."],
    ],
    cta: "Take it Back can help you write the dispute letters to the bureaus and companies and keep your timeline in one place.",
  },
  {
    slug: "data-breach-notice-what-to-do-next",
    category: "banking-fraud",
    icon: "lock",
    kind: "checklist",
    title: "Got a data breach notice? What to do next",
    description: "A company says your data was exposed. Learn what to check, which steps to take for each type of data, and how to spot fake breach notices.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "You got a letter or email saying your information was part of a data breach. Most people who get these notices never see fraud, but a few quick steps lower the risk a lot. What you do depends on which details were exposed.",
    blocks: [
      {
        h: "First, check that the notice is real",
        p: [
          "Scammers send fake breach notices to steal more information. Don't click links in an email or text. Type the company's website address yourself, or call a phone number you find on its official site. A real notice says what happened, what was taken and what the company is offering.",
        ],
      },
      {
        h: "What to do for each type of data",
        list: [
          "Passwords: change that password everywhere you used it, and turn on two-step sign-in.",
          "Credit card or debit card number: call the issuer for a new card and check recent charges.",
          "Bank account number: tell your bank, watch the account closely, and consider a new account number.",
          "Social Security number: freeze your credit at Equifax, Experian and TransUnion (free), and check your reports at annualcreditreport.com.",
          "Driver's license or passport number: place a fraud alert or freeze, and watch for accounts opened in your name.",
          "Health or insurance information: read your insurance statements, and ask your plan about any claims you don't recognize.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Read the notice twice", "Note the date of the breach, what data was exposed and what the company is offering."],
          ["Take the free credit monitoring if offered", "Sign up through the website you typed yourself. Monitoring alerts you to changes, though it does not stop fraud."],
          ["Freeze your credit if your Social Security number was exposed", "It's free, and you can lift it any time you need to apply for credit."],
          ["Watch your accounts for a year or more", "Check bank and card statements often. Set up text alerts for new charges."],
          ["Expect phishing", "After a breach, scammers send emails and texts that mention the company. Don't share codes, passwords or personal details with anyone who contacts you first."],
        ],
      },
      {
        h: "Settlements and lawsuits",
        p: [
          "Big breaches sometimes lead to class action settlements. If you are eligible, the notice usually says how to file a claim. Use only the settlement website listed in an official notice, and never pay to file a claim.",
          "You usually don't need to do anything to stay in a class action, but the notice will list deadlines if you want to file a claim, opt out or object. Read it before the dates pass, and keep a copy of anything you submit.",
        ],
      },
    ],
    faqs: [
      ["Do companies have to tell me about a breach?", "Every state has a law requiring notice after certain kinds of breaches, and the details differ. Your state attorney general's office can explain the rules where you live."],
      ["Should I accept the free credit monitoring?", "It usually costs nothing and helps you see problems sooner. It's worth taking, but a credit freeze gives stronger protection."],
      ["What if I see fraud after a breach?", "Follow the steps in our identity theft recovery plan and report at identitytheft.gov."],
    ],
    cta: "Scan your breach notice and Take it Back can explain what was exposed and which steps matter most for you.",
  },
  {
    slug: "common-phone-and-text-scams-and-how-to-report",
    category: "banking-fraud",
    icon: "phone",
    kind: "explainer",
    title: "Common phone and text scams, and how to report them",
    description: "Learn the most common phone and text scams, the warning signs, what to do if you already replied, and where to report them, including the FTC and FCC.",
    kicker: "Banks, fraud & scams",
    updated: "2026-10-20",
    intro: "A call, voicemail or text just reached you saying there's a problem with your account, a package, your taxes or a family member. Many of these are scams that follow the same few scripts. Knowing them makes it easier to hang up.",
    blocks: [
      {
        h: "Scams you are most likely to see",
        list: [
          "Bank fraud alert: a caller or text says your account was hacked and asks you to move money or read out a code.",
          "Government imposter: someone claims to be from the IRS, Social Security or a court and demands payment, often by gift card, wire or crypto.",
          "Package or toll text: a text says a delivery or toll payment failed and sends you to a link.",
          "Tech support: a pop-up or call says your computer is infected and asks for remote access.",
          "Family emergency: a voice that sounds like a relative asks for money. Voices can be copied with software.",
          "Wrong number: a friendly text that leads to a romance or investment pitch.",
          "Fake job or prize: you must pay a fee, or deposit a check and send money back.",
        ],
      },
      {
        h: "Warning signs",
        p: [
          "Pressure to act now, a demand for secrecy, a request for payment by gift card, wire transfer or crypto, and a call you didn't expect. Caller ID can be faked, so a familiar name or number proves nothing. Real banks and agencies don't ask you to move money to a safe account.",
        ],
      },
      {
        h: "What to do",
        steps: [
          ["Hang up or don't reply", "You don't need to be polite or explain. Don't press numbers, even to opt out."],
          ["Check using a number you trust", "Call the company back using the number on your card, bill or official website, not the number the caller gave."],
          ["Don't click links in texts", "If a text worries you, open the company's app or type its web address yourself."],
          ["Block and delete", "Block the number. Your carrier and phone settings can also filter suspected spam."],
          ["Tell someone", "Talk to a family member or friend before you act on anything that feels urgent."],
        ],
      },
      {
        h: "Where to report",
        list: [
          "Forward spam texts to 7726 (SPAM). Most major carriers accept it.",
          "Report scams to the Federal Trade Commission at reportfraud.ftc.gov.",
          "Report unwanted calls and texts to the FCC through fcc.gov/consumers.",
          "Tell your bank right away if you shared account details or sent money.",
          "Free services like donotcall.gov limit legitimate telemarketers. They don't stop scammers.",
        ],
      },
    ],
    faqs: [
      ["What if I already clicked or replied?", "Don't panic. Change any password you shared, call your bank if you gave account details, and watch for unusual charges. If you sent money, see our guide on wire transfer and gift card scams."],
      ["What if I gave my Social Security number?", "Freeze your credit at the three bureaus and follow our identity theft recovery plan."],
      ["Does reporting do anything?", "Reports help regulators and carriers spot trends and shut down numbers, and they create a record for you. They rarely return lost money, so avoid paying in the first place."],
    ],
    cta: "Paste a suspicious message into Take it Back and we'll tell you which scam it matches and what to do next.",
  },
  {
    slug: "auto-insurance-lowball-offer-or-denial-what-to-do",
    category: "insurance",
    icon: "car",
    kind: "how-to",
    title: "Auto insurance claim lowball offer or denial: what to do",
    description: "What to do when an auto insurer offers too little or denies a claim: get reasons in writing, document damage, counter the offer, file a state complaint.",
    kicker: "Insurance claims",
    updated: "2026-10-20",
    intro: "Your car was damaged, and the insurance company's offer is far below what repairs will cost, or it denied your claim. You don't have to accept the first number. The rules for insurers are set by each state, so this guide covers the general process and who to ask for the details.",
    blocks: [
      {
        h: "Know which claim you have",
        p: [
          "A first-party claim is made on your own policy, such as collision coverage. A third-party claim is made against the other driver's insurer for damage they caused. The steps are similar, but your own policy gives you more rights to see how the insurer decided, and the other driver's insurer owes you nothing under a contract.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Ask for the offer and the reasons in writing", "Request the estimate, the policy language it relied on and, for a denial, the exact reason. Many states require insurers to explain a denial in writing."],
          ["Get your own repair estimates", "Take the car to one or two shops you trust. Ask for itemized estimates, not just a total. Say which parts are original and which are aftermarket."],
          ["Collect evidence", "Photos from the day of the accident, the police report, medical records if you were hurt, receipts for towing and rental, and notes of every call with date and name."],
          ["Send a written counteroffer", "State the amount you want, attach the estimates, and point to the differences. Be specific and polite. Keep it to one page."],
          ["Look for an appraisal clause", "Many auto policies let you and the insurer each hire an appraiser to settle disagreements about the amount. A third person decides if they disagree. Check the policy for the process and costs."],
          ["Complain to your state insurance department", "Insurance is regulated by each state. Its consumer office takes complaints, asks the insurer to respond, and can tell you the state's rules on claim timelines."],
        ],
      },
      {
        h: "If the claim was denied",
        p: [
          "Read the denial against your policy. Look for what coverage you bought, the exclusions, the deductible and any claim deadlines. If you think the insurer misread the policy, say so in writing and quote the language. A denial based on a misunderstanding of the facts is easier to reverse than a denial based on a clear exclusion.",
        ],
      },
      {
        h: "When to get more help",
        p: [
          "If you were injured, if the insurer is delaying without a reason, or if the amount is large, talk to a lawyer. Many offer a free first call. Keep in mind that the time limit to sue is set by your state and by the policy, so don't wait.",
        ],
      },
    ],
    faqs: [
      ["Do I have to use the insurer's repair shop?", "In most places you can choose your own shop. The insurer may recommend one but generally can't force it. Ask your state insurance department if you're unsure."],
      ["Should I sign a release?", "Read it carefully. A release usually ends your right to ask for more, so don't sign until you've been paid or agreed on the final amount."],
      ["Will complaining raise my rates?", "A complaint to the state is about the insurer's conduct, not a claim against you. Ask your insurer how claims and rates relate in your state."],
    ],
    cta: "Upload the denial or offer and Take it Back can help you write the counteroffer and keep track of your claim deadlines.",
  },
  {
    slug: "homeowners-insurance-claim-denied-next-steps",
    category: "insurance",
    icon: "house",
    kind: "how-to",
    title: "Homeowners insurance claim denied: your next steps",
    description: "If your insurer denied or underpaid a home claim, learn how to read the letter, gather proof, ask for a review, use appraisal and file a state complaint.",
    kicker: "Insurance claims",
    updated: "2026-10-20",
    intro: "Your home was damaged by water, wind, fire or theft, and the insurance company denied the claim or paid less than the repair cost. A denial is not always final. Your state's department of insurance sets the rules, so use this guide as a map, and check your state for the details.",
    blocks: [
      {
        h: "Read the denial letter closely",
        p: [
          "The letter should name the policy provision it relied on. Common reasons are that the damage came from an excluded cause (flood and earthquake are usually excluded and need separate coverage), that it was gradual wear or lack of maintenance, that the loss was below the deductible, that the claim was late, or that the cause of the damage isn't a covered event. Compare the reason with your actual policy, not a summary.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Ask for your full policy and the claim file", "Request a certified copy of the policy, including endorsements, and the adjuster's report and photos. Your state may give you the right to see claim documents."],
          ["Get your own proof", "Hire a licensed contractor to write an itemized repair estimate. Add photos, receipts, dates, weather records and, if relevant, an engineer or plumber report on the cause of the damage."],
          ["Ask for reconsideration in writing", "Send a short letter that says which finding you dispute, why, and what new evidence you attach. Ask for a written answer by a date."],
          ["Check the deadlines", "Policies set time limits to report a claim, to file proof of loss, and to sue. These can be shorter than you expect. Ask for any extension in writing."],
          ["Consider appraisal", "If you and the insurer agree the damage is covered but disagree on the amount, your policy may let each side name an appraiser. It generally settles the price, not whether the loss is covered."],
          ["File a complaint with your state department of insurance", "Complaints are free. The department asks the insurer to respond, and it can tell you whether the insurer broke the state's claim-handling rules."],
        ],
      },
      {
        h: "Outside help",
        list: [
          "A public adjuster is a licensed professional who works for you on a fee, often a percentage of the claim. Check the license with your state and read the contract before signing.",
          "A lawyer who handles insurance disputes can tell you whether the denial may be in bad faith, which means the insurer acted unreasonably. Many offer a free first call.",
          "Your mortgage company may be named on claim checks. Ask the lender how to release funds for repairs.",
        ],
      },
      {
        h: "While you wait",
        p: [
          "Protect the home from more damage and keep receipts. Insurers usually pay for reasonable emergency repairs. Don't throw away damaged items or finish repairs before the insurer has had a chance to inspect, unless you have to for safety. Take photos first.",
        ],
      },
    ],
    faqs: [
      ["How long does the insurer have to respond?", "Most states set deadlines for acknowledging a claim and for deciding it. The department of insurance in your state publishes them."],
      ["Does a denial mean I can't sue?", "No, but policies and state law limit how long you have to file suit. Talk to a lawyer promptly if you're considering it."],
      ["Can I be dropped for filing a claim?", "Insurers can raise rates or decline to renew in some situations, and state law limits what they can do. Ask your state insurance department."],
    ],
    cta: "Upload your denial letter and Take it Back can break down the reasons and help you draft a reconsideration request.",
  },
  {
    slug: "total-loss-car-valuation-dispute-guide",
    category: "insurance",
    icon: "search",
    kind: "how-to",
    title: "Car declared a total loss? How to dispute a low valuation",
    description: "How insurers value a totaled car, how to find comparable vehicles, what to ask for in the valuation report, and how to push back or use appraisal.",
    kicker: "Insurance claims",
    updated: "2026-10-20",
    intro: "Your insurer says your car is a total loss and offered a number that feels too low. Insurers value a totaled car at its actual cash value, which is what a similar car was worth just before the crash. You can ask for the math and push back with evidence.",
    blocks: [
      {
        h: "How the number is built",
        p: [
          "Most insurers use a valuation report from a vendor. It lists comparable cars for sale near you, then adjusts the price for mileage, trim level, options and condition. Each adjustment can move the number, and mistakes are common. Taxes and fees may also be owed on top of the value, and the rules differ by state.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Ask for the full valuation report", "Request the report and the list of comparable cars, in writing. Many states require the insurer to give you its valuation."],
          ["Check the basics", "Compare the trim level, engine, mileage, options and condition against your car. Look for a lower trim, higher mileage or missing features in the comparables."],
          ["Find your own comparables", "Search dealer and listing sites for the same year, make, model and trim in your area. Save the listings with price, mileage and date."],
          ["Document your car's condition", "Add maintenance records, new tires, recent repairs, and photos from before the crash. Insurers often rate condition as average unless shown otherwise."],
          ["Write a counteroffer", "List the errors, the comparables you found and the value you believe is fair. Send it by email so you have a record."],
          ["Use appraisal if the policy has it", "Many policies let each side hire an appraiser, and a neutral umpire decides if they disagree. There are costs, so ask about the process first."],
          ["File a complaint if you are stuck", "Your state department of insurance takes complaints about low or delayed total loss settlements."],
        ],
      },
      {
        h: "Things to check before you accept",
        list: [
          "Loan payoff: if you owe more than the car is worth, gap coverage, if you have it, may cover the difference. The loan stays yours until it is paid.",
          "Sales tax, title and registration fees: whether the insurer owes them depends on your state.",
          "Rental car: coverage often stops a few days after the insurer makes a settlement offer. Ask about the cut-off date.",
          "Personal items and extras: remove your belongings and any aftermarket parts before the car is picked up.",
          "Keeping the car: you may be able to keep the totaled car in exchange for a lower payment, but there are title and registration rules.",
        ],
      },
      {
        h: "Do not rush to sign",
        p: [
          "A release or the signed title can end the discussion. Don't sign until you've agreed to the number. If the insurer pressures you to accept now, tell it you're gathering documents and ask for a response date in writing.",
        ],
      },
    ],
    faqs: [
      ["Is the insurer allowed to use cars from far away?", "Valuations should use comparable cars in your local market. Ask how it chose them, and challenge any that aren't truly comparable."],
      ["What if the other driver's insurer is paying?", "The same approach works. You can dispute the number and give comparables, but you have no appraisal clause with their policy."],
      ["Can I get a higher number just by asking?", "Not always. Specific evidence, like better comparables and records, is what moves a valuation."],
    ],
    cta: "Upload the valuation report and Take it Back can help you spot the errors and write the counteroffer.",
  },
  {
    slug: "diminished-value-claim-how-it-works",
    category: "insurance",
    icon: "chart",
    kind: "explainer",
    title: "Diminished value claims: how to ask for car value lost",
    description: "Diminished value is the drop in a car's worth after an accident, even after good repairs. Learn when you can claim it and how to document it.",
    kicker: "Insurance claims",
    updated: "2026-10-20",
    intro: "Your car was repaired after a crash, but it is now worth less than it was because it has an accident history. That loss is called diminished value. Whether you can recover it depends on whose insurance pays and on your state, so check the rules where you live.",
    blocks: [
      {
        h: "What diminished value means",
        p: [
          "Buyers pay less for a car with a collision record, even after proper repairs. The gap between the pre-accident value and the post-repair value is the diminished value. It is separate from the cost of the repair.",
        ],
      },
      {
        h: "Who may pay",
        list: [
          "The at-fault driver's insurer: in many states you can claim diminished value from the other driver's insurer as part of a third-party claim.",
          "Your own insurer: many policies exclude diminished value under your own coverage, and states differ on whether insurers must pay it. Read your policy and ask your state insurance department.",
          "The at-fault driver directly: you may be able to ask them to pay, or to take them to small claims court. Time limits depend on the state.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Keep records of the repair", "Save the repair estimate, final invoice, photos of the damage and the parts replaced. Structural and frame repairs matter more to buyers."],
          ["Find the pre-accident value", "Use listings of similar cars with the same year, mileage and condition. Save the dates and prices."],
          ["Get an independent appraisal", "A licensed appraiser who specializes in diminished value can write a report. Insurers take a written report more seriously than an online calculator."],
          ["Send a written demand", "Give the claim number, the appraisal or comparables and the amount you want. Ask for a written answer by a date."],
          ["Negotiate or escalate", "If the insurer refuses, ask for the reason, then consider your state department of insurance, small claims court or a lawyer."],
        ],
      },
      {
        h: "Be careful with timing",
        p: [
          "Claims against the at-fault driver have a time limit set by state law. Settling your whole claim and signing a release can end your right to ask for diminished value later, so raise it before you sign.",
          "Insurers often start with a low figure or say the repair restored the car fully. A clear appraisal and a few matching listings give you something concrete to point to. If the answer is still no, ask for the reason in writing, because that tells you whether the issue is the state's rule, the policy wording or the amount.",
        ],
      },
    ],
    faqs: [
      ["Is diminished value paid on every claim?", "No. It depends on your state, the policy and who is at fault. Newer cars with serious repairs tend to have bigger losses."],
      ["Do I need an appraisal?", "It is not always required, but a report with comparables is the strongest evidence you can bring."],
      ["Can I claim it on an old car?", "Possibly, but the loss is usually smaller on older, high-mileage cars, and insurers push back harder."],
    ],
    cta: "Take it Back can help you draft the diminished value demand and track the deadline in your state.",
  },
  {
    slug: "life-insurance-claim-denied-or-delayed",
    category: "insurance",
    icon: "document",
    kind: "rights",
    title: "Life insurance claim denied or delayed: what beneficiaries can do",
    description: "What to do when a life insurance company denies or delays a death benefit: find the reason, check the contestability period, appeal, and complain to your state.",
    kicker: "Insurance claims",
    updated: "2026-10-20",
    intro: "You are a beneficiary, and the life insurance company has denied the claim or is taking months to pay. You are grieving, and this is hard. The steps below help you find out why and decide what to do. Insurance is regulated by each state, so details vary.",
    blocks: [
      {
        h: "Why claims are denied or delayed",
        list: [
          "The policy lapsed because premiums weren't paid, or it was cancelled before the death",
          "The death happened during the contestability period, which is often the first two years of a policy. The insurer may review the application for errors or missing information.",
          "The insurer says the application had a misstatement, such as about health or tobacco use",
          "An exclusion applies, such as a time-limited clause about suicide or certain risky activities",
          "Disputes over who the beneficiary is, or paperwork problems",
          "The insurer is waiting for records, a death certificate or an investigation",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Get the denial or delay reason in writing", "Ask the insurer for a written explanation that names the policy section it relies on."],
          ["Request the policy and the claim file", "Get a certified copy of the policy, the application, and any records the insurer used."],
          ["Check lapse and grace period details", "Policies usually have a grace period for missed premiums, and many states require notice before a policy lapses. Ask for proof the notices were sent."],
          ["Ask about the contestability period", "If the insurer says the application was wrong, ask exactly what was misstated and whether it matters to the risk. Doctors' records may show that the issue was minor or was disclosed."],
          ["Appeal in writing", "Follow the process in the denial letter and watch the deadline. If the policy came through an employer, the plan's appeal rights are set out in the denial letter, so read them closely."],
          ["Complain to your state department of insurance", "Complaints are free. The department can ask the insurer to explain, and can tell you the state's rules on how fast claims must be paid."],
        ],
      },
      {
        h: "If you can't find the policy",
        p: [
          "The National Association of Insurance Commissioners runs a free life insurance policy locator. Search for the NAIC policy locator, and also check the person's mail, bank records, tax papers and employer benefits.",
        ],
      },
      {
        h: "When to call a lawyer",
        p: [
          "A denial for a large policy, an accusation of fraud, or a long delay without reasons are all good reasons to talk to a lawyer who handles life insurance claims. Many take cases on contingency, which means they are paid only if you recover money. Deadlines to sue are set by state law and the policy, so don't wait.",
        ],
      },
    ],
    faqs: [
      ["How long should payment take?", "State rules vary, and many require the insurer to pay or explain within a set time after receiving proof of death. Ask your state insurance department for the rule."],
      ["Does the insurer owe interest on a late payment?", "Many states require interest on delayed death benefits. Ask for the rule in your state."],
      ["Can an insurer deny a claim after years of premiums?", "After the contestability period ends, it is much harder for an insurer to deny based on application errors, though some fraud and exclusions can still apply."],
    ],
    cta: "Upload the denial letter and Take it Back can explain the stated reason and draft your appeal.",
  },
  {
    slug: "renters-insurance-claim-what-is-covered",
    category: "insurance",
    icon: "key",
    kind: "explainer",
    title: "Renters insurance claims: what's covered and how to file",
    description: "What renters insurance usually covers, what it leaves out, how to file a claim with an inventory, and what to do if the insurer pays too little.",
    kicker: "Insurance claims",
    updated: "2026-10-20",
    intro: "Your things were stolen, damaged in a fire or ruined by a burst pipe, and you have renters insurance. Policies differ, so check yours, but most work in a similar way. Filing well and early makes a difference in what you get paid.",
    blocks: [
      {
        h: "What renters insurance usually covers",
        list: [
          "Personal property: your belongings, from furniture to clothes, when damaged by covered events like fire, theft or certain water damage",
          "Loss of use: extra living costs, such as a hotel, if you can't stay in your unit after a covered loss",
          "Personal liability: if someone is hurt in your home, or you accidentally damage someone's property",
        ],
      },
      {
        h: "What it often leaves out",
        list: [
          "Flood and earthquake, which usually need separate coverage",
          "Your landlord's building, which is covered by the landlord's policy",
          "A roommate's belongings, unless they're named on your policy",
          "Items over a sub-limit, such as jewelry, cash or electronics",
          "Damage from neglect, pests or wear, and some kinds of sewer or water backup",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Stay safe and limit more damage", "Move items out of harm's way and make emergency repairs if you can. Keep receipts."],
          ["Report theft or a crime to the police", "Get a report number. Insurers often need it for theft claims."],
          ["Notify your insurer promptly", "Call or file online and write down the claim number. Policies have time limits for reporting."],
          ["Take photos and make an inventory", "List each damaged item with its age, price and where you bought it. Use receipts, bank statements, photos and online accounts to prove ownership."],
          ["Know your payout type", "Replacement cost pays what a new item costs. Actual cash value pays what the item was worth after wear. Check which your policy uses and what your deductible is."],
          ["Keep damaged items until the adjuster says otherwise", "They may need to see them. Keep records of any hotel or meal expenses."],
        ],
      },
      {
        h: "If the payment seems too low",
        p: [
          "Ask for an itemized explanation of how each item was valued and depreciated. Send proof of value for any items the insurer undervalued, such as receipts, photos or a listing for the same product, and ask for a supervisor review in writing. If you still disagree, your policy may have an appraisal process, and your state department of insurance takes complaints about claim handling.",
        ],
      },
    ],
    faqs: [
      ["Does renters insurance cover my landlord's mistakes?", "It may cover your belongings if a covered event damaged them, but the insurer may then try to recover its payment from the landlord."],
      ["Will filing a claim raise my premium?", "It can, and some insurers also decline to renew after repeated claims. Weigh the loss against your deductible before filing a small one."],
      ["Do I need a police report for a theft?", "Most insurers ask for one. File it quickly and keep the report number."],
    ],
    cta: "Take it Back can help you build an item inventory, draft the claim letter and track your insurer's response deadlines.",
  },
];
