-- ============================================================
-- CLOUDTIFY — Migration 003: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings  ENABLE ROW LEVEL SECURITY;

-- ─── HELPER: is current user an admin? ───────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ─── PROFILES ────────────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "profiles: read own" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

-- Users can read basic profile of file sharers (for share pages)
CREATE POLICY "profiles: read public" ON public.profiles
  FOR SELECT USING (TRUE);   -- limited to username + avatar only (handled at app level)

-- Users can update their own profile
CREATE POLICY "profiles: update own" ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND is_banned = FALSE);

-- Admin can manage all profiles
CREATE POLICY "profiles: admin full" ON public.profiles
  FOR ALL USING (public.is_admin());

-- ─── PLANS ───────────────────────────────────────────────────

-- Anyone can read active plans
CREATE POLICY "plans: public read" ON public.plans
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

-- Only admin can modify
CREATE POLICY "plans: admin write" ON public.plans
  FOR ALL USING (public.is_admin());

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────

CREATE POLICY "subscriptions: read own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "subscriptions: insert own" ON public.subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions: update own" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "subscriptions: admin full" ON public.subscriptions
  FOR ALL USING (public.is_admin());

-- ─── PAYMENTS ────────────────────────────────────────────────

CREATE POLICY "payments: read own" ON public.payments
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "payments: insert own" ON public.payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ─── STORAGE USAGE ───────────────────────────────────────────

CREATE POLICY "storage_usage: read own" ON public.storage_usage
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Only functions can update storage_usage (SECURITY DEFINER)
CREATE POLICY "storage_usage: no direct write" ON public.storage_usage
  FOR ALL USING (public.is_admin());

-- ─── FOLDERS ─────────────────────────────────────────────────

CREATE POLICY "folders: read own" ON public.folders
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "folders: insert own" ON public.folders
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

CREATE POLICY "folders: update own" ON public.folders
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "folders: delete own" ON public.folders
  FOR DELETE USING (user_id = auth.uid());

-- ─── FILES ───────────────────────────────────────────────────

-- Users can read their own files (including deleted for trash view)
CREATE POLICY "files: read own" ON public.files
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Users can read files that are in active shares (checked at app level)
-- This policy is permissive — access control for shared files is done
-- at the Edge Function layer with signed URLs, not at DB level

CREATE POLICY "files: insert own" ON public.files
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = TRUE
    )
  );

CREATE POLICY "files: update own" ON public.files
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "files: delete own" ON public.files
  FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- ─── UPLOADS ─────────────────────────────────────────────────

CREATE POLICY "uploads: read own" ON public.uploads
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "uploads: insert own" ON public.uploads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "uploads: update own" ON public.uploads
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "uploads: delete own" ON public.uploads
  FOR DELETE USING (user_id = auth.uid());

-- ─── SHARES ──────────────────────────────────────────────────

-- Owner can read their shares
CREATE POLICY "shares: read own" ON public.shares
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Anyone can read active shares by slug (for share page)
CREATE POLICY "shares: read by slug" ON public.shares
  FOR SELECT USING (status = 'active');

CREATE POLICY "shares: insert own" ON public.shares
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "shares: update own" ON public.shares
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "shares: delete own" ON public.shares
  FOR DELETE USING (user_id = auth.uid());

-- ─── NOTIFICATIONS ───────────────────────────────────────────

CREATE POLICY "notifications: read own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "notifications: update own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Only server/admin can insert notifications
CREATE POLICY "notifications: admin insert" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin());

-- ─── DEVICES ─────────────────────────────────────────────────

CREATE POLICY "devices: manage own" ON public.devices
  FOR ALL USING (user_id = auth.uid() OR public.is_admin());

-- ─── ACTIVITY LOGS ───────────────────────────────────────────

CREATE POLICY "activity_logs: read own" ON public.activity_logs
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Only SECURITY DEFINER functions can write
CREATE POLICY "activity_logs: server insert" ON public.activity_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- ─── REPORTS ─────────────────────────────────────────────────

CREATE POLICY "reports: insert" ON public.reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "reports: read own" ON public.reports
  FOR SELECT USING (reporter_id = auth.uid() OR public.is_admin());

CREATE POLICY "reports: admin full" ON public.reports
  FOR ALL USING (public.is_admin());

-- ─── COUPONS ─────────────────────────────────────────────────

-- Public can check if a coupon is valid (read only active)
CREATE POLICY "coupons: public read active" ON public.coupons
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "coupons: admin full" ON public.coupons
  FOR ALL USING (public.is_admin());

-- ─── FEATURE FLAGS ───────────────────────────────────────────

CREATE POLICY "feature_flags: public read" ON public.feature_flags
  FOR SELECT USING (TRUE);

CREATE POLICY "feature_flags: admin write" ON public.feature_flags
  FOR ALL USING (public.is_admin());

-- ─── APP SETTINGS ────────────────────────────────────────────

CREATE POLICY "app_settings: public read" ON public.app_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "app_settings: admin write" ON public.app_settings
  FOR ALL USING (public.is_admin());
