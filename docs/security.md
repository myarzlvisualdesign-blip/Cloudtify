# Cloudtify — Security Checklist

## Authentication Security
- [x] Supabase JWT with 1-hour expiry, 7-day refresh
- [x] Refresh token rotation enabled
- [x] Tokens stored in SecureStore (Keychain/Keystore), never AsyncStorage
- [x] Email verification required before login
- [x] Password requirements: min 8 chars, uppercase + number
- [x] Logout all devices (global session revocation)
- [x] OAuth (Google, Apple) — no password stored server-side

## Data Security
- [x] RLS enabled on ALL tables — no exceptions
- [x] Service role key NEVER exposed to client
- [x] `is_admin()` function uses `raw_app_meta_data` (not user-editable)
- [x] All file access via signed URLs (time-limited, per-user)
- [x] R2 buckets not publicly accessible (except thumbnails)
- [x] File checksums (MD5 + SHA256) stored for integrity verification

## Upload Security
- [x] File size validated server-side against subscription plan
- [x] MIME type validated against allowlist (not just extension)
- [x] File extension blocked list enforced
- [x] Upload quota checked before presigned URL is issued
- [x] Storage usage synced atomically via DB triggers
- [x] Uploaded bytes cannot exceed plan limit

## Sharing Security
- [x] Share links use random 12-char slug (unpredictable)
- [x] Password-protected links: bcrypt hash stored, not plaintext
- [x] Link expiry enforced at DB level + Edge Function level
- [x] Max access count enforced at DB level
- [x] Share status checked on every access (status = 'active')
- [x] Share access counter incremented atomically

## Payment Security
- [x] Midtrans webhook signature verified before processing
- [x] Idempotency keys prevent duplicate subscription activation
- [x] Payment amounts never trusted from client (recalculated server-side)
- [x] Subscription status transitions validated (can't jump from free to ultra via client)

## Infrastructure Security
- [x] HTTPS enforced everywhere (Cloudflare handles TLS)
- [x] Security headers set (X-Frame-Options, CSP, etc.)
- [x] R2 access key uses minimal permissions
- [x] Supabase service role key only in Edge Functions/server
- [x] Environment variables in GitHub Secrets, not in code

## Privacy & Compliance
- [x] Data deletion flow: user can request full account deletion
- [x] 30-day trash before permanent deletion
- [x] Activity logs retained for 90 days then purged
- [x] IP addresses logged but not exposed to other users
- [x] Privacy Policy covers data collection, retention, deletion
- [x] Terms of Service covers acceptable use, illegal content

## Abuse Prevention
- [x] Rate limiting on upload endpoint (per user, per hour)
- [x] Rate limiting on auth endpoints (per IP)
- [x] Banned users cannot upload (checked in RLS policy)
- [x] Report system for illegal content
- [x] Admin can ban users and revoke shares
- [x] Blocked file extensions enforced server-side
- [x] Storage quota prevents bandwidth abuse

## Known Limitations (Phase 1)
- [ ] No end-to-end encryption for non-vault files (at-rest only)
- [ ] No two-factor authentication (Phase 2)
- [ ] No advanced abuse detection ML (Phase 3)
- [ ] No CSAM detection (integrate PhotoDNA in Phase 2)
