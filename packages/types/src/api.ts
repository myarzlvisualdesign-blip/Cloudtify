import type { CloudFile, Folder, Share, Notification, Upload } from './models'

// ─── GENERIC RESPONSE ────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  code: string
  details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
  has_more: boolean
}

// ─── FILE ENDPOINTS ──────────────────────────────────────────

export interface UploadInitResponse {
  upload_id: string
  upload_url: string           // pre-signed PUT URL for single upload
  multipart_upload_id?: string // for chunked uploads
  r2_key: string
  expires_at: string
}

export interface UploadChunkRequest {
  upload_id: string
  chunk_index: number
  total_chunks: number
  part_url: string
}

export interface UploadCompleteRequest {
  upload_id: string
  parts?: Array<{ part_number: number; etag: string }>
}

export interface FileListResponse extends PaginatedResponse<CloudFile> {
  folder?: Folder
  breadcrumbs: Array<{ id: string; name: string }>
}

export interface FileDownloadResponse {
  download_url: string
  expires_at: string
  file_name: string
  size_bytes: number
}

export interface ThumbnailResponse {
  thumbnail_url: string
  expires_at: string
}

// ─── SHARE ENDPOINTS ─────────────────────────────────────────

export interface SharePageResponse {
  share: Share
  file?: CloudFile
  folder?: Folder
  requires_password: boolean
  is_expired: boolean
  can_download: boolean
}

// ─── PAYMENT ENDPOINTS ───────────────────────────────────────

export interface MidtransTokenResponse {
  token: string
  redirect_url: string
  order_id: string
  payment_id: string
}

export interface SubscriptionStatusResponse {
  is_active: boolean
  plan_name: string
  expires_at: string | null
  storage_gb: number
  used_bytes: number
  used_percent: number
}

// ─── NOTIFICATION ENDPOINTS ──────────────────────────────────

export interface NotificationListResponse extends PaginatedResponse<Notification> {
  unread_count: number
}

// ─── UPLOAD QUEUE (client-side) ──────────────────────────────

export interface UploadQueueItem {
  id: string
  file: File | { name: string; size: number; type: string; uri: string }
  folder_id: string | null
  status: 'queued' | 'uploading' | 'processing' | 'done' | 'error' | 'cancelled'
  progress: number
  upload?: Upload
  error?: string
  created_at: number
}

// ─── ANALYTICS EVENTS ────────────────────────────────────────

export type AnalyticsEvent =
  | { event: 'app_open'; properties: { platform: string; version: string } }
  | { event: 'onboarding_complete'; properties: Record<string, never> }
  | { event: 'signup_complete'; properties: { method: 'email' | 'google' | 'apple'; referral?: string } }
  | { event: 'login_success'; properties: { method: string } }
  | { event: 'upload_started'; properties: { file_count: number; total_size_bytes: number } }
  | { event: 'upload_success'; properties: { file_id: string; size_bytes: number; duration_ms: number } }
  | { event: 'upload_failed'; properties: { error: string; retry_count: number } }
  | { event: 'file_shared'; properties: { has_password: boolean; has_expiry: boolean } }
  | { event: 'pricing_viewed'; properties: Record<string, never> }
  | { event: 'subscription_started'; properties: { plan: string; billing_cycle: string } }
  | { event: 'subscription_success'; properties: { plan: string; amount_idr: number; method: string } }
  | { event: 'subscription_cancelled'; properties: { plan: string; reason?: string } }
  | { event: 'storage_limit_reached'; properties: { used_bytes: number; limit_bytes: number } }
  | { event: 'referral_shared'; properties: { code: string } }
  | { event: 'referral_accepted'; properties: { referrer_id: string } }
  | { event: 'file_deleted'; properties: { count: number } }
  | { event: 'file_restored'; properties: { count: number } }
  | { event: 'support_opened'; properties: Record<string, never> }
