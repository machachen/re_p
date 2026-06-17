-- ============================================================================
-- BPM Intelligence — grant admin role
--
-- masa.c@oosga.com is your existing account, so there's nothing to create —
-- just run this to give it the admin role. Admins see EVERY client via RLS
-- (is_admin), so no membership row is needed. Idempotent; safe to re-run.
--
-- (Only if the account somehow doesn't exist yet: Authentication -> Users ->
--  Add user, tick "Auto Confirm User", then run this.)
-- ============================================================================

update public.profiles
  set role = 'admin'
  where id = (select id from auth.users where email = 'masa.c@oosga.com');

-- verify (optional): should show your email with role = admin
-- select u.email, p.role from public.profiles p
--   join auth.users u on u.id = p.id where u.email = 'masa.c@oosga.com';
