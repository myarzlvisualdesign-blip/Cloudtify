-- ============================================================
-- CLOUDTIFY — Migration 004: Storage bucket + RLS
-- Real file upload via Supabase Storage (works with static export)
-- ============================================================
-- The "files" bucket is created via the Storage API (private, 50 MB cap):
--   POST /storage/v1/bucket { id:"files", public:false, file_size_limit:52428800 }
-- Objects are stored under  {user_id}/{timestamp}_{filename}
-- so each user is sandboxed to their own top-level folder.

-- Per-user access on storage.objects (first path segment must equal the uid).
do $$
begin
  if not exists (select 1 from pg_policy where polname = 'ct_files_insert') then
    create policy ct_files_insert on storage.objects for insert to authenticated
      with check (bucket_id = 'files' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policy where polname = 'ct_files_select') then
    create policy ct_files_select on storage.objects for select to authenticated
      using (bucket_id = 'files' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policy where polname = 'ct_files_delete') then
    create policy ct_files_delete on storage.objects for delete to authenticated
      using (bucket_id = 'files' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;

-- NB: inserting a row into public.files fires trg_files_storage_sync →
-- sync_storage_usage(), which keeps public.storage_usage accurate automatically.
