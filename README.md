# Take it back

Fight unfair medical bills, insurance denials, landlord problems and debt collectors. Snap the letter, get your rights in plain words, send a ready letter, and track every deadline to the finish.

## How it fits together
- **Web app:** Next.js 15 (App Router) on Vercel, region pdx1. Public site plus the signed-in app under `/app`.
- **Data:** Supabase project `uzogyqreputvggefnxiy` (us-west-2): Postgres with row-level security on every user table, the private `case-files` storage bucket, email auth (Apple and Google sign-in appear once switched on), the `daily-reminders` edge function, pg_cron jobs (reminders 18:30 UTC, stuck-scan release every 15 min).
- **Trust boundary:** the browser talks to Next.js (server actions, `/api/*`) which talks to Supabase **as the signed-in person**. Row-level security and column grants are the access control. Billing, case passes and mail/fax status are changed only through database functions that check `BILLING_SECRET`; there is no service-role key in the web app except for forwarded email.
- **Outside services:** Anthropic (reading and letters), Stripe (web payments), Apple (in-app purchases, push, Sign in with Apple), Google (sign-in, analytics on public pages), Resend (email), Twilio (texts), Lob and Telnyx (mail and fax), Postmark (forwarded bills).
- **iPhone app:** Capacitor shell that loads the live site (`ios/`, see `docs/ios-app.md`). Android is not built yet.

## Develop
```
npm install
cp .env.example .env.local   # every setting is documented there
npm run dev
```

## Checks
- `npx tsc --noEmit` and `npm run build` run in CI on every push (`.github/workflows/ci.yml`).
- `npm run smoke` checks the live site's public pages, protections and `/api/health`. It runs after each deploy and every 30 minutes (`site-check.yml`).
- `npm run test:e2e` runs the full user journey against the live site with "ZZ test" data (needs `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` and Playwright).

## Operations
See `docs/runbooks.md` for deploys, rollback, database changes, backups and incidents, and `docs/breach-response.md` for data incidents.

Not legal advice: deadline rules in `lib/rules.ts` and `lib/state-law/` are plain-language defaults and should be reviewed by a licensed attorney.
