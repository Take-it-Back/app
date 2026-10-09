import { requireUser } from "@/lib/supabase/server";
import { FREE_SCANS_PER_MONTH, getPlan, scansThisMonth } from "@/lib/plan";
import { BackLink } from "@/components/ui";
import Upsell from "@/components/Upsell";
import ScanFlow from "./ScanFlow";

export default async function ScanPage() {
  const { supabase, user } = await requireUser();
  const [{ data: profile }, plan, used] = await Promise.all([
    supabase.from("profiles").select("state").eq("id", user.id).maybeSingle(),
    getPlan(supabase, user.id),
    scansThisMonth(supabase),
  ]);
  if (!plan.premium && used >= FREE_SCANS_PER_MONTH) {
    return (
      <main className="app-main">
        <BackLink href="/app" />
        <h1 className="page-title" style={{ fontSize: 38, margin: "6px 0 8px" }}>That's {FREE_SCANS_PER_MONTH} this <em className="o">month</em></h1>
        <p className="muted" style={{ margin: "0 0 20px" }}>Free includes {FREE_SCANS_PER_MONTH} scans a month. Your next free scans arrive on the 1st.</p>
        <Upsell title="Scan as much as you need" />
      </main>
    );
  }
  return (
    <main className="app-main">
      <ScanFlow userId={user.id} defaultState={profile?.state || ""} />
    </main>
  );
}
