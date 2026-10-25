import type { CapacitorConfig } from "@capacitor/cli";

// The iPhone app loads the live app from takeitback.app, so every website update reaches the app
// without a new App Store release. Native features (Apple payments, alerts, Face ID, scanner,
// calendar) are reached through Capacitor plugins. mobile-shell/ holds the offline fallback page.
const config: CapacitorConfig = {
  appId: "app.takeitback",
  appName: "Take it back",
  webDir: "mobile-shell",
  server: {
    url: "https://www.takeitback.app/app",
    errorPath: "index.html",
    // Pages that stay inside the app instead of opening Safari (mail/fax checkout, Supabase auth).
    allowNavigation: ["takeitback.app", "www.takeitback.app", "checkout.stripe.com", "*.supabase.co"],
  },
  ios: {
    appendUserAgent: "TakeItBackApp/1",
    contentInset: "never",
    backgroundColor: "#F6F4EF",
    limitsNavigationsToAppBoundDomains: false,
  },
  plugins: {
    SplashScreen: { launchShowDuration: 3000, launchAutoHide: true, backgroundColor: "#F6F4EF", showSpinner: false },
    PushNotifications: { presentationOptions: ["banner", "sound", "list"] },
    StatusBar: { style: "LIGHT", overlaysWebView: true },
  },
};

export default config;
