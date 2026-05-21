-- ============================================================
-- CLOUDTIFY — Migration 002: Functions & Triggers
-- ============================================================

-- ─── AUTO-UPDATE updated_at ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at      BEFORE UPDATE ON public.profiles      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_files_updated_at         BEFORE UPDATE ON public.files         FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_folders_updated_at       BEFORE UPDATE ON public.folders       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_uploads_updated_at       BEFORE UPDATE ON public.uploads       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_shares_updated_at        BEFORE UPDATE ON public.shares        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_plans_updated_at         BEFORE UPDATE ON public.plans         FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_payments_updated_at      BEFORE UPDATE ON public.payments      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _username TEXT;
BEGIN
  -- Generate username from email
  _username := SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTR(NEW.id::TEXT, 1, 6);
  _username := REGEXP_REPLACE(LOWER(_username), '[^a-z0-9_]', '', 'g');

  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    _username
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create storage_usage record
  INSERT INTO public.storage_usage (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Assign free plan subscription
  INSERT INTO public.subscriptions (user_id, plan_id, status, expires_at)
  SELECT NEW.id, p.id, 'active', NULL
  FROM public.plans p
  WHERE p.name = 'free'
  LIMIT 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── STORAGE USAGE SYNC ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.sync_storage_usage()
RETURNS TRIGGER AS $$
DECLARE
  _delta_bytes BIGINT;
  _mime TEXT;
BEGIN
  IF TG_OP = 'INSERT' AND NOT NEW.is_deleted THEN
    _delta_bytes := NEW.size_bytes;
    _mime := NEW.mime_type;

    UPDATE public.storage_usage SET
      used_bytes    = used_bytes + _delta_bytes,
      file_count    = file_count + 1,
      image_bytes   = image_bytes   + CASE WHEN _mime LIKE 'image/%' THEN _delta_bytes ELSE 0 END,
      video_bytes   = video_bytes   + CASE WHEN _mime LIKE 'video/%' THEN _delta_bytes ELSE 0 END,
      document_bytes= document_bytes+ CASE WHEN _mime IN ('application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document') THEN _delta_bytes ELSE 0 END,
      audio_bytes   = audio_bytes   + CASE WHEN _mime LIKE 'audio/%' THEN _delta_bytes ELSE 0 END,
      other_bytes   = other_bytes   + CASE WHEN _mime NOT LIKE 'image/%' AND _mime NOT LIKE 'video/%' AND _mime NOT LIKE 'audio/%' AND _mime NOT IN ('application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document') THEN _delta_bytes ELSE 0 END,
      updated_at    = NOW()
    WHERE user_id = NEW.user_id;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle soft delete
    IF NOT OLD.is_deleted AND NEW.is_deleted THEN
      UPDATE public.storage_usage SET
        used_bytes  = GREATEST(0, used_bytes - NEW.size_bytes),
        file_count  = GREATEST(0, file_count - 1),
        trash_bytes = trash_bytes + NEW.size_bytes,
        updated_at  = NOW()
      WHERE user_id = NEW.user_id;
    -- Handle restore from trash
    ELSIF OLD.is_deleted AND NOT NEW.is_deleted THEN
      UPDATE public.storage_usage SET
        used_bytes  = used_bytes + NEW.size_bytes,
        file_count  = file_count + 1,
        trash_bytes = GREATEST(0, trash_bytes - NEW.size_bytes),
        updated_at  = NOW()
      WHERE user_id = NEW.user_id;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    -- Hard delete (permanent delete from trash)
    UPDATE public.storage_usage SET
      trash_bytes = GREATEST(0, trash_bytes - OLD.size_bytes),
      updated_at  = NOW()
    WHERE user_id = OLD.user_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_files_storage_sync
  AFTER INSERT OR UPDATE OR DELETE ON public.files
  FOR EACH ROW EXECUTE FUNCTION public.sync_storage_usage();

-- ─── FOLDER PATH MAINTENANCE ─────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_folder_path()
RETURNS TRIGGER AS $$
DECLARE
  _parent_path TEXT;
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path  := '/' || NEW.id::TEXT;
    NEW.depth := 0;
  ELSE
    SELECT path, depth INTO _parent_path, NEW.depth
    FROM public.folders
    WHERE id = NEW.parent_id AND user_id = NEW.user_id;

    IF _parent_path IS NULL THEN
      RAISE EXCEPTION 'Parent folder not found or not owned by user';
    END IF;

    NEW.path  := _parent_path || '/' || NEW.id::TEXT;
    NEW.depth := NEW.depth + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_folders_set_path
  BEFORE INSERT OR UPDATE OF parent_id ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.update_folder_path();

-- ─── SHARE ACCESS COUNTER ────────────────────────────────────

CREATE OR REPLACE FUNCTION public.increment_share_access(p_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.shares SET
    access_count     = access_count + 1,
    last_accessed_at = NOW()
  WHERE slug = p_slug AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── CHECK STORAGE QUOTA ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.check_storage_quota(
  p_user_id UUID,
  p_file_size BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
  _used_bytes     BIGINT;
  _total_bytes    BIGINT;
BEGIN
  SELECT su.used_bytes INTO _used_bytes
  FROM public.storage_usage su
  WHERE su.user_id = p_user_id;

  SELECT (uas.total_storage_gb * 1073741824) INTO _total_bytes
  FROM public.user_active_subscription uas
  WHERE uas.user_id = p_user_id;

  RETURN (_used_bytes + p_file_size) <= _total_bytes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── EXPIRE SHARES ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.expire_old_shares()
RETURNS VOID AS $$
BEGIN
  UPDATE public.shares
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── PERMANENT DELETE FROM TRASH ─────────────────────────────

CREATE OR REPLACE FUNCTION public.purge_expired_trash()
RETURNS INT AS $$
DECLARE
  _deleted_count INT;
BEGIN
  -- Mark files for permanent deletion after 30 days in trash
  WITH purged AS (
    DELETE FROM public.files
    WHERE is_deleted = TRUE
      AND permanent_delete_at < NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO _deleted_count FROM purged;

  RETURN _deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── SOFT DELETE FILE (sets permanent_delete_at) ─────────────

CREATE OR REPLACE FUNCTION public.soft_delete_file(
  p_file_id UUID,
  p_user_id UUID
) RETURNS VOID AS $$
DECLARE
  _retention_days INT;
BEGIN
  SELECT (value::TEXT)::INT INTO _retention_days
  FROM public.app_settings WHERE key = 'trash_retention_days';

  _retention_days := COALESCE(_retention_days, 30);

  UPDATE public.files
  SET
    is_deleted         = TRUE,
    deleted_at         = NOW(),
    permanent_delete_at = NOW() + (_retention_days || ' days')::INTERVAL
  WHERE id = p_file_id AND user_id = p_user_id AND is_deleted = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── SUBSCRIPTION GRACE PERIOD TRIGGER ───────────────────────

CREATE OR REPLACE FUNCTION public.handle_subscription_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- When subscription expires, start 3-day grace period
  IF OLD.status = 'active' AND NEW.expires_at < NOW() THEN
    NEW.status        := 'grace_period';
    NEW.grace_ends_at := NOW() + INTERVAL '3 days';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_subscription_grace_period
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_expiry();

-- ─── LOG ACTIVITY ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id      UUID,
  p_action       audit_action,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id  UUID DEFAULT NULL,
  p_resource_name TEXT DEFAULT NULL,
  p_metadata     JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, resource_name, metadata)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_resource_name, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
