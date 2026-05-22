'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatIDR } from '@cloudtify/utils'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Icon } from '../../../components/ui/icons'

interface Plan {
  name: string
  display_name: string
  storage_gb: number
  price_monthly_idr: number
  is_active: boolean
}
interface Flag {
  id: string
  [k: string]: unknown
}

export default function AdminSettingsPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [planRows, flagRows] = await Promise.all([
        supabase.from('plans').select('name, display_name, storage_gb, price_monthly_idr, is_active').order('sort_order'),
        supabase.from('feature_flags').select('*').limit(20),
      ])
      setPlans((planRows.data ?? []) as Plan[])
      setFlags((flagRows.data ?? []) as Flag[])
      setLoading(false)
    }
    load().catch(() => setLoading(false))
  }, [])

  function flagLabel(f: Flag): string {
    return String(f.name ?? f.key ?? f.flag ?? f.title ?? f.id)
  }
  function flagEnabled(f: Flag): boolean {
    return Boolean(f.enabled ?? f.is_enabled ?? f.active ?? f.value)
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Plans */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E2DD] flex items-center gap-2">
          <Icon.card size={16} />
          <h3 className="font-display font-bold text-[#141110] text-sm">Paket &amp; Harga</h3>
        </div>
        {loading ? (
          <div className="py-12 text-center text-[#A8A29E] text-sm">Memuat…</div>
        ) : (
          <div className="divide-y divide-[#F2F0ED]">
            {plans.map((p) => (
              <div key={p.name} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1">
                  <p className="text-[#141110] text-sm font-semibold">{p.display_name}</p>
                  <p className="text-[#A8A29E] text-xs">{p.storage_gb} GB storage</p>
                </div>
                <span className="text-[#141110] text-sm font-display font-bold">
                  {p.price_monthly_idr === 0 ? 'Gratis' : `${formatIDR(p.price_monthly_idr)}/bln`}
                </span>
                <Badge tone={p.is_active ? 'green' : 'neutral'}>{p.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Feature flags */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E2DD] flex items-center gap-2">
          <Icon.gear size={16} />
          <h3 className="font-display font-bold text-[#141110] text-sm">Feature Flags</h3>
        </div>
        {loading ? (
          <div className="py-12 text-center text-[#A8A29E] text-sm">Memuat…</div>
        ) : flags.length === 0 ? (
          <div className="py-12 text-center text-[#A8A29E] text-sm">Belum ada feature flag terkonfigurasi.</div>
        ) : (
          <div className="divide-y divide-[#F2F0ED]">
            {flags.map((f) => {
              const on = flagEnabled(f)
              return (
                <div key={f.id} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#141110] text-sm font-medium capitalize">{flagLabel(f).replace(/_/g, ' ')}</span>
                  <span className={`relative w-10 h-6 rounded-full transition-colors ${on ? 'bg-[#1A56DB]' : 'bg-[#E5E2DD]'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-5' : 'left-1'}`} />
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <div className="flex items-center gap-2 text-[#A8A29E] text-xs px-1">
        <Icon.database size={13} />
        Data ditarik langsung dari Supabase. Perubahan tulis (write) memerlukan hak akses admin di RLS.
      </div>
    </div>
  )
}
