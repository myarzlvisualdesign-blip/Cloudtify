'use client'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'

/** Compact base36 slug — 6 chars ≈ 2.1B values, low collision risk. */
function shortSlug(len = 6): string {
  const buf = new Uint8Array(len)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => (b % 36).toString(36)).join('')
}

export interface ShareTarget {
  kind: 'file' | 'folder'
  id: string
  name: string
}

interface ShareRow {
  id: string
  slug: string
  permission: 'viewer' | 'editor'
  allow_download: boolean
  expires_at: string | null
  status: 'active' | string
}

type Scope = 'private' | 'link'
type Permission = 'viewer' | 'editor'
type ExpiryKey = '1d' | '7d' | '30d' | 'never'

const EXPIRY: { key: ExpiryKey; label: string; ms: number | null }[] = [
  { key: '1d', label: '24 jam', ms: 24 * 3_600_000 },
  { key: '7d', label: '7 hari', ms: 7 * 24 * 3_600_000 },
  { key: '30d', label: '30 hari', ms: 30 * 24 * 3_600_000 },
  { key: 'never', label: 'Tidak ada', ms: null },
]

function fromExpiresAt(at: string | null): ExpiryKey {
  if (!at) return 'never'
  const remain = new Date(at).getTime() - Date.now()
  if (remain <= 1.5 * 24 * 3_600_000) return '1d'
  if (remain <= 10 * 24 * 3_600_000) return '7d'
  return '30d'
}

function expiresFromKey(k: ExpiryKey): string | null {
  const def = EXPIRY.find((e) => e.key === k)
  if (!def?.ms) return null
  return new Date(Date.now() + def.ms).toISOString()
}

export function ShareModal({
  target,
  userId,
  onClose,
}: {
  target: ShareTarget | null
  userId: string
  onClose: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existing, setExisting] = useState<ShareRow | null>(null)
  const [scope, setScope] = useState<Scope>('private')
  const [permission, setPermission] = useState<Permission>('viewer')
  const [allowDownload, setAllowDownload] = useState(true)
  const [expiry, setExpiry] = useState<ExpiryKey>('30d')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  // Fetch existing share for this target.
  const load = useCallback(async () => {
    if (!target) return
    setLoading(true)
    setError('')
    const col = target.kind === 'file' ? 'file_id' : 'folder_id'
    const { data } = await supabase
      .from('shares')
      .select('id, slug, permission, allow_download, expires_at, status')
      .eq(col, target.id)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data) {
      const row = data as ShareRow
      setExisting(row)
      setScope(row.status === 'active' ? 'link' : 'private')
      setPermission((row.permission as Permission) || 'viewer')
      setAllowDownload(!!row.allow_download)
      setExpiry(fromExpiresAt(row.expires_at))
    } else {
      setExisting(null)
      setScope('private')
      setPermission('viewer')
      setAllowDownload(true)
      setExpiry('30d')
    }
    setLoading(false)
  }, [target, userId])

  useEffect(() => {
    if (target) load()
  }, [target, load])

  /** Persist current modal state to the `shares` table (insert or update). */
  async function persist(): Promise<ShareRow | null> {
    if (!target) return null
    setSaving(true)
    setError('')
    try {
      if (scope === 'private') {
        if (existing) {
          await supabase.from('shares').update({ status: 'revoked' }).eq('id', existing.id)
          setExisting(null)
        }
        return null
      }
      // scope === 'link'
      const expires_at = expiresFromKey(expiry)
      if (existing) {
        const { data, error: e } = await supabase
          .from('shares')
          .update({ status: 'active', permission, allow_download: allowDownload, expires_at })
          .eq('id', existing.id)
          .select('id, slug, permission, allow_download, expires_at, status')
          .maybeSingle()
        if (e) throw e
        const row = data as ShareRow
        setExisting(row)
        return row
      }
      const slug = shortSlug(6)
      const payload: Record<string, unknown> = {
        user_id: userId,
        slug,
        status: 'active',
        visibility: 'public',
        permission,
        allow_download: allowDownload,
        expires_at,
      }
      payload[target.kind === 'file' ? 'file_id' : 'folder_id'] = target.id
      const { data, error: e } = await supabase
        .from('shares')
        .insert(payload)
        .select('id, slug, permission, allow_download, expires_at, status')
        .maybeSingle()
      if (e) throw e
      const row = data as ShareRow
      setExisting(row)
      return row
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan')
      return null
    } finally {
      setSaving(false)
    }
  }

  // Save automatically on any setting change after the initial load (debounced).
  useEffect(() => {
    if (loading || !target) return
    const t = setTimeout(() => { persist() }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, permission, allowDownload, expiry])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const link = existing ? `${origin}/s/${existing.slug}` : ''

  async function copyLink() {
    let url = link
    if (!url) {
      const row = await persist()
      if (!row) return
      url = `${origin}/s/${row.slug}`
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Salin link berbagi:', url)
    }
  }

  if (!target) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(11,21,48,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[460px] rounded-3xl shadow-[0_24px_60px_rgba(20,17,16,0.22)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 gap-3">
          <div className="min-w-0">
            <p className="text-[#A8A29E] text-[11px] font-semibold uppercase tracking-wider">Bagikan {target.kind === 'folder' ? 'folder' : 'file'}</p>
            <h2 className="font-display font-bold text-[#141110] text-lg leading-tight mt-0.5 truncate">{target.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="text-[#A8A29E] hover:text-[#141110] hover:bg-[#F2F0ED] rounded-lg p-1.5 transition-colors flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
          {/* Akses umum */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#EBF0FF] text-[#1A56DB] flex items-center justify-center flex-shrink-0">
                {scope === 'link' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-[#141110] text-sm">Akses umum</p>
                <p className="text-[#A8A29E] text-xs">
                  {scope === 'link' ? 'Siapa pun yang punya link bisa membuka' : 'Hanya kamu yang bisa mengakses'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setScope('private')}
                className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${scope === 'private' ? 'bg-[#EBF0FF] border-[#C2D0F8] text-[#1A56DB]' : 'bg-white border-[#E5E2DD] text-[#6B6560] hover:text-[#141110] hover:border-[#C2BDB8]'}`}
              >
                Hanya saya
              </button>
              <button
                onClick={() => setScope('link')}
                className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${scope === 'link' ? 'bg-[#EBF0FF] border-[#C2D0F8] text-[#1A56DB]' : 'bg-white border-[#E5E2DD] text-[#6B6560] hover:text-[#141110] hover:border-[#C2BDB8]'}`}
              >
                Punya link
              </button>
            </div>
          </div>

          {scope === 'link' && (
            <>
              {/* Permission */}
              <div>
                <p className="text-[#141110] text-xs font-semibold mb-1.5">Peran</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPermission('viewer')}
                    className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${permission === 'viewer' ? 'bg-[#EBF0FF] border-[#C2D0F8] text-[#1A56DB]' : 'bg-white border-[#E5E2DD] text-[#6B6560] hover:text-[#141110] hover:border-[#C2BDB8]'}`}
                  >
                    Pelihat
                  </button>
                  <button
                    onClick={() => setPermission('editor')}
                    className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${permission === 'editor' ? 'bg-[#EBF0FF] border-[#C2D0F8] text-[#1A56DB]' : 'bg-white border-[#E5E2DD] text-[#6B6560] hover:text-[#141110] hover:border-[#C2BDB8]'}`}
                  >
                    Editor
                  </button>
                </div>
                {permission === 'editor' && (
                  <p className="text-[#A8A29E] text-[11px] mt-1.5 leading-snug">
                    Editor masih dalam pengembangan — link tetap bisa dibagikan, tapi izin tulis aktif setelah update berikutnya.
                  </p>
                )}
              </div>

              {/* Allow download */}
              <div className="flex items-center justify-between gap-3 bg-[#FAFAF8] border border-[#F2F0ED] rounded-xl px-3.5 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-[#141110] text-sm leading-none">Izinkan download</p>
                  <p className="text-[#A8A29E] text-[11px] mt-1">Pelihat bisa mengunduh berkas asli</p>
                </div>
                <button
                  onClick={() => setAllowDownload((v) => !v)}
                  className="relative w-10 h-5.5 rounded-full transition-all flex-shrink-0"
                  style={{ background: allowDownload ? '#1A56DB' : '#D4CFC9', width: 40, height: 22 }}
                  aria-pressed={allowDownload}
                >
                  <span className={`absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all ${allowDownload ? 'left-[20px]' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Expiry */}
              <div>
                <p className="text-[#141110] text-xs font-semibold mb-1.5">Kedaluwarsa</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {EXPIRY.map((e) => (
                    <button
                      key={e.key}
                      onClick={() => setExpiry(e.key)}
                      className={`text-[11px] font-semibold px-2 py-2 rounded-lg border transition-all ${expiry === e.key ? 'bg-[#EBF0FF] border-[#C2D0F8] text-[#1A56DB]' : 'bg-white border-[#E5E2DD] text-[#6B6560] hover:text-[#141110] hover:border-[#C2BDB8]'}`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link preview */}
              <div className="bg-[#0B1530] rounded-2xl p-3.5 text-white space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Link berbagi</p>
                  {saving && (
                    <span className="text-white/40 text-[10px] flex items-center gap-1">
                      <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                      menyimpan…
                    </span>
                  )}
                </div>
                <p className="font-mono text-[12px] break-all leading-snug select-all">
                  {link || (loading ? 'Memuat…' : 'Akan dibuat saat kamu salin')}
                </p>
                <button
                  onClick={copyLink}
                  disabled={loading}
                  className={`w-full font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${copied ? 'bg-[#22C55E] text-white' : 'bg-white text-[#0B1530] hover:bg-white/90'}`}
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Link tersalin
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      Salin link
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#F2F0ED] flex items-center justify-end gap-2">
          <button onClick={onClose} className="text-[#6B6560] hover:text-[#141110] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#F2F0ED] transition-colors">Selesai</button>
        </div>
      </div>
    </div>
  )
}
