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

  const body = (await request.json().catch(() => ({}))) as {
    uploadId?: string
    key?: string
    parts?: { partNumber: number; etag: string }[]
  }
  if (!body.uploadId || !body.key || !body.parts?.length) return json({ error: 'missing fields' }, 400)
  if (!body.key.startsWith(user.id + '/')) return json({ error: 'forbidden' }, 403)

  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET_NAME}/${body.key}`

  // Build CompleteMultipartUpload XML (parts sorted by partNumber ascending).
  const parts = [...body.parts].sort((a, b) => a.partNumber - b.partNumber)
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<CompleteMultipartUpload>' +
    parts.map((p) => `<Part><PartNumber>${p.partNumber}</PartNumber><ETag>${p.etag}</ETag></Part>`).join('') +
    '</CompleteMultipartUpload>'

  const completeUrl = await presignS3({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    method: 'POST',
    host,
    path,
    expiresInSeconds: 300,
    extraQuery: { uploadId: body.uploadId },
  })
  const res = await fetch(completeUrl, {
    method: 'POST',
    body: xml,
    headers: { 'Content-Type': 'application/xml' },
  })
  if (!res.ok) {
    const t = await res.text()
    return json({ error: 'complete_failed', status: res.status, body: t.slice(0, 400) }, 500)
  }
  return json({ ok: true, key: body.key, bucket: env.R2_BUCKET_NAME })
}
