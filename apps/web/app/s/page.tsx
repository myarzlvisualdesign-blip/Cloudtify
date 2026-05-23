'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase/client'
import { Logo } from '../../components/brand/Logo'
import { formatBytes, formatRelativeDate } from '@cloudtify/utils'

interface FileRow { id: string; name: string; size_bytes: number; mime_type: string; r2_key: string; r2_bucket: string | null; created_at?: string }
interface FolderRow { id: string; name: string }
interface ShareRow { id: string; slug: string; file_id: string | null; folder_id: string | null; allow_download: boolean }

function iconFor(mime: string) {
  if (mime?.startsWith('image/')) return { color: '#D97706', bg: '#FFF7ED' }
  if (mime?.startsWith('video/')) return { color: '#059669', bg: '#ECFDF5' }
  if (mime?.startsWith('audio/')) return { color: '#BE185D', bg: '#FFF1F2' }
  if (/zip|rar|7z|tar|gzip/.test(mime || '')) return { color: '#6B6560', bg: '#F2F0ED' }
  return { color: '#1A56DB', bg: '#EBF0FF' }
}

function Viewer() {
  const sp = useSearchParams()
  const slug = sp.get('id') || ''
  const [state, setState] = useState<{ loading: boolean; share: ShareRow | null; folder: FolderRow | null; files: FileRow[] }>({ loading: true, share: null, folder: null, files: [] })
  const [preview, setPreview] = useState<{ url: string; name: string; mime: string } | null>(null)
  const [previewError, setPreviewError] = useState(false)

  useEffect(() => {
    if (!slug) { setState({ loading: false, share: null, folder: null, files: [] }); return }
    let cancelled = false
    ;(async () => {
      const { data: share } = await supabase.from('shares').select('id, slug, file_id, folder_id, allow_download').eq('slug', slug).eq('status', 'active').maybeSingle()
      if (cancelled) return
      if (!share) { setState({ loading: false, share: null, folder: null, files: [] }); return }
      let folder: FolderRow | null = null
      let files: FileRow[] = []
      if (share.folder_id) {
        const [fo, fi] = await Promise.all([
          supabase.from('folders').select('id, name').eq('id', share.folder_id).maybeSingle(),
          supabase.from('files').select('id, name, size_bytes, mime_type, r2_key, r2_bucket, created_at').eq('folder_id', share.folder_id).eq('is_deleted', false).order('created_at', { ascending: false }),
        ])
        folder = fo.data as FolderRow | null
        files = (fi.data ?? []) as FileRow[]
      } else if (share.file_id) {
        const { data } = await supabase.from('files').select('id, name, size_bytes, mime_type, r2_key, r2_bucket, created_at').eq('id', share.file_id).maybeSingle()
        files = data ? [data as FileRow] : []
      }
      if (!cancelled) setState({ loading: false, share, folder, files })
    })()
    return () => { cancelled = true }
  }, [slug])

  async function open(f: FileRow) {
    const { data } = await supabase.storage.from(f.r2_bucket || 'files').createSignedUrl(f.r2_key, 600)
    if (data?.signedUrl) { setPreviewError(false); setPreview({ url: data.signedUrl, name: f.name, mime: f.mime_type || '' }) }
  }
  async function download(f: FileRow) {
    const { data } = await supabase.storage.from(f.r2_bucket || 'files').createSignedUrl(f.r2_key, 600, { download: f.name })
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  if (state.loading) {
    return <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-5"><Logo size={40} /><svg className="animate-spin text-[#1A56DB]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" /></svg></div>
  }
  if (!slug || !state.share) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <Logo size={38} />
          <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mt-6 mb-2">Link tidak ditemukan</h1>
          <p className="text-[#6B6560] text-sm mb-6">Link berbagi ini sudah kedaluwarsa, dicabut, atau salah ketik.</p>
          <Link href="/" className="inline-flex text-white text-sm font-semibold px-5 py-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>Ke beranda Cloudtify</Link>
        </div>
      </div>
    )
  }

  const share = state.share // non-null after the guard above
  const title = state.folder?.name || state.files[0]?.name || 'File dibagikan'

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-white border-b border-[#E5E2DD] px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center"><Logo size={28} /></Link>
        <span className="text-[#A8A29E] text-xs">Dibagikan via Cloudtify</span>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-1 truncate">{title}</h1>
        <p className="text-[#A8A29E] text-sm mb-8">{state.files.length} file · siapa pun dengan link ini bisa lihat{share.allow_download ? ' & unduh' : ''}</p>

        {state.files.length === 0 ? (
          <div className="bg-white border border-[#E5E2DD] rounded-2xl py-16 text-center text-[#A8A29E] text-sm">Folder ini masih kosong.</div>
        ) : (
          <div className="bg-white border border-[#E5E2DD] rounded-2xl overflow-hidden">
            {state.files.map((f, i) => {
              const tone = iconFor(f.mime_type)
              return (
                <div key={f.id} className={`flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors ${i < state.files.length - 1 ? 'border-b border-[#F2F0ED]' : ''}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tone.bg, color: tone.color }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M13 3v5h5" /></svg>
                  </div>
                  <button onClick={() => open(f)} className="flex-1 min-w-0 text-left cursor-pointer">
                    <p className="font-medium text-[#141110] text-sm truncate">{f.name}</p>
                    <p className="text-[#A8A29E] text-xs mt-0.5">{formatBytes(f.size_bytes)}{f.created_at ? ` · ${formatRelativeDate(f.created_at)}` : ''}</p>
                  </button>
                  {share.allow_download && (
                    <button onClick={() => download(f)} className="flex items-center gap-1.5 text-[#1A56DB] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#EBF0FF] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3" /><polyline points="7.5 11 12 15.5 16.5 11" /><line x1="12" y1="15.5" x2="12" y2="3" /></svg>
                      Unduh
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <p className="text-center text-[#A8A29E] text-xs mt-10">
          Punya file sendiri? <Link href="/auth/register" className="text-[#1A56DB] font-semibold hover:opacity-75">Daftar Cloudtify gratis</Link>
        </p>
      </main>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" style={{ background: 'rgba(11,21,48,0.85)', backdropFilter: 'blur(4px)' }} onClick={() => setPreview(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 gap-4">
              <p className="text-white font-medium text-sm truncate">{preview.name}</p>
              <button onClick={() => setPreview(null)} className="text-white/70 hover:text-white flex-shrink-0"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
            </div>
            {(() => {
              const m = preview.mime.toLowerCase()
              const isHeic = /heic|heif/.test(m) || /\.heic$|\.heif$/i.test(preview.name)
              const isImage = m.startsWith('image/') && !isHeic
              const isVideo = m.startsWith('video/')
              const isPdf = m === 'application/pdf' || /\.pdf$/i.test(preview.name)
              if (isImage && !previewError) {
                // eslint-disable-next-line @next/next/no-img-element
                return <img src={preview.url} alt={preview.name} onError={() => setPreviewError(true)} className="w-full max-h-[80vh] object-contain rounded-xl" />
              }
              if (isVideo) return <video src={preview.url} controls autoPlay className="w-full max-h-[80vh] rounded-xl bg-black" />
              if (isPdf) return <iframe src={preview.url} title={preview.name} className="w-full rounded-xl bg-white" style={{ height: '80vh' }} />
              return (
                <div className="bg-white rounded-2xl p-10 text-center">
                  <p className="font-display font-bold text-[#141110] text-base mb-1">Preview tidak tersedia</p>
                  <p className="text-[#A8A29E] text-sm mb-6">{isHeic ? 'Browser belum bisa menampilkan foto HEIC.' : 'Tipe file ini tidak bisa dipratinjau di browser.'}</p>
                  <a href={preview.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>Buka file</a>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center"><Logo size={40} /></div>}>
      <Viewer />
    </Suspense>
  )
}
