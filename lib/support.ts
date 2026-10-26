// Support requests: shared labels, links and the emails that go out when a message is added. Server only.
import { sendEmail } from "@/lib/email";
import { SITE } from "@/lib/emails/layout";
import { supportReceivedEmail, supportReplyEmail, supportTeamEmail } from "@/lib/emails/templates";

export { SUPPORT_TOPICS, topicLabel, PLATFORM_LABEL, STATUS_LABEL } from "@/lib/supportTopics";
import { PLATFORM_LABEL, topicLabel } from "@/lib/supportTopics";

/** Where support notices go. Set SUPPORT_INBOX to change it. */
export const SUPPORT_INBOX = process.env.SUPPORT_INBOX || "admin@squaredawaylabs.com";

/** The link a person uses to see their conversation: in the app if they have an account, otherwise their private link. */
export function threadLink(t: { id: string; token?: string | null; signed_in_owner?: boolean }) {
  return t.signed_in_owner || !t.token ? `${SITE}/app/support/${t.id}` : `${SITE}/support/t/${t.token}`;
}

export type TicketInfo = { id: string; number: number; email: string; name?: string | null; subject: string; topic?: string; platform?: string; token?: string | null; signed_in_owner?: boolean };

/** After someone opens a request: a confirmation to them and a notice to the team. Best effort. */
export async function notifyNewTicket(t: TicketInfo, body: string, via?: string) {
  const link = threadLink(t);
  const mine = supportReceivedEmail({ name: t.name, number: t.number, subject: t.subject, link });
  const team = supportTeamEmail({ number: t.number, subject: t.subject, from: t.email, name: t.name, body, topic: topicLabel(t.topic), platform: t.platform ? PLATFORM_LABEL[t.platform] : undefined, isNew: true, link: `${SITE}/app/admin/support/${t.id}`, via });
  await Promise.all([
    sendEmail(t.email, mine.subject, mine.text, mine.html).catch(() => null),
    sendEmail(SUPPORT_INBOX, team.subject, team.text, team.html, { replyTo: t.email }).catch(() => null),
  ]);
}

/** After the person adds to a request: a notice to the team. */
export async function notifyCustomerReply(t: TicketInfo, body: string, via?: string) {
  const team = supportTeamEmail({ number: t.number, subject: t.subject, from: t.email, name: t.name, body, isNew: false, link: `${SITE}/app/admin/support/${t.id}`, via });
  await sendEmail(SUPPORT_INBOX, team.subject, team.text, team.html, { replyTo: t.email }).catch(() => null);
}

/** After we answer: the reply goes to the person by email too. */
export async function notifyStaffReply(t: TicketInfo, body: string) {
  const e = supportReplyEmail({ name: t.name, number: t.number, subject: t.subject, body, link: threadLink(t) });
  return sendEmail(t.email, e.subject, e.text, e.html);
}
