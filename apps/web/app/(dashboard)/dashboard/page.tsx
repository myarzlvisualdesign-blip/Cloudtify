'use client'
import { useState } from 'react'
import Link from 'next/link'

function StorageRing({ used, total }: { used: number; total: number }) {
  const radius = 72
  const stroke = 10
  const r = radius - stroke / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - used / total)
  return (
    <div className="relative inline-flex items-center justify-center w-44 h-44">
      <svg width="176" height="176" viewBox="0 0 176 176" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="dashRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="88" cy="88" r={r} fill="none" stroke="#E8F0FF" strokeWidth={stroke} />
        <circle cx="88" cy="88" r={r} fill="none" stroke="url(#dashRing)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-[#0F172A]">{used} <span className="text-sm font-normal text-[#64748B]">GB</span></div>
        <div className="text-xs text-[#94A3B8]">/ {total} GB</div>
        <div className="text-[10px] text-emerald-500 font-semibold mt-1">Aktif</div>
      </div>
    </div>
  )
}

const RECENT_FILES = [
  { name: 'Foto Liburan Bali.jpg', size: '4.2 MB', type: '📸', date: '21 Mei', color: '#FFF7ED' },
  { name: 'Proposal Q2 2026.pdf', size: '1.8 MB', type: '📄', date: '20 Mei', color: '#EFF6FF' },
  { name: 'Video Keluarga.mp4', size: '38.5 MB', type: '🎬', date: '19 Mei', color: '#F0FDF4' },
  { name: 'Laporan Keuangan.xlsx', size: '0.9 MB', type: '📊', date: '18 Mei', color: '#F5F3FF' },
  { name: 'Arsip Backup.zip', size: '128 MB', type: '📦', date: '17 Mei', color: '#F1F5F9' },
]

const POPULAR_PLANS = [
  { name: 'Plus', storage: '100 GB', period: '1 Bulan', price: 'Rp15.000', icon: '⚡', color: '#EFF6FF' },
  { name: 'Pro', storage: '500 GB', period: '1 Bulan', price: 'Rp35.000', icon: '🚀', color: '#F5F3FF', popular: true },
]

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video' | 'doc'>('all')

  const CATEGORY_STATS = [
    { label: 'Foto', size: '2.1 GB', icon: '📸', pct: 60, color: '#FFF7ED', bar: '#FB923C' },
    { label: 'Video', size: '0.9 GB', icon: '🎬', pct: 26, color: '#F0FDF4', bar: '#22C55E' },
    { label: 'Dokumen', size: '0.5 GB', icon: '📄', pct: 14, color: '#EFF6FF', bar: '#3B82F6' },
  ]

  return (
    <div className="space-y-5 max-w-2xl mx-auto md:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-[#94A3B8] text-sm">Selamat datang kembali,</p>
          <h1 className="text-xl font-bold text-[#0F172A]">Hi Zels! 👋</h1>
        </div>
        <button className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">🔔</button>
      </div>

      {/* Main storage card */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 60%, #06B6D4 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/4 translate-x-1/4 bg-white" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-xs font-medium">Paket Free</p>
            <p className="text-white font-bold text-lg">Storage Kamu</p>
          </div>
          <Link href="/settings" className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-xl hover:shadow-md transition-all">
            + Upgrade
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <StorageRing used={3.5} total={15} />
          <div className="flex-1 ml-6 space-y-3">
            {CATEGORY_STATS.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-blue-100 flex items-center gap-1.5">{cat.icon} {cat.label}</span>
                  <span className="text-white font-semibold">{cat.size}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5">
            ⬆️ Upload File
          </button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5">
            📁 Buat Folder
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: '⬆️', label: 'Upload', href: '/files', bg: '#EFF6FF' },
          { icon: '🔗', label: 'Bagikan', href: '/files', bg: '#F0FDF4' },
          { icon: '📥', label: 'Unduh', href: '/files', bg: '#F5F3FF' },
          { icon: '🗑️', label: 'Sampah', href: '/files', bg: '#FFF1F2' },
        ].map((action) => (
          <Link key={action.label} href={action.href} className="card-hover p-3 flex flex-col items-center gap-2 text-center" style={{ background: action.bg }}>
            <span className="text-2xl">{action.icon}</span>
            <span className="text-[#64748B] text-xs font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Popular plans */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#0F172A] font-bold">Paket Populer</h2>
          <Link href="/#pricing" className="text-blue-500 text-sm font-semibold">Lihat Semua</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POPULAR_PLANS.map((plan) => (
            <div key={plan.name} className={`card p-5 relative ${plan.popular ? 'border-2 border-blue-300 shadow-md' : ''}`} style={{ background: plan.color }}>
              {plan.popular && (
                <span className="absolute -top-3 left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  Paling Populer
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">{plan.icon}</div>
                  <div>
                    <p className="text-[#0F172A] font-bold text-sm">{plan.name}</p>
                    <p className="text-[#94A3B8] text-xs">{plan.storage} · {plan.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#0F172A] font-bold text-sm">{plan.price}</p>
                  <Link href="/auth/register" className="text-blue-500 text-xs font-semibold hover:underline">Pilih ›</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent files */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#0F172A] font-bold">File Terbaru</h2>
          <Link href="/files" className="text-blue-500 text-sm font-semibold">Lihat Semua</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {[['all', 'Semua'], ['photo', '📸 Foto'], ['video', '🎬 Video'], ['doc', '📄 Dokumen']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'all' | 'photo' | 'video' | 'doc')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === key ? 'text-white shadow-sm' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
              }`}
              style={activeTab === key ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          {RECENT_FILES.map((file, i) => (
            <div key={file.name} className={`flex items-center gap-3 px-4 py-3.5 ${i < RECENT_FILES.length - 1 ? 'border-b border-[#F1F5F9]' : ''} hover:bg-[#F8FAFF] transition-colors cursor-pointer`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: file.color }}>
                {file.type}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0F172A] text-sm font-semibold truncate">{file.name}</p>
                <p className="text-[#94A3B8] text-xs">{file.size} · {file.date}</p>
              </div>
              <button className="text-[#CBD5E1] hover:text-[#64748B] transition-colors text-lg">⋮</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
