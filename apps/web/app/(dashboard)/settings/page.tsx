'use client'
import { useState } from 'react'
import Link from 'next/link'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all ${value ? '' : 'bg-[#E2E8F0]'}`}
      style={value ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${value ? 'left-6' : 'left-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="pt-2">
        <h1 className="text-xl font-bold text-[#0F172A]">Pengaturan</h1>
        <p className="text-[#94A3B8] text-sm">Kelola akun dan preferensi kamu</p>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            Z
          </div>
          <div>
            <h2 className="text-[#0F172A] font-bold text-lg">Zels!</h2>
            <p className="text-[#94A3B8] text-sm">mvdgroupindonesia@gmail.com</p>
            <span className="tag-blue mt-1 inline-block">Paket Free</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white text-[#2563EB] font-semibold rounded-2xl px-6 py-2.5 border-2 border-blue-200 transition-all hover:border-blue-400 hover:shadow-sm text-sm">Edit Profil</button>
          <Link href="/#pricing" className="text-white font-semibold rounded-2xl px-6 py-2.5 text-center text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>Upgrade Paket</Link>
        </div>
      </div>

      {/* Storage usage */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#0F172A] font-bold text-sm">Storage</h3>
          <span className="text-[#94A3B8] text-xs">3.5 GB / 15 GB</span>
        </div>
        <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full" style={{ width: '23%', background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
        </div>
        <div className="flex justify-between text-xs text-[#94A3B8]">
          <span>11.5 GB tersisa</span>
          <span>23% terpakai</span>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-5">
        <h3 className="text-[#0F172A] font-bold text-sm mb-4">Preferensi</h3>
        <div className="space-y-4">
          {[
            { label: 'Notifikasi Push', desc: 'Terima notifikasi upload & berbagi', value: notifications, onChange: setNotifications, icon: '🔔' },
            { label: 'Backup Otomatis', desc: 'Backup foto dari galeri secara otomatis', value: autoBackup, onChange: setAutoBackup, icon: '🔄' },
            { label: 'Verifikasi 2 Langkah', desc: 'Tingkatkan keamanan akun', value: twoFactor, onChange: setTwoFactor, icon: '🔐' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-[#0F172A] text-sm font-semibold">{item.label}</p>
                  <p className="text-[#94A3B8] text-xs">{item.desc}</p>
                </div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Account actions */}
      <div className="card p-5">
        <h3 className="text-[#0F172A] font-bold text-sm mb-4">Akun</h3>
        <div className="space-y-2">
          {[
            { label: 'Ganti Password', icon: '🔑', color: '#EFF6FF' },
            { label: 'Kelola Perangkat', icon: '📱', color: '#F0FDF4' },
            { label: 'Referral & Bonus', icon: '🎁', color: '#FEFCE8' },
            { label: 'Pusat Bantuan', icon: '💬', color: '#F5F3FF' },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:shadow-sm transition-all text-left" style={{ background: item.color }}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[#0F172A] text-sm font-medium flex-1">{item.label}</span>
              <span className="text-[#CBD5E1]">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-5 border-red-100" style={{ background: '#FFF1F2' }}>
        <h3 className="text-red-500 font-bold text-sm mb-3">Zona Berbahaya</h3>
        <button className="w-full text-red-500 font-semibold text-sm py-3 rounded-2xl bg-white border border-red-200 hover:bg-red-50 transition-colors">
          Hapus Akun
        </button>
      </div>
    </div>
  )
}
