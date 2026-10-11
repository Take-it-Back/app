-- Web push subscriptions: one row per browser/device that turned on phone alerts.
-- Not applied automatically. Run in the Supabase SQL editor or as a migration.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;


create policy "Own push subscriptions: select" on public.push_subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);


create policy "Own push subscriptions: insert" on public.push_subscriptions
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- Needed so re-subscribing the same device (upsert on endpoint) can refresh its keys.

create policy "Own push subscriptions: update" on public.push_subscriptions
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);


create policy "Own push subscriptions: delete" on public.push_subscriptions
  for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.push_subscriptions from anon;
grant select, insert, update, delete on public.push_subscriptions to authenticated;
