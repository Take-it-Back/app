import { requireUser } from "@/lib/supabase/server";
import ScanFlow from "./ScanFlow";

export default async function ScanPage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("state").eq("id", user.id).maybeSingle();
  return (
    <main className="app-main">
      <ScanFlow userId={user.id} defaultState={profile?.state || ""} />
    </main>
  );
}
