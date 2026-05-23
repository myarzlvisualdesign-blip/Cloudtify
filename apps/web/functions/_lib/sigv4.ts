/**
 * AWS Signature V4 presigned URL — for S3-compatible storage (Cloudflare R2).
 * Self-contained, uses Web Crypto API. No deps.
 */

const enc = new TextEncoder()

function hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function sha256(input: string | ArrayBuffer): Promise<string> {
  const data = typeof input === 'string' ? enc.encode(input) : new Uint8Array(input)
  return hex(await crypto.subtle.digest('SHA-256', data))
}

async function hmac(key: ArrayBuffer | string, data: string): Promise<ArrayBuffer> {
  const k = typeof key === 'string' ? enc.encode(key) : new Uint8Array(key)
  const cryptoKey = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
}

async function signingKey(secret: string, date: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmac('AWS4' + secret, date)
  const kRegion = await hmac(kDate, region)
  const kService = await hmac(kRegion, service)
  return hmac(kService, 'aws4_request')
}

/** RFC 3986 percent-encoding that matches AWS expectations. */
function uriEncode(s: string, encodeSlash: boolean): string {
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    if (/[A-Za-z0-9_.~-]/.test(c) || (c === '/' && !encodeSlash)) {
      out += c
    } else {
      out += encodeURIComponent(c).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
    }
  }
  return out
}

export interface PresignOptions {
  accessKeyId: string
  secretAccessKey: string
  /** R2 uses "auto" */
  region?: string
  /** "s3" */
  service?: string
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'HEAD'
  /** e.g. "<account_id>.r2.cloudflarestorage.com" */
  host: string
  /** e.g. "/cloudtify-files/userId/timestamp_filename.jpg" — leading slash, no host */
  path: string
  expiresInSeconds: number
  /** Extra signed headers (besides host). Lowercase keys. */
  signedHeaders?: Record<string, string>
  /** Extra query params to include in the signed URL (e.g. partNumber, uploadId, uploads). */
  extraQuery?: Record<string, string>
}

export async function presignS3(opts: PresignOptions): Promise<string> {
  const region = opts.region ?? 'auto'
  const service = opts.service ?? 's3'
  const algorithm = 'AWS4-HMAC-SHA256'
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '')
  const dateStamp = amzDate.slice(0, 8)
  const scope = `${dateStamp}/${region}/${service}/aws4_request`
  const credential = `${opts.accessKeyId}/${scope}`

  const allHeaders: Record<string, string> = { host: opts.host, ...(opts.signedHeaders ?? {}) }
  const signedNames = Object.keys(allHeaders).map((k) => k.toLowerCase()).sort()
  const canonicalHeaders = signedNames
    .map((k) => `${k}:${(allHeaders[Object.keys(allHeaders).find((x) => x.toLowerCase() === k)!] ?? '').trim()}\n`)
    .join('')
  const signedHeadersStr = signedNames.join(';')

  const query: Record<string, string> = {
    'X-Amz-Algorithm': algorithm,
    'X-Amz-Credential': credential,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(opts.expiresInSeconds),
    'X-Amz-SignedHeaders': signedHeadersStr,
    ...(opts.extraQuery ?? {}),
  }
  const canonicalQuery = Object.keys(query)
    .sort()
    .map((k) => `${uriEncode(k, true)}=${uriEncode(query[k], true)}`)
    .join('&')

  // S3-style path: uri-encode every segment except slashes; do NOT double-encode.
  const canonicalUri = uriEncode(opts.path, false)

  const canonicalRequest = [
    opts.method,
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeadersStr,
    'UNSIGNED-PAYLOAD',
  ].join('\n')

  const stringToSign = [algorithm, amzDate, scope, await sha256(canonicalRequest)].join('\n')
  const key = await signingKey(opts.secretAccessKey, dateStamp, region, service)
  const signature = hex(await hmac(key, stringToSign))

  return `https://${opts.host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`
}
