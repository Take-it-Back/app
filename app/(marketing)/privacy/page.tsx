import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs, faqPage, ORG, APP_LD } from "@/lib/seo";


export const metadata: Metadata = pageMeta({ title: "Privacy", description: "How Take it back keeps your bills, letters and documents private: never sold, never used for ads, and deletable anytime.", path: "/privacy" });

export default function Privacy() {
  return (
    <>
      <main className="stack g16" style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 96px", fontSize: 16, lineHeight: 1.65 }}>
        <span className="eyebrow">Privacy</span>
        <h1 className="h-l">Your papers stay <em className="o">yours</em>.</h1>
        <p className="muted">Last updated October 12, 2026. This page is a plain summary and will be finalized with counsel before general launch.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>What we keep</h2>
        <p>Your account email, the documents you upload, the letters and notes you write, and your case dates. That's what the app needs to work.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>How we use it</h2>
        <p>Only to run your cases: reading your documents, drafting letters, and reminding you about deadlines. Documents are sent to our AI provider to be read, under terms that don't allow them to be used for training.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>What we never do</h2>
        <p>We never sell your data, never use it for advertising, and never put trackers of any kind on your case pages.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Health information</h2>
        <p>Bills and insurance letters can include health information. We ask for your consent before your first scan, and our <a href="/health-data-privacy">Consumer Health Data Privacy Policy</a> explains exactly what we collect, why, and who it goes to.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Text messages</h2>
        <p>Texts are off unless you turn them on. When on, we send at most one deadline reminder a day, between 8am and 8pm your time, with no case details in the message. Reply STOP to cancel or HELP for help. We keep a record of when you agreed. Your number is never sold or used for marketing.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Website analytics</h2>
        <p>We use Google Analytics on our public website to count visits and see which pages help people, with Google&apos;s advertising features turned off. It never runs inside the signed-in app, so it never sees your documents, cases or health information. We also turn it off on our public pages about medical bills and health insurance.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Payments</h2>
        <p>Payments are handled by Stripe. We never see or store your full card number.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Your state privacy rights</h2>
        <p>Wherever you live, you can see, download, correct or delete your information, and we never sell or share it for targeted advertising. Residents of states with privacy laws (including California, Washington, Nevada, Connecticut, Colorado, Virginia, Oregon and Texas) have these rights by law; we give them to everyone. If we turn down a request, you can appeal by replying to our answer.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Your control</h2>
        <p>Download everything or delete your account and all files at any time from the You page in the app. Questions: <a href="mailto:privacy@takeitback.app">privacy@takeitback.app</a>.</p>
      </main>
    </>
  );
}
