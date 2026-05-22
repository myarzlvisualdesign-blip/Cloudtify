'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatBytes, formatRelativeDate } from '@cloudtify/utils'
import { supabase } from '../../../lib/supabase/client'
import { useUser } from '../../../lib/auth'

const MAX_BYTES = 52428800 // 50 MB (bucket cap)

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
  const [uploadMsg, setUploadMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [newFolder, setNewFolder] = useState('')
  const [showFolderInput, setShowFolderInput] = useState(false)
  const [trash, setTrash] = useState(false)
  const [preview, setPreview] = useState<{ url: string; name: string; cat: Cat } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function downloadFile(f: FileRow) {
    setMenuFor(null)
    const { data } = await supabase.storage.from(f.r2_bucket || 'files').createSignedUrl(f.r2_key, 120, { download: f.name })
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  // Click a file → preview images/videos inline; otherwise download.
  async function openFile(f: FileRow) {
    const cat = catOf(f.mime_type)
    if (cat === 'image' || cat === 'video') {
      setBusyId(f.id)
      const { data } = await supabase.storage.from(f.r2_bucket || 'files').createSignedUrl(f.r2_key, 300)
      setBusyId(null)
      if (data?.signedUrl) setPreview({ url: data.signedUrl, name: f.name, cat })
    } else {
      downloadFile(f)
    }
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
    // Soft-delete → moves to recycle bin (restorable 30 days); storage_usage re-syncs via trigger.
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
    // Permanent: remove the stored object, then delete the row for good.
    await supabase.storage.from(f.r2_bucket || 'files').remove([f.r2_key])
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
    setUploading(true)
    let failed = 0
    for (const file of Array.from(list)) {
      if (file.size > MAX_BYTES) {
        setUploadMsg(`"${file.name}" lebih dari 50 MB — dilewati`)
        failed++
        continue
      }
      const safe = file.name.replace(/[^\w.\-]+/g, '_')
      const path = `${user.id}/${Date.now()}_${safe}`
      const { error: upErr } = await supabase.storage.from('files').upload(path, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })
      if (upErr) { failed++; setUploadMsg('Gagal upload: ' + upErr.message); continue }
      const { error: insErr } = await supabase.from('files').insert({
        user_id: user.id,
        name: file.name,
        original_name: file.name,
        mime_type: file.type || 'application/octet-stream',
        size_bytes: file.size,
        r2_key: path,
        r2_bucket: 'files',
        visibility: 'private',
      })
      if (insErr) { failed++; setUploadMsg('Gagal simpan: ' + insErr.message) }
    }
    await loadData()
    setUploading(false)
    if (failed === 0) setUploadMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const folderCounts = useMemo(() => {
    const m = new Map<string, number>()
    files.forEach((f) => { if (f.folder_id) m.set(f.folder_id, (m.get(f.folder_id) ?? 0) + 1) })
    return m
  }, [files])

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || catOf(f.mime_type) === filter),
  )

  return (
    <div
      className="space-y-6 relative"
      onDragOver={(e) => { e.preventDefault(); if (!trash && !dragging) setDragging(true) }}
      onDragLeave={(e) => { e.preventDefault(); if (e.currentTarget === e.target) setDragging(false) }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!trash) handleFiles(e.dataTransfer.files) }}
    >
      {dragging && !trash && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none p-6" style={{ background: 'rgba(26,86,219,0.08)', backdropFilter: 'blur(2px)' }}>
          <div className="rounded-3xl border-2 border-dashed border-[#1A56DB] bg-white px-10 py-8 text-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF0FF] flex items-center justify-center mx-auto mb-3 text-[#1A56DB]"><IcoUpload /></div>
            <p className="font-display font-bold text-[#141110] text-base">Lepas untuk upload</p>
            <p className="text-[#A8A29E] text-xs mt-1">File langsung tersimpan ke Cloudtify</p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between pt-2 gap-3">
        <div>
          <h1 className="font-display font-bold text-[#141110] text-xl tracking-tight">{trash ? 'Sampah' : 'File Saya'}</h1>
          <p className="text-[#A8A29E] text-sm mt-0.5">{loading ? 'Memuat…' : trash ? `${files.length} file · pulih dalam ≤30 hari` : `${files.length} file · ${formatBytes(usedBytes)} digunakan`}</p>
        </div>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => { setTrash((t) => !t); setMenuFor(null) }} className={`flex items-center gap-2 text-sm font-semibold px-3.5 py-2.5 rounded-xl border transition-all ${trash ? 'bg-[#EBF0FF] border-[#C2D0F8] text-[#1A56DB]' : 'bg-white border-[#E5E2DD] text-[#6B6560] hover:border-[#C2BDB8] hover:text-[#141110]'}`}>
            <IcoTrash /> {trash ? 'Kembali' : 'Sampah'}
          </button>
          {!trash && (
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/20 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              {uploading ? (<><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg> Mengupload…</>) : (<><IcoUpload /> Upload</>)}
            </button>
          )}
        </div>
      </div>

      {uploadMsg && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700 font-medium">{uploadMsg}</div>
      )}

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoSearch /></span>
        <input type="text" placeholder="Cari file…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-10 pr-4 py-3 text-sm text-[#141110] placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/50 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all" />
      </div>

      {!trash && (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {folders.slice(0, 6).map((folder) => (
              <div key={folder.id} className="bg-white border border-[#E5E2DD] rounded-xl p-4 text-left hover:border-[#C2D0F8] hover:shadow-[0_4px_16px_rgba(26,86,219,0.08)] transition-all duration-200 group cursor-pointer">
                <div className="text-[#1A56DB] mb-3 opacity-70 group-hover:opacity-100 transition-opacity"><IcoFolder /></div>
                <p className="font-display font-semibold text-[#141110] text-xs leading-snug truncate">{folder.name}</p>
                <p className="text-[#A8A29E] text-[10px] mt-1">{folderCounts.get(folder.id) ?? 0} file</p>
              </div>
            ))}
          </div>
        ) : (
          !showFolderInput && <p className="text-[#A8A29E] text-xs">Belum ada folder. Buat folder pertama untuk merapikan file.</p>
        )}
      </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {FILTERS.map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === key ? 'bg-[#1A56DB] text-white shadow-sm' : 'bg-white text-[#6B6560] border border-[#E5E2DD] hover:border-[#C2D0F8] hover:text-[#141110]'}`}>{label}</button>
          ))}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {([['list', IcoList], ['grid', IcoGrid]] as const).map(([v, IconCmp]) => (
            <button key={v} onClick={() => setView(v as 'grid' | 'list')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === v ? 'bg-[#EBF0FF] text-[#1A56DB]' : 'bg-white text-[#A8A29E] border border-[#E5E2DD] hover:text-[#141110]'}`}><IconCmp /></button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#E5E2DD] rounded-2xl py-16 text-center text-[#A8A29E] text-sm">Memuat file…</div>
      ) : files.length === 0 ? (
        <div className="bg-white border border-[#E5E2DD] rounded-2xl py-16 text-center">
          {trash ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[#F2F0ED] flex items-center justify-center mx-auto mb-4 text-[#A8A29E]"><IcoTrash /></div>
              <p className="text-[#141110] text-sm font-semibold mb-1">Sampah kosong</p>
              <p className="text-[#A8A29E] text-xs">File yang kamu hapus muncul di sini & bisa dipulihkan ≤30 hari.</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[#EBF0FF] flex items-center justify-center mx-auto mb-4 text-[#1A56DB]"><IcoUpload /></div>
              <p className="text-[#141110] text-sm font-semibold mb-1">Belum ada file</p>
              <p className="text-[#A8A29E] text-xs mb-5">File yang kamu upload akan muncul di sini.</p>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                <IcoUpload /> {uploading ? 'Mengupload…' : 'Upload File'}
              </button>
            </>
          )}
        </div>
      ) : view === 'list' ? (
        <div className="bg-white border border-[#E5E2DD] rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[#A8A29E] text-sm">Tidak ada file ditemukan</div>
          ) : filtered.map((file, i) => {
            const { Icon: IconCmp, accent, bg } = FILE_TYPE_MAP[catOf(file.mime_type)]
            return (
              <div key={file.id} onClick={() => { if (!trash) openFile(file) }} className={`flex items-center gap-3.5 px-5 py-3.5 ${trash ? '' : 'cursor-pointer'} hover:bg-[#FAFAF8] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#F2F0ED]' : ''} ${busyId === file.id ? 'opacity-50' : ''}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg, color: accent }}><IconCmp /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#141110] text-sm truncate">{file.name}</p>
                  <p className="text-[#A8A29E] text-xs mt-0.5">{formatBytes(file.size_bytes)} · {formatRelativeDate(file.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {sharedIds.has(file.id) && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF0FF] text-[#1A56DB]"><IcoLink /> Dibagikan</span>}
                  <div className="relative">
                    <button onClick={() => setMenuFor(menuFor === file.id ? null : file.id)} className="text-[#A8A29E] hover:text-[#141110] hover:bg-[#F2F0ED] rounded-lg p-1.5 transition-colors"><IcoMore /></button>
                    {menuFor === file.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                        <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-[#E5E2DD] rounded-xl shadow-[0_8px_28px_rgba(20,17,16,0.12)] py-1.5 overflow-hidden">
                          {trash ? (
                            <>
                              <button onClick={() => restoreFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoRestore /> Pulihkan</button>
                              <button onClick={() => purgeFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 transition-colors"><IcoTrash /> Hapus permanen</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => openFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoEye /> Lihat</button>
                              <button onClick={() => downloadFile(file)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#141110] hover:bg-[#FAFAF8] transition-colors"><IcoDownload2 /> Download</button>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((file) => {
            const { Icon: IconCmp, accent, bg } = FILE_TYPE_MAP[catOf(file.mime_type)]
            return (
              <button key={file.id} onClick={() => (trash ? restoreFile(file) : openFile(file))} title={trash ? 'Klik untuk pulihkan' : 'Klik untuk lihat'} className={`bg-white border border-[#E5E2DD] rounded-xl p-4 text-left cursor-pointer hover:border-[#C2D0F8] hover:shadow-[0_4px_16px_rgba(26,86,219,0.08)] transition-all duration-200 ${busyId === file.id ? 'opacity-50' : ''}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg, color: accent }}><IconCmp /></div>
                <p className="font-medium text-[#141110] text-xs truncate">{file.name}</p>
                <p className="text-[#A8A29E] text-[10px] mt-1">{formatBytes(file.size_bytes)}</p>
                {sharedIds.has(file.id) && <span className="mt-2 flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#EBF0FF] text-[#1A56DB]"><IcoLink /> Dibagikan</span>}
              </button>
            )
          })}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" style={{ background: 'rgba(11,21,48,0.85)', backdropFilter: 'blur(4px)' }} onClick={() => setPreview(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 gap-4">
              <p className="text-white font-medium text-sm truncate">{preview.name}</p>
              <button onClick={() => setPreview(null)} className="text-white/70 hover:text-white flex-shrink-0" aria-label="Tutup">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            {preview.cat === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt={preview.name} className="w-full max-h-[78vh] object-contain rounded-xl" />
            ) : (
              <video src={preview.url} controls autoPlay className="w-full max-h-[78vh] rounded-xl bg-black" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
