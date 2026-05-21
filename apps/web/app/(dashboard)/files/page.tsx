'use client'
import { useState } from 'react'

const FILES = [
  { name: 'foto_liburan_bali.jpg', size: '4.2 MB', type: 'image', icon: '📸', date: '21 Mei 2026', color: '#FFF7ED', shared: true },
  { name: 'proposal_q2_2026.pdf', size: '1.8 MB', type: 'document', icon: '📄', date: '20 Mei 2026', color: '#EFF6FF', shared: true },
  { name: 'video_keluarga_lebaran.mp4', size: '38.5 MB', type: 'video', icon: '🎬', date: '19 Mei 2026', color: '#F0FDF4', shared: false },
  { name: 'laporan_keuangan_q1.xlsx', size: '0.9 MB', type: 'document', icon: '📊', date: '18 Mei 2026', color: '#F5F3FF', shared: false },
  { name: 'arsip_backup_2026.zip', size: '128 MB', type: 'archive', icon: '📦', date: '17 Mei 2026', color: '#F1F5F9', shared: false },
  { name: 'design_cloudtify.fig', size: '22.4 MB', type: 'design', icon: '🎨', date: '16 Mei 2026', color: '#FEFCE8', shared: true },
  { name: 'musik_favorit.mp3', size: '8.1 MB', type: 'audio', icon: '🎵', date: '15 Mei 2026', color: '#FFF1F2', shared: false },
  { name: 'screenshot_app.png', size: '1.2 MB', type: 'image', icon: '🖼️', date: '14 Mei 2026', color: '#FFF7ED', shared: false },
]

const FOLDERS = [
  { name: 'Foto Keluarga', files: 42, size: '1.8 GB', color: '#FFF7ED', icon: '📸' },
  { name: 'Dokumen Kerja', files: 18, size: '340 MB', color: '#EFF6FF', icon: '📁' },
  { name: 'Video', files: 7, size: '1.2 GB', color: '#F0FDF4', icon: '🎬' },
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
    <div className="space-y-5 max-w-2xl mx-auto md:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">File Saya</h1>
          <p className="text-[#94A3B8] text-sm">{FILES.length} file · 3.5 GB digunakan</p>
        </div>
        <button className="text-white text-sm font-semibold px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
          ⬆️ Upload
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">🔍</span>
        <input
          type="text"
          placeholder="Cari file..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#E2E8F0] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm"
        />
      </div>

      {/* Folders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#0F172A] font-bold">Folder</h2>
          <button className="text-blue-500 text-sm font-semibold">+ Folder Baru</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FOLDERS.map((folder) => (
            <div key={folder.name} className="card-hover p-4" style={{ background: folder.color }}>
              <div className="text-2xl mb-2">{folder.icon}</div>
              <p className="text-[#0F172A] font-semibold text-xs truncate">{folder.name}</p>
              <p className="text-[#94A3B8] text-[10px] mt-0.5">{folder.files} file · {folder.size}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + View toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {[['all', 'Semua'], ['image', '📸 Foto'], ['video', '🎬 Video'], ['document', '📄 Dokumen'], ['archive', '📦 Arsip']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === key ? 'text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
              }`}
              style={filter === key ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {[['list', '☰'], ['grid', '⊞']].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v as 'grid' | 'list')} className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${view === v ? 'bg-blue-50 text-blue-600' : 'bg-white text-[#94A3B8] border border-[#E2E8F0]'}`}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Files */}
      {view === 'list' ? (
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#94A3B8] text-sm">Tidak ada file ditemukan</div>
          ) : filtered.map((file, i) => (
            <div key={file.name} className={`flex items-center gap-3 px-4 py-3.5 ${i < filtered.length - 1 ? 'border-b border-[#F1F5F9]' : ''} hover:bg-[#F8FAFF] transition-colors cursor-pointer`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: file.color }}>
                {file.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0F172A] text-sm font-semibold truncate">{file.name}</p>
                <p className="text-[#94A3B8] text-xs">{file.size} · {file.date}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {file.shared && <span className="tag-blue">Dibagikan</span>}
                <button className="text-[#CBD5E1] hover:text-[#64748B] transition-colors text-lg">⋮</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((file) => (
            <div key={file.name} className="card-hover p-4 cursor-pointer" style={{ background: file.color }}>
              <div className="text-3xl mb-3 text-center">{file.icon}</div>
              <p className="text-[#0F172A] text-xs font-semibold truncate">{file.name}</p>
              <p className="text-[#94A3B8] text-[10px] mt-0.5">{file.size}</p>
              {file.shared && <span className="tag-blue mt-2 inline-block">Dibagikan</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
