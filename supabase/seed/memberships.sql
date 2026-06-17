-- ============================================================================
-- BPM Intelligence — client logins  (run AFTER creating the two auth users)
--
-- STEP 1 — create the users in Supabase (reliable, 30 seconds each):
--   Authentication -> Users -> "Add user" -> tick "Auto Confirm User":
--     che2000@gmail.com   password 88888888    (Chen family)
--     tsai2000@gmail.com  password 88888888    (Tsai family)
--   A profile row is created automatically by the on_auth_user_created trigger.
--
-- STEP 2 — run this file to scope each login to its own client.
--   RLS then shows each user only their client's data. Idempotent; safe to re-run.
-- ============================================================================

insert into public.memberships (user_id, client_id)
  select u.id, c.id
  from auth.users u, public.clients c
  where u.email = 'che2000@gmail.com' and c.slug = 'chen-family'
  on conflict do nothing;

insert into public.memberships (user_id, client_id)
  select u.id, c.id
  from auth.users u, public.clients c
  where u.email = 'tsai2000@gmail.com' and c.slug = 'tsai-family'
  on conflict do nothing;

-- sanity check (optional): should list both memberships
-- select u.email, cl.slug from public.memberships m
--   join auth.users u on u.id = m.user_id
--   join public.clients cl on cl.id = m.client_id
--   order by cl.slug;
