import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Delete your account",
  description: "How to delete your Take it back account and all of your data, in the app or by email.",
  path: "/delete-account",
});

const H2 = { fontSize: 26, margin: "16px 0 0" } as const;

export default function DeleteAccountPage() {
  return (
    <main id="main" className="stack g16" style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 96px", fontSize: 16, lineHeight: 1.65 }}>
      <h1 className="h-l">Delete your <em className="o">account</em></h1>
      <p>You can delete your Take it back account and everything in it at any time. It happens right away and can&apos;t be undone.</p>

      <h2 className="serif" style={H2}>In the app or on the website</h2>
      <ol>
        <li>Sign in at <a href="/login">takeitback.app</a> or open the app.</li>
        <li>Go to <strong>You</strong> (the More tab on a phone).</li>
        <li>At the bottom, tap <strong>Delete my account and everything in it</strong>, then confirm.</li>
      </ol>
      <p>Want a copy first? On the same page, tap <strong>Download my data</strong>.</p>

      <h2 className="serif" style={H2}>By email</h2>
      <p>If you can&apos;t sign in, email <a href="mailto:privacy@takeitback.app?subject=Delete%20my%20account">privacy@takeitback.app</a> from the address on your account and ask us to delete it. We confirm it&apos;s you and delete it within 30 days.</p>

      <h2 className="serif" style={H2}>What gets deleted</h2>
      <p>Your account, profile, every case, document, letter, note, date and helper invitation, your phone alert settings, and the files you uploaded. A web subscription is cancelled and your saved payment details are removed from our payment processor. Backup copies roll off within 30 days.</p>
      <p><strong>Subscriptions bought in the iPhone or Android app</strong> are billed by Apple or Google. Deleting your account doesn&apos;t stop their billing, so cancel in your phone&apos;s subscription settings too.</p>

      <h2 className="serif" style={H2}>What we keep</h2>
      <p>Payment records our payment processors must keep by law (for example for taxes and fraud prevention), and anonymous counts that can&apos;t be tied back to you.</p>
    </main>
  );
}
