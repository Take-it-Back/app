import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <>
      <SiteHeader />
      <main className="stack g16" style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px 96px", fontSize: 16, lineHeight: 1.65 }}>
        <span className="eyebrow">Privacy</span>
        <h1 className="h-l">Your papers stay <em className="o">yours</em>.</h1>
        <p className="muted">Last updated October 9, 2026. This page is a plain summary and will be finalized with counsel before general launch.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>What we keep</h2>
        <p>Your account email, the documents you upload, the letters and notes you write, and your case dates. That's what the app needs to work.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>How we use it</h2>
        <p>Only to run your cases: reading your documents, drafting letters, and reminding you about deadlines. Documents are sent to our AI provider to be read, under terms that don't allow them to be used for training.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>What we never do</h2>
        <p>We never sell your data, never use it for advertising, and never put ad trackers on your case pages.</p>
        <h2 className="serif" style={{ fontSize: 26, margin: "16px 0 0" }}>Your control</h2>
        <p>Download everything or delete your account and all files at any time from the You page in the app. Questions: <a href="mailto:privacy@takeitback.app">privacy@takeitback.app</a>.</p>
      </main>
      <SiteFooter />
    </>
  );
}
