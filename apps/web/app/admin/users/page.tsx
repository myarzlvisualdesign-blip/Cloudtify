import { createClient } from '../../../lib/supabase/server'
import { formatRelativeDate } from '@cloudtify/utils'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select(`
      id, full_name, username, created_at, is_banned, is_verified,
      subscriptions (
        status, plans (name)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pengguna</h1>
          <p className="text-white/50 text-sm">Kelola semua pengguna Cloudtify</p>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Cari pengguna..."
            className="bg-[#0F172A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-500/50 w-64"
          />
        </div>
      </div>

      <div className="bg-[#0F172A] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Pengguna', 'Username', 'Paket', 'Status', 'Bergabung', 'Aksi'].map((h) => (
                <th key={h} className="text-left px-5 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((user) => {
              const activeSub = (user.subscriptions as unknown as Array<{ status: string; plans: { name: string } | null }>)?.[0]
              const planName = activeSub?.plans?.name ?? 'free'
              const isBanned = user.is_banned

              return (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm text-blue-300">
                        {(user.full_name ?? 'U')[0]}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{user.full_name ?? 'Pengguna'}</div>
                        {user.is_verified && <div className="text-blue-400 text-xs">✓ Terverifikasi</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-sm">@{user.username ?? '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      planName === 'ultra' ? 'bg-green-500/20 text-green-300' :
                      planName === 'pro' ? 'bg-purple-500/20 text-purple-300' :
                      planName === 'plus' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-white/10 text-white/50'
                    }`}>
                      {planName.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isBanned ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {isBanned ? 'Diblokir' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/40 text-sm">
                    {formatRelativeDate(user.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <a href={`/admin/users/${user.id}`} className="text-blue-400 hover:text-blue-300 text-xs">
                        Detail
                      </a>
                      {!isBanned && (
                        <button className="text-red-400 hover:text-red-300 text-xs">
                          Blokir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
