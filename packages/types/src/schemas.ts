import { z } from 'zod'

// ─── AUTH ─────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus ada huruf kapital')
    .regex(/[0-9]/, 'Harus ada angka'),
  confirm_password: z.string(),
  referral_code: z.string().optional(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Password tidak cocok',
  path: ['confirm_password'],
})

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid'),
})

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus ada huruf kapital')
    .regex(/[0-9]/, 'Harus ada angka'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Password tidak cocok',
  path: ['confirm_password'],
})

export const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus ada huruf kapital')
    .regex(/[0-9]/, 'Harus ada angka'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Password tidak cocok',
  path: ['confirm_password'],
})

// ─── PROFILE ─────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-z0-9_]+$/, 'Hanya huruf kecil, angka, dan underscore')
    .optional(),
  bio: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
})

// ─── FILES ───────────────────────────────────────────────────

export const UploadFileSchema = z.object({
  file_name: z.string().min(1).max(512),
  mime_type: z.string(),
  size_bytes: z.number().int().positive(),
  folder_id: z.string().uuid().optional().nullable(),
})

export const RenameFileSchema = z.object({
  name: z.string().min(1, 'Nama file wajib diisi').max(512),
})

export const MoveFileSchema = z.object({
  folder_id: z.string().uuid().nullable(),
})

export const BulkFileActionSchema = z.object({
  file_ids: z.array(z.string().uuid()).min(1).max(100),
  action: z.enum(['delete', 'restore', 'move', 'favorite', 'unfavorite']),
  target_folder_id: z.string().uuid().optional().nullable(),
})

// ─── FOLDERS ─────────────────────────────────────────────────

export const CreateFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama folder wajib diisi')
    .max(255, 'Nama folder terlalu panjang')
    .refine((n) => !['..', '.', '/'].includes(n), 'Nama folder tidak valid'),
  parent_id: z.string().uuid().optional().nullable(),
  color: z.string().optional(),
  icon: z.string().optional(),
})

export const RenameFolderSchema = z.object({
  name: z.string().min(1).max(255),
})

// ─── SHARING ─────────────────────────────────────────────────

export const CreateShareSchema = z.object({
  file_id: z.string().uuid().optional(),
  folder_id: z.string().uuid().optional(),
  visibility: z.enum(['shared', 'public']),
  password: z
    .string()
    .min(4, 'Password minimal 4 karakter')
    .max(50)
    .optional()
    .or(z.literal('')),
  expires_in_hours: z.number().int().min(1).max(8760).optional().nullable(), // max 1 year
  max_access_count: z.number().int().min(1).max(10000).optional().nullable(),
  allow_download: z.boolean().default(true),
}).refine(
  (d) => !!(d.file_id || d.folder_id),
  { message: 'Pilih file atau folder yang akan dibagikan' }
)

export const VerifySharePasswordSchema = z.object({
  slug: z.string(),
  password: z.string().min(1),
})

// ─── PAYMENT ─────────────────────────────────────────────────

export const InitiatePaymentSchema = z.object({
  plan_id: z.string().uuid(),
  billing_cycle: z.enum(['monthly', 'yearly']),
  coupon_code: z.string().optional(),
  payment_method: z.enum(['midtrans', 'google_play', 'apple_iap']),
})

export const ValidateCouponSchema = z.object({
  code: z.string().min(1).max(50),
  plan_id: z.string().uuid(),
})

// ─── REPORT ──────────────────────────────────────────────────

export const CreateReportSchema = z.object({
  reported_file_id: z.string().uuid().optional(),
  reported_user_id: z.string().uuid().optional(),
  reason: z.enum(['illegal_content', 'spam', 'copyright', 'malware', 'other']),
  description: z.string().max(1000).optional(),
}).refine(
  (d) => !!(d.reported_file_id || d.reported_user_id),
  { message: 'Pilih file atau user yang dilaporkan' }
)

// ─── SEARCH ──────────────────────────────────────────────────

export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  folder_id: z.string().uuid().optional(),
  mime_category: z.enum(['image', 'video', 'audio', 'document', 'archive', 'other']).optional(),
  sort_by: z.enum(['name', 'created_at', 'size', 'type']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Inferred types
export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type UploadFileInput = z.infer<typeof UploadFileSchema>
export type RenameFileInput = z.infer<typeof RenameFileSchema>
export type MoveFileInput = z.infer<typeof MoveFileSchema>
export type BulkFileActionInput = z.infer<typeof BulkFileActionSchema>
export type CreateFolderInput = z.infer<typeof CreateFolderSchema>
export type RenameFolderInput = z.infer<typeof RenameFolderSchema>
export type CreateShareInput = z.infer<typeof CreateShareSchema>
export type VerifySharePasswordInput = z.infer<typeof VerifySharePasswordSchema>
export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>
export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>
export type CreateReportInput = z.infer<typeof CreateReportSchema>
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>
