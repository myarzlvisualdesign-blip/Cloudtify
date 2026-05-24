'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { formatBytes, formatRelativeDate } from '@cloudtify/utils'
import { supabase } from '../../../lib/supabase/client'
import { useUser } from '../../../lib/auth'
import { uploadFileToR2, getStoredFileUrl, deleteStoredFile, R2_BUCKET } from '../../../lib/storage'
import type { ShareTarget } from '../../../components/ShareModal'

// Dynamic import so ShareModal's supabase/auth chain never runs during static pre-render.
const ShareModal = dynamic(() => import('../../../components/ShareModal').then((m) => m.ShareModal), { ssr: false })

const MAX_BYTES = 5 * 1024 * 1024 * 1024

/* ── SVG icons ─────────────────────────────────────────────────────── */
const si = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
function IcoImage() { return <svg {...si} stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> }
function IcoVideo() { return <svg {...si} stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg> }
function IcoDoc() { return <svg {...si} stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> }
function IcoArchive() { return <svg {...si} stroke="currentColor"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg> }
function IcoAudio() { return <svg {...si} stroke="currentColor"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg> }
function IcoFolder() { return <svg {...si} stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> }
function IcoSearch() { return <svg {...si} stroke="currentColor"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> }
function IcoUpload() { return <svg {...si} stroke="currentColor"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg> }
function IcoLink() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg> }
function IcoMore() { return <svg {...si} stroke="currentColor"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg> }
function IcoDownload2() { return <svg {...si} stroke="currentColor"><path d="M21 15v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3" /><polyline points="7.5 11 12 15.5 16.5 11" /><line x1="12" y1="15.5" x2="12" y2="3" /></svg> }
function IcoTrash() { return <svg {...si} stroke="currentColor"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg> }
function IcoRestore() { return <svg {...si} stroke="currentColor"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg> }
function IcoEye() { return <svg {...si} stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> }
function IcoRename() { return <svg {...si} stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> }
function IcoShare() { return <svg {...si} stroke="currentColor"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> }
function IcoGrid() { return <svg {...si} stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> }
function IcoList() { return <svg {...si} stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> }

const FILE_TYPE_MAP = {
  image: { Icon: IcoImage, accent: '#D97706', bg: '#FFF7ED' },
  video: { Icon: IcoVideo, accent: '#059669', bg: '#ECFDF5' },
  document: { Icon: IcoDoc, accent: '#1A56DB', bg: '#EBF0FF' },
  archive: { Icon: IcoArchive, accent: '#6B6560', bg: '#F2F0ED' },
  audio: { Icon: IcoAudio, accent: '#BE185D', bg: '#FFF1F2' },
} as const

type Cat = keyof typeof FILE_TYPE_MAP

function catOf(mime: string): Cat {
  if (!mime) return 'document'
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (/zip|rar|7z|tar|gzip|compressed/.test(mime)) return 'archive'
  return 'document'
}

function isHeic(f: { mime_type: string; name: string }): boolean {
  return /heic|heif/.test(f.mime_type || '') || /\.heic$|\.heif$/i.test(f.name)
}

/** Extract first decent frame (≈0.4s) from a video URL → small JPEG data URL. */
function captureVideoFrame(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const v = document.createElement('video')
    v.crossOrigin = 'anonymous'
    v.preload = 'metadata'
    v.muted = true
    v.playsInline = true
    let settled = false
    const cleanup = () => { try { v.src = '' } catch {} }
    const done = (out: string | null) => { if (!settled) { settled = true; cleanup(); resolve(out) } }
    v.onloadeddata = () => { try { v.currentTime = Math.min(0.4, (v.duration || 1) * 0.1) } catch { done(null) } }
    v.onseeked = () => {
      try {
        const w = v.videoWidth || 320
        const h = v.videoHeight || 180
        const scale = Math.min(360 / Math.max(w, h), 1)
        const cw = Math.round(w * scale)
        const ch = Math.round(h * scale)
        const canvas = document.createElement('canvas')
        canvas.width = cw
        canvas.height = ch
        const ctx = canvas.getContext('2d')
        if (!ctx) return done(null)
        ctx.drawImage(v, 0, 0, cw, ch)
        done(canvas.toDataURL('image/jpeg', 0.7))
      } catch { done(null) }
    }
    v.onerror = () => done(null)
    setTimeout(() => done(null), 8000)
    v.src = url
  })
}

const FILTERS: [string, string][] = [
  ['all', 'Semua'], ['image', 'Foto'], ['video', 'Video'], ['document', 'Dokumen'], ['archive', 'Arsip'],
]

interface FileRow { id: string; name: string; size_bytes: number; mime_type: string; folder_id: string | null; created_at: string; r2_key: string; r2_bucket: string | null }
interface FolderRow { id: string; name: string }

export default function FilesPage() {
  const { user } = useUser({ redirectTo: '/auth/login/' })
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [files, setFiles] = useState<FileRow[]>([])
  const [folders, setFolders] = useState<FolderRow[]>([])
  const [sharedIds, setSharedIds] = useState<Set<string>>(new Set())
  const [usedBytes, setUsedBytes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ name: string; pct: number } | null>(null)
  const [uploadMsg, setUploadMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [newFolder, setNewFolder] = useState('')
  const [showFolderInput, setShowFolderInput] = useState(false)
  const [trash, setTrash] = useState(false)
  const [preview, setPreview] = useState<{ url: string; name: string; mime: string } | null>(null)
  const [previewError, setPreviewError] = useState(false)
  const [openFolder, setOpenFolder] = useState<string | null>(null)
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [folderCovers, setFolderCovers] = useState<Map<string, string>>(new Map())
  const [imageThumbs, setImageThumbs] = useState<Map<string, string>>(new Map())
  const [videoThumbs, setVideoThumbs] = useState<Map<string, string>>(new Map())
  const [shareTarget, setShareTarget] = useState<ShareTarget | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  // Folder covers — first renderable image (or video frame) in each folder
  useEffect(() => {
    if (!folders.length || !files.length) return
    const firstCover = new Map<string, FileRow>()
    // Pass 1: prefer images
    for (const f of files) {
      if (f.folder_id && catOf(f.mime_type) === 'image' && !isHeic(f) && !firstCover.has(f.folder_id))
        firstCover.set(f.folder_id, f)
    }
    // Pass 2: fall back to videos for folders that still have no cover
    for (const f of files) {
      if (f.folder_id && catOf(f.mime_type) === 'video' && !firstCover.has(f.folder_id))
        firstCover.set(f.folder_id, f)
    }
    if (!firstCover.size) return
    let cancelled = false
    ;(async () => {
      const entries = Array.from(firstCover.entries()).slice(0, 12)
      const out = new Map<string, string>()
      for (const [folderId, f] of entries) {
        if (cancelled) return
        try {
          const url = await getStoredFileUrl(f, 3600)
          if (!url) continue
          if (catOf(f.mime_type) === 'video') {
            const frame = await captureVideoFrame(url)
            if (frame) out.set(folderId, frame)
          } else {
            out.set(folderId, url)
          }
        } catch { /* skip */ }
      }
      if (!cancelled) setFolderCovers(out)
    })()
    return () => { cancelled = true }
  }, [files, folders])

  // Image thumbnails — all view modes (grid + list), up to 60 images
  useEffect(() => {
    if (!files.length) return
    const images = files.filter((f) => catOf(f.mime_type) === 'image' && !isHeic(f)).slice(0, 60)
    const need = images.filter((f) => !imageThumbs.has(f.id))
    if (!need.length) return
    let cancelled = false
    Promise.all(
      need.map(async (f) => {
        const url = await getStoredFileUrl(f, 3600).catch(() => '')
        return [f.id, url] as const
      }),
    ).then((pairs) => {
      if (cancelled) return
      setImageThumbs((prev) => {
        const next = new Map(prev)
        for (const [k, v] of pairs) if (v) next.set(k, v)
        return next
      })
    })
    return () => { cancelled = true }
  }, [files]) // eslint-disable-line react-hooks/exhaustive-deps

  // Video thumbnails — extract first frame to canvas JPEG so cards show cover
  useEffect(() => {
    if (!files.length) return
    const videos = files.filter((f) => catOf(f.mime_type) === 'video').slice(0, 30)
    const need = videos.filter((f) => !videoThumbs.has(f.id))
    if (!need.length) return
    let cancelled = false
    ;(async () => {
      for (const f of need) {
        if (cancelled) return
        try {
          const url = await getStoredFileUrl(f, 3600)
          if (!url) continue
          const dataUrl = await captureVideoFrame(url)
          if (!dataUrl || cancelled) continue
          setVideoThumbs((prev) => {
            const next = new Map(prev)
            next.set(f.id, dataUrl)
            return next
          })
        } catch { /* skip on error */ }
      }
    })()
    return () => { cancelled = true }
  }, [files]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = folderInputRef.current
    if (el) { el.setAttribute('webkitdirectory', ''); el.setAttribute('directory', '') }
  }, [])

  async function downloadFile(f: FileRow) {
    setMenuFor(null)
    const url = await getStoredFileUrl(f, 120)
    if (url) window.open(url, '_blank')
  }

  async function openFile(f: FileRow) {
    setBusyId(f.id)
    const url = await getStoredFileUrl(f, 600).catch(() => '')
    setBusyId(null)
    if (url) { setPreviewError(false); setPreview({ url, name: f.name, mime: f.mime_type || '' }) }
  }

  function openShareForFile(f: FileRow) {
    setMenuFor(null)
    setShareTarget({ kind: 'file', id: f.id, name: f.name })
  }

  function openShareForFolder(folder: FolderRow, e?: React.MouseEvent) {
    e?.stopPropagation()
    setShareTarget({ kind: 'folder', id: folder.id, name: folder.name })
  }

  async function renameFile(f: FileRow) {
    setMenuFor(null)
    const name = window.prompt('Ubah nama file:', f.name)?.trim()
    if (!name || name === f.name) return
    setBusyId(f.id)
    await supabase.from('files').update({ name }).eq('id', f.id)
    setBusyId(null)
    await loadData()
  }

  async function deleteFile(f: FileRow) {
    setMenuFor(null)
    setBusyId(f.id)
    await supabase.from('files').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', f.id)
    setBusyId(null)
    await loadData()
  }

  async function restoreFile(f: FileRow) {
    setMenuFor(null)
    setBusyId(f.id)
    await supabase.from('files').update({ is_deleted: false, deleted_at: null }).eq('id', f.id)
    setBusyId(null)
    await loadData()
  }

  async function purgeFile(f: FileRow) {
    setMenuFor(null)
    setBusyId(f.id)
    await deleteStoredFile(f)
    await supabase.from('files').delete().eq('id', f.id)
    setBusyId(null)
    await loadData()
  }

  async function createFolder() {
    const name = newFolder.trim()
    if (!name || !user) return
    await supabase.from('folders').insert({ user_id: user.id, name })
    setNewFolder('')
    setShowFolderInput(false)
    await loadData()
  }

  const loadData = useCallback(async () => {
    if (!user) return
    const [f, fo, sh, su] = await Promise.all([
      supabase.from('files').select('id, name, size_bytes, mime_type, folder_id, created_at, r2_key, r2_bucket').eq('user_id', user.id).eq('is_deleted', trash).order('created_at', { ascending: false }).limit(200),
      supabase.from('folders').select('id, name').eq('user_id', user.id).eq('is_deleted', false).order('created_at', { ascending: false }),
      supabase.from('shares').select('file_id').eq('user_id', user.id).eq('status', 'active'),
      supabase.from('storage_usage').select('used_bytes').eq('user_id', user.id).maybeSingle(),
    ])
    setFiles((f.data ?? []) as FileRow[])
    setFolders((fo.data ?? []) as FolderRow[])
    setSharedIds(new Set(((sh.data ?? []) as { file_id: string }[]).map((s) => s.file_id)))
    setUsedBytes((su.data?.used_bytes ?? 0) as number)
    setLoading(false)
  }, [user, trash])

  useEffect(() => {
    if (user) loadData().catch(() => setLoading(false))
  }, [user, loadData])

  async function handleFiles(list: FileList | null) {
    if (!list || !user) return
    const items = Array.from(list)
    setUploading(true)
    let failed = 0

    let folderId: string | null = null
    const rel = (items[0] as File & { webkitRelativePath?: string })?.webkitRelativePath
    if (rel && rel.includes('/')) {
      const top = rel.split('/')[0]
      const { data } = await supabase.from('folders').insert({ user_id: user.id, name: top }).select('id').maybeSingle()
      folderId = (data?.id as string) ?? null
    }

    for (const file of items) {
      if (file.size > MAX_BYTES) {
        setUploadMsg(`"${file.name}" terlalu besar (>5 GB) — dilewati`)
        failed++
        continue
      }
      setUploadProgress({ name: file.name, pct: 0 })
      try {
        const { key, bucket } = await uploadFileToR2(file, (loaded, total) =>
          setUploadProgress({ name: file.name, pct: Math.round((loaded / total) * 100) }),
        )
        const { error: insErr } = await supabase.from('files').insert({
          user_id: user.id,
          folder_id: openFolder ?? folderId,
          name: file.name,
          original_name: file.name,
          mime_type: file.type || 'application/octet-stream',
          size_bytes: file.size,
          r2_key: key,
          r2_bucket: bucket,
          visibility: 'private',
        })
        if (insErr) { failed++; setUploadMsg('Gagal simpan metadata: ' + insErr.message) }
      } catch (e) {
        failed++
        setUploadMsg(e instanceof Error ? e.message : 'Upload gagal')
      }
    }
    await loadData()
    setUploading(false)
    setUploadProgress(null)
    if (failed === 0) setUploadMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (folderInputRef.current) folderInputRef.current.value = ''
  }

  const folderCounts = useMemo(() => {
    const m = new Map<string, number>()
    files.forEach((f) => { if (f.folder_id) m.set(f.folder_id, (m.get(f.folder_id) ?? 0) + 1) })
    return m
  }, [files])

  const inFolderFiles = files.filter((f) =>
    openFolder === null ? !f.folder_id : f.folder_id === openFolder,
  )
  const filtered = inFolderFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || catOf(f.mime_type) === filter),
  )
  const openFolderName = openFolder ? folders.find((x) => x.id === openFolder)?.name : null

  const gridCols =
    size === 'sm' ? 'grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9' :
    size === 'lg' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
    'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

  return (
    <div
      className="space-y-5 relative"
      onDragOver={(e) => { e.preventDefault(); if (!trash && !dragging) setDragging(true) }}
      onDragLeave={(e) => { e.preventDefault(); if (e.currentTarget === e.target) setDragging(false) }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!trash) handleFiles(e.dataTransfer.files) }}
    >
      {/* ── Share modal ── */}
      {shareTarget && user && (
        <ShareModal target={shareTarget} userId={user.id} onClose={() => { setShareTarget(null); loadData() }} />
      )}

      {/* Drag overlay */}
      {dragging && !trash && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none p-6" style={{ background: 'rgba(26,86,219,0.08)', backdropFilter: 'blur(2px)' }}>
          <div className="rounded-3xl border-2 border-dashed border-[#1A56DB] bg-white px-10 py-8 text-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF0FF] flex items-center justify-center mx-auto mb-3 text-[#1A56DB]"><IcoUpload /></div>
            <p className="font-display font-bold text-[#141110] text-base">Lepas untuk upload</p>
            <p className="text-[#A8A29E] text-xs mt-1">File langsung tersimpan ke Cloudtify</p>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between pt-2 gap-3">
        <div className="min-w-0 flex-1">
          {openFolder && !trash && (
            <button onClick={() => setOpenFolder(null)} className="flex items-center gap-1.5 text-[#1A56DB] text-xs font-semibold hover:opacity-75 mb-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              File Saya
            </button>
          )}
          <h1 className="font-display font-bold text-[#141110] text-xl tracking-tight truncate">
            {trash ? 'Sampah' : (openFolderName || 'File Saya')}
          </h1>
          <p className="text-[#A8A29E] text-sm mt-0.5">
            {loading ? 'Memuat…' : trash
              ? `${files.length} file · pulih dalam ≤30 hari`
              : openFolder
              ? `${filtered.length} file dalam folder ini`
              : `${filtered.length} file · ${formatBytes(usedBytes)} digunakan`}
          </p>
        </div>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <input ref={folderInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => { setTrash((t) => !t); setMenuFor(null) }} className={`flex items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-xl border transition-all ${trash ? 'bg-[#EBF0FF] border-[#C2D0F8] text-[#1A56DB]' : 'bg-white border-[#E5E2DD] text-[#6B6560] hover:border-[#C2BDB8] hover:text-[#141110]'}`}>
            <IcoTrash /> <span className="hidden sm:inline">{trash ? 'Kembali' : 'Sampah'}</span>
          </button>
          {!trash && (
            <>
              <button onClick={() => folderInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-white border border-[#E5E2DD] text-[#6B6560] text-sm font-semibold px-3 py-2.5 rounded-xl hover:border-[#C2BDB8] hover:text-[#141110] transition-all disabled:opacity-60">
                <IcoFolder /> <span className="hidden sm:inline">Folder</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 text-white text-sm font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/20 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                {uploading
                  ? <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg><span className="hidden sm:inline">Upload…</span></>
                  : <><IcoUpload /><span className="hidden sm:inline">Upload</span></>}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upload progress bar */}
      {uploadProgress && (
        <div className="rounded-xl border border-[#C2D0F8] bg-[#EBF0FF] px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[#1A56DB] text-xs font-semibold truncate max-w-[70%]">{uploadProgress.name}</p>
            <span className="text-[#1A56DB] text-xs font-bold">{uploadProgress.pct}%</span>
          </div>
          <div className="h-1.5 bg-[#C2D0F8] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${uploadProgress.pct}%`, background: 'linear-gradient(90deg, #1A56DB, #60A5FA)' }} />
          </div>
        </div>
      )}

      {uploadMsg && !uploadProgress && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700 font-medium">{uploadMsg}</div>
      )}

      {/* ── Search ── */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoSearch /></span>
        <input type="text" placeholder="Cari file…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-10 pr-4 py-3 text-sm text-[#141110] placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/50 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all" />
      </div>

      {/* ── Folders ── */}
      {!trash && !openFolder && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-[#141110] text-sm">Folder</h2>
            <button onClick={() => setShowFolderInput((v) => !v)} className="text-[#1A56DB] text-xs font-semibold hover:opacity-75 transition-opacity">+ Folder Baru</button>
          </div>
          {showFolderInput && (
            <div className="flex gap-2 mb-3">
              <input autoFocus value={newFolder} onChange={(e) => setNewFolder(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') setShowFolderInput(false) }} placeholder="Nama folder…" className="flex-1 bg-white border border-[#E5E2DD] rounded-xl px-4 py-2.5 text-sm text-[#141110] placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/50 focus:ring-2 focus:ring-[#1A56DB]/10" />
              <button onClick={createFolder} className="text-white text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>Buat</button>
            </div>
          )}
          {folders.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {folders.map((folder) => {
                const cover = folderCovers.get(folder.id)
                return (
                  <div
                    key={folder.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpenFolder(folder.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setOpenFolder(folder.id) }}
                    className="bg-white border border-[#E5E2DD] rounded-2xl text-left hover:border-[#C2D0F8] hover:shadow-[0_4px_16px_rgba(26,86,219,0.08)] transition-all duration-200 group cursor-pointer overflow-hidden relative"
                  >
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="w-full h-24 object-cover" />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-gradient-to-br from-[#EBF0FF] to-[#dde7fb] text-[#1A56DB]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Share button — appears on hover */}
                    <button
                      onClick={(e) => openShareForFolder(folder, e)}
                      title="Bagikan folder"
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm transition-all bg-white/95 border border-[#E5E2DD] text-[#6B6560] hover:text-[#1A56DB] hover:border-[#C2D0F8] opacity-0 group-hover:opacity-100"
                    >
                      <IcoShare />
                    </button>
                    <div className="p-3">
                      <p className="font-display font-semibold text-[#141110] text-xs leading-snug truncate">{folder.name}</p>
                      <p className="text-[#A8A29E] text-[10px] mt-0.5">{folderCounts.get(folder.id) ?? 0} file</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            !showFolderInput && <p className="text-[#A8A29E] text-xs">Belum ada folder. Klik "+ Folder Baru" untuk membuat.</p>
          )}
        </div>
      )}

      {/* ── Filter + view toggle ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1 scrollbar-hide">
          {FILTERS.map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === key ? 'bg-[#1A56DB] text-white shadow-sm' : 'bg-white text-[#6B6560] border border-[#E5E2DD] hover:border-[#C2D0F8] hover:text-[#141110]'}`}>{label}</button>
          ))}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {(['list', 'grid'] as const).map((v) => {
            const IconCmp = v === 'list' ? IcoList : IcoGrid
            return (
              <button key={v} onClick={() => setView(v)} title={v === 'list' ? 'List' : 'Grid'} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === v ? 'bg-[#EBF0FF] text-[#1A56DB]' : 'bg-white text-[#A8A29E] border border-[#E5E2DD] hover:text-[#141110]'}`}>
                <IconCmp />
              </button>
            )
          })}
          {view === 'grid' && (
            <div className="flex gap-1 ml-1 pl-2 border-l border-[#E5E2DD]">
              {([['sm', 8], ['md', 12], ['lg', 16]] as const).map(([s, px]) => (
                <button key={s} onClick={() => setSize(s)} title={s === 'sm' ? 'Kecil' : s === 'md' ? 'Sedang' : 'Besar'} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${size === s ? 'bg-[#EBF0FF] text-[#1A56DB]' : 'bg-white text-[#A8A29E] border border-[#E5E2DD] hover:text-[#141110]'}`}>
                  <svg width={px} height={px} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="currentColor" /></svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── File content ── */}
      {loading ? (
        <div className="bg-white border border-[#E5E2DD] rounded-2xl py-16 text-center text-[#A8A29E] text-sm">Memuat file…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E2DD] rounded-2xl py-16 text-center">
          {files.length === 0 ? (
            trash ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#F2F0ED] flex items-center justify-center mx-auto mb-4 text-[#A8A29E]"><IcoTrash /></div>
                <p className="text-[#141110] text-sm font-semibold mb-1">Sampah kosong</p>
                <p className="text-[#A8A29E] text-xs">File terhapus bisa dipulihkan ≤30 hari.</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#EBF0FF] flex items-center justify-center mx-auto mb-4 text-[#1A56DB]"><IcoUpload /></div>
                <p className="text-[#141110] text-sm font-semibold mb-1">Belum ada file</p>
                <p className="text-[#A8A29E] text-xs mb-5">Drag & drop atau klik Upload</p>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                  <IcoUpload /> Upload File
                </button>
              </>
            )
          ) : (
            <p className="text-[#A8A29E] text-sm">Tidak ada file ditemukan</p>
          )}
        </div>
      ) : view === 'list' ? (
        /* ── LIST VIEW ── */
        <div className="bg-white border border-[#E5E2DD] rounded-2xl">
          {filtered.map((file, i) => {
            const { Icon: IconCmp, accent, bg } = FILE_TYPE_MAP[catOf(file.mime_type)]
            const cat = catOf(file.mime_type)
            const thumb = cat === 'image' && !isHeic(file)
              ? imageThumbs.get(file.id)
              : cat === 'video' ? videoThumbs.get(file.id) : null
            return (
              <div
                key={file.id}
                onClick={() => { if (!trash) openFile(file) }}
                className={`flex items-center gap-3 sm:gap-3.5 px-3.5 sm:px-5 py-3 sm:py-3.5 ${trash ? '' : 'cursor-pointer'} hover:bg-[#FAFAF8] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#F2F0ED]' : ''} ${busyId === file.id ? 'opacity-50' : ''}`}
              >
                {/* Thumbnail or type icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative" style={{ background: bg, color: accent }}>
                  {thumb
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                    : <IconCmp />}
                  {cat === 'video' && thumb && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#141110] text-sm truncate">{file.name}</p>
                  <p className="text-[#A8A29E] text-xs mt-0.5">{formatBytes(file.size_bytes)} · {formatRelativeDate(file.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {sharedIds.has(file.id) && (
                    <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF0FF] text-[#1A56DB]"><IcoLink /> Dibagikan</span>
                  )}
                  <div className="relative">
                    <button onClick={() => setMenuFor(menuFor === file.id ? null : file.id)} className="text-[#A8A29E] hover:text-[#141110] hover:bg-[#F2F0ED] rounded-lg p-1.5 transition-colors"><IcoMore /></button>
                    {menuFor === file.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                        <div className="absolute right-0 top-9 z-20 w-48 bg-white border border-[#E5E2DD] rounded-xl shadow-[0_8px_28px_rgba(20,17,16,0.12)] py-1.5">
                          {trash ? (
                            <>
                              <button onClick={() => restoreFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoRestore /> Pulihkan</button>
                              <button onClick={() => purgeFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 transition-colors"><IcoTrash /> Hapus permanen</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => openFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoEye /> Lihat</button>
                              <button onClick={() => downloadFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoDownload2 /> Download</button>
                              <button onClick={() => openShareForFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoShare /> Bagikan</button>
                              <button onClick={() => renameFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoRename /> Ubah nama</button>
                              <button onClick={() => deleteFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 transition-colors"><IcoTrash /> Hapus</button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── GRID VIEW ── */
        <div className={`grid gap-3 ${gridCols}`}>
          {filtered.map((file) => {
            const cat = catOf(file.mime_type)
            const { Icon: IconCmp, accent, bg } = FILE_TYPE_MAP[cat]
            const canImg = cat === 'image' && !isHeic(file)
            const thumb = canImg
              ? imageThumbs.get(file.id)
              : cat === 'video' ? videoThumbs.get(file.id) : null
            const thumbH = size === 'lg' ? 'h-36' : 'h-24'
            return (
              <div
                key={file.id}
                className={`bg-white border border-[#E5E2DD] rounded-2xl text-left cursor-pointer hover:border-[#C2D0F8] hover:shadow-[0_4px_16px_rgba(26,86,219,0.08)] transition-all duration-200 group relative overflow-hidden ${busyId === file.id ? 'opacity-50' : ''}`}
              >
                {/* Preview area (sm: icon only; md/lg: thumbnail/icon block) */}
                {size !== 'sm' ? (
                  <button onClick={() => (trash ? restoreFile(file) : openFile(file))} className="block w-full">
                    {thumb ? (
                      <div className={`relative w-full ${thumbH}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumb} alt={file.name} className={`w-full ${thumbH} object-cover`} />
                        {cat === 'video' && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <span className="w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[#141110]">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                            </span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className={`w-full ${thumbH} flex items-center justify-center`} style={{ background: bg }}>
                        <div style={{ color: accent, transform: size === 'lg' ? 'scale(2)' : 'scale(1.5)' }}><IconCmp /></div>
                      </div>
                    )}
                  </button>
                ) : null}
                <div className={size === 'sm' ? 'p-2' : 'px-3 pb-3'}>
                  {size === 'sm' && (
                    <button onClick={() => (trash ? restoreFile(file) : openFile(file))} className="block w-full mb-1.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto" style={{ background: bg, color: accent }}><IconCmp /></div>
                    </button>
                  )}
                  <div className={`flex items-start ${size === 'sm' ? 'justify-center' : 'justify-between'} gap-1 ${size !== 'sm' ? 'pt-2' : ''}`}>
                    <button onClick={() => (trash ? restoreFile(file) : openFile(file))} className="flex-1 min-w-0 text-left">
                      <p className={`font-medium text-[#141110] truncate leading-snug ${size === 'sm' ? 'text-[10px] text-center' : size === 'lg' ? 'text-sm' : 'text-xs'}`}>{file.name}</p>
                      {size !== 'sm' && <p className="text-[#A8A29E] text-[10px] mt-0.5">{formatBytes(file.size_bytes)}</p>}
                    </button>
                    {size !== 'sm' && !trash && (
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setMenuFor(menuFor === file.id ? null : file.id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[#A8A29E] hover:text-[#141110] hover:bg-[#F2F0ED] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <IcoMore />
                        </button>
                        {menuFor === file.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-0 top-7 z-20 w-44 bg-white border border-[#E5E2DD] rounded-xl shadow-[0_8px_28px_rgba(20,17,16,0.12)] py-1.5">
                              <button onClick={() => openFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8]"><IcoEye /> Lihat</button>
                              <button onClick={() => downloadFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8]"><IcoDownload2 /> Download</button>
                              <button onClick={() => openShareForFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8]"><IcoShare /> Bagikan</button>
                              <button onClick={() => renameFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8]"><IcoRename /> Ubah nama</button>
                              <button onClick={() => deleteFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50"><IcoTrash /> Hapus</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {size !== 'sm' && sharedIds.has(file.id) && (
                    <span className="mt-1.5 flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#EBF0FF] text-[#1A56DB]"><IcoLink /> Dibagikan</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Preview modal ── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8" style={{ background: 'rgba(11,21,48,0.85)', backdropFilter: 'blur(4px)' }} onClick={() => setPreview(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 gap-4">
              <p className="text-white font-medium text-sm truncate">{preview.name}</p>
              <button onClick={() => setPreview(null)} className="text-white/70 hover:text-white flex-shrink-0" aria-label="Tutup">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            {(() => {
              const m = preview.mime.toLowerCase()
              const heic = /heic|heif/.test(m) || /\.heic$|\.heif$/i.test(preview.name)
              const isImage = m.startsWith('image/') && !heic
              const isVideo = m.startsWith('video/')
              const isAudio = m.startsWith('audio/')
              const isPdf = m === 'application/pdf' || /\.pdf$/i.test(preview.name)
              if (isImage && !previewError)
                return <img src={preview.url} alt={preview.name} onError={() => setPreviewError(true)} className="w-full max-h-[80vh] object-contain rounded-xl" />
              if (isVideo) return <video src={preview.url} controls autoPlay className="w-full max-h-[80vh] rounded-xl bg-black" />
              if (isAudio) return <div className="bg-white rounded-2xl p-8"><audio src={preview.url} controls autoPlay className="w-full" /></div>
              if (isPdf) return <iframe src={preview.url} title={preview.name} className="w-full rounded-xl bg-white" style={{ height: '80vh' }} />
              return (
                <div className="bg-white rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#EBF0FF] flex items-center justify-center mx-auto mb-4 text-[#1A56DB]"><IcoDoc /></div>
                  <p className="font-display font-bold text-[#141110] text-base mb-1">{heic ? 'Format HEIC' : 'Preview tidak tersedia'}</p>
                  <p className="text-[#A8A29E] text-sm mb-6 max-w-xs mx-auto">{heic ? 'Browser belum bisa menampilkan foto HEIC. Download untuk melihatnya.' : 'Tipe file ini tidak bisa dipratinjau langsung di browser.'}</p>
                  <a href={preview.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}><IcoDownload2 /> Download &amp; lihat</a>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
