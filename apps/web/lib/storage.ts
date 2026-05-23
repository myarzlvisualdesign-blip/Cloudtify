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

/** Files larger than this use multipart upload (resumable, parallel parts). */
const MULTIPART_THRESHOLD = 100 * 1024 * 1024 // 100 MB

/**
 * Upload a file directly to Cloudflare R2. Auto-switches to multipart for
 * files >100MB. Body streams straight to R2 — never buffered by our server.
 */
export async function uploadFileToR2(file: File, onProgress?: (loaded: number, total: number) => void): Promise<UploadResult> {
  if (file.size > MULTIPART_THRESHOLD) return uploadMultipart(file, onProgress)
  return uploadSinglePut(file, onProgress)
}

async function uploadSinglePut(file: File, onProgress?: (loaded: number, total: number) => void): Promise<UploadResult> {
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
  const put = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
  if (!put.ok) throw new Error('Gagal upload ke R2 (' + put.status + ')')
  onProgress?.(file.size, file.size)
  return { key, bucket }
}

async function uploadMultipart(file: File, onProgress?: (loaded: number, total: number) => void): Promise<UploadResult> {
  const headers = await authHeader()
  // 1. Initiate
  const initRes = await fetch('/api/upload-multipart-init', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, mimeType: file.type || 'application/octet-stream', size: file.size }),
  })
  if (!initRes.ok) throw new Error('Multipart init gagal (' + initRes.status + ')')
  const init = (await initRes.json()) as {
    uploadId: string; key: string; bucket: string; partSize: number
    partUrls: { partNumber: number; url: string }[]
  }

  // 2. Upload parts sequentially (so we can show progress + fail fast).
  const parts: { partNumber: number; etag: string }[] = []
  let uploaded = 0
  for (const p of init.partUrls) {
    const start = (p.partNumber - 1) * init.partSize
    const end = Math.min(start + init.partSize, file.size)
    const chunk = file.slice(start, end)
    const res = await fetch(p.url, { method: 'PUT', body: chunk })
    if (!res.ok) throw new Error(`Part ${p.partNumber} gagal (${res.status})`)
    const etag = res.headers.get('etag') || res.headers.get('ETag') || ''
    if (!etag) throw new Error(`Part ${p.partNumber} tidak ada ETag (CORS exposeHeaders?)`)
    parts.push({ partNumber: p.partNumber, etag })
    uploaded += chunk.size
    onProgress?.(uploaded, file.size)
  }

  // 3. Complete
  const done = await fetch('/api/upload-multipart-complete', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId: init.uploadId, key: init.key, parts }),
  })
  if (!done.ok) throw new Error('Multipart complete gagal (' + done.status + ')')
  return { key: init.key, bucket: init.bucket }
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

/**
 * Anonymous (no auth) signed URL for a file inside a public share.
 * Routes R2-backed files through /api/share-file-url; Supabase Storage files
 * fall back to supabase.storage which honors anon RLS for shared files.
 */
export async function getSharedFileUrl(file: { id?: string; r2_key: string; r2_bucket: string | null }): Promise<string> {
  if (file.r2_bucket === R2_BUCKET) {
    if (!file.id) return ''
    const res = await fetch('/api/share-file-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId: file.id }),
    })
    if (!res.ok) return ''
    const data = (await res.json()) as { url: string }
    return data.url
  }
  const { data } = await supabase.storage.from(file.r2_bucket || 'files').createSignedUrl(file.r2_key, 600)
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
