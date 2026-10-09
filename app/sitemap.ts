import type { MetadataRoute } from "next";
import { FEATURES, PROBLEMS } from "@/lib/marketing";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.takeitback.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/features", "/fight", "/how-it-works", "/pricing", "/faq", "/about", "/privacy", "/terms", ...FEATURES.map((f) => `/features/${f.slug}`), ...PROBLEMS.map((p) => `/fight/${p.slug}`)];
  return paths.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
