import { headers } from "next/headers";

/** Both apps add this to their browser user agent (see capacitor.config.ts). */
export const APP_UA = "TakeItBackApp";

/** "ios" or "android" when the page is loaded inside the Take it back app, otherwise null. Server only. */
export async function appPlatform(): Promise<"ios" | "android" | null> {
  const ua = (await headers()).get("user-agent") || "";
  if (!ua.includes(APP_UA)) return null;
  return /Android/i.test(ua) ? "android" : "ios";
}

/** True when the page is being loaded inside the Take it back app (iPhone or Android). Server only. */
export async function isAppRequest() {
  return (await appPlatform()) !== null;
}
