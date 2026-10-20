import type { Guide } from "../guides";

// Travel and work guides. General information, not legal advice.
// Airline and agency rules change often, so each guide points to the official site for current rules.
export const TRAVEL_WORK_GUIDES: Guide[] = [
  {
    slug: "cancelled-flight-refund-rights",
    category: "travel",
    icon: "plane",
    kind: "rights",
    title: "Cancelled flight refund rights: cash back or a voucher?",
    description: "If an airline cancels your flight, U.S. rules let you ask for a refund to your original payment method. Here is how to ask and what to do about a voucher.",
    kicker: "Travel & airlines",
    updated: "2026-10-20",
    intro: "Your flight was cancelled and the airline is offering a voucher or a rebooking you can't use. Under U.S. Department of Transportation (DOT) rules, you can usually ask for your money back instead. Airline rules change, so check transportation.gov/airconsumer for the current version.",
    blocks: [
      {
        h: "What the DOT rule says",
        p: [
          "If an airline cancels a flight to, from or within the United States, or changes it in a significant way, and you decide not to travel, the airline owes you a refund. This holds even if your ticket was marked non-refundable.",
          "The refund goes back to your original form of payment. If you paid by credit card, the money should return to that card. The DOT also sets deadlines for how fast airlines must send it. For credit card purchases the deadline is short, measured in days, so check the DOT site for the current number.",
          "A voucher or travel credit is an offer. You can accept it, but you don't have to. If you want cash, say so clearly.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Find out who cancelled", "The refund right applies when the airline cancels or significantly changes the flight. If you cancelled a non-refundable ticket yourself, different rules apply."],
          ["Decline the rebooking and voucher", "Use the airline's refund form or call. Say: \"The airline cancelled my flight. I am declining the alternatives and requesting a refund to my original form of payment.\""],
          ["Keep proof", "Save the cancellation email, your confirmation number, screenshots of the refund request and the date and name of anyone you talk to."],
          ["Check your card statement", "If the refund has not arrived within the time the airline gave you, ask again in writing. Mention the DOT refund rule."],
          ["Dispute with your card issuer", "Under the Fair Credit Billing Act you generally have 60 days from the statement date to dispute a charge for a service you did not receive. Do this if the airline keeps stalling."],
          ["File a DOT complaint", "Submit a complaint through transportation.gov/airconsumer. The DOT forwards it to the airline, and airlines have to respond."],
        ],
      },
      {
        h: "Other costs you may have",
        p: [
          "Hotels, rental cars and tours you booked separately are not covered by the airline refund rule. Cancel them as soon as you know, and read their policies. If you bought travel insurance, ask whether it pays for these losses. Many policies cover trip interruption only for listed reasons.",
        ],
      },
    ],
    faqs: [
      ["Do I have to take the voucher?", "No. If the airline cancelled the flight and you choose not to travel, you can ask for a refund. Airlines often show the voucher first because it is easier for them."],
      ["What if I already took the voucher?", "Read its terms. Some can be turned into a refund and some cannot. Ask the airline in writing, and if it refuses, file a DOT complaint."],
      ["Does this cover a flight I booked through a travel site?", "Often the travel site handles the refund, and it may be slower. Ask both the site and the airline who is processing it, and keep the names."],
      ["Is a long delay the same as a cancellation?", "Not automatically. The DOT decides what counts as a significant change, so look at the current definition on its site."],
    ],
    cta: "Tell us what the airline sent you and we'll write the refund request and track the deadline.",
  },
  {
    slug: "flight-delay-compensation-us-and-eu-rules",
    category: "travel",
    icon: "clock",
    kind: "explainer",
    title: "Flight delay compensation: what US and EU rules cover",
    description: "A long delay does not always mean cash from the airline. Here is what U.S. rules require, how EU261 works for flights to or from Europe, and what to ask for.",
    kicker: "Travel & airlines",
    updated: "2026-10-20",
    intro: "Your flight is hours late and you want to know what the airline owes you. The answer depends on where the flight was going and who flew it. For current U.S. rules, check transportation.gov/airconsumer.",
    blocks: [
      {
        h: "Flights within or from the United States",
        p: [
          "Federal law does not require airlines to pay cash compensation for a delay. Your ticket contract, called the contract of carriage, says what the airline will do. Many airlines promise meals, hotel rooms or rebooking in certain cases, mostly when the delay is the airline's fault.",
          "The DOT keeps a public dashboard that shows which services each large airline commits to when a delay is within its control. Look it up before you ask, so you can name the promise they made.",
          "If the delay is long enough that you decide not to travel, you may be able to ask for a refund. The DOT has rules on this, and they change, so read the current version.",
        ],
      },
      {
        h: "Flights to or from Europe (EU261)",
        p: [
          "The European Union has a regulation known as EU261. It can pay set amounts, in euros, for long delays, cancellations and denied boarding. It generally applies to flights leaving an EU airport on any airline, and to flights landing in the EU on an EU airline.",
          "For delays, the key number is how late you arrived at your final destination. A delay of three hours or more can qualify. The amount depends on the distance of the flight and usually falls in a range of a few hundred euros per passenger.",
          "Airlines do not owe compensation when the cause is an extraordinary circumstance, such as severe weather or a security problem. Technical faults that are part of normal operation usually do not count as extraordinary. Airlines often deny claims on this ground, and you can push back.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Write down the facts right away", "Flight number, scheduled and actual times, the reason given, and any announcements. Take photos of the departure board."],
          ["Keep every receipt", "Meals, hotel, taxis and phone calls while you waited. Airlines that owe you care often reimburse reasonable costs with receipts."],
          ["Ask for what the airline promised", "Use the airline's app or desk and cite its own policy or the DOT dashboard."],
          ["Send a written claim", "For EU flights, use the airline's claim form and state the flight, your arrival delay and the amount you are claiming under EU261."],
          ["Escalate", "File a DOT complaint for U.S. flights, or contact the national enforcement body in the EU country where the delay happened."],
        ],
      },
    ],
    faqs: [
      ["Can I get money for a delay on a domestic U.S. flight?", "Federal law does not require it. You may still get meals, a hotel or a rebooking under the airline's own policy, and you can try to negotiate a voucher."],
      ["Does EU261 apply to a flight from the U.S. to Europe?", "It applies if the airline is an EU carrier. A U.S. airline flying to Europe is generally outside it, though the return flight from Europe is covered."],
      ["How long do I have to claim under EU261?", "Time limits vary by country. Claim as soon as you can and look up the limit for the country where the problem happened."],
    ],
    cta: "Upload your delay email and we'll draft a claim that cites the right policy.",
  },
  {
    slug: "lost-delayed-damaged-luggage-claim",
    category: "travel",
    icon: "package",
    kind: "how-to",
    title: "Lost, delayed or damaged luggage: how to file a claim",
    description: "Report the problem before you leave the airport, keep receipts and file a written claim. Covers deadlines, what airlines pay and how to escalate.",
    kicker: "Travel & airlines",
    updated: "2026-10-20",
    intro: "Your bag did not show up, or it arrived broken. Airlines pay for a lot of these cases, but only if you report the problem fast and keep proof. Rules on fees and limits change, so check transportation.gov/airconsumer for the current ones.",
    blocks: [
      {
        h: "Step by step",
        steps: [
          ["Report it before you leave the airport", "Go to the airline's baggage desk and file a report. You will get a file reference number. For a delayed bag, ask where to send it and how to track it."],
          ["Photograph the damage", "For a damaged bag or contents, take photos right away and keep the bag. Ask the airline to note the damage on your report."],
          ["Keep your boarding pass and bag tag", "The claim check from your checked bag is your proof that the airline had it."],
          ["Buy what you need and keep receipts", "Many airlines reimburse reasonable essentials, such as toiletries and basic clothing, while a bag is delayed. Ask for the airline's limit before you shop."],
          ["File a written claim", "Use the airline's online form or send a letter. List each item, what it cost and when you bought it. Attach receipts, photos and your file number."],
          ["Follow up", "Airlines can take weeks. Write down every contact. If you get no answer, send a second written request."],
        ],
      },
      {
        h: "Deadlines and limits",
        p: [
          "For international trips covered by the Montreal Convention, a treaty most countries follow, you generally must give written notice within 7 days for damaged bags and within 21 days of the bag being handed to you for delayed bags. Airline contracts for domestic flights set their own deadlines, often shorter, so read the contract of carriage on the airline's website.",
          "Airlines limit what they pay. For domestic U.S. flights the limit is set by federal rule and adjusts over time, and international limits come from the Montreal Convention. Airlines also exclude some items, like cash, jewelry and electronics, from checked bags. Do not pack valuables in checked bags.",
        ],
      },
      {
        h: "Fees and escalation",
        p: [
          "The DOT requires airlines to refund checked bag fees in some situations when a bag is significantly late. The time that counts changes with the rule, so check the DOT site. Ask for the refund in writing.",
          "If the airline denies your claim or offers too little, file a complaint at transportation.gov/airconsumer. Your credit card may also have baggage delay coverage, and your travel insurance might pay for items the airline will not.",
        ],
      },
    ],
    faqs: [
      ["What if I did not report it at the airport?", "Report it right away anyway, by phone or the airline's website. A late report is harder but still worth filing, especially for a delayed bag."],
      ["Will the airline pay full price for my items?", "Usually it pays the depreciated value, meaning what the item was worth after use. Receipts and photos help."],
      ["Who is responsible if I flew two airlines on one ticket?", "Generally the airline that flew the last leg handles the claim on a single ticket, though any of them may be involved. Ask which one owns the file."],
      ["Can I claim for a gate-checked stroller or wheelchair?", "Yes. Report damage immediately at the gate or baggage desk. Damaged mobility devices have extra protections under federal rules, so mention that."],
    ],
    cta: "Share your baggage report and receipts and we'll build the claim and track the airline's response.",
  },
  {
    slug: "denied-boarding-bumped-from-flight-rights",
    category: "travel",
    icon: "alert",
    kind: "rights",
    title: "Denied boarding: your rights if you're bumped from a flight",
    description: "If an oversold flight bumps you against your will, U.S. rules require compensation in many cases. Learn what you are owed and what to ask at the gate.",
    kicker: "Travel & airlines",
    updated: "2026-10-20",
    intro: "The gate agent says the flight is full and you are not getting on. If you have a confirmed ticket and you did not choose to give up your seat, the DOT has rules about what the airline owes you. Check transportation.gov/airconsumer for the current amounts.",
    blocks: [
      {
        h: "Voluntary and involuntary bumping",
        p: [
          "When a flight is oversold, airlines first ask for volunteers. You can negotiate. Ask what the offer is, when the next flight leaves, whether you get a meal or hotel, and whether the offer is cash or a voucher. Get the terms in writing before you agree.",
          "If not enough people volunteer, the airline can bump passengers against their will. That is called involuntary denied boarding. The airline must give you a written statement of your rights and pay compensation in many cases.",
        ],
      },
      {
        h: "What you are owed for involuntary bumping",
        list: [
          "Compensation depends on how late you reach your destination compared to your original schedule.",
          "For domestic flights, a short delay usually pays 200% of your one-way fare, and a longer delay pays 400%, each up to a dollar cap.",
          "International flights have their own time thresholds.",
          "The caps are adjusted by the DOT from time to time, so check the current numbers on its site.",
          "The airline generally must offer payment on the day of the bump, in cash or check, or by another form you agree to. You can refuse a voucher and ask for payment.",
          "You still keep your ticket, or you can ask for a refund of the unused portion.",
        ],
      },
      {
        h: "When the rule does not apply",
        p: [
          "The compensation rules generally do not cover you if you missed check-in or gate deadlines, if the airline swapped to a smaller plane for safety or weight reasons, or if you were removed for safety or conduct reasons. Check-in and gate deadlines are in the airline's contract of carriage, so arrive early and keep your check-in time on record.",
        ],
      },
      {
        h: "Step by step at the gate",
        steps: [
          ["Say you want the written statement", "Ask the agent for the DOT-required written notice of your denied boarding rights."],
          ["Ask what compensation applies", "Ask them to state the amount and the basis in writing, including the fare they used."],
          ["Do not sign away your rights", "Read anything before signing. Accepting a voucher can end your claim for cash."],
          ["File a complaint if it goes wrong", "Use transportation.gov/airconsumer and attach the notice, your boarding pass and your payment record."],
        ],
      },
    ],
    faqs: [
      ["Can I get both compensation and a refund?", "If you decide not to travel after being bumped, you can generally request a refund of the unused ticket in addition to the denied boarding compensation. Ask the airline to confirm in writing."],
      ["What if I took a voucher at the gate?", "Check the terms. If you were pressured, ask the airline for cash in writing and file a DOT complaint."],
      ["Does this apply to flights in Europe?", "The EU has its own rules under EU261 for flights leaving the EU or landing there on an EU airline. See our guide on delay compensation."],
    ],
    cta: "Send us a photo of your boarding pass and the gate notice and we'll help you write the claim.",
  },
  {
    slug: "hotel-resort-fees-and-booking-disputes",
    category: "travel",
    icon: "tag",
    kind: "how-to",
    title: "Hotel resort fees and booking disputes: what you can do",
    description: "A hotel added a resort fee you did not expect, or your booking went wrong. Here is how to challenge the charge, dispute it with your card and file a complaint.",
    kicker: "Travel & airlines",
    updated: "2026-10-20",
    intro: "You booked a room at one price and the bill is higher, or the hotel will not honor your reservation. Resort and facility fees are common, and some are hidden until checkout. Rules on how hotels must show prices have been changing, so check ftc.gov for the current version.",
    blocks: [
      {
        h: "Know what you agreed to",
        p: [
          "Look at the booking confirmation, any screenshots from the booking page and the fine print. Some bookings show a total that includes mandatory fees, and others list fees only at the hotel. The Federal Trade Commission has a rule that requires lodging businesses to show the total price including mandatory fees up front. Its details and effective dates may change, so verify them.",
          "Even without a specific rule, hiding a mandatory fee until after you commit can be an unfair or deceptive practice. State attorneys general enforce laws against this.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Take screenshots before you check in", "Capture the price page, the confirmation email and the fee description. Do this again if the site changes."],
          ["Ask the front desk to remove or reduce the fee", "Politely ask a manager, show your screenshot and say you were not told about the fee when you booked. Many hotels remove it for a reason like this."],
          ["Pay with a credit card", "If a hotel will not fix a charge, a card gives you leverage. Under the Fair Credit Billing Act you can dispute billing errors, generally within 60 days of the statement date."],
          ["Write to the hotel corporate office", "Send a short email with the facts, your confirmation number, what was advertised and what you were charged. Ask for a refund of a specific amount."],
          ["Dispute with the card issuer", "If corporate does not respond, file a dispute with your card company and attach your documents."],
          ["File a complaint", "Report it to your state attorney general and at reportfraud.ftc.gov. A complaint helps regulators spot repeat offenders."],
        ],
      },
      {
        h: "If your booking was lost or changed",
        p: [
          "If you booked through a third-party site, both the site and the hotel may blame each other. Contact the site first, since it holds your payment. Ask in writing whether the hotel received the booking. If you are walked to another hotel, ask the booking site and the hotel to cover the difference in cost and any transport. Keep every receipt.",
          "For prepaid non-refundable bookings, read the cancellation terms. Many sites still refund when the hotel cancels or when the room is not as described.",
        ],
      },
    ],
    faqs: [
      ["Are resort fees legal?", "Charging a fee is generally legal. Hiding it until late in the booking process is what regulators target. Rules vary and are changing, so check current federal and state law."],
      ["Can I dispute a fee I already paid at checkout?", "Yes, with your card issuer. Dispute it within the time allowed by your card agreement, which for billing errors is generally 60 days under federal law."],
      ["What if the hotel charged my card after I left?", "Ask for an itemized folio showing the charge. If it is wrong, dispute it with the card issuer and tell the hotel in writing."],
    ],
    cta: "Upload your booking confirmation and hotel bill and we'll write the dispute and track your card deadline.",
  },
  {
    slug: "travel-insurance-claim-denied-how-to-appeal",
    category: "travel",
    icon: "shield",
    kind: "letter",
    title: "Travel insurance claim denied: how to appeal, with a letter",
    description: "If your travel insurance company denied a claim, you can appeal. Learn how to read the denial, gather proof and write the appeal, with a sample letter.",
    kicker: "Travel & airlines",
    updated: "2026-10-20",
    intro: "You filed a trip cancellation, medical or baggage claim and the insurer said no. A denial is often a first answer, and a clear appeal with the right documents sometimes changes it. Rules differ by state and by policy, so this is general information.",
    blocks: [
      {
        h: "Find out why it was denied",
        p: [
          "The denial letter should name the reason and the policy section it relies on. Common reasons are a pre-existing condition, a cause the policy does not list as covered, missing paperwork, or a claim filed after the deadline. Read your full policy, not just the summary. Look at the covered reasons, the exclusions and the claim deadline.",
          "If the letter is vague, write and ask which policy language supports the denial and what documents they say are missing.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Note your appeal deadline", "The denial letter or policy usually says how long you have. If you cannot find it, ask in writing."],
          ["Gather documents", "Receipts, the cancellation notice from the airline or hotel, medical records and doctor letters, photos, police or airline reports, and your policy."],
          ["Ask your doctor for a letter", "For a medical claim, the letter should state the dates, the diagnosis, and why you could not travel. Ask the doctor to note when symptoms started."],
          ["Write the appeal", "Quote the policy language that supports you and attach your proof. Keep it short and factual."],
          ["Send it so you can prove delivery", "Use certified mail or an online portal that gives a receipt. Keep a copy."],
          ["Contact your state insurance department", "If the insurer upholds the denial, your state insurance department takes complaints about travel insurance. Look for it through your state's official website."],
        ],
      },
      {
        h: "Sample appeal letter",
        p: [
          "[DATE]",
          "[INSURANCE COMPANY NAME]\nAttn: Claims Appeals\n[ADDRESS]",
          "Re: Appeal of denied claim. Claim number [NUMBER]. Policy number [NUMBER]. Insured: [YOUR NAME]",
          "I am appealing the denial of my claim dated [DENIAL DATE]. The letter said the claim was denied because [REASON GIVEN].",
          "I disagree because [SHORT EXPLANATION, FOR EXAMPLE: my trip was cancelled on [DATE] after [EVENT], which is a covered reason under section [SECTION] of my policy]. I have attached [LIST DOCUMENTS].",
          "Please review the denial again and send me a written decision. If you still deny the claim, please give me the specific policy language you rely on and tell me how to take this further.",
          "Sincerely,\n[YOUR NAME]\n[PHONE AND EMAIL]",
        ],
      },
    ],
    faqs: [
      ["Does a pre-existing condition always disqualify me?", "Not always. Policies define it narrowly, often with a look-back period. Some plans waive it if you bought them soon after your first trip payment. Read your policy's definition."],
      ["Can I use my credit card instead?", "If you paid for a service you did not receive, you can dispute with your card issuer. Some cards also include their own travel protection, so check your benefits guide."],
      ["Should I hire a lawyer?", "For a large denied claim, a consumer or insurance lawyer or legal aid office can tell you whether the denial looks improper. Many offer a free first call."],
    ],
    cta: "Upload your denial letter and policy and we'll help you draft the appeal and keep track of the deadline.",
  },
  {
    slug: "timeshare-cancellation-and-resale-scams",
    category: "travel",
    icon: "key",
    kind: "checklist",
    title: "Timeshare cancellation and resale scams: a checklist",
    description: "Timeshare owners get pitched fake resale offers and paid exit services. Learn how rescission periods work, how to spot scams and what to do if you already paid.",
    kicker: "Travel & airlines",
    updated: "2026-10-20",
    intro: "You signed a timeshare contract and now you want out, or someone called offering to sell it for you. Timeshare law is mostly set by each state, and scams that target owners are common. Slow down, read your contract and do not pay anyone upfront until you have checked them.",
    blocks: [
      {
        h: "If you just bought",
        p: [
          "Many states give timeshare buyers a short window to cancel, called a rescission period. It is set by state law and written in your contract, and it is often counted in days. Look for the cancellation section right away. The federal three-day Cooling-Off Rule is limited and often does not apply to timeshares, so do not count on it.",
          "To cancel, follow the contract's instructions exactly. Send written notice by certified mail with return receipt, and keep a copy. If you were pressured, lied to about resale value or promised returns that are not in the contract, write down what was said, who said it and when.",
        ],
      },
      {
        h: "Checklist before you pay anyone",
        list: [
          "Do not pay upfront fees to a company that promises to sell or cancel your timeshare. Legitimate sellers rarely ask for large payments before a sale.",
          "Be careful if a caller says they already have a buyer. Fake buyer stories are a common scam.",
          "Ask for the company's name, address and license, and look them up with your state attorney general and the Better Business Bureau.",
          "Get every promise in writing before paying. Walk away if they refuse.",
          "Do not wire money or buy gift cards. Those payments are hard to recover.",
          "Check your resort's own exit program or owner services, which some resorts offer for free or for a set fee.",
          "Read your contract for what ends your obligation, including maintenance fees and any loan.",
        ],
      },
      {
        h: "If you already paid a scammer",
        steps: [
          ["Stop sending money", "Do not pay any new fees to recover the old ones."],
          ["Contact your card issuer or bank", "If you paid by credit card, dispute the charge. The Fair Credit Billing Act gives you generally 60 days from the statement date for billing errors, and card issuers sometimes help beyond that for fraud."],
          ["Report it", "File at reportfraud.ftc.gov and with your state attorney general."],
          ["Keep records", "Save contracts, emails, call logs and receipts."],
          ["Talk to a lawyer or legal aid", "If you are being sued, getting foreclosure notices or have a large loan, get legal help promptly."],
        ],
      },
    ],
    faqs: [
      ["Can I just stop paying maintenance fees?", "That can lead to collections, credit damage or foreclosure on the timeshare. Look at your contract and talk to the resort or a lawyer before you stop."],
      ["Are all timeshare exit companies scams?", "No, but many charge high upfront fees and deliver little. Check reviews, your state attorney general and whether they promise results they cannot control."],
      ["Who regulates timeshares?", "Mostly state agencies, often the real estate regulator or the attorney general. Look on your state's official website for the right office."],
    ],
    cta: "Upload your timeshare contract and we'll flag the cancellation deadline and the fee terms to check.",
  },
  {
    slug: "unpaid-wages-and-final-paycheck-how-to-file",
    category: "work",
    icon: "coin",
    kind: "how-to",
    title: "Unpaid wages and final paychecks: how to file a complaint",
    description: "If your employer has not paid you or held your last paycheck, you can file with the U.S. Department of Labor or your state labor agency. Here is how to start.",
    kicker: "Work & wages",
    updated: "2026-10-20",
    intro: "You worked, and the money did not come. It might be your final paycheck, a missed week or overtime. Both federal and state law cover wages, and filing a complaint is free. Deadlines can be short, so start soon. If you are unsure, call a legal aid office.",
    blocks: [
      {
        h: "Federal law and state law",
        p: [
          "The federal Fair Labor Standards Act (FLSA) requires employers to pay at least the federal minimum wage and overtime for covered employees. It does not set a deadline for final paychecks. Each state sets its own rules for when final pay is due after you quit or are fired, whether unused vacation must be paid, and what penalties apply.",
          "Your state often has stronger protections than the federal law. If both apply, you generally get the one that helps you more. Your state labor department website will list its wage claim process.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Add up what you are owed", "List the dates, hours, pay rate and what you were paid. Use pay stubs, bank deposits, texts about shifts, schedules and timecards."],
          ["Ask in writing", "Email your employer or payroll with the amount and the dates and ask for payment by a specific date. Keep a copy. Some employers fix it once it is in writing."],
          ["Find the right agency", "For federal minimum wage and overtime, the U.S. Department of Labor Wage and Hour Division takes complaints at dol.gov/agencies/whd. For other unpaid wages, final pay and deductions, use your state labor agency."],
          ["File the complaint", "You will describe the employer, your job, your dates and the amount unpaid. You can usually file without a lawyer, and the agency can investigate."],
          ["Watch the deadline", "Federal FLSA claims generally must be brought within two years, or three years if the violation was willful. State deadlines vary, and some are shorter."],
          ["Consider other options", "You can sometimes sue in small claims court for smaller amounts. For bigger amounts or many workers affected, talk to an employment lawyer or legal aid."],
        ],
      },
      {
        h: "Retaliation is illegal",
        p: [
          "Your employer cannot fire you or punish you for filing a wage complaint. If that happens, tell the agency right away. You do not need to be a citizen to file. Wage laws generally protect workers regardless of immigration status.",
        ],
      },
    ],
    faqs: [
      ["Can my employer take money out of my last check?", "State law limits deductions and varies widely. Ask your state labor agency what is allowed, especially for deductions for uniforms, damage or cash shortages."],
      ["Do I get paid for unused vacation?", "Depends on the state and on your employer's written policy. Check both."],
      ["What if I was paid in cash with no pay stub?", "You can still file. Write down your hours and what you were paid, and gather texts, schedules and the names of coworkers who saw you work."],
    ],
    cta: "Tell us what you are owed and we'll help you write the demand and the agency complaint, and track the deadline.",
  },
  {
    slug: "overtime-and-wage-theft-basics",
    category: "work",
    icon: "clipboard",
    kind: "explainer",
    title: "Overtime and wage theft basics: what the law says",
    description: "Learn when you are owed overtime under federal law, the common ways employers shortchange workers, and how to keep records for a Department of Labor complaint.",
    kicker: "Work & wages",
    updated: "2026-10-20",
    intro: "You work more than 40 hours and your paycheck does not show it, or you get paid late or short. That may be wage theft, which means an employer does not pay what the law requires. This guide covers the federal basics. Your state may add more.",
    blocks: [
      {
        h: "What federal law requires",
        p: [
          "The Fair Labor Standards Act (FLSA) says covered employees must be paid at least 1.5 times their regular rate for hours over 40 in a workweek. Each workweek counts separately, so you cannot average two weeks. Some states add daily overtime, so check yours.",
          "Not everyone gets overtime. Workers who qualify as exempt, such as certain executives, administrators and professionals, are excluded. To be exempt you generally must meet a pay level and a duties test. Having a salary or a title like manager is not enough on its own. The salary levels change, so check dol.gov/agencies/whd for current rules.",
        ],
      },
      {
        h: "Common forms of wage theft",
        list: [
          "Working off the clock before, after or during shifts",
          "Skipped or shortened breaks that are still deducted from pay",
          "Overtime paid at regular rate, or hours shifted to the next week",
          "Calling a worker a manager or contractor to avoid overtime",
          "Tip theft, such as owners or managers keeping tips",
          "Illegal deductions that bring pay below minimum wage",
          "Late paychecks or bounced paychecks",
        ],
      },
      {
        h: "Step by step to build your case",
        steps: [
          ["Keep your own record", "Write down start and end times every day, breaks and tasks. Do it the same day. A notebook or phone note works."],
          ["Save documents", "Pay stubs, schedules, offer letters, job descriptions, texts from your boss and your W-2."],
          ["Compare hours to pay", "Multiply hours by your rate and compare it to what you were paid. Note the difference."],
          ["Raise it in writing", "Ask HR or your boss to correct the pay. Keep a copy."],
          ["File a complaint", "Use the Wage and Hour Division of the U.S. Department of Labor at dol.gov/agencies/whd, or your state labor agency."],
        ],
      },
      {
        h: "What you might recover",
        p: [
          "Under the FLSA, workers can recover back wages and often an equal amount in damages. Federal claims generally have a two-year limit, or three years if the employer broke the law on purpose. Your state may allow more. The sooner you act, the less you lose to deadlines.",
        ],
      },
    ],
    faqs: [
      ["Does a salary mean no overtime?", "No. Many salaried workers are still owed overtime if they do not meet the duties test or the salary level."],
      ["Can my boss make me work off the clock?", "No. If you are covered, work your employer knows about or allows must be paid, even if no one approved it."],
      ["Do I need a lawyer?", "Not to file with the agency. For large claims or group claims, legal aid or an employment lawyer can help, and some work for a share of what you recover."],
    ],
    cta: "Upload your pay stubs and notes and we'll help you spot the gaps and prepare a complaint.",
  },
  {
    slug: "unemployment-benefits-denied-how-to-appeal",
    category: "work",
    icon: "bell",
    kind: "how-to",
    title: "Unemployment benefits denied: how to appeal the decision",
    description: "A denial is often not the final answer. Learn how state unemployment appeals work, why the deadline is short and how to prepare for a hearing.",
    kicker: "Work & wages",
    updated: "2026-10-20",
    intro: "Your state sent a letter saying you do not qualify for unemployment, or that your benefits stopped. You can usually appeal. Unemployment is run by each state, so the rules, forms and deadlines depend on where you filed. The deadline to appeal can be short, so read your letter today.",
    blocks: [
      {
        h: "Read the determination letter",
        p: [
          "The letter explains why you were denied and tells you how and when to appeal. Common reasons are that you quit without a reason the state accepts, you were fired for misconduct as the state defines it, you did not report earnings, or you missed a required step like a weekly claim or an interview.",
          "Write down the appeal deadline from the letter. Missing it can end your case. If you are close to the deadline, file first and gather evidence after.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["File the appeal in writing", "Use the method on the letter, such as an online form, a fax or mail. Say you disagree and want a hearing. Keep proof that you filed."],
          ["Keep claiming weekly benefits", "In most states you must keep filing weekly claims while you appeal. If you win, you may be paid back for those weeks. Check your state's rule."],
          ["Gather your evidence", "Termination or resignation letters, emails, texts, warnings, performance records, pay stubs, medical notes and names of witnesses."],
          ["Prepare to explain what happened", "Make a short timeline with dates. Be ready to say why you left or what really happened, and answer questions plainly."],
          ["Attend the hearing", "Hearings are often by phone before an administrative law judge. Join early, have your documents in front of you, and ask to submit your evidence ahead of time if the state allows it."],
          ["Appeal again if needed", "If you lose, the decision explains the next level of appeal, which is usually a board or a court. These have deadlines too."],
        ],
      },
      {
        h: "Overpayments and fraud findings",
        p: [
          "States sometimes say they overpaid you and ask you to pay money back. You can often appeal that, ask for a waiver if it was not your fault, or ask for a payment plan. If the state accuses you of fraud, get legal help right away. Penalties can be severe.",
          "Many legal aid offices help with unemployment hearings for free. Search your state's legal aid website or call 211.",
        ],
      },
    ],
    faqs: [
      ["Can I get benefits if I quit?", "Sometimes. States accept certain reasons, like unsafe conditions, unpaid wages or a major change in your job. Each state defines this differently."],
      ["Do I need a lawyer for the hearing?", "No, but free help from legal aid can make a difference, especially if misconduct or fraud is alleged."],
      ["What if I missed the deadline?", "Appeal anyway and explain why you were late, such as illness, mail problems or never receiving the notice. Some states accept good cause."],
    ],
    cta: "Upload your denial letter and we'll mark the deadline and help you outline your hearing evidence.",
  },
  {
    slug: "independent-contractor-misclassification-explained",
    category: "work",
    icon: "briefcase",
    kind: "explainer",
    title: "Independent contractor misclassification: are you an employee?",
    description: "Some employers call workers contractors to skip overtime, benefits and taxes. Learn the common tests, the warning signs and where to report misclassification.",
    kicker: "Work & wages",
    updated: "2026-10-20",
    intro: "You get a 1099 instead of a W-2, but your boss sets your hours, your tasks and how you do the work. You may be an employee, with rights to minimum wage, overtime and other protections. The tests used to decide this differ by agency and state, and federal guidance has changed over time.",
    blocks: [
      {
        h: "Why it matters",
        p: [
          "Employees are covered by minimum wage and overtime rules, unemployment insurance, workers' compensation and employer payroll taxes. Contractors usually are not. When an employer mislabels an employee as a contractor, the worker may lose pay and protections and may owe extra self-employment tax.",
        ],
      },
      {
        h: "Questions the tests ask",
        p: [
          "The U.S. Department of Labor looks at the economic reality of the relationship, which means whether you depend on the business for work or are really in business for yourself. The IRS looks at behavior, financial control and the written agreement. Many states use a stricter test, sometimes called the ABC test. Check dol.gov/agencies/whd and irs.gov for current guidance.",
        ],
        list: [
          "Who controls how, when and where the work is done?",
          "Do you use your own tools and pay your own business costs?",
          "Can you make a profit or take a loss based on how you run the work?",
          "Can you work for other clients, and do you?",
          "Is the work a normal part of the employer's business?",
          "How long and how permanent is the relationship?",
          "Does the job require special skill that you bring yourself?",
        ],
      },
      {
        h: "What to do",
        steps: [
          ["Collect your records", "Contracts, invoices, 1099s, messages that show how you are managed, schedules and what you paid for your own tools."],
          ["Compare your situation to the tests", "Write down how many of the questions point toward employee status."],
          ["Ask the employer to reclassify you", "A short written request is fine. Some businesses correct it."],
          ["Report it", "You can contact the Wage and Hour Division of the U.S. Department of Labor, your state labor agency or your state unemployment agency. To ask the IRS for a ruling on your status, you can file Form SS-8."],
          ["Handle taxes carefully", "Talk to a tax professional or free tax help before changing how you file. Reporting the wrong way can cause problems."],
          ["Get advice", "An employment lawyer or legal aid office can assess your case. Many give a free first conversation."],
        ],
      },
    ],
    faqs: [
      ["Does a signed contractor agreement settle it?", "No. Agencies look at how the work actually happens, not only what the contract calls it."],
      ["Can I be punished for asking?", "Retaliation for raising wage claims is illegal under federal law. Still, keep records of any changes after you ask."],
      ["What can I recover if I was misclassified?", "It may include unpaid overtime, minimum wage, and sometimes benefits and expenses. It depends on federal and state law."],
    ],
    cta: "Describe how your job works and we'll help you check it against the employee tests and prepare a report.",
  },
  {
    slug: "workers-compensation-claim-denied-what-to-do",
    category: "work",
    icon: "cross",
    kind: "how-to",
    title: "Workers' compensation claim denied: what to do next",
    description: "If your workers' comp claim was denied, you can usually appeal through your state's system. Here is how to report the injury, read the denial and find help.",
    kicker: "Work & wages",
    updated: "2026-10-20",
    intro: "You were hurt at work, filed a claim and the insurer said no. Workers' compensation pays for medical care and part of lost wages after a work injury or illness. It is run by each state, so deadlines, forms and appeal steps differ. Act quickly, because the time to appeal can be short.",
    blocks: [
      {
        h: "Why claims get denied",
        list: [
          "The insurer says the injury did not happen at work or is not work related",
          "The injury was not reported to the employer fast enough",
          "A pre-existing condition is blamed",
          "Missing paperwork or a missed filing deadline",
          "The employer disputes that you are an employee",
          "A dispute over the doctor you saw, since many states limit who you can see",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Read the denial letter", "It should state the reason and how to appeal. Write down the appeal deadline and calendar it."],
          ["Get the facts on the record", "Make sure the injury was reported in writing to your employer. Keep a copy of every form and email."],
          ["Keep seeing a doctor", "Follow medical advice and ask your doctor to write down how the injury relates to your work."],
          ["Gather evidence", "Witness names, photos of the site, incident reports, medical records and your job description."],
          ["File the appeal", "Contact your state's workers' compensation agency or board. It will have the forms and explain hearings. Many states offer free help for injured workers."],
          ["Consider a lawyer", "Workers' comp lawyers usually take a percentage of what you win rather than an hourly fee, and state rules cap that percentage. Ask about it during a free consultation."],
        ],
      },
      {
        h: "If you are still being treated",
        p: [
          "Ask your doctor and the agency whether you can get treatment while the appeal is pending. Some states have processes for urgent care. If you have health insurance, ask whether it will cover care in the meantime and understand it may seek repayment later.",
          "It is illegal in every state to fire you only for filing a claim, though the details vary. If you think you were punished for filing, tell the agency and see a lawyer quickly.",
        ],
      },
    ],
    faqs: [
      ["Can I be fired while on workers' comp?", "Employers cannot fire you for filing a claim, but they may end employment for lawful reasons. If the timing looks suspicious, get legal advice."],
      ["What if my employer says I am a contractor?", "The label does not control. If you are really an employee, you may still be covered. See our guide on contractor misclassification."],
      ["Do I need to prove who was at fault?", "Generally no. Workers' comp is a no-fault system, so it usually does not matter whether you or your employer made the mistake."],
    ],
    cta: "Upload your denial letter and medical notes and we'll organize your evidence and track the appeal deadline.",
  },
  {
    slug: "workplace-retaliation-how-to-file-a-complaint",
    category: "work",
    icon: "megaphone",
    kind: "rights",
    title: "Workplace retaliation: how to file a complaint",
    description: "If you were fired, demoted or punished for reporting discrimination, wage problems or unsafe work, you can file a complaint. Deadlines are short.",
    kicker: "Work & wages",
    updated: "2026-10-20",
    intro: "You spoke up about something at work and now your hours were cut, you were written up or you were fired. Retaliation for protected activity is illegal under many federal and state laws. Deadlines to file are short, sometimes a few weeks. Act quickly, or call a legal aid office or employment lawyer today.",
    blocks: [
      {
        h: "What counts as retaliation",
        p: [
          "Retaliation is a negative action taken because you did something the law protects. Protected activity includes reporting discrimination or harassment, taking part in an investigation, asking for a disability accommodation, filing a wage complaint, reporting unsafe conditions, or filing a workers' comp claim. A negative action can be firing, demotion, pay cuts, schedule changes, threats or other treatment that would stop a reasonable person from speaking up.",
          "Different agencies handle different complaints. The U.S. Equal Employment Opportunity Commission (EEOC) handles discrimination and related retaliation. The U.S. Department of Labor handles wage law retaliation, and OSHA handles safety complaints. State agencies handle many of these as well.",
        ],
      },
      {
        h: "Deadlines are short",
        list: [
          "EEOC charges generally must be filed within 180 days of the event, extended to 300 days in places where a state or local agency enforces a similar law.",
          "Federal employees have a much shorter window to contact an EEO counselor, so ask your agency right away.",
          "OSHA retaliation complaints under its main safety law generally must be filed within 30 days.",
          "Other laws have their own limits, and state laws may be shorter or longer.",
          "When unsure, assume the shortest deadline and file or call now.",
        ],
      },
      {
        h: "Step by step",
        steps: [
          ["Write a timeline", "Note the date you spoke up, who you told, how they reacted and each action taken against you. Include names of witnesses."],
          ["Save evidence safely", "Keep emails, texts, reviews, schedules and pay records. Store copies where your employer cannot delete them, and follow company rules on private data."],
          ["Pick the right agency", "For discrimination, use eeoc.gov. For wage claims, use dol.gov/agencies/whd. For state issues, use your state labor or civil rights agency."],
          ["File the complaint", "You can file without a lawyer. The agency will ask for your employer's name, what happened and when."],
          ["Keep working if you can", "If you are still employed, keep doing your job well and avoid retaliating back. Report new incidents in writing."],
          ["Get advice", "Legal aid, a bar association referral line or an employment lawyer can review your options. Many offer a free first call."],
        ],
      },
    ],
    faqs: [
      ["Do I have to complain to my employer first?", "Not always. For many legal claims you can go straight to the agency. Telling HR in writing can still help show what you reported."],
      ["Can I be protected if my original complaint was wrong?", "Often yes, if you had a reasonable, good-faith belief. Protection depends on the law involved."],
      ["Will my employer know I filed?", "Usually the agency notifies the employer, though some complaints, such as certain wage complaints, can be handled with less identifying information. Ask the agency."],
    ],
    cta: "Share your timeline and we'll help you pick the right agency and track every filing deadline.",
  },
];
