import Link from "next/link";
import { CtaLink, Logo } from "./ui";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap-1200 row wrap between g12" style={{ paddingTop: 14, paddingBottom: 14 }}>
        <Logo />
        <nav aria-label="Main" className="row wrap g20" style={{ fontSize: 15 }}>
          <Link href="/#features" style={{ textDecoration: "none", padding: "10px 0" }}>Features</Link>
          <Link href="/#pricing" style={{ textDecoration: "none", padding: "10px 0" }}>Pricing</Link>
          <Link href="/#faq" style={{ textDecoration: "none", padding: "10px 0" }}>Help</Link>
          <Link href="/login" style={{ textDecoration: "none", padding: "10px 0" }}>Sign in</Link>
          <Link href="/login?mode=signup" className="btn btn-ink" style={{ minHeight: 44, padding: "4px 4px 4px 16px", fontSize: 14 }}>
            Start free
            <span className="dot" style={{ width: 36, height: 36 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        </nav>
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
        <CtaLink href="/login?mode=signup" variant="light">Scan your first letter</CtaLink>
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
          <nav aria-label="Product" className="stack g8" style={{ fontSize: 15 }}>
            <span className="eyebrow">Product</span>
            <Link href="/#features" style={{ textDecoration: "none" }}>Features</Link>
            <Link href="/features/case-tracker" style={{ textDecoration: "none" }}>Case tracker</Link>
            <Link href="/#pricing" style={{ textDecoration: "none" }}>Pricing</Link>
          </nav>
          <nav aria-label="Help" className="stack g8" style={{ fontSize: 15 }}>
            <span className="eyebrow">Help</span>
            <Link href="/#faq" style={{ textDecoration: "none" }}>Questions</Link>
            <a href="https://www.lawhelp.org" style={{ textDecoration: "none" }}>Find legal aid</a>
            <a href="mailto:hello@takeitback.app" style={{ textDecoration: "none" }}>Contact us</a>
          </nav>
          <nav aria-label="Company" className="stack g8" style={{ fontSize: 15 }}>
            <span className="eyebrow">Company</span>
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
