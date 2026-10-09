# Take it back

Fight unfair medical bills, insurance denials, landlord problems and debt collectors. Snap the letter, get your rights in plain words, send a ready letter, and track every deadline to the finish.

## Stack
Next.js 15 (App Router) · Supabase (auth, Postgres with RLS, private storage, edge functions, pg_cron) · Anthropic API for reading documents and drafting letters · Vercel.

## Environment variables
| Name | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Publishable key |
| `NEXT_PUBLIC_SITE_URL` | Vercel | `https://www.takeitback.app` |
| `ANTHROPIC_API_KEY` | Vercel (server only) | Needed to read documents and write letters. Without it the app still works with templates. |
| `ANTHROPIC_MODEL` | Vercel (optional) | Defaults to `claude-sonnet-5-5` |
| `RESEND_API_KEY` | Supabase edge function secret (optional) | Enables email reminders |

## Develop
```
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Not legal advice: deadline rules in `lib/rules.ts` are plain-language defaults and should be reviewed by a licensed attorney.
