-- BestWording Supabase schema (initial draft)
-- Apply in Supabase SQL editor.

-- 1) Profiles (optional)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_upsert_own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

-- 2) TODO: Add tables for writings/diaries/goals/transcriptions/admin_messages
-- We will migrate from localStorage to DB step-by-step.
