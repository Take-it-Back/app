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

export function CtaBand({ title, italic, sub }: { title: string; italic?: string; sub?: string }) {
  const es = /[¿ñ]|Escanee/.test(`${title} ${sub || ""}`);
  return (
    <section className="wrap-1200" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="end-cta">
        <div className="stack g8" style={{ maxWidth: 720 }}>
          <h2 className="serif" style={{ margin: 0, fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 400, lineHeight: 1.15 }}>{italic ? `${title} ${italic}` : title}</h2>
          {sub && <p className="muted" style={{ margin: 0 }}>{sub}</p>}
        </div>
        <CtaLink href="/login?mode=signup">{es ? "Empezar gratis" : "Start free"}</CtaLink>
      </div>
    </section>
  );
}

// Sister apps from Squared Away Labs, the studio that makes Take it back.
const SISTER_APPS: [string, string, string][] = [
  ["Kopetta", "https://kopetta.com", "A companion for coffee"],
  ["Andamos", "https://andamos.app", "Plan your trips"],
  ["Hey Tribe", "https://www.heytribe.app", "The whole family, finally in sync"],
  ["Ospelia", "https://www.ospelia.com", "Restaurant operations and marketing"],
  ["Capitol Receipts", "https://www.capitolreceipts.com", "Follow the money in Congress"],
];

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid #EBEBEB" }}>
      <div className="wrap-1200 stack g32" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <div className="grid-tiles" style={{ gap: 32 }}>
          <div className="stack g12">
            <Logo />
            <span className="muted" style={{ fontSize: 14 }}>Help with medical bills, insurance denials, landlords and debt collectors.</span>
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
            <Link href="/guides" style={{ textDecoration: "none" }}>Guides</Link>
            <Link href="/tools" style={{ textDecoration: "none" }}>Free tools</Link>
            <Link href="/states" style={{ textDecoration: "none" }}>Rules by state</Link>
            <Link href="/legal-aid" style={{ textDecoration: "none" }}>Free legal aid</Link>
            <Link href="/es" lang="es" hrefLang="es" style={{ textDecoration: "none" }}>En español</Link>
            <Link href="/es/guias" lang="es" hrefLang="es" style={{ textDecoration: "none" }}>Guías en español</Link>
            <Link href="/about" style={{ textDecoration: "none" }}>About</Link>
            <Link href="/support" style={{ textDecoration: "none" }}>Support</Link>
            <Link href="/status" style={{ textDecoration: "none" }}>Status</Link>
            <Link href="/privacy" style={{ textDecoration: "none" }}>Privacy</Link>
            <Link href="/health-data-privacy" style={{ textDecoration: "none" }}>Health data privacy</Link>
            <Link href="/terms" style={{ textDecoration: "none" }}>Terms</Link>
          </nav>
        </div>
        <nav aria-label="More from Squared Away Labs" className="row wrap g8" style={{ paddingTop: 24, borderTop: "1px solid #EBEBEB", fontSize: 14, columnGap: 18, rowGap: 8 }}>
          <span className="muted">A <a href="https://www.squaredawaylabs.com" style={{ color: "inherit", display: "inline-block", padding: "4px 0" }}>Squared Away Labs</a> app. Also from us:</span>
          {SISTER_APPS.map(([name, url, blurb]) => (
            <a key={name} href={url} title={blurb} style={{ textDecoration: "none" }}>{name}</a>
          ))}
        </nav>
        <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
          Take it back is not a law firm and does not give legal advice. We provide information and self-help tools. For legal advice, talk to a licensed attorney or your local legal aid office. © 2026 Take it back.
        </p>
      </div>
    </footer>
  );
}
