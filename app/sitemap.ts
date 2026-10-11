import type { MetadataRoute } from "next";
import { FEATURES, PROBLEMS } from "@/lib/marketing";
import { GUIDES } from "@/lib/guides";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.takeitback.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/features", "/fight", "/how-it-works", "/pricing", "/faq", "/about", "/privacy", "/health-data-privacy", "/terms", ...FEATURES.map((f) => `/features/${f.slug}`), ...PROBLEMS.map((p) => `/fight/${p.slug}`), "/guides", ...GUIDES.map((g) => `/guides/${g.slug}`)];
  const lastModified = new Date();
  return paths.map((p) => ({ url: `${BASE}${p}`, lastModified, changeFrequency: "monthly", priority: p === "" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8 }));
}
