'use client'
import Link from 'next/link'

/* ── SVG icons ─────────────────────────────────────────────────────── */
const si = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const sm = { ...si, width: 18, height: 18 }

function IcoImage()    { return <svg {...si} stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> }
function IcoVideo()    { return <svg {...si} stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> }
function IcoDoc()      { return <svg {...si} stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }
function IcoArchive()  { return <svg {...si} stroke="currentColor"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg> }
function IcoMusic()    { return <svg {...si} stroke="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }

function IcoUpload()   { return <svg {...sm} stroke="currentColor"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> }
function IcoShare()    { return <svg {...sm} stroke="currentColor"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> }
function IcoDownload() { return <svg {...sm} stroke="currentColor"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg> }
function IcoChevronR() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg> }

/* ── File type icons + accents ─────────────────────────────────────── */
const FILE_TYPES = {
  image:    { Icon: IcoImage,   accent: '#D97706', bg: '#FFF7ED' },
  video:    { Icon: IcoVideo,   accent: '#059669', bg: '#ECFDF5' },
  document: { Icon: IcoDoc,     accent: '#1A56DB', bg: '#EBF0FF' },
  archive:  { Icon: IcoArchive, accent: '#6B6560', bg: '#F2F0ED' },
  audio:    { Icon: IcoMusic,   accent: '#BE185D', bg: '#FFF1F2' },
} as const

/* ── Storage ring ──────────────────────────────────────────────────── */
function StorageRing({ used, total }: { used: number; total: number }) {
  const r    = 76
  const stroke = 11
  const ri   = r - stroke / 2
  const circ = 2 * Math.PI * ri
  const offset = circ * (1 - used / total)
  const size = r * 2

  return (
    <div className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8"/>
            <stop offset="100%" stopColor="#06B6D4"/>
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={ri} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={stroke}/>
        <circle cx={r} cy={r} r={ri} fill="none" stroke="url(#ringG)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}/>
      </svg>
      <div className="absolute text-center">
        <div className="font-display font-bold text-white leading-none" style={{ fontSize: 32 }}>
          {used}<span className="text-base font-normal text-white/60 ml-0.5">GB</span>
        </div>
        <div className="text-white/50 text-xs mt-0.5">/ {total} GB</div>
      </div>
    </div>
  )
}

/* ── Data ──────────────────────────────────────────────────────────── */
const RECENT_FILES = [
  { name: 'foto_liburan.jpg',      size: '4,2 MB',  type: 'image' },
  { name: 'proposal.pdf',           size: '1,8 MB',  type: 'document' },
  { name: 'video_keluarga.mp4',     size: '38,5 MB', type: 'video' },
  { name: 'laporan_keuangan.xlsx',  size: '0,9 MB',  type: 'document' },
  { name: 'arsip_backup.zip',       size: '128 MB',  type: 'archive' },
]

const CATEGORIES = [
  { Icon: IcoImage, label: 'Foto',  size: '2,1 GB', accent: '#38BDF8' },
  { Icon: IcoVideo, label: 'Video', size: '0,9 GB', accent: '#34D399' },
  { Icon: IcoDoc,   label: 'Dok',   size: '0,5 GB', accent: '#A78BFA' },
]

const QUICK_ACTIONS = [
  { Icon: IcoUpload,   label: 'Upload',  href: '/files' },
  { Icon: IcoShare,    label: 'Bagikan', href: '/files' },
  { Icon: IcoDownload, label: 'Unduh',   href: '/files' },
]

export default function UserDashboard() {
  return (
    <div className="-m-4 md:-m-8 flex flex-col min-h-screen"
      style={{ background: 'linear-gradient(160deg, #0F2D8A 0%, #1A56DB 55%, #2B9FD4 100%)' }}>

      {/* ── Blue top section ──────────────────────────────────── */}
      <div className="px-5 pt-7 pb-5">

        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/55 text-sm">Selamat datang kembali,</p>
            <h1 className="font-display font-bold text-white text-2xl tracking-tight mt-0.5">Hi, Zels</h1>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold"
            style={{ background: 'rgba(255,255,255,0.18)' }}>
            Z
          </div>
        </div>

        {/* Storage card */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.14)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/55 text-xs">Paket Free</p>
              <p className="text-white font-display font-semibold text-sm mt-0.5">Aktif selamanya</p>
            </div>
            <Link href="/settings"
              className="bg-white text-[#1A56DB] text-xs font-bold px-4 py-2 rounded-full
                hover:shadow-lg hover:shadow-black/20 hover:-translate-y-px transition-all duration-200">
              Upgrade
            </Link>
          </div>

          {/* Ring + categories side by side on larger screens */}
          <div className="flex items-center gap-6">
            <div className="flex justify-center">
              <StorageRing used={3.5} total={15} />
            </div>
            <div className="flex-1 space-y-3">
              {CATEGORIES.map(({ Icon, label, size, accent }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.12)', color: accent }}>
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{label}</span>
                      <span className="text-white font-medium">{size}</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <div className="h-full rounded-full" style={{ width: label === 'Foto' ? '60%' : label === 'Video' ? '26%' : '14%', background: accent }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Aksi Cepat</p>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ Icon, label, href }) => (
              <Link key={label} href={href}
                className="rounded-xl py-4 flex flex-col items-center gap-2.5
                  hover:-translate-y-0.5 hover:bg-white/25 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.16)' }}>
                <div className="text-white"><Icon /></div>
                <span className="text-white/80 text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── White file card ───────────────────────────────────── */}
      <div className="flex-1 bg-[#FAFAF8] rounded-t-[28px] px-5 pt-6 pb-8 mt-2 md:rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-[#141110] text-base">File Terbaru</h2>
          <Link href="/files" className="text-[#1A56DB] text-sm font-semibold hover:opacity-75 transition-opacity">
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-0.5">
          {RECENT_FILES.map((file) => {
            const meta = FILE_TYPES[file.type as keyof typeof FILE_TYPES] ?? FILE_TYPES.document
            const { Icon, accent, bg } = meta
            return (
              <div key={file.name}
                className="flex items-center gap-3.5 py-3 rounded-xl hover:bg-[#F2F0ED] transition-colors cursor-pointer px-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg, color: accent }}>
                  <Icon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#141110] text-sm truncate">{file.name}</p>
                  <p className="text-[#A8A29E] text-xs mt-0.5">{file.size}</p>
                </div>
                <span className="text-[#D4CFC9] flex-shrink-0"><IcoChevronR /></span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
