'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatBytes, formatIDR } from '@cloudtify/utils'

interface Stats {
  totalUsers: number
  activeSubscriptions: number
  totalStorageBytes: number
  mrr: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-lg transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1
              ? 'linear-gradient(180deg, #2563EB, #06B6D4)'
              : '#E8F0FF',
            minHeight: 4,
          }}
        />
      ))}
    </div>
  )
}

const MOCK_USER_GROWTH = [120, 180, 240, 310, 420, 560, 680, 790, 850, 920, 1050, 1240]
const MOCK_REVENUE = [0, 150000, 320000, 580000, 890000, 1200000, 1450000, 1680000, 1920000, 2100000, 2350000, 2800000]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeSubscriptions: 0, totalStorageBytes: 0, mrr: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, subsRes, storageRes, paymentsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('storage_usage').select('used_bytes'),
          supabase.from('payments').select('amount_idr').eq('status', 'success').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        ])
        const totalStorageBytes = ((storageRes.data ?? []) as { used_bytes: number }[]).reduce((a, r) => a + (r.used_bytes ?? 0), 0)
        const mrr = ((paymentsRes.data ?? []) as { amount_idr: number }[]).reduce((a, r) => a + (r.amount_idr ?? 0), 0)
        setStats({ totalUsers: usersRes.count ?? 0, activeSubscriptions: subsRes.count ?? 0, totalStorageBytes, mrr })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const STAT_CARDS = [
    { label: 'Total Pengguna', value: stats.totalUsers.toLocaleString('id-ID'), icon: '👥', change: '+12%', positive: true, color: '#EFF6FF', iconBg: '#BFDBFE' },
    { label: 'Langganan Aktif', value: stats.activeSubscriptions.toLocaleString('id-ID'), icon: '💳', change: '+8%', positive: true, color: '#F0FDF4', iconBg: '#BBF7D0' },
    { label: 'Storage Dipakai', value: formatBytes(stats.totalStorageBytes), icon: '💾', change: '+24%', positive: true, color: '#F5F3FF', iconBg: '#DDD6FE' },
    { label: 'Pendapatan 30 Hari', value: formatIDR(stats.mrr), icon: '💰', change: '+15%', positive: true, color: '#FEFCE8', iconBg: '#FEF08A' },
  ]

  const RECENT_USERS = [
    { name: 'Budi Santoso', email: 'budi@email.com', plan: 'Pro', joined: '21 Mei 2026', avatar: 'BS' },
    { name: 'Dewi Rahayu', email: 'dewi@email.com', plan: 'Plus', joined: '20 Mei 2026', avatar: 'DR' },
    { name: 'Agus Pratama', email: 'agus@email.com', plan: 'Free', joined: '20 Mei 2026', avatar: 'AP' },
    { name: 'Sari Indah', email: 'sari@email.com', plan: 'Ultra', joined: '19 Mei 2026', avatar: 'SI' },
    { name: 'Reza Firmansyah', email: 'reza@email.com', plan: 'Free', joined: '19 Mei 2026', avatar: 'RF' },
  ]

  const PLAN_DIST = [
    { label: 'Free', count: 1050, pct: 72, color: '#E8F0FF' },
    { label: 'Plus', count: 230, pct: 16, color: '#BBF7D0' },
    { label: 'Pro', count: 120, pct: 8, color: '#BFDBFE' },
    { label: 'Ultra', count: 58, pct: 4, color: '#FEF08A' },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
        <p className="text-[#64748B] text-sm mt-0.5">Ringkasan performa Cloudtify hari ini</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="card p-5" style={{ background: card.color }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: card.iconBg }}>
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.positive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                {card.change}
              </span>
            </div>
            <div className={`text-2xl font-bold text-[#0F172A] mb-0.5 ${loading ? 'animate-pulse' : ''}`}>
              {loading ? '...' : card.value}
            </div>
            <div className="text-[#94A3B8] text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User growth chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0F172A] font-bold text-sm">Pertumbuhan Pengguna</h3>
              <p className="text-[#94A3B8] text-xs">12 bulan terakhir</p>
            </div>
            <span className="tag-blue">2026</span>
          </div>
          <MiniBarChart data={MOCK_USER_GROWTH} />
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => (
              <span key={m} className="text-[10px] text-[#CBD5E1] flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>

        {/* Revenue chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0F172A] font-bold text-sm">Pendapatan (IDR)</h3>
              <p className="text-[#94A3B8] text-xs">12 bulan terakhir</p>
            </div>
            <span className="tag-active">Live</span>
          </div>
          <MiniBarChart data={MOCK_REVENUE.map((v, i) => i === 0 ? 1 : v)} />
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => (
              <span key={m} className="text-[10px] text-[#CBD5E1] flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent users */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0F172A] font-bold text-sm">Pengguna Terbaru</h3>
            <a href="/admin/users" className="text-blue-500 text-xs font-semibold hover:underline">Lihat Semua →</a>
          </div>
          <div className="space-y-3">
            {RECENT_USERS.map((user) => (
              <div key={user.email} className="flex items-center gap-3 py-2 border-b border-[#F1F5F9] last:border-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0F172A] text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-[#94A3B8] text-xs truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    user.plan === 'Free' ? 'bg-[#F1F5F9] text-[#64748B]'
                    : user.plan === 'Plus' ? 'bg-blue-50 text-blue-600'
                    : user.plan === 'Pro' ? 'bg-purple-50 text-purple-600'
                    : 'bg-amber-50 text-amber-600'
                  }`}>
                    {user.plan}
                  </span>
                  <span className="text-[#CBD5E1] text-xs hidden sm:block">{user.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan distribution */}
        <div className="card p-6">
          <h3 className="text-[#0F172A] font-bold text-sm mb-4">Distribusi Paket</h3>
          <div className="space-y-3">
            {PLAN_DIST.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#0F172A] font-medium">{p.label}</span>
                  <span className="text-[#64748B]">{p.count.toLocaleString('id-ID')} ({p.pct}%)</span>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${p.pct}%`, background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Laporan Baru', icon: '🚨', href: '/admin/files', color: '#FFF1F2' },
                { label: 'Cek Pengaturan', icon: '⚙️', href: '/admin/settings', color: '#F1F5F9' },
              ].map((link) => (
                <a key={link.label} href={link.href} className="rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:shadow-sm transition-all" style={{ background: link.color }}>
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-[#64748B] text-xs font-medium text-center">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
