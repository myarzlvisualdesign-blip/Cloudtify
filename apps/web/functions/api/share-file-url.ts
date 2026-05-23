import { json, corsPreflight } from '../_lib/auth'
import { presignS3 } from '../_lib/sigv4'

// Anonymous endpoint: returns a short-lived signed R2 URL for a file that's
// covered by an active public share. Authorization is handled by Supabase RLS
// (migration 005): anon can only SELECT files reachable via an active share,
// so a successful lookup proves the file is publicly shared.

interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  R2_ACCOUNT_ID: string
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
  R2_BUCKET_NAME: string
}

export const onRequestOptions = () => corsPreflight()

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = (await request.json().catch(() => ({}))) as { fileId?: string }
  if (!body.fileId) return json({ error: 'fileId required' }, 400)

  const lookup = await fetch(
    `${env.SUPABASE_URL}/rest/v1/files?id=eq.${encodeURIComponent(body.fileId)}&select=r2_key,r2_bucket`,
    { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}` } },
  )
  if (!lookup.ok) return json({ error: 'lookup_failed', status: lookup.status }, 500)
  const rows = (await lookup.json()) as { r2_key: string; r2_bucket: string | null }[]
  const file = rows[0]
  if (!file) return json({ error: 'not_found_or_not_shared' }, 404)

  // Only R2-backed files; legacy Supabase Storage files use a different code path.
  if (file.r2_bucket !== env.R2_BUCKET_NAME) {
    return json({ error: 'use_supabase_storage_path', r2_bucket: file.r2_bucket }, 400)
  }

  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET_NAME}/${file.r2_key}`
  const url = await presignS3({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    method: 'GET',
    host,
    path,
    expiresInSeconds: 600,
  })
  return json({ url, expiresIn: 600 })
}
