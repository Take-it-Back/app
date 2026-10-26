// Every email the app sends itself (account emails like sign-in links live in supabase/email-templates).
import { SITE, button, emailLayout, esc, list, p, panel, small } from "./layout";

export type Email = { subject: string; html: string; text: string };
const hi = (name?: string | null) => (name ? `Hi ${esc(name.split(" ")[0])},` : "Hi,");
const hiText = (name?: string | null) => (name ? `Hi ${name.split(" ")[0]},` : "Hi,");

/** After someone signs up and confirms. */
export function welcomeEmail(name?: string | null): Email {
  return {
    subject: "Welcome to Take it back",
    html: emailLayout({
      preheader: "Here's how to start your first fight in about a minute.",
      title: "You're in. Let's take it back.",
      accent: "take it back",
      body:
        p(hi(name)) +
        p("Hospitals, insurers, landlords and debt collectors count on people giving up. You just made that harder for them. Here's how to start:") +
        list([
          ["Snap the bill, denial or notice", "A photo, PDF or screenshot. Every page if there's more than one."],
          ["See what's wrong", "Plain words, the dollar amount and the rules for your state."],
          ["Send the letter", "We write it. Print it, email it, or we can mail it certified for you."],
        ]) +
        button("Scan your first paper", `${SITE}/app/scan`) +
        small(`Court date, lawsuit or eviction notice? Don't wait on us. <a href="${SITE}/legal-aid" style="color:#5E5E5E">Find free legal aid near you</a>.`),
    }),
    text: `${hiText(name)}\n\nYou're in. Here's how to start:\n1. Snap the bill, denial or notice.\n2. See what's wrong, with the rules for your state.\n3. Send the letter we write.\n\nScan your first paper: ${SITE}/app/scan\n\nCourt date, lawsuit or eviction? Find free legal aid: ${SITE}/legal-aid`,
  };
}

export type ReminderItem = { caseTitle: string; title: string; due: string; owner: "you" | "them"; days: number };

/** Daily deadline reminder. */
export function reminderEmail(name: string | null | undefined, items: ReminderItem[]): Email {
  const when = (i: ReminderItem) => (i.owner === "them" ? `Their reply was due ${i.due}` : i.days === 0 ? "Due today" : `Due in ${i.days} day${i.days === 1 ? "" : "s"} · ${i.due}`);
  const urgent = items.some((i) => i.owner === "you" && i.days <= 1);
  return {
    subject: items.length === 1 ? `Reminder: ${items[0].owner === "them" ? `${items[0].caseTitle}: their reply is late` : items[0].title}` : `${items.length} deadlines coming up`,
    html: emailLayout({
      preheader: items.map((i) => `${i.title}: ${when(i)}`).join(" · ").slice(0, 140),
      title: urgent ? "A deadline is close." : "Coming up on your cases.",
      accent: urgent ? "close" : "coming up",
      body:
        p(hi(name)) +
        list(items.map((i) => [esc(i.owner === "them" ? `${i.caseTitle}: they owe you a reply` : `${i.caseTitle}: ${i.title}`), esc(when(i)) + (i.owner === "them" ? " · If nothing came, send a follow-up." : "")])) +
        button("Open your cases", `${SITE}/app/dates`),
      footerNote: "You get these because reminders are on. Turn them off anytime in Settings.",
    }),
    text: `${hiText(name)}\n\n${items.map((i) => `- ${i.caseTitle}: ${i.title} — ${when(i)}`).join("\n")}\n\nOpen your cases: ${SITE}/app/dates\n\nTurn reminders off in Settings.`,
  };
}

/** Subscription confirmation. Doubles as the auto-renewal acknowledgment California and similar laws require. */
export function subscriptionStartedEmail(o: { name?: string | null; plan: string; price: string; trialEnds?: string | null; firstCharge: string; terms: string }): Email {
  return {
    subject: o.trialEnds ? "Your free trial of Premium has started" : "You're on Premium",
    html: emailLayout({
      preheader: o.trialEnds ? `Free until ${o.trialEnds}. Cancel anytime before then and you won't be charged.` : `${o.price}, renews automatically. Cancel anytime online.`,
      title: o.trialEnds ? "Your free trial has started." : "Welcome to Premium.",
      accent: o.trialEnds ? "free trial" : "Premium",
      body:
        p(hi(o.name)) +
        p("Letters written for you, every deadline tracked with reminders, replies explained and your full case file. Here are your plan details:") +
        panel([["Plan", esc(o.plan)], ["Price", esc(o.price)], ...(o.trialEnds ? ([["Free trial ends", esc(o.trialEnds)]] as [string, string][]) : []), ["First charge", esc(o.firstCharge)], ["Renews", "Automatically, until you cancel"]], "orange") +
        p(`<strong>How to cancel:</strong> anytime, online, in Settings → Cancel or change plan. ${o.trialEnds ? `Cancel before ${esc(o.trialEnds)} and you won't be charged.` : "You keep Premium until the end of the period you paid for."}`) +
        button("Cancel or manage your plan", `${SITE}/app/you`) +
        small(`The terms you agreed to: ${esc(o.terms)}`),
      footerNote: "Keep this email for your records.",
    }),
    text: `${hiText(o.name)}\n\nPlan: ${o.plan}\nPrice: ${o.price}\n${o.trialEnds ? `Free trial ends: ${o.trialEnds}\n` : ""}First charge: ${o.firstCharge}\nRenews automatically until you cancel.\n\nCancel anytime online: ${SITE}/app/you (Settings → Cancel or change plan).\n\nTerms you agreed to: ${o.terms}`,
  };
}

/** A few days before a free trial turns into a paid plan. */
export function trialEndingEmail(o: { name?: string | null; ends: string; price: string }): Email {
  return {
    subject: `Your free trial ends ${o.ends}`,
    html: emailLayout({
      preheader: `Then it's ${o.price}. Cancel before ${o.ends} if you don't want to keep Premium.`,
      title: "Your trial ends soon.",
      accent: "soon",
      body:
        p(hi(o.name)) +
        p(`Your free trial of Premium ends on <strong>${esc(o.ends)}</strong>. After that, your card will be charged <strong>${esc(o.price)}</strong>, and it renews automatically until you cancel.`) +
        p("Want to keep fighting? You don't need to do anything. Rather not? Cancel in a tap and you won't be charged.") +
        button("Keep or cancel", `${SITE}/app/you`),
    }),
    text: `${hiText(o.name)}\n\nYour free trial ends ${o.ends}. Then your card is charged ${o.price}, renewing until you cancel.\n\nKeep or cancel: ${SITE}/app/you`,
  };
}

/** Before a yearly plan renews (required notice in several states). */
export function renewalReminderEmail(o: { name?: string | null; date: string; price: string }): Email {
  return {
    subject: `Your Premium plan renews on ${o.date}`,
    html: emailLayout({
      preheader: `${o.price} on ${o.date}. Cancel anytime before then.`,
      title: "Your yearly plan renews soon.",
      accent: "renews soon",
      body:
        p(hi(o.name)) +
        panel([["Renews on", esc(o.date)], ["Amount", esc(o.price)]]) +
        p("Nothing to do if you'd like to keep Premium. To cancel or switch to monthly, use Settings before the renewal date.") +
        button("Manage your plan", `${SITE}/app/you`),
    }),
    text: `${hiText(o.name)}\n\nYour Premium plan renews on ${o.date} for ${o.price}. To cancel or switch, go to ${SITE}/app/you before then.`,
  };
}

/** A renewal payment didn't go through. */
export function paymentFailedEmail(o: { name?: string | null; amount: string }): Email {
  return {
    subject: "Your payment didn't go through",
    html: emailLayout({
      preheader: "Update your card to keep your letters, deadlines and reminders running.",
      title: "We couldn't take your payment.",
      accent: "payment",
      body:
        p(hi(o.name)) +
        p(`Your payment of <strong>${esc(o.amount)}</strong> for Premium didn't go through. This usually means a card expired or the bank declined it. We'll try again over the next few days.`) +
        p("Update your card so your deadline reminders and case tools keep working. Your cases and files are safe either way.") +
        button("Update your card", `${SITE}/app/you`),
    }),
    text: `${hiText(o.name)}\n\nYour payment of ${o.amount} didn't go through. Update your card: ${SITE}/app/you\n\nYour cases and files are safe either way.`,
  };
}

/** Subscription ended (cancelled or unpaid). */
export function subscriptionEndedEmail(o: { name?: string | null }): Email {
  return {
    subject: "Your Premium plan has ended",
    html: emailLayout({
      preheader: "Your cases stay in your account. Come back anytime.",
      title: "Your Premium plan has ended.",
      accent: "ended",
      body:
        p(hi(o.name)) +
        p("You're back on the free plan. Nothing is deleted: your cases, letters and files stay in your account, and you can still download everything.") +
        list([["Still free", "1 scan a month, plain-English summaries, your state's rules and the legal aid finder."], ["Paused", "Letter writing, deadline reminders and reply reading."]]) +
        button("Come back to Premium", `${SITE}/app/upgrade`) +
        small("Did we fall short? Reply and tell us. A person reads every message."),
    }),
    text: `${hiText(o.name)}\n\nYour Premium plan has ended. Your cases and files stay in your account. Come back anytime: ${SITE}/app/upgrade`,
  };
}

/** A friend joined with your link. */
export function referralRewardEmail(o: { name?: string | null; applied: boolean }): Email {
  return {
    subject: "A friend joined. Your free month is in.",
    html: emailLayout({
      preheader: "Thanks for spreading the word.",
      title: "You earned a free month.",
      accent: "free month",
      body:
        p(hi(o.name)) +
        p(`Someone you invited just started Premium, so you both get a month free. ${o.applied ? "It's already credited to your account and will come off your next bill." : "It's saved to your account and will be added when you start Premium."}`) +
        button("Share your link again", `${SITE}/app/you`),
    }),
    text: `${hiText(o.name)}\n\nA friend you invited started Premium, so you both get a month free. ${o.applied ? "It's credited to your next bill." : "It's saved for when you start Premium."}\n\n${SITE}/app/you`,
  };
}

/** Someone added you as a helper on their case. */
export function helperInviteEmail(o: { fromName: string; caseTitle: string }): Email {
  return {
    subject: `${o.fromName} wants your help with a case`,
    html: emailLayout({
      preheader: `You've been added as a helper on "${o.caseTitle}".`,
      title: "You've been asked to help.",
      accent: "help",
      body:
        p(`<strong>${esc(o.fromName)}</strong> added you as a helper on their case, <strong>${esc(o.caseTitle)}</strong>, in Take it back.`) +
        p("Helpers can see the case, read the letters and files, add notes and keep track of deadlines. Sign in or create a free account with this email address to see it.") +
        button("See the case", `${SITE}/login?mode=signup&next=/app/cases`),
      footerNote: "Not expecting this? You can ignore this email. Nothing is shared until you sign in with this address.",
    }),
    text: `${o.fromName} added you as a helper on their case "${o.caseTitle}" in Take it back.\n\nSign in or create a free account with this email address to see it: ${SITE}/login?mode=signup&next=/app/cases`,
  };
}

/** We mailed or faxed a letter for them. */
export function letterSentEmail(o: { name?: string | null; method: "mail" | "fax"; to: string; caseId: string; tracking?: string | null }): Email {
  const mail = o.method === "mail";
  return {
    subject: mail ? `Your letter to ${o.to} is in the mail` : `Your fax to ${o.to} was sent`,
    html: emailLayout({
      preheader: mail ? "Certified, with tracking. A copy is saved to your case." : "A copy is saved to your case.",
      title: mail ? "Your letter is on its way." : "Your fax went through.",
      accent: mail ? "on its way" : "went through",
      body:
        p(hi(o.name)) +
        panel([["To", esc(o.to)], ["Sent by", mail ? "Certified mail" : "Fax"], ...(o.tracking ? ([["Tracking", esc(o.tracking)]] as [string, string][]) : [])]) +
        p("A copy of exactly what we sent is saved to your case file, and we've started counting their deadline to respond. We'll remind you if they go quiet.") +
        button("See your case", `${SITE}/app/cases/${o.caseId}`),
    }),
    text: `${hiText(o.name)}\n\nYour letter to ${o.to} was sent by ${mail ? "certified mail" : "fax"}.${o.tracking ? ` Tracking: ${o.tracking}.` : ""} A copy is in your case: ${SITE}/app/cases/${o.caseId}`,
  };
}

/** We received a bill forwarded by email. */
export function forwardReceivedEmail(o: { name?: string | null; caseTitle: string; caseId: string; files: number }): Email {
  return {
    subject: `Got it: ${o.caseTitle}`,
    html: emailLayout({
      preheader: "We opened a case and we're reading it now.",
      title: "Got it. We're on it.",
      accent: "on it",
      body:
        p(hi(o.name)) +
        p(`We received your forwarded email${o.files ? ` with ${o.files} attachment${o.files > 1 ? "s" : ""}` : ""} and opened a case: <strong>${esc(o.caseTitle)}</strong>. We'll read it and set your first deadline.`) +
        button("Open the case", `${SITE}/app/cases/${o.caseId}`),
    }),
    text: `${hiText(o.name)}\n\nWe received your forwarded email and opened a case: ${o.caseTitle}. ${SITE}/app/cases/${o.caseId}`,
  };
}

/** Support: confirms we got a message. Never repeats the message itself (so the form can't be used to send spam). */
export function supportReceivedEmail(o: { name?: string | null; number: number; subject: string; link: string }): Email {
  return {
    subject: `We got your message [#${o.number}]`,
    html: emailLayout({
      preheader: "A person reads every message. Here's your link to follow the conversation.",
      title: "We got your message.",
      accent: "message",
      body:
        p(hi(o.name)) +
        p(`Thanks for writing. A person reads every message, and we usually reply within one business day. Your request number is <strong>#${o.number}</strong>.`) +
        panel([["Request", `#${o.number}`], ["About", esc(o.subject)]]) +
        button("See the conversation", o.link) +
        small("You can also reply to this email to add more. Keep the request number in the subject so it joins the same conversation.") +
        small(`Court date, lawsuit or eviction? Don't wait on us. <a href="${SITE}/legal-aid" style="color:#5E5E5E">Find free legal aid near you</a>.`),
    }),
    text: `${hiText(o.name)}\n\nThanks for writing. A person reads every message, and we usually reply within one business day. Your request number is #${o.number} (${o.subject}).\n\nSee the conversation: ${o.link}\n\nYou can also reply to this email. Keep #${o.number} in the subject.\n\nCourt date, lawsuit or eviction? Find free legal aid: ${SITE}/legal-aid`,
  };
}

/** Support: our reply, sent to the person. */
export function supportReplyEmail(o: { name?: string | null; number: number; subject: string; body: string; link: string }): Email {
  const paras = o.body.split(/\n{2,}/).map((x) => p(esc(x).replace(/\n/g, "<br>"))).join("");
  return {
    subject: `Re: ${o.subject} [#${o.number}]`,
    html: emailLayout({
      preheader: o.body.slice(0, 120),
      title: "We replied to your message.",
      accent: "replied",
      body: p(hi(o.name)) + paras + button("Reply or see the conversation", o.link) + small(`Request #${o.number}. You can also reply to this email.`),
    }),
    text: `${hiText(o.name)}\n\n${o.body}\n\nReply or see the conversation: ${o.link}\n\nRequest #${o.number}. You can also reply to this email.`,
  };
}

/** Support: tells the team a message came in. */
export function supportTeamEmail(o: { number: number; subject: string; from: string; name?: string | null; body: string; topic?: string; platform?: string; isNew: boolean; link: string; via?: string }): Email {
  const meta: [string, string][] = [["From", esc(o.name ? `${o.name} <${o.from}>` : o.from)], ["Request", `#${o.number}`]];
  if (o.topic) meta.push(["Topic", esc(o.topic)]);
  if (o.platform) meta.push(["Sent from", esc(o.platform)]);
  if (o.via) meta.push(["Came in by", esc(o.via)]);
  return {
    subject: `${o.isNew ? "New request" : "New reply"} #${o.number}: ${o.subject}`,
    html: emailLayout({
      preheader: o.body.slice(0, 120),
      title: o.isNew ? "New support request" : "They replied",
      body: panel(meta) + p(esc(o.body).replace(/\n/g, "<br>")) + button("Answer in the dashboard", o.link) + small("Answer from the dashboard so the reply is saved with the request."),
    }),
    text: `${o.isNew ? "New request" : "New reply"} #${o.number} from ${o.name ? `${o.name} <${o.from}>` : o.from}\n\n${o.body}\n\nAnswer: ${o.link}`,
  };
}

/** Sample data for the admin preview page. */
export function emailPreviews(): { key: string; label: string; email: Email }[] {
  const terms = "Free for 7 days, then $59 a year starting October 19, 2026, renewing automatically every year until you cancel. Cancel online anytime in Settings before October 19, 2026 and you won't be charged.";
  return [
    { key: "welcome", label: "Welcome", email: welcomeEmail("Maria Lopez") },
    { key: "reminder", label: "Deadline reminder", email: reminderEmail("Maria Lopez", [
      { caseTitle: "Riverside Medical · ER bill", title: "Send your dispute letter", due: "Oct 15", owner: "you", days: 1 },
      { caseTitle: "Sunset Properties · deposit", title: "Their reply is due", due: "Oct 11", owner: "them", days: -1 },
    ]) },
    { key: "sub-started", label: "Premium started (renewal terms)", email: subscriptionStartedEmail({ name: "Maria Lopez", plan: "Premium, yearly", price: "$59 a year", trialEnds: "October 19, 2026", firstCharge: "October 19, 2026", terms }) },
    { key: "trial-ending", label: "Trial ending", email: trialEndingEmail({ name: "Maria Lopez", ends: "October 19, 2026", price: "$59 a year" }) },
    { key: "renewal", label: "Yearly renewal reminder", email: renewalReminderEmail({ name: "Maria Lopez", date: "November 12, 2026", price: "$59" }) },
    { key: "payment-failed", label: "Payment failed", email: paymentFailedEmail({ name: "Maria Lopez", amount: "$14.99" }) },
    { key: "sub-ended", label: "Premium ended", email: subscriptionEndedEmail({ name: "Maria Lopez" }) },
    { key: "referral", label: "Referral reward", email: referralRewardEmail({ name: "Maria Lopez", applied: true }) },
    { key: "helper", label: "Helper invite", email: helperInviteEmail({ fromName: "Maria Lopez", caseTitle: "Sunset Properties · deposit" }) },
    { key: "sent", label: "Letter mailed for you", email: letterSentEmail({ name: "Maria Lopez", method: "mail", to: "Midland Credit Management", caseId: "demo", tracking: "9407 1118 9876 5432 1012 34" }) },
    { key: "forward", label: "Forwarded bill received", email: forwardReceivedEmail({ name: "Maria Lopez", caseTitle: "Mercy Hospital statement", caseId: "demo", files: 2 }) },
    { key: "support-received", label: "Support: message received", email: supportReceivedEmail({ name: "Maria Lopez", number: 1042, subject: "My scan is stuck", link: `${SITE}/app/support` }) },
    { key: "support-reply", label: "Support: our reply", email: supportReplyEmail({ name: "Maria Lopez", number: 1042, subject: "My scan is stuck", body: "Thanks for letting us know. We restarted the reading on your case, and it finished a minute ago.\n\nIf anything still looks off, reply here.", link: `${SITE}/app/support` }) },
    { key: "support-team", label: "Support: new request (to team)", email: supportTeamEmail({ number: 1042, subject: "My scan is stuck", from: "maria@example.com", name: "Maria Lopez", body: "I scanned my ER bill an hour ago and it still says reading.", topic: "Scanning", platform: "iPhone app", isNew: true, link: `${SITE}/app/admin/support` }) },
  ];
}
