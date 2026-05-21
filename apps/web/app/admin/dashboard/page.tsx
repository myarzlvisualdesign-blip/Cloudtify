import { createClient } from '../../../lib/supabase/server'
import { formatBytes, formatIDR } from '@cloudtify/utils'

export const dynamic = 'force-dynamic'

async function getStats(supabase: ReturnType<typeof createClient>) {
  const [usersRes, subsRes, storageRes, paymentsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('id, plans(name)', { count: 'exact' }).eq('status', 'active'),
    supabase.from('storage_usage').select('used_bytes'),
    supabase.from('payments').select('amount_idr').eq('status', 'success').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  const totalUsers = usersRes.count ?? 0
  const activeSubscriptions = subsRes.count ?? 0
  const totalStorageBytes = (storageRes.data ?? []).reduce((acc, row) => acc + (row.used_bytes ?? 0), 0)
  const mrr = (paymentsRes.data ?? []).reduce((acc, row) => acc + (row.amount_idr ?? 0), 0)

  return { totalUsers, activeSubscriptions, totalStorageBytes, mrr }
}

export default async function AdminDashboard() {
  const supabase = createClient()
  const stats = await getStats(supabase)

  const STAT_CARDS = [
    { label: 'Total Pengguna', value: stats.totalUsers.toLocaleString('id-ID'), icon: '👤', change: '+12%' },
    { label: 'Langganan Aktif', value: stats.activeSubscriptions.toLocaleString('id-ID'), icon: '💳', change: '+8%' },
    { label: 'Total Storage Dipakai', value: formatBytes(stats.totalStorageBytes), icon: '💾', change: '+24%' },
    { label: 'Pendapatan 30 Hari', value: formatIDR(stats.mrr), icon: '💰', change: '+15%' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/50 text-sm">Ringkasan performa Cloudtify hari ini</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="bg-[#0F172A] rounded-2xl border border-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-0.5 rounded-full">
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-white/40 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Kelola Pengguna', href: '/admin/users', icon: '👥' },
          { label: 'Langganan', href: '/admin/subscriptions', icon: '💳' },
          { label: 'Laporan File', href: '/admin/files', icon: '🚨' },
          { label: 'Pengaturan', href: '/admin/settings', icon: '⚙️' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="bg-[#0F172A] border border-white/5 hover:border-blue-500/30 rounded-2xl p-4 flex items-center gap-3 transition-all group"
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
