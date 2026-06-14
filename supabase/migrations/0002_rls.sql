-- ============================================================================
-- BPM Intelligence — 0002 Row-Level Security
-- Run AFTER 0001. Defines who can read/write each table.
--   admin : full access to everything
--   user  : read only their client's PUBLISHED data; create their own requests
-- ============================================================================

-- Helper functions (security definer => can read profiles/memberships safely) --
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.has_client_access(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
      or exists (select 1 from public.memberships m
                 where m.user_id = auth.uid() and m.client_id = cid);
$$;

-- Enable RLS ------------------------------------------------------------------
alter table public.clients            enable row level security;
alter table public.profiles           enable row level security;
alter table public.memberships        enable row level security;
alter table public.assets             enable row level security;
alter table public.periods            enable row level security;
alter table public.portfolio_data     enable row level security;
alter table public.asset_section_data enable row level security;
alter table public.documents          enable row level security;
alter table public.requests           enable row level security;

-- clients ---------------------------------------------------------------------
drop policy if exists clients_select on public.clients;
create policy clients_select on public.clients
  for select using (public.has_client_access(id));
drop policy if exists clients_admin on public.clients;
create policy clients_admin on public.clients
  for all using (public.is_admin()) with check (public.is_admin());

-- profiles --------------------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_admin on public.profiles;
create policy profiles_admin on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- memberships -----------------------------------------------------------------
drop policy if exists memberships_select on public.memberships;
create policy memberships_select on public.memberships
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists memberships_admin on public.memberships;
create policy memberships_admin on public.memberships
  for all using (public.is_admin()) with check (public.is_admin());

-- assets ----------------------------------------------------------------------
drop policy if exists assets_select on public.assets;
create policy assets_select on public.assets
  for select using (public.has_client_access(client_id));
drop policy if exists assets_admin on public.assets;
create policy assets_admin on public.assets
  for all using (public.is_admin()) with check (public.is_admin());

-- periods (users see only published) ------------------------------------------
drop policy if exists periods_select on public.periods;
create policy periods_select on public.periods
  for select using (public.has_client_access(client_id) and (published or public.is_admin()));
drop policy if exists periods_admin on public.periods;
create policy periods_admin on public.periods
  for all using (public.is_admin()) with check (public.is_admin());

-- portfolio_data (client access + period published, unless admin) -------------
drop policy if exists portfolio_data_select on public.portfolio_data;
create policy portfolio_data_select on public.portfolio_data
  for select using (
    public.has_client_access(client_id)
    and (public.is_admin() or exists (
      select 1 from public.periods p where p.id = period_id and p.published
    ))
  );
drop policy if exists portfolio_data_admin on public.portfolio_data;
create policy portfolio_data_admin on public.portfolio_data
  for all using (public.is_admin()) with check (public.is_admin());

-- asset_section_data ----------------------------------------------------------
drop policy if exists asd_select on public.asset_section_data;
create policy asd_select on public.asset_section_data
  for select using (
    exists (select 1 from public.assets a
            where a.id = asset_id and public.has_client_access(a.client_id))
    and (public.is_admin() or exists (
      select 1 from public.periods p where p.id = period_id and p.published
    ))
  );
drop policy if exists asd_admin on public.asset_section_data;
create policy asd_admin on public.asset_section_data
  for all using (public.is_admin()) with check (public.is_admin());

-- documents -------------------------------------------------------------------
drop policy if exists documents_select on public.documents;
create policy documents_select on public.documents
  for select using (public.has_client_access(client_id));
drop policy if exists documents_admin on public.documents;
create policy documents_admin on public.documents
  for all using (public.is_admin()) with check (public.is_admin());

-- requests (users create + read their own; admins read/resolve all) -----------
drop policy if exists requests_insert on public.requests;
create policy requests_insert on public.requests
  for insert with check (created_by = auth.uid() and public.has_client_access(client_id));
drop policy if exists requests_select on public.requests;
create policy requests_select on public.requests
  for select using (created_by = auth.uid() or public.is_admin());
drop policy if exists requests_update on public.requests;
create policy requests_update on public.requests
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists requests_delete on public.requests;
create policy requests_delete on public.requests
  for delete using (public.is_admin());
