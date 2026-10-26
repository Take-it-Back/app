// Server only: uses the VAPID private key.
import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";
import { apnsReady, sendApns } from "@/lib/apns";
import { fcmReady, sendFcm } from "@/lib/google";

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
  const app = await sendToApp(supabase, userId, payload);
  if (!pushReady()) return app;
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
  return { sent: sent + app.sent, removed: gone.length + app.removed, failed: failed + app.failed };
}

/** True when web push or app push (iPhone or Android) is set up. */
export const anyPushReady = () => pushReady() || apnsReady() || fcmReady();

/** App devices: iPhones through Apple's push service, Android through Firebase. Drops tokens that are no longer valid. */
async function sendToApp(supabase: SupabaseClient, userId: string, payload: PushPayload) {
  if (!apnsReady() && !fcmReady()) return { sent: 0, removed: 0, failed: 0 };
  const { data } = await supabase.from("device_tokens").select("token, platform").eq("user_id", userId);
  const rows = (data ?? []) as { token: string; platform: string }[];
  const ios = rows.filter((r) => r.platform !== "android").map((r) => r.token);
  const android = rows.filter((r) => r.platform === "android").map((r) => r.token);
  const [apple, google] = await Promise.all([apnsReady() ? sendApns(ios, payload) : [], fcmReady() ? sendFcm(android, payload) : []]);
  const gone = [
    ...apple.filter((r) => r.status === 410 || r.reason === "BadDeviceToken" || r.reason === "Unregistered").map((r) => r.token),
    ...google.filter((r) => r.gone).map((r) => r.token),
  ];
  if (gone.length) await supabase.from("device_tokens").delete().in("token", gone);
  const sent = apple.filter((r) => r.status === 200).length + google.filter((r) => r.ok).length;
  const total = apple.length + google.length;
  return { sent, removed: gone.length, failed: total - sent - gone.length };
}
