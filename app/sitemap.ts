import { AID_STATES, stateSlug } from "@/lib/legalAid";
import type { MetadataRoute } from "next";
import { FEATURES, PROBLEMS } from "@/lib/marketing";
import { GUIDES } from "@/lib/guides";
import { CATEGORIES } from "@/lib/guideMeta";
import { LAW_STATES, LAW_TOPICS, lawStateSlug } from "@/lib/lawPages";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.takeitback.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/es", "/features", "/fight", "/how-it-works", "/pricing", "/faq", "/about", "/privacy", "/health-data-privacy", "/terms", ...FEATURES.map((f) => `/features/${f.slug}`), ...PROBLEMS.map((p) => `/fight/${p.slug}`), "/guides", ...CATEGORIES.map((c) => `/guides/category/${c.slug}`), ...GUIDES.map((g) => `/guides/${g.slug}`), "/legal-aid", ...AID_STATES.map((st) => `/legal-aid/${stateSlug(st)}`), "/states", ...LAW_STATES.map((s) => `/states/${lawStateSlug(s)}`), ...LAW_TOPICS.map((t) => `/laws/${t.slug}`), ...LAW_TOPICS.flatMap((t) => LAW_STATES.map((s) => `/laws/${t.slug}/${lawStateSlug(s)}`))];
  const lastModified = new Date();
  return paths.map((p) => ({ url: `${BASE}${p}`, lastModified, changeFrequency: "monthly", priority: p === "" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8 }));
}
