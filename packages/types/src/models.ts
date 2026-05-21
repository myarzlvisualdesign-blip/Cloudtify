import type {
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentMethod,
  PaymentStatus,
  FileVisibility,
  ShareStatus,
  UploadStatus,
  NotificationType,
  ReportStatus,
  ReportReason,
  AuditAction,
} from './enums'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  country_code: string
  locale: string
  timezone: string
  is_verified: boolean
  is_banned: boolean
  ban_reason: string | null
  banned_at: string | null
  referral_code: string
  referred_by: string | null
  referral_count: number
  total_referral_bonus_gb: number
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: SubscriptionPlan
  display_name: string
  description: string | null
  storage_gb: number
  max_file_size_mb: number
  max_upload_per_day: number
  max_share_links: number
  download_speed_mbps: number | null
  has_ads: boolean
  has_password_share: boolean
  has_expiry_share: boolean
  has_private_vault: boolean
  has_priority_support: boolean
  price_monthly_idr: number
  price_yearly_idr: number
  price_monthly_usd: number
  price_yearly_usd: number
  google_product_id: string | null
  apple_product_id: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  plan?: Plan
  status: SubscriptionStatus
  payment_method: PaymentMethod | null
  starts_at: string
  expires_at: string | null
  cancelled_at: string | null
  grace_ends_at: string | null
  auto_renew: boolean
  is_trial: boolean
  trial_ends_at: string | null
  extra_storage_gb: number
  coupon_code: string | null
  discount_pct: number
  created_at: string
  updated_at: string
}

export interface UserActiveSubscription extends Subscription {
  plan_name: SubscriptionPlan
  total_storage_gb: number
  max_file_size_mb: number
  has_ads: boolean
  has_password_share: boolean
  has_expiry_share: boolean
  has_private_vault: boolean
  download_speed_mbps: number | null
}

export interface StorageUsage {
  id: string
  user_id: string
  used_bytes: number
  file_count: number
  folder_count: number
  image_bytes: number
  video_bytes: number
  document_bytes: number
  audio_bytes: number
  other_bytes: number
  trash_bytes: number
  updated_at: string
}

export interface Folder {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  color: string | null
  icon: string | null
  is_pinned: boolean
  is_deleted: boolean
  deleted_at: string | null
  path: string | null
  depth: number
  created_at: string
  updated_at: string
  children?: Folder[]
  file_count?: number
}

export interface CloudFile {
  id: string
  user_id: string
  folder_id: string | null
  name: string
  original_name: string
  mime_type: string
  size_bytes: number
  r2_key: string
  r2_bucket: string
  thumbnail_key: string | null
  checksum_md5: string | null
  width: number | null
  height: number | null
  duration_seconds: number | null
  is_favorite: boolean
  visibility: FileVisibility
  is_deleted: boolean
  deleted_at: string | null
  permanent_delete_at: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  download_url?: string
  thumbnail_url?: string
}

export interface Upload {
  id: string
  user_id: string
  file_id: string | null
  folder_id: string | null
  file_name: string
  mime_type: string | null
  total_size_bytes: number
  uploaded_bytes: number
  r2_key: string | null
  r2_upload_id: string | null
  status: UploadStatus
  chunk_count: number
  chunks_uploaded: number
  error_message: string | null
  retry_count: number
  expires_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  progress?: number
}

export interface Share {
  id: string
  user_id: string
  file_id: string | null
  folder_id: string | null
  slug: string
  status: ShareStatus
  visibility: FileVisibility
  has_password: boolean
  expires_at: string | null
  max_access_count: number | null
  access_count: number
  last_accessed_at: string | null
  allow_download: boolean
  show_metadata: boolean
  created_at: string
  updated_at: string
  share_url?: string
  file?: CloudFile
  folder?: Folder
}

export interface Payment {
  id: string
  user_id: string
  subscription_id: string | null
  plan_id: string
  method: PaymentMethod
  status: PaymentStatus
  amount_idr: number | null
  amount_usd: number | null
  currency: string
  external_id: string | null
  external_ref: string | null
  billing_cycle: string | null
  is_renewal: boolean
  description: string | null
  paid_at: string | null
  expired_at: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface Device {
  id: string
  user_id: string
  fcm_token: string
  platform: 'ios' | 'android'
  device_name: string | null
  app_version: string | null
  os_version: string | null
  is_active: boolean
  last_seen_at: string
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: AuditAction
  resource_type: string | null
  resource_id: string | null
  resource_name: string | null
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_file_id: string | null
  reported_user_id: string | null
  reason: ReportReason
  description: string | null
  status: ReportStatus
  reviewed_by: string | null
  reviewed_at: string | null
  resolution_note: string | null
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  description: string | null
  discount_pct: number
  discount_idr: number
  max_uses: number | null
  used_count: number
  valid_from: string
  valid_until: string | null
  applicable_plans: SubscriptionPlan[] | null
  is_active: boolean
  created_at: string
}

export interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string | null
  is_enabled: boolean
  rollout_pct: number
  allowed_plans: SubscriptionPlan[] | null
  metadata: Record<string, unknown> | null
  updated_at: string
}
