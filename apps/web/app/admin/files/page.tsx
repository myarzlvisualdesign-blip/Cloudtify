'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatBytes, formatRelativeDate } from '@cloudtify/utils'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Icon, type IconKey } from '../../../components/ui/icons'

interface Report {
  id: string
  reason?: string
  status?: string
  description?: string
  created_at?: string
}

export default function AdminFilesPage() {
  const [stats, setStats] = useState({ files: 0, storage: 0, pending: 0 })
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [filesCount, storageRows, reportRows] = await Promise.all([
        supabase.from('files').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('storage_usage').select('used_bytes'),
        supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(30),
      ])
      const storage = ((storageRows.data ?? []) as { used_bytes: number }[]).reduce((a, r) => a + (r.used_bytes ?? 0), 0)
      const reps = (reportRows.data ?? []) as Report[]
      setStats({ files: filesCount.count ?? 0, storage, pending: reps.filter((r) => r.status === 'pending').length })
      setReports(reps)
      setLoading(false)
    }
    load().catch(() => setLoading(false))
  }, [])

  const cards: { label: string; value: string; icon: IconKey; tint: string }[] = [
    { label: 'Total File', value: stats.files.toLocaleString('id-ID'), icon: 'file', tint: '#1A56DB' },
    { label: 'Storage Terpakai', value: formatBytes(stats.storage), icon: 'database', tint: '#7C3AED' },
    { label: 'Laporan Menunggu', value: stats.pending.toLocaleString('id-ID'), icon: 'flag', tint: '#DC2626' },
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
        <div className="px-5 py-4 border-b border-[#E5E2DD] flex items-center gap-2">
          <Icon.flag size={16} />
          <h3 className="font-display font-bold text-[#141110] text-sm">Laporan Konten</h3>
        </div>
        {loading ? (
          <div className="py-16 text-center text-[#A8A29E] text-sm">Memuat…</div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-emerald-500"><Icon.shield size={22} /></div>
            <p className="text-[#6B6560] text-sm">Tidak ada laporan. Semua konten aman.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F2F0ED]">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] flex-shrink-0"><Icon.flag size={16} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#141110] text-sm font-semibold capitalize">{(r.reason ?? 'lainnya').replace('_', ' ')}</p>
                  {r.description && <p className="text-[#A8A29E] text-xs truncate">{r.description}</p>}
                </div>
                <Badge tone={r.status === 'pending' ? 'amber' : r.status === 'resolved' ? 'green' : 'neutral'}>{r.status ?? '—'}</Badge>
                <span className="text-[#A8A29E] text-xs hidden sm:block">{r.created_at ? formatRelativeDate(r.created_at) : ''}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
