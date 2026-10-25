import { headers } from "next/headers";

/** The iPhone app adds this to its browser user agent (see capacitor.config.ts). */
export const APP_UA = "TakeItBackApp";

/** True when the page is being loaded inside the Take it back iPhone app. Server only. */
export async function isAppRequest() {
  return ((await headers()).get("user-agent") || "").includes(APP_UA);
}
