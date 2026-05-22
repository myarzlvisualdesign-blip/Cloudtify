'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatIDR, formatRelativeDate } from '@cloudtify/utils'
import { Card } from '../../../components/ui/Card'
import { Badge, PlanBadge } from '../../../components/ui/Badge'
import { Icon, type IconKey } from '../../../components/ui/icons'

interface SubRow {
  id: string
  user_id: string
  plan_name: string
  status: string
  starts_at: string | null
  expires_at: string | null
}

const statusTone: Record<string, 'green' | 'amber' | 'red' | 'neutral'> = {
  active: 'green',
  grace_period: 'amber',
  paused: 'amber',
  expired: 'red',
  cancelled: 'neutral',
}

export default function AdminSubscriptionsPage() {
  const [rows, setRows] = useState<SubRow[]>([])
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [stats, setStats] = useState({ active: 0, mrr: 0, totalRevenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [subs, plans, pays] = await Promise.all([
        supabase.from('user_active_subscription').select('id, user_id, plan_name, status, starts_at, expires_at').limit(50),
        supabase.from('plans').select('name, price_monthly_idr'),
        supabase.from('payments').select('amount_idr').eq('status', 'success'),
      ])
      const data = (subs.data ?? []) as SubRow[]
      const priceMap = new Map<string, number>()
      ;((plans.data ?? []) as { name: string; price_monthly_idr: number }[]).forEach((p) => priceMap.set(p.name, p.price_monthly_idr))
      const active = data.filter((s) => s.status === 'active')
      const mrr = active.reduce((a, s) => a + (priceMap.get(s.plan_name) ?? 0), 0)
      const totalRevenue = ((pays.data ?? []) as { amount_idr: number }[]).reduce((a, p) => a + (p.amount_idr ?? 0), 0)

      if (data.length) {
        const { data: profs } = await supabase.from('profiles').select('id, full_name, username').in('id', data.map((d) => d.user_id))
        const m = new Map<string, string>()
        ;((profs ?? []) as { id: string; full_name: string | null; username: string | null }[]).forEach((p) => m.set(p.id, p.full_name || p.username || 'Pengguna'))
        setNames(m)
      }
      setRows(data)
      setStats({ active: active.length, mrr, totalRevenue })
      setLoading(false)
    }
    load().catch(() => setLoading(false))
  }, [])

  const cards: { label: string; value: string; icon: IconKey; tint: string }[] = [
    { label: 'Langganan Aktif', value: stats.active.toLocaleString('id-ID'), icon: 'card', tint: '#1A56DB' },
    { label: 'MRR (Estimasi)', value: formatIDR(stats.mrr), icon: 'trend', tint: '#059669' },
    { label: 'Total Pendapatan', value: formatIDR(stats.totalRevenue), icon: 'database', tint: '#7C3AED' },
  ]

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => {
          const IconCmp = Icon[c.icon]
          return (
            <Card key={c.label} className="p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: c.tint + '14', color: c.tint }}><IconCmp size={19} /></div>
              <div className={`font-display font-extrabold text-[#141110] text-2xl tracking-tight ${loading ? 'animate-pulse' : ''}`}>{loading ? '—' : c.value}</div>
              <div className="text-[#A8A29E] text-xs mt-0.5">{c.label}</div>
            </Card>
          )
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E2DD]"><h3 className="font-display font-bold text-[#141110] text-sm">Langganan Terbaru</h3></div>
        {loading ? (
          <div className="py-16 text-center text-[#A8A29E] text-sm">Memuat…</div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F0ED] flex items-center justify-center text-[#A8A29E]"><Icon.card size={22} /></div>
            <p className="text-[#6B6560] text-sm">Belum ada langganan berbayar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E5E2DD]">
                  {['Pengguna', 'Paket', 'Status', 'Mulai', 'Berakhir'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[#A8A29E] text-[11px] font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-b border-[#F2F0ED] last:border-0 hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-5 py-3.5 text-[#141110] text-sm font-medium">{names.get(s.user_id) ?? 'Pengguna'}</td>
                    <td className="px-5 py-3.5"><PlanBadge plan={s.plan_name} /></td>
                    <td className="px-5 py-3.5"><Badge tone={statusTone[s.status] ?? 'neutral'}>{s.status}</Badge></td>
                    <td className="px-5 py-3.5 text-[#A8A29E] text-xs">{s.starts_at ? formatRelativeDate(s.starts_at) : '—'}</td>
                    <td className="px-5 py-3.5 text-[#A8A29E] text-xs">{s.expires_at ? new Date(s.expires_at).toLocaleDateString('id-ID') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
