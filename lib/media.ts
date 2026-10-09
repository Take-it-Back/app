import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaInput } from "./ai";

const SUPPORTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

/** Downloads the user's files from private storage and returns base64 blocks for the model. */
export async function loadMedia(supabase: SupabaseClient, paths: { storage_path: string; mime_type: string | null }[]) {
  const out: MediaInput[] = [];
  for (const p of paths.slice(0, 8)) {
    const mime = p.mime_type || "image/jpeg";
    if (!SUPPORTED.includes(mime)) continue;
    const { data, error } = await supabase.storage.from("case-files").download(p.storage_path);
    if (error || !data) continue;
    const buf = Buffer.from(await data.arrayBuffer());
    out.push({ mime, base64: buf.toString("base64") });
  }
  return out;
}
