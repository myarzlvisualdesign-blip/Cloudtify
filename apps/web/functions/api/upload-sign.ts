import { verifyUser, json, corsPreflight, type AuthEnv } from '../_lib/auth'
import { presignS3 } from '../_lib/sigv4'

interface Env extends AuthEnv {
  R2_ACCOUNT_ID: string
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
  R2_BUCKET_NAME: string
}

export const onRequestOptions = () => corsPreflight()

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const user = await verifyUser(request, env)
  if (!user) return json({ error: 'unauthorized' }, 401)

  const body = (await request.json().catch(() => ({}))) as { filename?: string; mimeType?: string }
  const safeName = (body.filename || 'file').replace(/[^\w.\-]+/g, '_').slice(0, 180) || 'file'
  const mimeType = body.mimeType || 'application/octet-stream'

  // Per-user folder + random suffix to avoid collisions.
  const key = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}_${safeName}`
  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET_NAME}/${key}`

  // Presigned PUT URL — client uploads directly to R2 with no proxying.
  const uploadUrl = await presignS3({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    method: 'PUT',
    host,
    path,
    expiresInSeconds: 3600,
    signedHeaders: { 'content-type': mimeType },
  })

  return json({
    uploadUrl,
    key,
    bucket: env.R2_BUCKET_NAME,
    contentType: mimeType,
  })
}
