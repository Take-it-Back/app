import { SiteFooter, SiteHeader } from "@/components/site";
import Analytics from "@/components/Analytics";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <Analytics />
    </>
  );
}
