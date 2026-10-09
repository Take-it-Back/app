import { Suspense } from "react";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { SideBar, TabBar } from "@/components/AppNav";

export const metadata: Metadata = { title: "Your cases", robots: { index: false } };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireUser();
  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("full_name, is_admin").eq("id", user.id).maybeSingle(),
    supabase.from("cases").select("id", { count: "exact", head: true }).not("status", "in", "(won,settled,closed)"),
  ]);
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
