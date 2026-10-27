import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta, JsonLd, breadcrumbs } from "@/lib/seo";
import { PageHead } from "@/components/Faq";
import { SupportForm } from "@/components/Support";
import { getSessionUser } from "@/lib/supabase/server";

export const metadata: Metadata = pageMeta({
  title: "Support: contact Take it back",
  description: "Get help with your Take it back account, billing, scans or letters. A person reads every message and usually replies within one business day.",
  path: "/support",
});

const QUICK: [string, string, string][] = [
  ["Common questions", "Pricing, privacy, how scans and letters work.", "/faq"],
  ["Is something down?", "Live status of the website and app.", "/status"],
  ["Delete your account", "How to remove your account and data.", "/delete-account"],
  ["Court date, lawsuit or eviction?", "Don't wait on us. Find free legal aid near you.", "/legal-aid"],
];

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  const { user } = await getSessionUser();
  return (
    <main id="main">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Support", "/support"]])} />
      <PageHead eyebrow="Support" title="Support" lede="Questions about your account, billing, a scan or a letter? Send us a message. A person reads every one, and we usually reply within one business day." />
      <div className="wrap-1200 row wrap g32" style={{ alignItems: "flex-start", paddingTop: 40, paddingBottom: 96 }}>
        <section className="card stack g16" style={{ flex: "1 1 520px", padding: "clamp(20px, 3vw, 32px)", borderRadius: 12 }} aria-labelledby="contact">
          <h2 id="contact" className="serif" style={{ margin: 0, fontSize: 30 }}>Send us a message</h2>
          {sent && <p className="notice" role="status" style={{ margin: 0 }}>Thanks, we got it.</p>}
          {user ? (
            <p className="muted small" style={{ margin: 0 }}>You&apos;re signed in as {user.email}. Your conversation will also show in the app under <Link href="/app/support">Support</Link>.</p>
          ) : (
            <p className="muted small" style={{ margin: 0 }}>Have an account? <Link href="/login?next=/app/support">Sign in</Link> first so we can see your cases.</p>
          )}
          <SupportForm signedIn={Boolean(user)} page="/support" />
        </section>
        <aside className="stack g12" style={{ flex: "1 1 300px" }} aria-label="Other ways to get help">
          <span className="eyebrow">Faster answers</span>
          {QUICK.map(([t, d, href]) => (
            <Link key={href} href={href} className="card stack g4" style={{ textDecoration: "none", borderRadius: 12, padding: "16px 18px" }}>
              <span style={{ fontWeight: 500 }}>{t} →</span>
              <span className="muted small">{d}</span>
            </Link>
          ))}
          <p className="muted small" style={{ margin: "8px 0 0" }}>Prefer email? Write to <a href="mailto:hello@takeitback.app">hello@takeitback.app</a>. Take it back is not a law firm and can&apos;t give legal advice.</p>
        </aside>
      </div>
    </main>
  );
}
