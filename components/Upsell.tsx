import { CtaLink } from "./ui";

const DEFAULT_POINTS = ["Letters written for you, ready to send", "Every deadline tracked, with reminders", "Their replies read and explained", "All your papers in one case file"];

export default function Upsell({
  title = "Take the next step with Premium",
  body = "Free gives you the lay of the land. Premium does the work: it writes the letters, tracks every date and stays with you until it's settled.",
  points = DEFAULT_POINTS,
  compact = false,
}: {
  title?: string;
  body?: string;
  points?: string[];
  compact?: boolean;
}) {
  return (
    <section className="upsell" aria-label="Premium">
      <div className="stack g8">
        <span className="eyebrow" style={{ color: "#BF4F28" }}>Premium</span>
        <span className="serif" style={{ fontSize: compact ? 22 : 26, lineHeight: 1.15 }}>{title}</span>
        {!compact && <span style={{ fontSize: 15, color: "#D9D9D9" }}>{body}</span>}
      </div>
      {!compact && (
        <ul className="stack g8" style={{ margin: "16px 0 0", padding: 0, listStyle: "none" }}>
          {points.map((p) => (
            <li key={p} className="row g8" style={{ fontSize: 14.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BF4F28" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
              {p}
            </li>
          ))}
        </ul>
      )}
      <div className="row g12 wrap" style={{ marginTop: 18 }}>
        <CtaLink href="/app/upgrade" variant="orange">Try it free for 7 days</CtaLink>
        <span className="small" style={{ color: "#BDBDBD" }}>Then $9.99 a month. Cancel anytime.</span>
      </div>
    </section>
  );
}

export function LockedNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="row g8 small" style={{ color: "#5E5E5E" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
      {children}
    </span>
  );
}
