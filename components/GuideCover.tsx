import type { ReactNode } from "react";
import { categoryBySlug, type GuideCategory, type IconKey } from "@/lib/guideMeta";

// Simple line icons on a 48 x 48 grid. Drawn once, coloured per category.
const ICONS: Record<IconKey, ReactNode> = {
  receipt: <><path d="M12 6h24v36l-4-3-4 3-4-3-4 3-4-3-4 3z" /><path d="M18 16h12M18 23h12M18 30h7" /></>,
  shield: <><path d="M24 5l15 5v11c0 10-6.5 17-15 21C15.5 38 9 31 9 21V10z" /><path d="M17 23l5 5 9-10" /></>,
  house: <><path d="M6 23L24 7l18 16" /><path d="M11 20v21h26V20" /><path d="M20 41V29h8v12" /></>,
  key: <><circle cx="15" cy="24" r="8" /><path d="M23 24h20M37 24v7M30 24v5" /></>,
  phone: <><rect x="14" y="5" width="20" height="38" rx="4" /><path d="M21 37h6" /></>,
  car: <><path d="M6 31l4-11a4 4 0 0 1 4-3h20a4 4 0 0 1 4 3l4 11v8h-6v-4H12v4H6z" /><path d="M6 31h36M13 26h3M32 26h3" /></>,
  plane: <><path d="M42 6L5 20l14 6 6 14z" /><path d="M19 26L42 6" /></>,
  card: <><rect x="5" y="11" width="38" height="26" rx="4" /><path d="M5 19h38M11 30h10" /></>,
  bank: <><path d="M24 6L6 15h36z" /><path d="M11 19v15M20 19v15M28 19v15M37 19v15M7 39h34" /></>,
  scale: <><path d="M24 8v32M14 40h20M10 14h28" /><path d="M10 14l-5 12a6 5 0 0 0 10 0z" /><path d="M38 14l-5 12a6 5 0 0 0 10 0z" /></>,
  gavel: <><path d="M26 8l14 14-6 6L20 14z" /><path d="M23 21L8 36M12 41h20" /></>,
  envelope: <><rect x="5" y="10" width="38" height="28" rx="3" /><path d="M5 14l19 14 19-14" /></>,
  document: <><path d="M12 5h17l9 9v29H12z" /><path d="M29 5v9h9M18 24h14M18 31h14" /></>,
  clock: <><circle cx="24" cy="24" r="18" /><path d="M24 13v11l7 5" /></>,
  search: <><circle cx="21" cy="21" r="13" /><path d="M31 31l12 12" /></>,
  cross: <path d="M19 6h10v13h13v10H29v13H19V29H6V19h13z" />,
  pill: <><path d="M17 31L31 17a7 7 0 0 1 10 10L27 41a7 7 0 0 1-10-10z" /><path d="M24 24l7 7" /></>,
  cap: <><path d="M24 9L3 19l21 10 21-10z" /><path d="M11 24v10c0 3 6 6 13 6s13-3 13-6V24M45 19v14" /></>,
  briefcase: <><rect x="5" y="15" width="38" height="26" rx="3" /><path d="M17 15v-5h14v5M5 27h38" /></>,
  wrench: <path d="M30 8a10 10 0 0 0-8 14L8 36l4 4 14-14a10 10 0 0 0 14-8l-6 5-5-1-1-5z" />,
  wifi: <><path d="M5 18a27 27 0 0 1 38 0M11 25a18 18 0 0 1 26 0M17 32a9 9 0 0 1 14 0" /><circle cx="24" cy="39" r="2" /></>,
  bolt: <path d="M27 4L9 27h14l-2 17 18-24H25z" />,
  bag: <><path d="M9 15h30l2 27H7z" /><path d="M17 20v-6a7 7 0 0 1 14 0v6" /></>,
  tag: <><path d="M5 5h18l20 20-18 18L5 23z" /><circle cx="15" cy="15" r="3" /></>,
  lock: <><rect x="9" y="21" width="30" height="22" rx="4" /><path d="M16 21v-6a8 8 0 0 1 16 0v6M24 30v6" /></>,
  alert: <><path d="M24 6L4 41h40z" /><path d="M24 18v10M24 34v1" /></>,
  check: <><circle cx="24" cy="24" r="18" /><path d="M15 25l6 6 12-13" /></>,
  calendar: <><rect x="6" y="9" width="36" height="33" rx="4" /><path d="M6 19h36M15 5v8M33 5v8" /></>,
  megaphone: <><path d="M6 20v8h8l16 9V11l-16 9z" /><path d="M36 18a8 8 0 0 1 0 12M14 28l3 11h6l-3-8" /></>,
  pin: <><path d="M24 43S10 29 10 19a14 14 0 0 1 28 0c0 10-14 24-14 24z" /><circle cx="24" cy="19" r="5" /></>,
  coin: <><circle cx="24" cy="24" r="18" /><path d="M28 17c-1-2-3-3-5-3-3 0-5 2-5 4s2 4 6 5 6 3 6 5-2 4-5 4c-2 0-4-1-5-3M24 10v4M24 34v4" /></>,
  chart: <><path d="M7 6v36h36" /><path d="M13 33l8-10 7 6 12-15" /></>,
  package: <><path d="M24 5l17 8v22l-17 8-17-8V13z" /><path d="M7 13l17 8 17-8M24 21v22" /></>,
  flag: <><path d="M10 5v40" /><path d="M10 8h26l-5 8 5 8H10" /></>,
  stop: <><path d="M17 5h14l12 12v14L31 43H17L5 31V17z" /><path d="M16 24h16" /></>,
  user: <><circle cx="24" cy="16" r="8" /><path d="M7 43c0-10 7-16 17-16s17 6 17 16" /></>,
  drop: <path d="M24 5S10 21 10 31a14 14 0 0 0 28 0C38 21 24 5 24 5z" />,
  bell: <><path d="M12 33V22a12 12 0 0 1 24 0v11l4 5H8z" /><path d="M20 42h8" /></>,
  clipboard: <><rect x="9" y="8" width="30" height="35" rx="3" /><rect x="17" y="4" width="14" height="8" rx="2" /><path d="M16 22h16M16 30h16" /></>,
  scissors: <><circle cx="13" cy="34" r="5" /><circle cx="35" cy="34" r="5" /><path d="M17 31L38 8M31 31L10 8" /></>,
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed: number) {
  let t = seed || 1;
  return () => { t = (t + 0x6d2b79f5) | 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
}

/** A small illustrated cover: the category colour, a big icon, and shapes that differ for every guide. */
export default function GuideCover({ slug, category, icon, ratio = "16 / 9" }: { slug: string; category: GuideCategory; icon: IconKey; ratio?: string }) {
  const cat = categoryBySlug(category);
  const tint = cat?.tint ?? "#f3f3f3";
  const ink = cat?.ink ?? "#1a1a1a";
  const r = rng(hash(slug));
  const shapes = Array.from({ length: 5 }, (_, i) => {
    const kind = Math.floor(r() * 3);
    return { i, kind, x: 20 + r() * 360, y: 15 + r() * 210, s: 14 + r() * 46, o: 0.1 + r() * 0.16 };
  });
  const dx = (r() - 0.5) * 70; // nudge the icon so covers don't all look centred
  const dy = (r() - 0.5) * 24;
  const tilt = (r() - 0.5) * 14;
  const ix = 200 + dx, iy = 112 + dy;
  return (
    <svg viewBox="0 0 400 225" role="presentation" aria-hidden="true" focusable="false" style={{ display: "block", width: "100%", height: "auto", aspectRatio: ratio, background: tint, borderRadius: "inherit" }} preserveAspectRatio="xMidYMid slice">
      {shapes.map((s) =>
        s.kind === 0 ? <circle key={s.i} cx={s.x} cy={s.y} r={s.s / 2} fill={ink} opacity={s.o} /> :
        s.kind === 1 ? <rect key={s.i} x={s.x - s.s / 2} y={s.y - s.s / 2} width={s.s} height={s.s} rx={s.s / 4} fill={ink} opacity={s.o} transform={`rotate(${Math.round(s.x) % 40 - 20} ${s.x} ${s.y})`} /> :
        <path key={s.i} d={`M${s.x - s.s} ${s.y}a${s.s} ${s.s} 0 0 1 ${s.s * 2} 0`} fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" opacity={s.o + 0.08} />
      )}
      <g transform={`translate(${ix} ${iy}) rotate(${tilt})`}>
        <circle r="64" fill="#fff" opacity="0.92" />
        <g transform="translate(-36 -36) scale(1.5)" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[icon]}</g>
      </g>
    </svg>
  );
}
