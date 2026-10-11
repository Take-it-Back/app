// Server only: uses the VAPID private key.
import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PushPayload = { title: string; body: string; url?: string };
type Sub = { id: string; endpoint: string; p256dh: string; auth: string };

let configured = false;

/** True when the VAPID keys are set. Configures web-push once. */
export function pushReady() {
  const pub = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  if (!configured) {
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:hello@takeitback.app", pub, priv);
    configured = true;
  }
  return true;
}

/**
 * Sends a notification to every saved device for the user the client is signed in as (RLS scopes the rows).
 * Removes subscriptions the push service says are gone (404/410). Returns how many were delivered.
 */
export async function sendPushToSelf(supabase: SupabaseClient, userId: string, payload: PushPayload) {
  if (!pushReady()) return { sent: 0, removed: 0, failed: 0 };
  const { data } = await supabase.from("push_subscriptions").select("id, endpoint, p256dh, auth").eq("user_id", userId);
  const subs = (data ?? []) as Sub[];
  const body = JSON.stringify(payload);
  const gone: string[] = [];
  let sent = 0;
  let failed = 0;
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, body, { TTL: 60 * 60 * 12 });
        sent++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) gone.push(s.id);
        else failed++;
      }
    })
  );
  if (gone.length) await supabase.from("push_subscriptions").delete().in("id", gone);
  return { sent, removed: gone.length, failed };
}
