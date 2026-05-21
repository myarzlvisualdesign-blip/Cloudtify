'use client'
import Link from 'next/link'

function StorageRing({ used, total }: { used: number; total: number }) {
  const radius = 90
  const stroke = 14
  const r = radius - stroke / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - used / total)
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: 208, height: 208 }}>
      <svg width="208" height="208" viewBox="0 0 208 208" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="dashRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="104" cy="104" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} />
        <circle cx="104" cy="104" r={r} fill="none" stroke="url(#dashRing)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute text-center">
        <div className="font-bold text-white leading-none" style={{ fontSize: 42 }}>
          {used}
          <span className="text-lg font-normal text-white/60 ml-1">GB</span>
        </div>
        <div className="text-white/50 text-sm mt-1">/ {total} GB</div>
      </div>
    </div>
  )
}

const RECENT_FILES = [
  { name: 'foto_liburan.jpg', size: '4.2 MB', icon: '📸', color: '#F0F4FF' },
  { name: 'proposal.pdf', size: '1.8 MB', icon: '📄', color: '#FFF7ED' },
  { name: 'video_keluarga.mp4', size: '38.5 MB', icon: '🎬', color: '#F0FDF4' },
  { name: 'laporan_keuangan.xlsx', size: '0.9 MB', icon: '📊', color: '#F5F3FF' },
  { name: 'arsip_backup.zip', size: '128 MB', icon: '📦', color: '#F1F5F9' },
]

export default function UserDashboard() {
  return (
    <div className="-m-4 md:-m-6 flex flex-col min-h-screen" style={{ background: 'linear-gradient(160deg, #1A56DB 0%, #0EA5E9 55%, #06B6D4 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <p className="text-white/60 text-sm">Selamat datang kembali,</p>
          <h1 className="text-2xl font-bold text-white">Hi Zels! 👋</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg">
          👤
        </div>
      </div>

      {/* Storage card */}
      <div className="mx-4 mt-3 rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.15)' }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-white/60 text-xs">Paket Free</p>
            <p className="text-white font-bold text-base">Aktif selamanya</p>
          </div>
          <Link href="/settings"
            className="bg-white text-blue-600 text-xs font-bold px-5 py-2 rounded-full hover:shadow-md transition-all">
            Upgrade
          </Link>
        </div>

        {/* Ring */}
        <div className="flex justify-center py-2">
          <StorageRing used={3.5} total={15} />
        </div>

        {/* Category stats */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {[['📸', '2.1 GB', 'Foto'], ['🎬', '0.9 GB', 'Video'], ['📄', '0.5 GB', 'Dok']].map(([icon, size, label]) => (
            <div key={label} className="text-center py-1">
              <span className="text-2xl">{icon}</span>
              <p className="text-white font-bold text-sm mt-1">{size}</p>
              <p className="text-white/55 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-5">
        <p className="text-white font-bold text-base mb-3">Aksi Cepat</p>
        <div className="grid grid-cols-3 gap-3">
          {[['⬆️', 'Upload', '/files'], ['🔗', 'Bagikan', '/files'], ['📥', 'Unduh', '/files']].map(([icon, label, href]) => (
            <Link key={label} href={href}
              className="rounded-2xl py-4 flex flex-col items-center gap-2 transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <span className="text-2xl">{icon}</span>
              <span className="text-white text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* File Terbaru — white card */}
      <div className="mt-6 flex-1 bg-white rounded-t-[32px] px-5 pt-5 pb-6 md:rounded-3xl md:mx-0 md:mb-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#0F172A] font-bold text-base">File Terbaru</h2>
          <Link href="/files" className="text-blue-500 text-sm font-semibold">Lihat Semua</Link>
        </div>
        <div>
          {RECENT_FILES.map((file, i) => (
            <div key={file.name}
              className={`flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-[#F8FAFF] transition-colors cursor-pointer ${i < RECENT_FILES.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: file.color }}>
                {file.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0F172A] text-sm font-semibold truncate">{file.name}</p>
                <p className="text-[#94A3B8] text-xs">{file.size}</p>
              </div>
              <span className="text-[#CBD5E1] text-lg flex-shrink-0">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
