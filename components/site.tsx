import Link from "next/link";
import { CtaLink, Logo } from "./ui";
import SiteNav from "./SiteNav";
import { FEATURES, PROBLEMS } from "@/lib/marketing";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap-1200 row between g12" style={{ paddingTop: 12, paddingBottom: 12 }}>
        <Logo />
        <SiteNav />
      </div>
    </header>
  );
}

export function CtaBand({ title, italic, sub }: { title: string; italic: string; sub?: string }) {
  return (
    <section style={{ padding: "112px 24px" }}>
      <div className="row wrap between g32" style={{ maxWidth: 1152, margin: "0 auto", background: "#1A1A1A", borderRadius: 32, padding: "clamp(44px, 7vw, 88px)" }}>
        <div className="stack g12" style={{ flex: "1 1 460px" }}>
          <h2 className="serif" style={{ margin: 0, fontSize: "clamp(38px, 4.8vw, 62px)", lineHeight: 1.05, color: "#fff" }}>
            {title} <em style={{ color: "#F0A07E" }}>{italic}</em>
          </h2>
          {sub && <p style={{ margin: 0, fontSize: 17, color: "#D4D4D4" }}>{sub}</p>}
        </div>
        <div className="stack g8"><CtaLink href="/login?mode=signup" variant="light">Start free</CtaLink><span style={{ color: "#BDBDBD", fontSize: 13 }}>No card needed. Premium trial is 7 days free.</span></div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid #EBEBEB" }}>
      <div className="wrap-1200 stack g32" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <div className="grid-tiles" style={{ gap: 32 }}>
          <div className="stack g12">
            <Logo />
            <span className="muted" style={{ fontSize: 14 }}>Your rights, on the clock.</span>
          </div>
          <nav aria-label="Features" className="stack g8" style={{ fontSize: 15 }}>
            <span className="eyebrow">Features</span>
            {FEATURES.map((f) => <Link key={f.slug} href={`/features/${f.slug}`} style={{ textDecoration: "none" }}>{f.name}</Link>)}
          </nav>
          <nav aria-label="Who we fight" className="stack g8" style={{ fontSize: 15 }}>
            <span className="eyebrow">Who we fight</span>
            {PROBLEMS.map((p) => <Link key={p.slug} href={`/fight/${p.slug}`} style={{ textDecoration: "none" }}>{p.name}</Link>)}
          </nav>
          <nav aria-label="Company" className="stack g8" style={{ fontSize: 15 }}>
            <span className="eyebrow">Company</span>
            <Link href="/how-it-works" style={{ textDecoration: "none" }}>How it works</Link>
            <Link href="/pricing" style={{ textDecoration: "none" }}>Pricing</Link>
            <Link href="/faq" style={{ textDecoration: "none" }}>FAQ</Link>
            <Link href="/about" style={{ textDecoration: "none" }}>About</Link>
            <a href="mailto:hello@takeitback.app" style={{ textDecoration: "none" }}>Contact us</a>
            <Link href="/privacy" style={{ textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms" style={{ textDecoration: "none" }}>Terms</Link>
          </nav>
        </div>
        <p className="muted" style={{ margin: 0, paddingTop: 24, borderTop: "1px solid #EBEBEB", fontSize: 13, lineHeight: 1.6 }}>
          Take it back is not a law firm and does not give legal advice. We provide information and self-help tools. For legal advice, talk to a licensed attorney or your local legal aid office. © 2026 Take it back.
        </p>
      </div>
    </footer>
  );
}
