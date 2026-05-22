'use client'
import { useState } from 'react'

/* ── SVG icons ─────────────────────────────────────────────────────── */
const si = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function IcoImage()    { return <svg {...si} stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> }
function IcoVideo()    { return <svg {...si} stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> }
function IcoDoc()      { return <svg {...si} stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> }
function IcoArchive()  { return <svg {...si} stroke="currentColor"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg> }
function IcoDesign()   { return <svg {...si} stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> }
function IcoAudio()    { return <svg {...si} stroke="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function IcoFolder()   { return <svg {...si} stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> }
function IcoSearch()   { return <svg {...si} stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IcoUpload()   { return <svg {...si} stroke="currentColor"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> }
function IcoLink()     { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> }
function IcoMore()     { return <svg {...si} stroke="currentColor"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg> }
function IcoGrid()     { return <svg {...si} stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> }
function IcoList()     { return <svg {...si} stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }

/* ── File type → icon + accent ─────────────────────────────────────── */
const FILE_TYPE_MAP = {
  image:    { Icon: IcoImage,   accent: '#D97706', bg: '#FFF7ED' },
  video:    { Icon: IcoVideo,   accent: '#059669', bg: '#ECFDF5' },
  document: { Icon: IcoDoc,     accent: '#1A56DB', bg: '#EBF0FF' },
  archive:  { Icon: IcoArchive, accent: '#6B6560', bg: '#F2F0ED' },
  design:   { Icon: IcoDesign,  accent: '#7C3AED', bg: '#F5F3FF' },
  audio:    { Icon: IcoAudio,   accent: '#BE185D', bg: '#FFF1F2' },
} as const

const FILES = [
  { name: 'foto_liburan_bali.jpg',       size: '4,2 MB',   type: 'image',    date: '21 Mei 2026', shared: true },
  { name: 'proposal_q2_2026.pdf',         size: '1,8 MB',   type: 'document', date: '20 Mei 2026', shared: true },
  { name: 'video_keluarga_lebaran.mp4',   size: '38,5 MB',  type: 'video',    date: '19 Mei 2026', shared: false },
  { name: 'laporan_keuangan_q1.xlsx',     size: '0,9 MB',   type: 'document', date: '18 Mei 2026', shared: false },
  { name: 'arsip_backup_2026.zip',        size: '128 MB',   type: 'archive',  date: '17 Mei 2026', shared: false },
  { name: 'design_cloudtify.fig',         size: '22,4 MB',  type: 'design',   date: '16 Mei 2026', shared: true },
  { name: 'musik_favorit.mp3',            size: '8,1 MB',   type: 'audio',    date: '15 Mei 2026', shared: false },
  { name: 'screenshot_app.png',           size: '1,2 MB',   type: 'image',    date: '14 Mei 2026', shared: false },
]

const FOLDERS = [
  { name: 'Foto Keluarga',  files: 42, size: '1,8 GB' },
  { name: 'Dokumen Kerja',  files: 18, size: '340 MB' },
  { name: 'Video',          files: 7,  size: '1,2 GB' },
]

const FILTERS: [string, string][] = [
  ['all', 'Semua'],
  ['image', 'Foto'],
  ['video', 'Video'],
  ['document', 'Dokumen'],
  ['archive', 'Arsip'],
]

export default function FilesPage() {
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = FILES.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || f.type === filter)
  )

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between pt-2 gap-4">
        <div>
          <h1 className="font-display font-bold text-[#141110] text-xl tracking-tight">File Saya</h1>
          <p className="text-[#A8A29E] text-sm mt-0.5">{FILES.length} file · 3,5 GB digunakan</p>
        </div>
        <button className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl
          hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/20 transition-all duration-200 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
          <IcoUpload />
          Upload
        </button>
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoSearch /></span>
        <input
          type="text"
          placeholder="Cari file..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-10 pr-4 py-3 text-sm text-[#141110]
            placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/50 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all"
        />
      </div>

      {/* ── Folders ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-[#141110] text-sm">Folder</h2>
          <button className="text-[#1A56DB] text-xs font-semibold hover:opacity-75 transition-opacity">+ Folder Baru</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FOLDERS.map((folder) => (
            <button key={folder.name}
              className="bg-white border border-[#E5E2DD] rounded-xl p-4 text-left
                hover:border-[#C2D0F8] hover:shadow-[0_4px_16px_rgba(26,86,219,0.08)] transition-all duration-200 group">
              <div className="text-[#1A56DB] mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
                <IcoFolder />
              </div>
              <p className="font-display font-semibold text-[#141110] text-xs leading-snug truncate">{folder.name}</p>
              <p className="text-[#A8A29E] text-[10px] mt-1">{folder.files} file · {folder.size}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter + view toggle ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {FILTERS.map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === key
                  ? 'bg-[#1A56DB] text-white shadow-sm'
                  : 'bg-white text-[#6B6560] border border-[#E5E2DD] hover:border-[#C2D0F8] hover:text-[#141110]'
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {([['list', IcoList], ['grid', IcoGrid]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v as 'grid' | 'list')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                view === v
                  ? 'bg-[#EBF0FF] text-[#1A56DB]'
                  : 'bg-white text-[#A8A29E] border border-[#E5E2DD] hover:text-[#141110]'
              }`}>
              <Icon />
            </button>
          ))}
        </div>
      </div>

      {/* ── File list / grid ─────────────────────────────────────── */}
      {view === 'list' ? (
        <div className="bg-white border border-[#E5E2DD] rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[#A8A29E] text-sm">Tidak ada file ditemukan</div>
          ) : filtered.map((file, i) => {
            const meta = FILE_TYPE_MAP[file.type as keyof typeof FILE_TYPE_MAP] ?? FILE_TYPE_MAP.document
            const { Icon, accent, bg } = meta
            return (
              <div key={file.name}
                className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer
                  hover:bg-[#FAFAF8] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#F2F0ED]' : ''}`}>
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg, color: accent }}>
                  <Icon />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#141110] text-sm truncate">{file.name}</p>
                  <p className="text-[#A8A29E] text-xs mt-0.5">{file.size} · {file.date}</p>
                </div>
                {/* Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.shared && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                      bg-[#EBF0FF] text-[#1A56DB]">
                      <IcoLink /> Dibagikan
                    </span>
                  )}
                  <button className="text-[#D4CFC9] hover:text-[#6B6560] transition-colors p-1">
                    <IcoMore />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((file) => {
            const meta = FILE_TYPE_MAP[file.type as keyof typeof FILE_TYPE_MAP] ?? FILE_TYPE_MAP.document
            const { Icon, accent, bg } = meta
            return (
              <button key={file.name}
                className="bg-white border border-[#E5E2DD] rounded-xl p-4 text-left cursor-pointer
                  hover:border-[#C2D0F8] hover:shadow-[0_4px_16px_rgba(26,86,219,0.08)] transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: bg, color: accent }}>
                  <Icon />
                </div>
                <p className="font-medium text-[#141110] text-xs truncate">{file.name}</p>
                <p className="text-[#A8A29E] text-[10px] mt-1">{file.size}</p>
                {file.shared && (
                  <span className="mt-2 flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-full text-[9px] font-semibold
                    bg-[#EBF0FF] text-[#1A56DB]">
                    <IcoLink /> Dibagikan
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
