import type { FeatureSlug, ProblemSlug } from "@/lib/marketing";

export default function FeatureIcon({ slug, size = 18 }: { slug: FeatureSlug | ProblemSlug; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (slug) {
    case "scan": return <svg {...p}><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><path d="M8 12h8" /></svg>;
    case "plain-answers": return <svg {...p}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></svg>;
    case "letters": return <svg {...p}><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></svg>;
    case "deadline-keeper": return <svg {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6" /></svg>;
    case "case-tracker": return <svg {...p}><path d="M5 4v16" /><circle cx="5" cy="7" r="2" /><circle cx="5" cy="17" r="2" /><path d="M10 7h10M10 17h7" /></svg>;
    case "reply-decoder": return <svg {...p}><path d="M9 14l-5-5 5-5" /><path d="M4 9h10a6 6 0 0 1 6 6v5" /></svg>;
    case "case-packet": return <svg {...p}><path d="M6 3h9l3 3v15H6z" /><path d="M9 12h6M9 16h4" /></svg>;
    case "real-help": return <svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></svg>;
    case "medical-bills": return <svg {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M12 8v6M9 11h6" /></svg>;
    case "insurance-denials": return <svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9.5 9.5l5 5M14.5 9.5l-5 5" /></svg>;
    case "landlords": return <svg {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>;
    case "debt-collectors": return <svg {...p}><path d="M5 4h14v16H5z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>;
  }
}
