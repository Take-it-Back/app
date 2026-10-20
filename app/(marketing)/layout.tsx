import { SiteFooter, SiteHeader } from "@/components/site";
import Analytics from "@/components/Analytics";
import { GUIDES } from "@/lib/guides";
import { HEALTH_LAW_TOPICS } from "@/lib/lawPages";
import { CATEGORIES, HEALTH_CATEGORIES } from "@/lib/guideMeta";
import { ES_GUIDES } from "@/lib/guideEs";

// Pages about medical bills and health insurance: analytics stays off (see the health data privacy memo).
const HEALTH_PROBLEMS = ["medical-bills", "insurance-denials"];
const QUIET = [
  ...HEALTH_PROBLEMS.map((p) => `/fight/${p}`),
  ...GUIDES.filter((g) => HEALTH_CATEGORIES.includes(g.category)).map((g) => `/guides/${g.slug}`),
  // Free tools include health topics (itemized medical bills, appeals), so analytics stays off for all of them.
  "/tools",
  ...ES_GUIDES.filter((e) => GUIDES.some((g) => g.slug === e.slug && HEALTH_CATEGORIES.includes(g.category))).map((e) => `/es/guias/${e.slug}`),
  ...CATEGORIES.filter((c) => c.health).map((c) => `/guides/category/${c.slug}`),
  ...HEALTH_LAW_TOPICS.map((t) => `/laws/${t}`),
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <Analytics quiet={QUIET} />
    </>
  );
}
