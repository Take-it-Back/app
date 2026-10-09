# Database

The schema lives in the Supabase project (applied via migrations `core_schema`, `owns_case_invoker`, `daily_reminders_cron`).
Tables: profiles, cases, documents, letters, deadlines, events — all with row-level security scoped to the signed-in user.
Storage: private bucket `case-files`, files stored under `<user_id>/<case_id>/…`.
Edge function: `daily-reminders` (pg_cron, 12:45 UTC daily) emails deadline nudges when `RESEND_API_KEY` is set.
