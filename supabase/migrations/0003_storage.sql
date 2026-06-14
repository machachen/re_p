-- ============================================================================
-- BPM Intelligence — 0003 Storage buckets + policies
-- Run AFTER 0002. Two PRIVATE buckets.
--   documents            : path 'documents/<client_id>/<file>'        admin writes, members read
--   request-attachments  : path '<client_id>/<user_id>/<file>'        members write, owner/admin read
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('request-attachments', 'request-attachments', false)
on conflict (id) do nothing;

-- documents bucket ------------------------------------------------------------
drop policy if exists "documents read" on storage.objects;
create policy "documents read" on storage.objects
  for select using (
    bucket_id = 'documents' and (
      public.is_admin()
      or (split_part(name, '/', 1))::uuid in
         (select client_id from public.memberships where user_id = auth.uid())
    )
  );

drop policy if exists "documents admin insert" on storage.objects;
create policy "documents admin insert" on storage.objects
  for insert with check (bucket_id = 'documents' and public.is_admin());

drop policy if exists "documents admin update" on storage.objects;
create policy "documents admin update" on storage.objects
  for update using (bucket_id = 'documents' and public.is_admin());

drop policy if exists "documents admin delete" on storage.objects;
create policy "documents admin delete" on storage.objects
  for delete using (bucket_id = 'documents' and public.is_admin());

-- request-attachments bucket --------------------------------------------------
drop policy if exists "req-att insert" on storage.objects;
create policy "req-att insert" on storage.objects
  for insert with check (
    bucket_id = 'request-attachments' and
    (split_part(name, '/', 1))::uuid in
      (select client_id from public.memberships where user_id = auth.uid())
  );

drop policy if exists "req-att read" on storage.objects;
create policy "req-att read" on storage.objects
  for select using (
    bucket_id = 'request-attachments' and (
      public.is_admin()
      or (split_part(name, '/', 2))::uuid = auth.uid()
    )
  );

drop policy if exists "req-att admin delete" on storage.objects;
create policy "req-att admin delete" on storage.objects
  for delete using (bucket_id = 'request-attachments' and public.is_admin());
