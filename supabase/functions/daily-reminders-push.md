# Phone alerts in `daily-reminders`

Snippet to merge into `supabase/functions/daily-reminders/index.ts`. Not deployed.

Function secrets: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (same values as the app). Table: `supabase/push_subscriptions.sql`.

**Timing:** there's no time zone on profiles, so local time comes from `profiles.state` (falls back to Eastern). The cron runs at 12:45 UTC, which is 5:45am Pacific, so West Coast, Alaska and Hawaii users would be skipped. Move the cron to about 18:00 UTC (2pm Eastern, 11am Pacific, 8am Hawaii) so every US state falls inside 8am–8pm.

## 1. Imports and setup (top of file)

```ts
import webpush from "npm:web-push@3";

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY");
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY");
const pushOn = Boolean(VAPID_PUBLIC && VAPID_PRIVATE);
if (pushOn) webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@takeitback.app", VAPID_PUBLIC!, VAPID_PRIVATE!);

// Main time zone per state. Good enough for an 8am–8pm window.
const TZ: Record<string, string> = {
  Hawaii: "Pacific/Honolulu", Alaska: "America/Anchorage", "Puerto Rico": "America/Puerto_Rico", Arizona: "America/Phoenix",
  California: "America/Los_Angeles", Nevada: "America/Los_Angeles", Oregon: "America/Los_Angeles", Washington: "America/Los_Angeles",
  Colorado: "America/Denver", Idaho: "America/Boise", Montana: "America/Denver", "New Mexico": "America/Denver", Utah: "America/Denver", Wyoming: "America/Denver",
  Alabama: "America/Chicago", Arkansas: "America/Chicago", Illinois: "America/Chicago", Iowa: "America/Chicago", Kansas: "America/Chicago",
  Louisiana: "America/Chicago", Minnesota: "America/Chicago", Mississippi: "America/Chicago", Missouri: "America/Chicago", Nebraska: "America/Chicago",
  "North Dakota": "America/Chicago", Oklahoma: "America/Chicago", "South Dakota": "America/Chicago", Tennessee: "America/Chicago", Texas: "America/Chicago", Wisconsin: "America/Chicago",
};
const localHour = (state: string | null) =>
  Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: TZ[state ?? ""] ?? "America/New_York" }).format(new Date()));
```

Update the early exit so push alone is enough:

```ts
if (!resendKey && !smsOn && !pushOn) return Response.json({ ok: true, sent: 0, note: "No reminder channel configured" });
```

## 2. Inside the per-user loop

Add `state` to the profile select:

```ts
.select("full_name, remind_email, plan, plan_status, phone, sms_opt_in, state")
```

Then, after the SMS block and before `if (delivered)`:

```ts
if (pushOn) {
  const hour = localHour(prof.state);
  if (hour >= 8 && hour < 20) {
    const { data: subs } = await admin.from("push_subscriptions").select("id, endpoint, p256dh, auth").eq("user_id", userId);
    // Generic on purpose: no case names or health details on a lock screen.
    const payload = JSON.stringify({
      title: "Take it back",
      body: `You have ${items.length} deadline${items.length === 1 ? "" : "s"} coming up.`,
      url: "/app",
    });
    const gone: string[] = [];
    for (const s of subs ?? []) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 60 * 60 * 12 });
        delivered = true;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) gone.push(s.id);
      }
    }
    if (gone.length) await admin.from("push_subscriptions").delete().in("id", gone);
  }
}
```

A push counts as delivered, so `last_reminded_on` still stops a second nudge the same day.
