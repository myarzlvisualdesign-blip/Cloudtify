'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { formatRelativeDate } from '@cloudtify/utils'

interface UserRow {
  id: string
  full_name: string | null
  username: string | null
  created_at: string
  is_banned: boolean
  is_verified: boolean
  plan_name: string
}

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  free: { bg: '#F1F5F9', text: '#64748B' },
  plus: { bg: '#EFF6FF', text: '#2563EB' },
  pro: { bg: '#F5F3FF', text: '#7C3AED' },
  ultra: { bg: '#FEFCE8', text: '#CA8A04' },
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
        if (search) {
          query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%`)
        }
        const { data } = await query
        if (data) {
          setUsers(data.map((u) => ({ ...u, full_name: u.full_name ?? null, username: u.username ?? null, is_banned: u.is_banned ?? false, is_verified: u.is_verified ?? false, plan_name: 'free' })))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [search])

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Pengguna</h1>
          <p className="text-[#64748B] text-sm">Kelola semua pengguna Cloudtify</p>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">🔍</span>
          <input
            type="search"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm w-64 transition-all"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#94A3B8] text-sm">⏳ Memuat data...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-4xl">👥</div>
            <p className="text-[#64748B] text-sm">
              {search ? 'Tidak ada pengguna ditemukan' : 'Belum ada pengguna'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {['Pengguna', 'Username', 'Paket', 'Status', 'Bergabung', 'Aksi'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-[#F8FAFF]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => {
                  const planColor = PLAN_COLORS[user.plan_name] ?? PLAN_COLORS['free']!
                  return (
                    <tr key={user.id} className={`border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFF] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFF]'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm text-white font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                            {(user.full_name ?? 'U')[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[#0F172A] text-sm font-semibold">{user.full_name ?? 'Pengguna'}</div>
                            {user.is_verified && <div className="text-blue-500 text-xs flex items-center gap-1">✓ Terverifikasi</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#64748B] text-sm">@{user.username ?? '-'}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: planColor.bg, color: planColor.text }}>
                          {user.plan_name.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${user.is_banned ? 'tag-expired' : 'tag-active'}`}>
                          {user.is_banned ? 'Diblokir' : 'Aktif'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
                        {formatRelativeDate(user.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <a href={`/admin/users/${user.id}`} className="text-blue-500 hover:text-blue-700 text-xs font-semibold hover:underline">
                          Detail →
                        </a>
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
