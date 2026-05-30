'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatIDR, formatRelativeDate } from '@cloudtify/utils'

interface SubRow {
  id: string
  plan_name: string
  status: string
  billing_cycle: string
  amount_idr: number
  started_at: string
  expires_at: string | null
  profile: { full_name: string | null; username: string | null } | null
}

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  free: { bg: '#F1F5F9', text: '#64748B' },
  plus: { bg: '#EFF6FF', text: '#2563EB' },
  pro: { bg: '#F5F3FF', text: '#7C3AED' },
  ultra: { bg: '#FEFCE8', text: '#CA8A04' },
}

const STATUS_TAGS: Record<string, string> = {
  active: 'tag-active',
  expired: 'tag-expired',
  cancelled: 'bg-[#FFF1F2] text-red-500 text-xs font-bold px-2.5 py-1 rounded-full',
  grace_period: 'bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full',
  paused: 'bg-[#F1F5F9] text-[#64748B] text-xs font-bold px-2.5 py-1 rounded-full',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Aktif',
  expired: 'Expired',
  cancelled: 'Dibatalkan',
  grace_period: 'Grace Period',
  paused: 'Dijeda',
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<SubRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'cancelled'>('all')

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      try {
        let query = supabase
          .from('subscriptions')
          .select('id, plan_name, status, billing_cycle, amount_idr, started_at, expires_at, profile:profiles(full_name, username)')
          .order('started_at', { ascending: false })
          .limit(100)
        if (filter !== 'all') query = query.eq('status', filter)
        const { data } = await query
        if (data) setSubs(data as unknown as SubRow[])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [filter])

  const FILTERS: { label: string; value: typeof filter }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Expired', value: 'expired' },
    { label: 'Dibatalkan', value: 'cancelled' },
  ]

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Langganan</h1>
        <p className="text-[#64748B] text-sm">Kelola semua langganan pengguna</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'text-white shadow-sm'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
            }`}
            style={filter === f.value ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : subs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x={1} y={4} width={22} height={16} rx={2} stroke="#CBD5E1" strokeWidth={1.5} />
              <line x1={1} y1={10} x2={23} y2={10} stroke="#CBD5E1" strokeWidth={1.5} />
            </svg>
            <p className="text-[#64748B] text-sm">Tidak ada data langganan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {['Pengguna', 'Paket', 'Status', 'Siklus', 'Jumlah', 'Mulai', 'Berakhir'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-[#F8FAFF]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((sub, i) => {
                  const planColor = PLAN_COLORS[sub.plan_name] ?? PLAN_COLORS['free']!
                  const statusClass = STATUS_TAGS[sub.status] ?? STATUS_TAGS['paused']!
                  return (
                    <tr key={sub.id} className={`border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFF] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFF]'}`}>
                      <td className="px-5 py-4">
                        <div>
                          <div className="text-[#0F172A] text-sm font-semibold">{sub.profile?.full_name ?? 'Pengguna'}</div>
                          <div className="text-[#94A3B8] text-xs">@{sub.profile?.username ?? '-'}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase" style={{ background: planColor.bg, color: planColor.text }}>
                          {sub.plan_name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={statusClass}>{STATUS_LABELS[sub.status] ?? sub.status}</span>
                      </td>
                      <td className="px-5 py-4 text-[#64748B] text-sm capitalize">
                        {sub.billing_cycle === 'monthly' ? 'Bulanan' : sub.billing_cycle === 'yearly' ? 'Tahunan' : sub.billing_cycle}
                      </td>
                      <td className="px-5 py-4 text-[#0F172A] text-sm font-semibold">
                        {sub.amount_idr > 0 ? formatIDR(sub.amount_idr) : 'Gratis'}
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
                        {formatRelativeDate(sub.started_at)}
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
                        {sub.expires_at ? formatRelativeDate(sub.expires_at) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
