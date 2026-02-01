-- BestWording Supabase schema (v1)
-- Apply in Supabase SQL editor.

-- Extensions
create extension if not exists pgcrypto;

-- 1) Profiles (optional)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_upsert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

-- 2) Writings
create table if not exists public.writings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content text not null,
  genre text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.writings enable row level security;

drop policy if exists "writings_select_own" on public.writings;
drop policy if exists "writings_insert_own" on public.writings;
drop policy if exists "writings_update_own" on public.writings;
drop policy if exists "writings_delete_own" on public.writings;

create policy "writings_select_own" on public.writings
for select using (auth.uid() = user_id);

create policy "writings_insert_own" on public.writings
for insert with check (auth.uid() = user_id);

create policy "writings_update_own" on public.writings
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "writings_delete_own" on public.writings
for delete using (auth.uid() = user_id);

-- 3) Diaries
create table if not exists public.diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  content text not null,
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.diaries enable row level security;

drop policy if exists "diaries_select_own" on public.diaries;
drop policy if exists "diaries_insert_own" on public.diaries;
drop policy if exists "diaries_update_own" on public.diaries;
drop policy if exists "diaries_delete_own" on public.diaries;

create policy "diaries_select_own" on public.diaries
for select using (auth.uid() = user_id);

create policy "diaries_insert_own" on public.diaries
for insert with check (auth.uid() = user_id);

create policy "diaries_update_own" on public.diaries
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "diaries_delete_own" on public.diaries
for delete using (auth.uid() = user_id);

-- 4) Goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  target_date date not null,
  progress int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_progress_range check (progress >= 0 and progress <= 100)
);

alter table public.goals enable row level security;

drop policy if exists "goals_select_own" on public.goals;
drop policy if exists "goals_insert_own" on public.goals;
drop policy if exists "goals_update_own" on public.goals;
drop policy if exists "goals_delete_own" on public.goals;

create policy "goals_select_own" on public.goals
for select using (auth.uid() = user_id);

create policy "goals_insert_own" on public.goals
for insert with check (auth.uid() = user_id);

create policy "goals_update_own" on public.goals
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "goals_delete_own" on public.goals
for delete using (auth.uid() = user_id);

-- 5) Transcriptions
create table if not exists public.transcriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  original_text text not null,
  transcribed_text text not null,
  reflection text not null default '',
  created_at timestamptz not null default now()
);

alter table public.transcriptions enable row level security;

drop policy if exists "transcriptions_select_own" on public.transcriptions;
drop policy if exists "transcriptions_insert_own" on public.transcriptions;
drop policy if exists "transcriptions_update_own" on public.transcriptions;
drop policy if exists "transcriptions_delete_own" on public.transcriptions;

create policy "transcriptions_select_own" on public.transcriptions
for select using (auth.uid() = user_id);

create policy "transcriptions_insert_own" on public.transcriptions
for insert with check (auth.uid() = user_id);

create policy "transcriptions_update_own" on public.transcriptions
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transcriptions_delete_own" on public.transcriptions
for delete using (auth.uid() = user_id);

-- 6) Admin messages
create table if not exists public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  user_name text,
  user_email text,
  title text not null,
  content text not null,
  is_read boolean not null default false,
  admin_reply text,
  admin_reply_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_messages enable row level security;

drop policy if exists "admin_messages_select_own" on public.admin_messages;
drop policy if exists "admin_messages_insert_any_logged_in" on public.admin_messages;
drop policy if exists "admin_messages_update_own" on public.admin_messages;
drop policy if exists "admin_messages_delete_own" on public.admin_messages;

-- Users: can see their own messages. Admin will need a service-role endpoint later for all.
create policy "admin_messages_select_own" on public.admin_messages
for select using (auth.uid() = user_id);

-- Logged-in user can insert a message with their user_id
create policy "admin_messages_insert_any_logged_in" on public.admin_messages
for insert with check (auth.uid() = user_id);

-- Users can update/delete their own message (admin reply handled later via service role)
create policy "admin_messages_update_own" on public.admin_messages
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "admin_messages_delete_own" on public.admin_messages
for delete using (auth.uid() = user_id);
