import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Consumer Health Data Privacy Policy",
  description: "What health information Take it back collects from your bills and letters, why, who it's shared with, and how to see or delete it. Covers Washington, Nevada, Connecticut and other state health data laws.",
  path: "/health-data-privacy",
});

const H2 = { fontSize: 26, margin: "16px 0 0" } as const;

export default function HealthDataPrivacy() {
  return (
    <main id="main" className="stack g16" style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 96px", fontSize: 16, lineHeight: 1.65 }}>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Privacy", "/privacy"], ["Health data", "/health-data-privacy"]])} />
      <h1 className="h-l">Consumer health data <em className="o">privacy policy</em></h1>
      <p className="muted">Effective October 12, 2026. This policy covers &ldquo;consumer health data&rdquo; under Washington&apos;s My Health My Data Act, Nevada law (SB 370), Connecticut law and similar state laws. It adds to our main <a href="/privacy">privacy policy</a> and will be finalized with counsel before general launch.</p>

      <h2 className="serif" style={H2}>What health data we collect</h2>
      <p>Only what is in the documents you choose to add, or that you type in: medical bills and statements, insurance explanations of benefits and denial letters, records you request, and notes about your case. These can show the care or services you got, dates of service, providers, diagnosis or billing codes, insurance and coverage details, and what you were charged or paid.</p>
      <p>We don&apos;t collect precise location, we don&apos;t use geofencing, and we don&apos;t collect health data from other sources about you.</p>

      <h2 className="serif" style={H2}>Why we collect it</h2>
      <p>Only to provide the service you asked for: reading your documents, finding errors and rights that apply, writing letters, tracking deadlines and reminders, keeping your case file, and sending mail or faxes when you ask us to. We ask for your consent before your first scan and won&apos;t use the data for any other purpose without asking again.</p>

      <h2 className="serif" style={H2}>Who we share it with</h2>
      <p>We don&apos;t sell health data, and we don&apos;t share it for advertising. It goes only to:</p>
      <ul>
        <li><strong>Service providers that run the app for us</strong>, under contracts that let them use it only to do that: Anthropic (AI that reads documents and drafts letters, under terms that don&apos;t allow training on it), Supabase (database and file storage) and Vercel (hosting).</li>
        <li><strong>Messaging providers</strong>, only for the message involved: Resend (emails to you), Postmark (bills you forward to us), and Twilio (text reminders, which never include case details).</li>
        <li><strong>Payment and app store providers</strong>: Stripe (website payments) and Apple (iPhone app purchases and phone alerts). They receive billing details or a device token, never your documents.</li>
        <li><strong>Mail and fax providers</strong>, Lob (certified mail) and Telnyx (fax), only for a letter you ask us to send, and only that letter.</li>
        <li><strong>People you invite</strong> as helpers on a case, only after you agree to share that case with them. You can remove a helper anytime.</li>
        <li><strong>Anyone else only if the law requires it</strong>, such as a valid court order.</li>
      </ul>
      <p>If we ever wanted to share it with anyone else, we would ask for your separate consent first.</p>

      <h2 className="serif" style={H2}>Your rights</h2>
      <ul>
        <li><strong>See it:</strong> download everything we hold about you from the You page in the app.</li>
        <li><strong>Delete it:</strong> delete a single case and its files, or your whole account, from the app; it happens right away. If you ask us by email instead, we delete within 30 days of confirming it&apos;s you, including copies held by our service providers. Backup copies roll off within 30 days.</li>
        <li><strong>Take back consent:</strong> tap &ldquo;Withdraw health data consent&rdquo; on the You page, or email us. We stop collecting new health data; you can keep or delete what&apos;s there.</li>
        <li><strong>Know who got it:</strong> ask us for the list of third parties and service providers your data went to.</li>
        <li><strong>Appeal:</strong> if we turn down a request, reply to our answer to appeal. If we deny the appeal, you can contact your state attorney general.</li>
      </ul>
      <p>To use any of these rights, email <a href="mailto:privacy@takeitback.app">privacy@takeitback.app</a> from the address on your account. We answer within 45 days (30 days for deletion) and don&apos;t charge for requests. We won&apos;t treat you differently for using them.</p>

      <h2 className="serif" style={H2}>How we protect it</h2>
      <p>Your files are stored privately and only open for you and helpers you invite. Access is encrypted in transit, and we don&apos;t put advertising or tracking pixels on signed-in pages.</p>

      <h2 className="serif" style={H2}>Contact</h2>
      <p>Take it back · <a href="mailto:privacy@takeitback.app">privacy@takeitback.app</a></p>
    </main>
  );
}
