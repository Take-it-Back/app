import { SiteFooter, SiteHeader } from "@/components/site";
import Analytics from "@/components/Analytics";
import { GUIDES } from "@/lib/guides";
import { HEALTH_LAW_TOPICS } from "@/lib/lawPages";

// Pages about medical bills and health insurance: analytics stays off (see the health data privacy memo).
const HEALTH_PROBLEMS = ["medical-bills", "insurance-denials"];
const QUIET = [
  ...HEALTH_PROBLEMS.map((p) => `/fight/${p}`),
  ...GUIDES.filter((g) => HEALTH_PROBLEMS.includes(g.problem)).map((g) => `/guides/${g.slug}`),
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
