-- Optional thumbnail key for video (and large image) files. Generated client-side
-- at upload time from a local Blob URL (no CORS issues) and stored alongside
-- the source file as `<srcKey>.thumb.jpg`.
alter table public.files
  add column if not exists thumb_key text;
