-- ============================================================
-- CLOUDTIFY — Migration 001: Initial Schema
-- PostgreSQL via Supabase
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";          -- for full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";         -- for composite indexes

-- ─── ENUM TYPES ──────────────────────────────────────────────

CREATE TYPE subscription_plan AS ENUM ('free', 'plus', 'pro', 'ultra');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'grace_period', 'paused');
CREATE TYPE payment_method AS ENUM ('midtrans', 'google_play', 'apple_iap', 'manual');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'expired', 'refunded');
CREATE TYPE file_visibility AS ENUM ('private', 'shared', 'public');
CREATE TYPE share_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE upload_status AS ENUM ('pending', 'uploading', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE notification_type AS ENUM (
  'upload_complete', 'storage_warning', 'subscription_expiring',
  'subscription_expired', 'promotion', 'link_accessed', 'security_alert',
  'referral_accepted', 'payment_success', 'payment_failed'
);
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE report_reason AS ENUM ('illegal_content', 'spam', 'copyright', 'malware', 'other');
CREATE TYPE audit_action AS ENUM (
  'login', 'logout', 'file_upload', 'file_delete', 'file_move', 'file_rename',
  'folder_create', 'folder_delete', 'share_create', 'share_revoke',
  'subscription_upgrade', 'subscription_cancel', 'password_change',
  'account_delete', 'admin_action'
);

-- ─── USERS (extends Supabase auth.users) ─────────────────────

CREATE TABLE public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          TEXT UNIQUE,
  full_name         TEXT,
  avatar_url        TEXT,
  bio               TEXT,
  phone             TEXT,
  country_code      CHAR(2) DEFAULT 'ID',
  locale            TEXT DEFAULT 'id-ID',
  timezone          TEXT DEFAULT 'Asia/Jakarta',
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  is_banned         BOOLEAN NOT NULL DEFAULT FALSE,
  ban_reason        TEXT,
  banned_at         TIMESTAMPTZ,
  referral_code     TEXT UNIQUE DEFAULT UPPER(SUBSTR(MD5(gen_random_uuid()::TEXT), 1, 8)),
  referred_by       UUID REFERENCES public.profiles(id),
  referral_count    INT NOT NULL DEFAULT 0,
  total_referral_bonus_gb INT NOT NULL DEFAULT 0,
  last_seen_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_profiles_referred_by ON public.profiles(referred_by);

-- ─── PLANS ───────────────────────────────────────────────────

CREATE TABLE public.plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              subscription_plan NOT NULL UNIQUE,
  display_name      TEXT NOT NULL,
  description       TEXT,
  storage_gb        INT NOT NULL,
  max_file_size_mb  INT NOT NULL DEFAULT 100,
  max_upload_per_day INT NOT NULL DEFAULT 50,
  max_share_links   INT NOT NULL DEFAULT 5,
  download_speed_mbps INT,              -- NULL = unlimited
  has_ads           BOOLEAN NOT NULL DEFAULT TRUE,
  has_password_share BOOLEAN NOT NULL DEFAULT FALSE,
  has_expiry_share  BOOLEAN NOT NULL DEFAULT FALSE,
  has_private_vault BOOLEAN NOT NULL DEFAULT FALSE,
  has_priority_support BOOLEAN NOT NULL DEFAULT FALSE,
  price_monthly_idr INT NOT NULL DEFAULT 0,
  price_yearly_idr  INT NOT NULL DEFAULT 0,
  price_monthly_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly_usd  NUMERIC(10,2) NOT NULL DEFAULT 0,
  google_product_id TEXT,              -- SKU for Google Play
  apple_product_id  TEXT,              -- SKU for Apple IAP
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default plans seed
INSERT INTO public.plans (name, display_name, description, storage_gb, max_file_size_mb, max_upload_per_day, max_share_links, download_speed_mbps, has_ads, has_password_share, has_expiry_share, has_private_vault, has_priority_support, price_monthly_idr, price_yearly_idr, price_monthly_usd, price_yearly_usd, google_product_id, apple_product_id, sort_order) VALUES
('free',  'Free',  'Gratis selamanya dengan fitur dasar', 15,   50,  20,  3, 5,    TRUE,  FALSE, FALSE, FALSE, FALSE, 0,      0,       0.00,  0.00,  NULL,                         NULL,                         1),
('plus',  'Plus',  'Untuk pelajar dan pengguna aktif',    100,  200, 50,  10, NULL, FALSE, TRUE,  FALSE, FALSE, FALSE, 15000,  120000,  0.99,  8.99,  'cloudtify_plus_monthly',     'cloudtify_plus_monthly',     2),
('pro',   'Pro',   'Untuk profesional dan UMKM',          500,  500, 200, 50, NULL, FALSE, TRUE,  TRUE,  FALSE, FALSE, 35000,  280000,  2.49, 19.99,  'cloudtify_pro_monthly',      'cloudtify_pro_monthly',      3),
('ultra', 'Ultra', 'Untuk power user dan bisnis',         2048, 2048,999, 999,NULL, FALSE, TRUE,  TRUE,  TRUE,  TRUE,  75000,  600000,  4.99, 39.99,  'cloudtify_ultra_monthly',    'cloudtify_ultra_monthly',    4);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────

CREATE TABLE public.subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id           UUID NOT NULL REFERENCES public.plans(id),
  status            subscription_status NOT NULL DEFAULT 'active',
  payment_method    payment_method,
  starts_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  grace_ends_at     TIMESTAMPTZ,
  auto_renew        BOOLEAN NOT NULL DEFAULT TRUE,
  is_trial          BOOLEAN NOT NULL DEFAULT FALSE,
  trial_ends_at     TIMESTAMPTZ,
  google_order_id   TEXT,
  google_token      TEXT,
  apple_receipt     TEXT,
  apple_transaction_id TEXT,
  midtrans_order_id TEXT,
  extra_storage_gb  INT NOT NULL DEFAULT 0,   -- bonus from referrals/promos
  coupon_code       TEXT,
  discount_pct      INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON public.subscriptions(expires_at);

-- View: active subscription per user
CREATE OR REPLACE VIEW public.user_active_subscription AS
SELECT DISTINCT ON (s.user_id)
  s.*,
  p.name AS plan_name,
  p.storage_gb + s.extra_storage_gb AS total_storage_gb,
  p.max_file_size_mb,
  p.has_ads,
  p.has_password_share,
  p.has_expiry_share,
  p.has_private_vault,
  p.download_speed_mbps
FROM public.subscriptions s
JOIN public.plans p ON p.id = s.plan_id
WHERE s.status IN ('active', 'grace_period', 'trial')
  AND (s.expires_at IS NULL OR s.expires_at > NOW() OR s.grace_ends_at > NOW())
ORDER BY s.user_id, s.expires_at DESC NULLS LAST;

-- ─── PAYMENTS ────────────────────────────────────────────────

CREATE TABLE public.payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id   UUID REFERENCES public.subscriptions(id),
  plan_id           UUID NOT NULL REFERENCES public.plans(id),
  method            payment_method NOT NULL,
  status            payment_status NOT NULL DEFAULT 'pending',
  amount_idr        BIGINT,
  amount_usd        NUMERIC(10,2),
  currency          CHAR(3) NOT NULL DEFAULT 'IDR',
  external_id       TEXT,                 -- midtrans order_id / google order id
  external_ref      TEXT,                 -- transaction_id from gateway
  gateway_response  JSONB,                -- full raw response
  billing_cycle     TEXT,                 -- 'monthly' | 'yearly'
  is_renewal        BOOLEAN NOT NULL DEFAULT FALSE,
  description       TEXT,
  paid_at           TIMESTAMPTZ,
  expired_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_external_id ON public.payments(external_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

-- ─── STORAGE USAGE ───────────────────────────────────────────

CREATE TABLE public.storage_usage (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  used_bytes        BIGINT NOT NULL DEFAULT 0,
  file_count        INT NOT NULL DEFAULT 0,
  folder_count      INT NOT NULL DEFAULT 0,
  image_bytes       BIGINT NOT NULL DEFAULT 0,
  video_bytes       BIGINT NOT NULL DEFAULT 0,
  document_bytes    BIGINT NOT NULL DEFAULT 0,
  audio_bytes       BIGINT NOT NULL DEFAULT 0,
  other_bytes       BIGINT NOT NULL DEFAULT 0,
  trash_bytes       BIGINT NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_storage_usage_user_id ON public.storage_usage(user_id);

-- ─── FOLDERS ─────────────────────────────────────────────────

CREATE TABLE public.folders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id         UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  color             TEXT,
  icon              TEXT,
  is_pinned         BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at        TIMESTAMPTZ,
  path              TEXT,               -- materialized path e.g. "/uuid/uuid/uuid"
  depth             INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT folders_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
  CONSTRAINT folders_name_max_length CHECK (LENGTH(name) <= 255),
  CONSTRAINT folders_depth_max CHECK (depth <= 10)
);

CREATE INDEX idx_folders_user_id ON public.folders(user_id);
CREATE INDEX idx_folders_parent_id ON public.folders(parent_id);
CREATE INDEX idx_folders_path ON public.folders USING GIST (path gist_trgm_ops);
CREATE INDEX idx_folders_not_deleted ON public.folders(user_id) WHERE is_deleted = FALSE;

-- ─── FILES ───────────────────────────────────────────────────

CREATE TABLE public.files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  folder_id         UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  original_name     TEXT NOT NULL,
  mime_type         TEXT NOT NULL,
  size_bytes        BIGINT NOT NULL DEFAULT 0,
  r2_key            TEXT NOT NULL UNIQUE,       -- e.g. users/{user_id}/files/{uuid}/{name}
  r2_bucket         TEXT NOT NULL DEFAULT 'cloudtify-files',
  thumbnail_key     TEXT,                        -- R2 key for thumbnail
  checksum_md5      TEXT,
  checksum_sha256   TEXT,
  width             INT,                          -- for images/videos
  height            INT,
  duration_seconds  INT,                          -- for video/audio
  is_favorite       BOOLEAN NOT NULL DEFAULT FALSE,
  visibility        file_visibility NOT NULL DEFAULT 'private',
  is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at        TIMESTAMPTZ,
  permanent_delete_at TIMESTAMPTZ,               -- 30 days after deletion
  encryption_key_id TEXT,                        -- for vault files (Ultra plan)
  metadata          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT files_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
  CONSTRAINT files_name_max_length CHECK (LENGTH(name) <= 512),
  CONSTRAINT files_size_positive CHECK (size_bytes >= 0)
);

CREATE INDEX idx_files_user_id ON public.files(user_id);
CREATE INDEX idx_files_folder_id ON public.files(folder_id);
CREATE INDEX idx_files_r2_key ON public.files(r2_key);
CREATE INDEX idx_files_mime_type ON public.files(mime_type);
CREATE INDEX idx_files_not_deleted ON public.files(user_id, folder_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_files_search ON public.files USING GIN (name gin_trgm_ops) WHERE is_deleted = FALSE;
CREATE INDEX idx_files_created_at ON public.files(user_id, created_at DESC) WHERE is_deleted = FALSE;
CREATE INDEX idx_files_favorites ON public.files(user_id) WHERE is_favorite = TRUE AND is_deleted = FALSE;

-- ─── UPLOADS ─────────────────────────────────────────────────

CREATE TABLE public.uploads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_id           UUID REFERENCES public.files(id),
  folder_id         UUID REFERENCES public.folders(id),
  file_name         TEXT NOT NULL,
  mime_type         TEXT,
  total_size_bytes  BIGINT NOT NULL DEFAULT 0,
  uploaded_bytes    BIGINT NOT NULL DEFAULT 0,
  r2_key            TEXT,
  r2_upload_id      TEXT,               -- multipart upload ID from R2
  status            upload_status NOT NULL DEFAULT 'pending',
  chunk_count       INT NOT NULL DEFAULT 1,
  chunks_uploaded   INT NOT NULL DEFAULT 0,
  error_message     TEXT,
  retry_count       INT NOT NULL DEFAULT 0,
  expires_at        TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX idx_uploads_status ON public.uploads(status);
CREATE INDEX idx_uploads_expires_at ON public.uploads(expires_at);

-- ─── UPLOAD CHUNKS ───────────────────────────────────────────

CREATE TABLE public.upload_chunks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id         UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  chunk_index       INT NOT NULL,
  size_bytes        BIGINT NOT NULL,
  etag              TEXT,
  checksum          TEXT,
  is_uploaded       BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at       TIMESTAMPTZ,
  UNIQUE (upload_id, chunk_index)
);

CREATE INDEX idx_upload_chunks_upload_id ON public.upload_chunks(upload_id);

-- ─── SHARES ──────────────────────────────────────────────────

CREATE TABLE public.shares (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_id           UUID REFERENCES public.files(id) ON DELETE CASCADE,
  folder_id         UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  slug              TEXT NOT NULL UNIQUE DEFAULT LOWER(SUBSTR(MD5(gen_random_uuid()::TEXT), 1, 12)),
  status            share_status NOT NULL DEFAULT 'active',
  visibility        file_visibility NOT NULL DEFAULT 'shared',
  password_hash     TEXT,                 -- bcrypt hash of access password
  expires_at        TIMESTAMPTZ,
  max_access_count  INT,                  -- NULL = unlimited
  access_count      INT NOT NULL DEFAULT 0,
  last_accessed_at  TIMESTAMPTZ,
  allow_download    BOOLEAN NOT NULL DEFAULT TRUE,
  show_metadata     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT shares_file_or_folder CHECK (
    (file_id IS NOT NULL AND folder_id IS NULL) OR
    (file_id IS NULL AND folder_id IS NOT NULL)
  )
);

CREATE INDEX idx_shares_user_id ON public.shares(user_id);
CREATE INDEX idx_shares_slug ON public.shares(slug);
CREATE INDEX idx_shares_file_id ON public.shares(file_id);
CREATE INDEX idx_shares_status ON public.shares(status) WHERE status = 'active';

-- ─── NOTIFICATIONS ───────────────────────────────────────────

CREATE TABLE public.notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type              notification_type NOT NULL,
  title             TEXT NOT NULL,
  body              TEXT NOT NULL,
  data              JSONB,
  is_read           BOOLEAN NOT NULL DEFAULT FALSE,
  read_at           TIMESTAMPTZ,
  sent_via_push     BOOLEAN NOT NULL DEFAULT FALSE,
  push_sent_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;

-- ─── DEVICES (FCM tokens) ────────────────────────────────────

CREATE TABLE public.devices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fcm_token         TEXT NOT NULL,
  platform          TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  device_name       TEXT,
  app_version       TEXT,
  os_version        TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  last_seen_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, fcm_token)
);

CREATE INDEX idx_devices_user_id ON public.devices(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_devices_fcm_token ON public.devices(fcm_token);

-- ─── ACTIVITY LOGS ───────────────────────────────────────────

CREATE TABLE public.activity_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action            audit_action NOT NULL,
  resource_type     TEXT,               -- 'file', 'folder', 'share', 'subscription', etc.
  resource_id       UUID,
  resource_name     TEXT,
  ip_address        INET,
  user_agent        TEXT,
  metadata          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Monthly partitions for activity_logs
CREATE TABLE public.activity_logs_2025 PARTITION OF public.activity_logs
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE public.activity_logs_2026 PARTITION OF public.activity_logs
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action, created_at DESC);

-- ─── REPORTS ─────────────────────────────────────────────────

CREATE TABLE public.reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_file_id  UUID REFERENCES public.files(id) ON DELETE SET NULL,
  reported_user_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason            report_reason NOT NULL,
  description       TEXT,
  status            report_status NOT NULL DEFAULT 'pending',
  reviewed_by       UUID REFERENCES public.profiles(id),
  reviewed_at       TIMESTAMPTZ,
  resolution_note   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_reporter_id ON public.reports(reporter_id);

-- ─── COUPONS ─────────────────────────────────────────────────

CREATE TABLE public.coupons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT NOT NULL UNIQUE,
  description       TEXT,
  discount_pct      INT NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  discount_idr      INT NOT NULL DEFAULT 0,
  max_uses          INT,
  used_count        INT NOT NULL DEFAULT 0,
  valid_from        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until       TIMESTAMPTZ,
  applicable_plans  subscription_plan[],    -- NULL = all plans
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON public.coupons(code) WHERE is_active = TRUE;

-- ─── FEATURE FLAGS ───────────────────────────────────────────

CREATE TABLE public.feature_flags (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key               TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  description       TEXT,
  is_enabled        BOOLEAN NOT NULL DEFAULT FALSE,
  rollout_pct       INT NOT NULL DEFAULT 0 CHECK (rollout_pct BETWEEN 0 AND 100),
  allowed_plans     subscription_plan[],
  metadata          JSONB,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default feature flags
INSERT INTO public.feature_flags (key, name, description, is_enabled, rollout_pct) VALUES
('thumbnail_generation',  'Thumbnail Generation',   'Auto-generate thumbnails for images/videos',  TRUE,  100),
('video_preview',         'Video Preview',          'Stream video preview in app',                 TRUE,  100),
('recycle_bin',           'Recycle Bin',            'Soft-delete with 30-day recovery',            TRUE,  100),
('referral_program',      'Referral Program',       'Earn storage by inviting friends',            TRUE,  100),
('smart_search',          'Smart Search',           'Full-text fuzzy search',                      TRUE,  100),
('private_vault',         'Private Vault',          'Encrypted secret folder (Ultra)',             FALSE, 0),
('desktop_sync',          'Desktop Sync',           'Sync files to desktop client',                FALSE, 0),
('ai_features',           'AI Features',            'AI-powered file organization',                FALSE, 0);

-- ─── APP SETTINGS ────────────────────────────────────────────

CREATE TABLE public.app_settings (
  key               TEXT PRIMARY KEY,
  value             JSONB NOT NULL,
  description       TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.app_settings (key, value, description) VALUES
('maintenance_mode',       'false',                                  'Put app in maintenance mode'),
('max_free_upload_mb',     '50',                                     'Max file size for free users (MB)'),
('trash_retention_days',   '30',                                     'Days before permanent deletion from trash'),
('referral_bonus_gb',      '5',                                      'GB bonus per successful referral'),
('referral_max_bonus_gb',  '50',                                     'Max total referral bonus (GB)'),
('upload_chunk_size_mb',   '10',                                     'Chunk size for chunked uploads (MB)'),
('signed_url_expire_mins', '60',                                     'Minutes before signed download URL expires'),
('allowed_mime_types',     '["image/*","video/*","audio/*","application/pdf","application/zip","application/x-zip-compressed","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","text/plain","text/csv"]', 'Allowed MIME type patterns'),
('blocked_extensions',     '[".exe",".bat",".sh",".cmd",".ps1",".vbs",".js",".jar",".apk"]', 'Blocked file extensions');
