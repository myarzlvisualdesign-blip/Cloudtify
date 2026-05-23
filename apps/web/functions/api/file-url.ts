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

  const body = (await request.json().catch(() => ({}))) as { key?: string; expiresIn?: number }
  const key = body.key
  if (!key) return json({ error: 'key required' }, 400)
  // RLS-equivalent: object key must be under the user's own folder.
  if (!key.startsWith(user.id + '/')) return json({ error: 'forbidden' }, 403)

  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET_NAME}/${key}`
  const expires = Math.min(Math.max(body.expiresIn ?? 600, 60), 86400)

  const url = await presignS3({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    method: 'GET',
    host,
    path,
    expiresInSeconds: expires,
  })

  return json({ url, expiresIn: expires })
}
