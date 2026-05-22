'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatRelativeDate } from '@cloudtify/utils'
import { Card } from '../../../components/ui/Card'
import { Badge, PlanBadge } from '../../../components/ui/Badge'
import { Icon } from '../../../components/ui/icons'
import { initials } from '../../../lib/auth'

interface UserRow {
  id: string
  full_name: string | null
  username: string | null
  created_at: string
  is_banned: boolean
  is_verified: boolean
  plan_name: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        let query = supabase
          .from('profiles')
          .select('id, full_name, username, created_at, is_banned, is_verified')
          .order('created_at', { ascending: false })
          .limit(100)
        if (search) query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%`)

        const [{ data }, planRes] = await Promise.all([
          query,
          supabase.from('user_active_subscription').select('user_id, plan_name'),
        ])
        const planMap = new Map<string, string>()
        ;((planRes.data ?? []) as { user_id: string; plan_name: string }[]).forEach((r) => planMap.set(r.user_id, r.plan_name))

        if (data) {
          setUsers(
            data.map((u) => ({
              id: u.id,
              full_name: u.full_name ?? null,
              username: u.username ?? null,
              created_at: u.created_at,
              is_banned: u.is_banned ?? false,
              is_verified: u.is_verified ?? false,
              plan_name: planMap.get(u.id) ?? 'free',
            })),
          )
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [search])

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[#6B6560] text-sm">{loading ? 'Memuat…' : `${users.length} pengguna terdaftar`}</p>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]"><Icon.search size={16} /></span>
          <input
            type="search"
            placeholder="Cari nama atau username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-[#E5E2DD] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#141110] placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/60 focus:ring-2 focus:ring-[#1A56DB]/10 w-full sm:w-72 transition-all"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#A8A29E] text-sm gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
            Memuat data…
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F0ED] flex items-center justify-center text-[#A8A29E]"><Icon.users size={22} /></div>
            <p className="text-[#6B6560] text-sm">{search ? 'Tidak ada pengguna ditemukan' : 'Belum ada pengguna terdaftar'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E5E2DD]">
                  {['Pengguna', 'Username', 'Paket', 'Status', 'Bergabung', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[#A8A29E] text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const name = user.full_name ?? 'Pengguna'
                  return (
                    <tr key={user.id} className="border-b border-[#F2F0ED] last:border-0 hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs text-white font-display font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                            {initials(name)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#141110] text-sm font-semibold">{name}</span>
                            {user.is_verified && <span className="text-[#1A56DB]"><Icon.check size={13} /></span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B6560] text-sm">{user.username ? '@' + user.username : '—'}</td>
                      <td className="px-5 py-3.5"><PlanBadge plan={user.plan_name} /></td>
                      <td className="px-5 py-3.5">
                        <Badge tone={user.is_banned ? 'red' : 'green'}>{user.is_banned ? 'Diblokir' : 'Aktif'}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-[#A8A29E] text-xs whitespace-nowrap">{formatRelativeDate(user.created_at)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="text-[#1A56DB] hover:opacity-70 text-xs font-semibold">Detail →</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
