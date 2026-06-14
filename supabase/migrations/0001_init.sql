-- ============================================================================
-- BPM Intelligence — 0001 init schema
-- Multi-tenant report platform. Run in Supabase SQL editor (or `supabase db push`).
-- ============================================================================
create extension if not exists pgcrypto;

-- Tenants ---------------------------------------------------------------------
create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique,
  created_at timestamptz not null default now()
);

-- One row per auth user (role lives here) -------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now()
);

-- Which users can see which clients (admins see all, regardless) ---------------
create table if not exists public.memberships (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  client_id  uuid not null references public.clients(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);

-- Assets ----------------------------------------------------------------------
create table if not exists public.assets (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.clients(id) on delete cascade,
  code          text not null,                 -- e.g. 'asset-001' (used in URLs)
  name          text not null,
  type          text,
  location      text,
  ownership_meta text,
  status        text,
  status_color  text,
  sort_order    int default 0,
  created_at    timestamptz not null default now(),
  unique (client_id, code)
);

-- Reporting periods (monthly), draft until published --------------------------
create table if not exists public.periods (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.clients(id) on delete cascade,
  period       text not null,                  -- e.g. '2026-05'
  label        text,                           -- e.g. '2026年5月'
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (client_id, period)
);

-- Portfolio-level report blob (mirrors portfolio.json) ------------------------
create table if not exists public.portfolio_data (
  client_id  uuid not null references public.clients(id) on delete cascade,
  period_id  uuid not null references public.periods(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (client_id, period_id)
);

-- Per-asset, per-section report blob (mirrors the section JSON files) ----------
create table if not exists public.asset_section_data (
  asset_id   uuid not null references public.assets(id) on delete cascade,
  period_id  uuid not null references public.periods(id) on delete cascade,
  section    text not null check (section in
              ('overview','ownership-capital','financial','risk','operations','documents','market')),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (asset_id, period_id, section)
);

-- Uploaded documents (files live in Storage; this is the index) ---------------
create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  asset_id    uuid references public.assets(id) on delete set null,
  period_id   uuid references public.periods(id) on delete set null,
  title       text not null,
  category    text,
  doc_type    text,
  storage_path text not null,                  -- documents/<client_id>/<file>
  size_bytes  bigint,
  uploaded_by uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

-- User -> admin requests ------------------------------------------------------
create table if not exists public.requests (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.clients(id) on delete cascade,
  created_by      uuid not null references public.profiles(id) on delete cascade,
  subject         text not null,
  message         text,
  attachment_path text,
  status          text not null default 'open' check (status in ('open','closed')),
  created_at      timestamptz not null default now(),
  resolved_at     timestamptz,
  resolved_by     uuid references public.profiles(id)
);

-- Indexes ---------------------------------------------------------------------
create index if not exists idx_memberships_client on public.memberships (client_id);
create index if not exists idx_assets_client      on public.assets (client_id);
create index if not exists idx_periods_client_pub on public.periods (client_id, published);
create index if not exists idx_asd_period         on public.asset_section_data (period_id);
create index if not exists idx_documents_client   on public.documents (client_id);
create index if not exists idx_requests_client_st on public.requests (client_id, status);

-- Auto-create a profile row whenever an auth user is created ------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
