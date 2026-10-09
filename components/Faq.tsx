export default function Faq({ items, openFirst = true }: { items: [string, string][]; openFirst?: boolean }) {
  return (
    <div className="stack g8">
      {items.map(([q, a], i) => (
        <details key={q} className="faq" open={openFirst && i === 0}>
          <summary>
            {q}
            <svg className="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
          </summary>
          <p className="muted" style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.6 }}>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function PageHead({ eyebrow, title, italic, after, lede, children }: { eyebrow: string; title: string; italic: string; after?: string; lede?: string; children?: React.ReactNode }) {
  return (
    <section className="wrap-1200 stack g16" style={{ paddingTop: "clamp(48px, 7vw, 80px)" }}>
      <span className="eyebrow" style={{ fontSize: 13 }}>{eyebrow}</span>
      <h1 className="h-xl" style={{ maxWidth: 900, fontSize: "clamp(42px, 5.2vw, 68px)" }}>
        {title} <em className="o">{italic}</em>{after}
      </h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </section>
  );
}
