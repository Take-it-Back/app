import { Suspense } from "react";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { SideBar, TabBar } from "@/components/AppNav";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Your cases", robots: { index: false } };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireUser();
  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("full_name, is_admin, referred_by, language, created_at").eq("id", user.id).maybeSingle(),
    supabase.from("cases").select("id", { count: "exact", head: true }).not("status", "in", "(won,settled,closed)"),
  ]);
  // Invited by a friend? Link the accounts once (the database only allows it for new accounts).
  const jar = await cookies();
  const ref = jar.get("tib_ref")?.value;
  if (ref && profile && !profile.referred_by) await supabase.rpc("claim_referral", { p_code: ref });
  // Signed up from the Spanish page: start with Spanish explanations (only for brand-new accounts, so a later switch sticks).
  if (jar.get("tib_lang")?.value === "es" && profile && profile.language !== "es" && Date.now() - new Date(profile.created_at).getTime() < 3600000) {
    await supabase.from("profiles").update({ language: "es" }).eq("id", user.id);
  }
  return (
    <div className="app-shell">
      <Suspense>
        <SideBar name={profile?.full_name || user.email || ""} counts={{ open: count ?? 0 }} admin={!!profile?.is_admin} />
      </Suspense>
      {children}
      <TabBar />
    </div>
  );
}
