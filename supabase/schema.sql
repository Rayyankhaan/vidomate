-- VidoMate optional schema. The app works without Supabase; these tables only enable the
-- contact form and anonymous usage stats. All access goes through the server-side service role.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null, -- null for anonymous use
  platform text not null,
  media_url text,                                                   -- intentionally left null (privacy)
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

-- RLS on with no public policies: only the service role (server-side) can read or write.
alter table public.profiles enable row level security;
alter table public.analysis_history enable row level security;
alter table public.contact_messages enable row level security;

create index if not exists analysis_history_created_idx on public.analysis_history (created_at desc);
