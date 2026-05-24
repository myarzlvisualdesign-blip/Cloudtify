-- ============================================================
-- CLOUDTIFY — Migration 006: Share permission (viewer/editor)
-- Adds `permission` to shares so Google Drive style link sharing
-- can distinguish read-only viewers from collaborators.
-- "editor" role is reserved (UI exposes it; write-policy comes later).
-- ============================================================

alter table public.shares
  add column if not exists permission text not null default 'viewer'
    check (permission in ('viewer', 'editor'));

comment on column public.shares.permission is
  'Access level for anon viewers reaching this share by link. viewer = read only; editor = reserved for future write-by-link.';
