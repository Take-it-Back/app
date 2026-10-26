"use client";
// Small helpers for code that only runs inside the iPhone app. Plugins are loaded on demand,
// so people using the website never download them.

type CapWindow = { Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string } };

export function nativePlatform(): "ios" | "android" | null {
  if (!isNativeApp()) return null;
  return (window as unknown as CapWindow).Capacitor?.getPlatform?.() === "android" ? "android" : "ios";
}

export function isNativeApp() {
  if (typeof window === "undefined") return false;
  return Boolean((window as unknown as CapWindow).Capacitor?.isNativePlatform?.());
}

export async function haptic(kind: "light" | "success" | "warning" = "light") {
  if (!isNativeApp()) return;
  try {
    const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");
    if (kind === "light") await Haptics.impact({ style: ImpactStyle.Light });
    else await Haptics.notification({ type: kind === "success" ? NotificationType.Success : NotificationType.Warning });
  } catch {}
}

/** Opens a link in Safari's in-app sheet (keeps the person in the app). */
export async function openInSheet(url: string) {
  if (!isNativeApp()) {
    window.open(url, "_blank", "noopener");
    return;
  }
  const { Browser } = await import("@capacitor/browser");
  await Browser.open({ url, presentationStyle: "popover" });
}
