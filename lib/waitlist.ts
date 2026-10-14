"use server";
import { createClient } from "@supabase/supabase-js";

/** "Tell me when the app is out" — stores the email for the iPhone/Android launch announcement. */
export async function joinAppWaitlist(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const platform = ["iphone", "android", "both"].includes(String(formData.get("platform"))) ? String(formData.get("platform")) : "both";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { error: "That email doesn't look right." };
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const { error } = await sb.from("app_waitlist").insert({ email, platform });
  if (error && error.code !== "23505") return { error: "Something went wrong. Please try again." };
  return { ok: true };
}
