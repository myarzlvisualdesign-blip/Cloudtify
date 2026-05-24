'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase/client'
import { formatBytes, formatIDR } from '@cloudtify/utils'
import { Card } from '../../../components/ui/Card'
import { Icon, type IconKey } from '../../../components/ui/icons'
import { PlanBadge } from '../../../components/ui/Badge'
import { initials } from '../../../lib/auth'

interface RecentUser {
  id: string
  full_name: string | null
  username: string | null
  created_at: string
  plan: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

function lastMonths(n: number) {
  const out: { key: string; label: string }[] = []
  const d = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
    out.push({ key: `${m.getFullYear()}-${m.getMonth()}`, label: MONTHS[m.getMonth()]! })
  }
  return out
}

function bucket(dates: string[], n: number) {
  const months = lastMonths(n)
  const counts = months.map(() => 0)
  dates.forEach((iso) => {
    const d = new Date(iso)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const idx = months.findIndex((m) => m.key === key)
    if (idx >= 0) counts[idx]!++
  })
  return { months, counts }
}

/* Clean custom bar chart (no library) */
function BarTrend({ data, labels, format }: { data: number[]; labels: string[]; format?: (v: number) => string }) {
  const max = Math.max(...data, 1)
  const empty = data.every((v) => v === 0)
  return (
    <div>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group">
            <span className="text-[10px] font-semibold text-[#6B6560] opacity-0 group-hover:opacity-100 transition-opacity">
              {format ? format(v) : v}
            </span>
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(v / max) * 100}%`,
                minHeight: v > 0 ? 6 : 2,
                background: i === data.length - 1 ? 'linear-gradient(180deg, #1A56DB, #2B7FD4)' : '#DCE6FB',
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {labels.map((m, i) => (
          <span key={i} className="text-[10px] text-[#A8A29E] flex-1 text-center">{m}</span>
        ))}
      </div>
      {empty && <p className="text-center text-[#A8A29E] text-xs mt-3">Belum ada data — chart terisi otomatis seiring aktivitas.</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalUsers: 0, newUsers30: 0, activeSubs: 0, storage: 0, revenue30: 0 })
  const [growth, setGrowth] = useState<{ counts: number[]; labels: string[] }>({ counts: [], labels: [] })
  const [revenue, setRevenue] = useState<{ counts: number[]; labels: string[] }>({ counts: [], labels: [] })
  const [recent, setRecent] = useState<RecentUser[]>([])
  const [planDist, setPlanDist] = useState<{ label: string; count: number; plan: string }[]>([])

  useEffect(() => {
    async function load() {
      const since30 = new Date(Date.now() - 30 * 864e5).toISOString()
      const [usersCount, profilesAll, subsActive, storageRows, payRows, recentRows, activeSubsRows] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('created_at'),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('storage_usage').select('used_bytes'),
        supabase.from('payments').select('amount_idr, created_at').eq('status', 'success'),
        supabase.from('profiles').select('id, full_name, username, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('user_active_subscription').select('plan_name'),
      ])

      const allDates = (profilesAll.data ?? []).map((r: { created_at: string }) => r.created_at)
      const g = bucket(allDates, 6)
      const newUsers30 = allDates.filter((d) => d >= since30).length

      const payData = (payRows.data ?? []) as { amount_idr: number; created_at: string }[]
      const revBucket = lastMonths(6)
      const revCounts = revBucket.map(() => 0)
      payData.forEach((p) => {
        const d = new Date(p.created_at)
        const idx = revBucket.findIndex((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`)
        if (idx >= 0) revCounts[idx]! += p.amount_idr ?? 0
      })
      const revenue30 = payData.filter((p) => p.created_at >= since30).reduce((a, p) => a + (p.amount_idr ?? 0), 0)
      const storage = ((storageRows.data ?? []) as { used_bytes: number }[]).reduce((a, r) => a + (r.used_bytes ?? 0), 0)

      // Plan distribution
      const active = (activeSubsRows.data ?? []) as { plan_name: string }[]
      const byPlan: Record<string, number> = {}
      active.forEach((s) => { byPlan[s.plan_name] = (byPlan[s.plan_name] ?? 0) + 1 })
      const total = usersCount.count ?? 0
      const paidTotal = Object.values(byPlan).reduce((a, b) => a + b, 0)
      const dist = [
        { label: 'Free', plan: 'free', count: Math.max(total - paidTotal, 0) },
        { label: 'Plus', plan: 'plus', count: byPlan['plus'] ?? 0 },
        { label: 'Pro', plan: 'pro', count: byPlan['pro'] ?? 0 },
        { label: 'Ultra', plan: 'ultra', count: byPlan['ultra'] ?? 0 },
      ]

      setStats({ totalUsers: total, newUsers30, activeSubs: subsActive.count ?? 0, storage, revenue30 })
      setGrowth({ counts: g.counts, labels: g.months.map((m) => m.label) })
      setRevenue({ counts: revCounts, labels: revBucket.map((m) => m.label) })
      setPlanDist(dist)
      setRecent(((recentRows.data ?? []) as RecentUser[]).map((u) => ({ ...u, plan: 'free' })))
      setLoading(false)
    }
    load().catch(() => setLoading(false))
  }, [])

  const cards: { label: string; value: string; sub: string; icon: IconKey; tint: string }[] = [
    { label: 'Total Pengguna', value: stats.totalUsers.toLocaleString('id-ID'), sub: `+${stats.newUsers30} dalam 30 hari`, icon: 'users', tint: '#1A56DB' },
    { label: 'Langganan Aktif', value: stats.activeSubs.toLocaleString('id-ID'), sub: 'Pelanggan berbayar', icon: 'card', tint: '#059669' },
    { label: 'Storage Dipakai', value: formatBytes(stats.storage), sub: 'Seluruh pengguna', icon: 'database', tint: '#7C3AED' },
    { label: 'Pendapatan 30 Hari', value: formatIDR(stats.revenue30), sub: 'Transaksi sukses', icon: 'trend', tint: '#B45309' },
  ]

  const distMax = Math.max(...planDist.map((p) => p.count), 1)

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => {
          const IconCmp = Icon[c.icon]
          return (
            <Card key={c.label} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.tint + '14', color: c.tint }}>
                  <IconCmp size={19} />
                </div>
              </div>
              <div className={`font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-0.5 ${loading ? 'animate-pulse' : ''}`}>
                {loading ? '—' : c.value}
              </div>
              <div className="text-[#A8A29E] text-xs">{c.label}</div>
              <div className="text-[#22C55E] text-[11px] font-medium mt-1.5">{c.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[#141110] font-display font-bold text-sm">Pertumbuhan Pengguna</h3>
              <p className="text-[#A8A29E] text-xs mt-0.5">Pendaftaran baru, 6 bulan terakhir</p>
            </div>
          </div>
          <BarTrend data={growth.counts} labels={growth.labels} />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[#141110] font-display font-bold text-sm">Pendapatan</h3>
              <p className="text-[#A8A29E] text-xs mt-0.5">Transaksi sukses, 6 bulan terakhir</p>
            </div>
          </div>
          <BarTrend data={revenue.counts} labels={revenue.labels} format={(v) => formatIDR(v)} />
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#141110] font-display font-bold text-sm">Pengguna Terbaru</h3>
            <Link href="/admin/users" className="text-[#1A56DB] text-xs font-semibold hover:underline">Lihat Semua →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F2F0ED] flex items-center justify-center mx-auto mb-3 text-[#A8A29E]"><Icon.users size={22} /></div>
              <p className="text-[#A8A29E] text-sm">Belum ada pengguna terdaftar.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((u) => {
                const name = u.full_name || u.username || 'Pengguna'
                return (
                  <div key={u.id} className="flex items-center gap-3 py-2.5 border-b border-[#F2F0ED] last:border-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-display font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                      {initials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#141110] text-sm font-semibold truncate">{name}</p>
                      <p className="text-[#A8A29E] text-xs truncate">{u.username ? '@' + u.username : '—'}</p>
                    </div>
                    <PlanBadge plan={u.plan} />
                    <span className="text-[#A8A29E] text-xs hidden sm:block w-24 text-right">
                      {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-[#141110] font-display font-bold text-sm mb-4">Distribusi Paket</h3>
          <div className="space-y-3.5">
            {planDist.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#141110] font-semibold">{p.label}</span>
                  <span className="text-[#6B6560]">{p.count.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-2 bg-[#F2F0ED] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(p.count / distMax) * 100}%`, minWidth: p.count > 0 ? 8 : 0, background: 'linear-gradient(90deg, #1A56DB, #2B7FD4)' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[#E5E2DD] grid grid-cols-2 gap-3">
            <Link href="/admin/files" className="rounded-xl p-3 flex flex-col items-center gap-1.5 bg-[#FEF2F2] hover:shadow-sm transition-all text-[#DC2626]">
              <Icon.flag size={18} />
              <span className="text-[#6B6560] text-xs font-medium">Laporan</span>
            </Link>
            <Link href="/admin/settings" className="rounded-xl p-3 flex flex-col items-center gap-1.5 bg-[#F2F0ED] hover:shadow-sm transition-all text-[#6B6560]">
              <Icon.gear size={18} />
              <span className="text-[#6B6560] text-xs font-medium">Pengaturan</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
