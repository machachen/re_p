-- ============================================================================
-- BPM Intelligence — admin login  (run AFTER creating the admin auth user)
--
-- STEP 1 — create the admin user in Supabase:
--   Authentication -> Users -> "Add user" -> tick "Auto Confirm User":
--     admin2000@gmail.com   password 88888888
--
-- STEP 2 — run this to grant the admin role. Admins see EVERY client via RLS
--   (is_admin), so no membership row is needed. Idempotent; safe to re-run.
-- ============================================================================

update public.profiles
  set role = 'admin'
  where id = (select id from auth.users where email = 'admin2000@gmail.com');

-- verify (optional): should show admin2000 with role = admin
-- select email, role from public.profiles p join auth.users u on u.id = p.id
--   where u.email = 'admin2000@gmail.com';
