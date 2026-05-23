import { verifyUser, json, corsPreflight, type AuthEnv } from '../_lib/auth'
import { presignS3 } from '../_lib/sigv4'

interface Env extends AuthEnv {
  R2_ACCOUNT_ID: string
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
  R2_BUCKET_NAME: string
}

const PART_SIZE = 8 * 1024 * 1024 // 8 MB per part (S3 minimum is 5 MB)

export const onRequestOptions = () => corsPreflight()

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const user = await verifyUser(request, env)
  if (!user) return json({ error: 'unauthorized' }, 401)

  const body = (await request.json().catch(() => ({}))) as { filename?: string; mimeType?: string; size?: number }
  const safeName = (body.filename || 'file').replace(/[^\w.\-]+/g, '_').slice(0, 180) || 'file'
  const mimeType = body.mimeType || 'application/octet-stream'
  const size = body.size ?? 0
  if (size <= 0) return json({ error: 'size required' }, 400)

  const key = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}_${safeName}`
  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET_NAME}/${key}`

  // 1) Initiate multipart upload — server-side fetch of a presigned POST.
  const initUrl = await presignS3({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    method: 'POST',
    host,
    path,
    expiresInSeconds: 300,
    extraQuery: { uploads: '' },
  })
  const initRes = await fetch(initUrl, { method: 'POST' })
  if (!initRes.ok) {
    const errText = await initRes.text()
    return json({ error: 'initiate_failed', status: initRes.status, body: errText.slice(0, 300) }, 500)
  }
  const initXml = await initRes.text()
  const uploadId = /<UploadId>([^<]+)<\/UploadId>/.exec(initXml)?.[1]
  if (!uploadId) return json({ error: 'no_upload_id', body: initXml.slice(0, 300) }, 500)

  // 2) Presign one PUT URL per part. Client uploads each chunk directly to R2.
  const partCount = Math.ceil(size / PART_SIZE)
  const partUrls: { partNumber: number; url: string }[] = []
  for (let i = 1; i <= partCount; i++) {
    const url = await presignS3({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      method: 'PUT',
      host,
      path,
      expiresInSeconds: 3600,
      extraQuery: { partNumber: String(i), uploadId },
    })
    partUrls.push({ partNumber: i, url })
  }

  return json({
    uploadId,
    key,
    bucket: env.R2_BUCKET_NAME,
    contentType: mimeType,
    partSize: PART_SIZE,
    partUrls,
  })
}
