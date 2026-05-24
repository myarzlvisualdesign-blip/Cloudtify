-- Recreate avatar storage policies with explicit `TO authenticated` so that
-- `auth.uid()` resolves correctly for browser uploads. The previous policies
-- defaulted to PUBLIC role which silently returned NULL auth.uid().
drop policy if exists ct_avatars_insert on storage.objects;
drop policy if exists ct_avatars_update on storage.objects;
drop policy if exists ct_avatars_delete on storage.objects;
drop policy if exists ct_avatars_select on storage.objects;

create policy ct_avatars_select on storage.objects
  for select using (bucket_id = 'avatars');

create policy ct_avatars_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy ct_avatars_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy ct_avatars_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
