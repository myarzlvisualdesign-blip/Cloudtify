'use client'
import { supabase } from './supabase/client'

/** Primary object storage for new uploads. */
export const R2_BUCKET = 'cloudtify-files'

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${token}` }
}

export interface UploadResult {
  key: string
  bucket: string
}

/**
 * Upload a file directly to Cloudflare R2 via a presigned PUT URL.
 * Returns the storage key + bucket to persist into the files table.
 * Body streams straight to R2 — never buffered by our server.
 */
export async function uploadFileToR2(file: File): Promise<UploadResult> {
  const headers = await authHeader()
  const sign = await fetch('/api/upload-sign', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, mimeType: file.type || 'application/octet-stream' }),
  })
  if (!sign.ok) throw new Error('Gagal sign upload (' + sign.status + ')')
  const { uploadUrl, key, bucket, contentType } = (await sign.json()) as {
    uploadUrl: string; key: string; bucket: string; contentType: string
  }
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': contentType },
  })
  if (!put.ok) throw new Error('Gagal upload ke R2 (' + put.status + ')')
  return { key, bucket }
}

/**
 * Get a short-lived URL to view/download a file. Auto-routes between R2
 * (current) and Supabase Storage (legacy files uploaded before the cutover).
 */
export async function getStoredFileUrl(
  file: { r2_key: string; r2_bucket: string | null },
  expiresIn = 600,
): Promise<string> {
  if (file.r2_bucket === R2_BUCKET) {
    const headers = await authHeader()
    const res = await fetch('/api/file-url', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: file.r2_key, expiresIn }),
    })
    if (!res.ok) throw new Error('Gagal generate URL (' + res.status + ')')
    const data = (await res.json()) as { url: string }
    return data.url
  }
  // Legacy: Supabase Storage
  const { data } = await supabase.storage.from(file.r2_bucket || 'files').createSignedUrl(file.r2_key, expiresIn)
  return data?.signedUrl || ''
}

/** Delete a stored object. Routes by bucket. */
export async function deleteStoredFile(file: { r2_key: string; r2_bucket: string | null }): Promise<void> {
  if (file.r2_bucket === R2_BUCKET) {
    const headers = await authHeader()
    await fetch('/api/file-delete', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: file.r2_key }),
    })
    return
  }
  await supabase.storage.from(file.r2_bucket || 'files').remove([file.r2_key])
}
