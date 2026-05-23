/**
 * Verify a Supabase user JWT by asking Supabase's auth service.
 * Returns user.id on success, or null if the token is missing/invalid/expired.
 */
export interface AuthEnv {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

export async function verifyUser(req: Request, env: AuthEnv): Promise<{ id: string; email?: string } | null> {
  const authz = req.headers.get('Authorization') || req.headers.get('authorization')
  if (!authz || !authz.toLowerCase().startsWith('bearer ')) return null
  const jwt = authz.slice(7).trim()
  if (!jwt) return null

  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: env.SUPABASE_ANON_KEY,
    },
  })
  if (!res.ok) return null
  const data = (await res.json()) as { id?: string; email?: string } | null
  if (!data?.id) return null
  return { id: data.id, email: data.email }
}

export function json(data: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'Authorization, Content-Type, apikey',
      'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
      ...extraHeaders,
    },
  })
}

export function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'Authorization, Content-Type, apikey',
      'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
      'access-control-max-age': '86400',
    },
  })
}
