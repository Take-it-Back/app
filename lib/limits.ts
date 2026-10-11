import type { SupabaseClient } from "@supabase/supabase-js";

// Hourly caps on AI work per person, so one account can't run up the bill.
const PER_HOUR: Record<string, number> = { analyze: 20, letter: 40, reply: 20 };

export async function useAi(supabase: SupabaseClient, userId: string, kind: keyof typeof PER_HOUR) {
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await supabase.from("ai_usage").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("kind", kind).gte("created_at", since);
  if ((count ?? 0) >= PER_HOUR[kind]) return { ok: false as const, error: "You've done a lot in the last hour. Please try again in a little while." };
  await supabase.from("ai_usage").insert({ user_id: userId, kind });
  return { ok: true as const };
}

/** Best-effort error log shown on the admin dashboard. Never throws. */
export async function logError(supabase: SupabaseClient, area: string, message: unknown, path?: string, userId?: string) {
  try {
    const text = message instanceof Error ? message.message : String(message);
    await supabase.from("app_errors").insert({ area, message: text.slice(0, 1000), path: path?.slice(0, 300) ?? null, ...(userId ? { user_id: userId } : {}) });
  } catch {
    /* ignore */
  }
}
