# iPhone app

The iPhone app is a Capacitor 8 shell (`ios/`, `capacitor.config.ts`) that loads https://www.takeitback.app/app.
Web deploys reach the app instantly; only native changes (plugins, Info.plist, icon) need a new App Store build.

- The app appends `TakeItBackApp/1` to its user agent. Server code checks it with `isAppRequest()` (lib/appContext.ts);
  client code uses `isNativeApp()` (lib/native.ts). Plugins are imported dynamically so the website never loads them.
- `components/NativeBridge.tsx` (root layout): universal links, notification taps, Face ID lock, status bar,
  once-per-launch push token refresh and Apple subscription re-check.
- Payments: in the app, `/app/upgrade` shows `ApplePlans` (StoreKit 2 via @capgo/native-purchases, appAccountToken = user id).
  `/api/apple/verify` checks the signed transaction against Apple's roots (lib/appleRoots.ts) and calls
  `billing_apply_apple`. `/api/apple/notifications` handles App Store Server Notifications v2.
  Product IDs: lib/appleProducts.ts. Stripe and Apple never overwrite each other's active subscription.
- Push: `device_tokens` table, `/api/push/device`, lib/apns.ts (token-based APNs). `sendPushToSelf` sends to web push and APNs.
- Universal links: app/.well-known/apple-app-site-association (needs APPLE_TEAM_ID).
- Apple/Google sign-in: components/SocialSignIn.tsx (web: Supabase OAuth; app: @capgo/capacitor-social-login + signInWithIdToken).
  Buttons show when the provider is on in Supabase (lib/authProviders.ts). Apple tokens are revoked on account deletion (lib/appleSignin.ts).
  The Supabase Apple secret is renewed monthly by .github/workflows/apple-auth-secret.yml.

## Env (Vercel)
APPLE_TEAM_ID, APPLE_APP_ID (numeric, enables Production receipt checks), APNS_KEY_ID, APNS_TEAM_ID, APNS_PRIVATE_KEY
(the .p8 text), optional APPLE_BUNDLE_ID (default app.takeitback), APNS_SANDBOX=1 only for Xcode debug builds,
NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID, NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID (also a GitHub variable of the same name for the iPhone build).

## Build
`npx cap sync ios` after changing plugins or capacitor.config.ts. Releases: GitHub Actions → "iPhone app" →
Run workflow (secrets APPLE_TEAM_ID, ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8). On a Mac: `npx cap open ios`.
Icon and splash come from mobile-assets/app-icon.svg and public/icon.svg.
