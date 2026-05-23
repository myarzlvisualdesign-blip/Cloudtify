-- ============================================================
-- CLOUDTIFY — Migration 005: Public share (link viewer)
-- Allows anon read of files/folders/storage when an active share covers them.
-- ============================================================

-- Does an active share cover this file (direct file share, or its folder)?
create or replace function public.share_active_for_file(_file_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.shares s
    left join public.files f on f.id = _file_id
    where s.status = 'active'
      and (s.expires_at is null or s.expires_at > now())
      and (
        s.file_id = _file_id
        or (s.folder_id is not null and s.folder_id = f.folder_id)
      )
  );
$$;

-- Does an active share cover this folder?
create or replace function public.share_active_for_folder(_folder_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.shares s
    where s.status = 'active'
      and (s.expires_at is null or s.expires_at > now())
      and s.folder_id = _folder_id
  );
$$;

-- RLS policies (idempotent).
do $$
begin
  if not exists (select 1 from pg_policy where polname = 'ct_shares_read_active') then
    create policy ct_shares_read_active on public.shares for select to anon
      using (status = 'active' and (expires_at is null or expires_at > now()));
  end if;
  if not exists (select 1 from pg_policy where polname = 'ct_files_read_shared') then
    create policy ct_files_read_shared on public.files for select to anon
      using (public.share_active_for_file(id));
  end if;
  if not exists (select 1 from pg_policy where polname = 'ct_folders_read_shared') then
    create policy ct_folders_read_shared on public.folders for select to anon
      using (public.share_active_for_folder(id));
  end if;
  -- Allow anon to download the underlying storage object when a share covers the file.
  if not exists (select 1 from pg_policy where polname = 'ct_files_storage_shared') then
    create policy ct_files_storage_shared on storage.objects for select to anon
      using (
        bucket_id = 'files'
        and exists (
          select 1 from public.files f
          where f.r2_key = storage.objects.name
            and public.share_active_for_file(f.id)
        )
      );
  end if;
end $$;
