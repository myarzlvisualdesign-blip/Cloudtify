// ─── ERROR CODES ─────────────────────────────────────────────

export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS:   'Terjadi kesalahan.',
  EMAIL_NOT_VERIFIED:    'Email belum diverifikasi. Cek inbox kamu.',
  SESSION_EXPIRED:       'Sesi kamu telah habis. Silakan login ulang.',
  ACCOUNT_BANNED:        'Akun kamu telah dinonaktifkan. Hubungi support.',
  INVALID_TOKEN:         'Token tidak valid atau sudah kadaluarsa.',

  // File
  FILE_TOO_LARGE:        'Ukuran file melebihi batas paket kamu.',
  UNSUPPORTED_FILE_TYPE: 'Tipe file ini tidak didukung.',
  UPLOAD_INTERRUPTED:    'Upload terputus. Silakan coba lagi.',
  UPLOAD_QUOTA_EXCEEDED: 'Storage kamu penuh. Upgrade paket untuk ruang lebih.',
  FILE_NOT_FOUND:        'File tidak ditemukan.',
  PERMISSION_DENIED:     'Kamu tidak punya akses ke file ini.',

  // Share
  SHARE_LINK_EXPIRED:    'Link berbagi ini sudah kadaluarsa.',
  SHARE_WRONG_PASSWORD:  'Password salah.',
  SHARE_ACCESS_LIMIT:    'Batas akses link ini sudah tercapai.',
  SHARE_NOT_FOUND:       'Link berbagi tidak ditemukan.',

  // Payment
  PAYMENT_FAILED:        'Pembayaran gagal. Coba metode pembayaran lain.',
  SUBSCRIPTION_EXPIRED:  'Langganan kamu sudah habis. Perpanjang sekarang.',
  COUPON_INVALID:        'Kode kupon tidak valid atau sudah kadaluarsa.',
  COUPON_PLAN_MISMATCH:  'Kode kupon ini tidak berlaku untuk paket yang dipilih.',

  // Network
  NETWORK_OFFLINE:       'Tidak ada koneksi internet. Periksa jaringan kamu.',
  SERVER_ERROR:          'Terjadi gangguan pada server. Silakan coba beberapa saat lagi.',
  REQUEST_TIMEOUT:       'Permintaan timeout. Periksa koneksi internet kamu.',

  // Generic
  UNKNOWN_ERROR:         'Terjadi kesalahan. Silakan coba lagi.',
} as const

export type ErrorCode = keyof typeof ERROR_CODES

export class CloudtifyError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly technical?: string,
    public readonly recoveryAction?: string
  ) {
    super(ERROR_CODES[code])
    this.name = 'CloudtifyError'
  }

  get userMessage(): string {
    return ERROR_CODES[this.code]
  }
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.toLowerCase().includes('offline')
    )
  }
  return false
}

export function parseSupabaseError(error: { message?: string; code?: string }): CloudtifyError {
  const msg = error.message?.toLowerCase() ?? ''
  const code = error.code ?? ''

  if (msg.includes('invalid login credentials')) return new CloudtifyError('INVALID_CREDENTIALS')
  if (msg.includes('email not confirmed')) return new CloudtifyError('EMAIL_NOT_VERIFIED')
  if (msg.includes('jwt expired') || code === 'PGRST301') return new CloudtifyError('SESSION_EXPIRED')
  if (msg.includes('row-level security')) return new CloudtifyError('PERMISSION_DENIED')

  return new CloudtifyError('UNKNOWN_ERROR', error.message)
}

export function getRecoveryAction(code: ErrorCode): string | undefined {
  const actions: Partial<Record<ErrorCode, string>> = {
    UPLOAD_QUOTA_EXCEEDED:  'Upgrade Plan',
    SESSION_EXPIRED:        'Login Ulang',
    EMAIL_NOT_VERIFIED:     'Kirim Ulang Email',
    SUBSCRIPTION_EXPIRED:   'Perpanjang Sekarang',
    PAYMENT_FAILED:         'Coba Lagi',
    UPLOAD_INTERRUPTED:     'Coba Upload Ulang',
  }
  return actions[code]
}
