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

  const body = (await request.json().catch(() => ({}))) as { key?: string }
  const key = body.key
  if (!key) return json({ error: 'key required' }, 400)
  if (!key.startsWith(user.id + '/')) return json({ error: 'forbidden' }, 403)

  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET_NAME}/${key}`

  // We presign a DELETE URL and execute it from the function — R2 needs a signed
  // request to remove the object. The credentials never leave the function.
  const deleteUrl = await presignS3({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    method: 'DELETE',
    host,
    path,
    expiresInSeconds: 60,
  })
  const res = await fetch(deleteUrl, { method: 'DELETE' })
  if (!res.ok && res.status !== 404) return json({ error: 'r2_delete_failed', status: res.status }, 500)
  return json({ ok: true })
}
