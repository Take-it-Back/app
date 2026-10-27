// Shared email look: cream page, white card, ink text, orange accents. Table layout and inline styles
// so it renders the same in Gmail, Outlook and Apple Mail. Works in dark mode clients (no images needed to read).
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.takeitback.app").replace(/\/$/, "");

const C = { ink: "#1A1A1A", muted: "#5E5E5E", orange: "#BF4F28", orangeSoft: "#FBEDE7", cream: "#F6F4EF", line: "#E7E3DA" };
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const p = (html: string) => `<p style="margin:0 0 16px;font:16px/1.6 ${SANS};color:${C.ink}">${html}</p>`;
export const small = (html: string) => `<p style="margin:0 0 12px;font:13px/1.55 ${SANS};color:${C.muted}">${html}</p>`;

export function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="border-radius:999px;background:${C.ink}">
<a href="${href}" style="display:inline-block;padding:14px 26px;font:600 16px ${SANS};color:#ffffff;text-decoration:none;border-radius:999px">${esc(label)} &rarr;</a></td></tr></table>`;
}

/** A soft panel for the key facts (amounts, dates, terms). */
export function panel(rows: [string, string][], tone: "orange" | "cream" = "cream") {
  const bg = tone === "orange" ? C.orangeSoft : C.cream;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;background:${bg};border-radius:16px"><tr><td style="padding:16px 20px">
${rows.map(([k, v], i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"${i ? ` style="border-top:1px solid ${tone === "orange" ? "#F3D5C8" : C.line}"` : ""}><tr>
<td style="padding:10px 0;font:14px ${SANS};color:${C.muted};vertical-align:top">${esc(k)}</td>
<td style="padding:10px 0;font:600 15px ${SANS};color:${C.ink};text-align:right;vertical-align:top">${v}</td></tr></table>`).join("")}
</td></tr></table>`;
}

/** A list of items, each with a bold line and a muted line. */
export function list(items: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px">${items
    .map(([t, b]) => `<tr><td style="width:18px;vertical-align:top;padding:12px 0 0;font:700 16px ${SANS};color:${C.orange}">&bull;</td>
<td style="padding:10px 0;border-bottom:1px solid ${C.line}"><div style="font:600 15px ${SANS};color:${C.ink}">${t}</div>${b ? `<div style="font:14px/1.5 ${SANS};color:${C.muted};margin-top:2px">${b}</div>` : ""}</td></tr>`)
    .join("")}</table>`;
}

export function emailLayout({ preheader, title, accent, body, footerNote }: { preheader: string; title: string; accent?: string; body: string; footerNote?: string }) {
  const heading = accent ? title.replace(accent, `<em style="font-style:italic;color:${C.orange}">${esc(accent)}</em>`) : esc(title);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 6px 18px"><a href="${SITE}" style="text-decoration:none"><img src="${SITE}/icons/icon-192.png" width="32" height="32" alt="" style="vertical-align:middle;border:0;border-radius:8px"> <span style="font:700 19px ${SANS};color:${C.ink};letter-spacing:-0.4px;vertical-align:middle">&nbsp;take it back</span></a></td></tr>
<tr><td style="background:#ffffff;border-radius:22px;padding:34px 30px 18px;border:1px solid ${C.line}">
<h1 style="margin:0 0 18px;font:400 30px/1.15 ${SERIF};color:${C.ink};letter-spacing:-0.3px">${heading}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 10px 0">
${footerNote ? small(footerNote) : ""}
${small(`Take it back is not a law firm and doesn't give legal advice. We provide information and self-help tools. Questions? Just reply, or write to <a href="mailto:hello@takeitback.app" style="color:${C.muted}">hello@takeitback.app</a>.`)}
${small(`<a href="${SITE}/app/you" style="color:${C.muted}">Email settings</a> &middot; <a href="${SITE}/privacy" style="color:${C.muted}">Privacy</a> &middot; <a href="${SITE}/terms" style="color:${C.muted}">Terms</a>`)}
</td></tr></table></td></tr></table></body></html>`;
}
