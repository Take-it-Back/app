# Runbooks

## Deploy
Push to `main`. Vercel builds and deploys production automatically; CI (type check, audit, build) runs on the same push and the site check runs after the deploy. Database changes go through Supabase migrations first (see below), and must work with both the old and new app code during the switch.

## Roll back the web app
Vercel dashboard → Project → Deployments → pick the last good deployment → **Instant Rollback**. Takes seconds and doesn't rebuild. Then revert the bad commit in git so the next push doesn't bring it back.

## Turn a feature off quickly
Most outside services switch off when their setting is removed in Vercel (Settings → Environment Variables) and the project is redeployed: `ANTHROPIC_API_KEY` (reading/letters fall back to templates), `STRIPE_SECRET_KEY` (payments show "not switched on"), `LOB_API_KEY` / `TELNYX_API_KEY` (mail/fax), `APNS_*` (iPhone alerts). The iPhone app loads the website, so web fixes reach it without an App Store release.

## Database changes
Write a migration, apply it to Supabase, then deploy code that uses it. Add columns and functions before code needs them; remove them only after no deployed code uses them. Any column people can edit needs `grant update (column) on public.<table> to authenticated`, and columns that decide money, ownership or access must never be granted.

## Backups and restore
Confirm the Supabase plan includes daily backups (Pro) and turn on point-in-time recovery for user data. Restore test: Supabase → Database → Backups → restore into a **new** project, sign in with a test account and open a case and a file. Record the date and how long it took here.
Targets to agree: acceptable data loss (suggest ≤ 24 h now, ≤ 5 min with point-in-time recovery) and time to recover (suggest ≤ 4 h).
| Date | What was restored | Result | Time |
| --- | --- | --- | --- |
| (not yet tested) | | | |

## Incidents
1. Check `/api/health` and the admin page (errors, failed AI reads, stuck cases).
2. Vercel → Logs (runtime errors) and Supabase → Logs (API, auth, functions).
3. Roll back if a deploy caused it; switch off the affected service if an outside provider is failing.
4. For anything involving personal or health data, follow `docs/breach-response.md`.
5. Write down what happened, the cause and the fix.

## Keys and rotation
Keys live only in Vercel env, Supabase function secrets and GitHub secrets (never in the repo). Rotate a key by creating the new one with the provider, updating it in Vercel, redeploying, then revoking the old one. The Supabase Apple sign-in secret expires every 6 months and is renewed monthly by `.github/workflows/apple-auth-secret.yml`.

## Mobile releases
GitHub → Actions → "iPhone app" → Run workflow. The build lands in TestFlight; test it there before submitting. Because the app loads the website, most fixes don't need a new build; native changes (plugins, permissions, icon) do. Keep the backend working with the previous app version for at least 30 days after a new one ships.
