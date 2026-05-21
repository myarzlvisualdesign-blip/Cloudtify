// ─── PLAN LIMITS ─────────────────────────────────────────────

export const PLAN_STORAGE_GB = {
  free:  15,
  plus:  100,
  pro:   500,
  ultra: 2048,
} as const

export const PLAN_MAX_FILE_MB = {
  free:  50,
  plus:  200,
  pro:   500,
  ultra: 2048,
} as const

export const PLAN_PRICE_IDR_MONTHLY = {
  free:  0,
  plus:  15_000,
  pro:   35_000,
  ultra: 75_000,
} as const

export const PLAN_PRICE_IDR_YEARLY = {
  free:  0,
  plus:  120_000,
  pro:   280_000,
  ultra: 600_000,
} as const

// ─── FILE LIMITS ─────────────────────────────────────────────

export const MAX_CHUNK_SIZE_BYTES = 10 * 1024 * 1024     // 10 MB
export const MIN_MULTIPART_SIZE_BYTES = 5 * 1024 * 1024  // 5 MB (R2 minimum)
export const SIGNED_URL_EXPIRY_SECONDS = 3600             // 1 hour
export const TRASH_RETENTION_DAYS = 30
export const MAX_FOLDER_DEPTH = 10
export const MAX_BULK_ACTION_COUNT = 100

// ─── ALLOWED FILE TYPES ──────────────────────────────────────

export const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/'] as const

export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_PREFIXES,
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
] as const

export const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.sh', '.cmd', '.ps1', '.vbs',
  '.js', '.jar', '.apk', '.msi', '.dll', '.sys',
] as const

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic', '.heif']
export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp']
export const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a']
export const DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv']

// ─── R2 PATHS ────────────────────────────────────────────────

export const R2_PATHS = {
  userFile: (userId: string, uploadId: string, fileName: string) =>
    `users/${userId}/files/${uploadId}/${fileName}`,
  thumbnail: (userId: string, fileId: string) =>
    `users/${userId}/thumbnails/${fileId}.webp`,
  avatar: (userId: string) =>
    `users/${userId}/avatar/avatar.webp`,
} as const

// ─── APP LIMITS ──────────────────────────────────────────────

export const MAX_UPLOAD_CONCURRENT = 3
export const UPLOAD_RETRY_MAX = 3
export const UPLOAD_RETRY_DELAY_MS = 2000
export const REFERRAL_BONUS_GB = 5
export const REFERRAL_MAX_BONUS_GB = 50

// ─── PAGINATION ──────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// ─── SHARE ───────────────────────────────────────────────────

export const SHARE_URL_PREFIX = 'https://cloudtify.com/s'
export const MAX_SHARE_PASSWORD_LENGTH = 50
export const MAX_SHARE_ACCESS_COUNT = 10_000
export const MAX_SHARE_EXPIRY_HOURS = 8760  // 1 year

// ─── STORAGE WARNINGS ────────────────────────────────────────

export const STORAGE_WARNING_PCT = 80
export const STORAGE_CRITICAL_PCT = 95
