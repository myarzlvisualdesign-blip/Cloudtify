'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from '../../components/brand/Logo'
import { Icon, type IconKey } from '../../components/ui/icons'
import { useUser, signOut, displayName, initials } from '../../lib/auth'
import { supabase } from '../../lib/supabase/client'

const NAV: { label: string; href: string; icon: IconKey }[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'grid' },
  { label: 'File Saya', href: '/files', icon: 'folder' },
  { label: 'Riwayat', href: '/history', icon: 'chart' },
  { label: 'Pengaturan', href: '/settings', icon: 'gear' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState('')
  const { user, profile } = useUser({ redirectTo: '/auth/login/' })
  const [storage, setStorage] = useState({ usedGb: 0, totalGb: 15, pct: 0 })

  useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('storage_usage').select('used_bytes').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_active_subscription').select('total_storage_gb').eq('user_id', user.id).maybeSingle(),
    ]).then(([s, sub]) => {
      const usedGb = ((s.data?.used_bytes ?? 0) as number) / 1e9
      const totalGb = (sub.data?.total_storage_gb as number) ?? 15
      setStorage({ usedGb, totalGb, pct: Math.min((usedGb / totalGb) * 100, 100) })
    })
  }, [user])

  const name = displayName(user, profile)
  const avatar = profile?.avatar_url ?? (user?.user_metadata?.avatar_url as string | undefined)
  const planLabel = 'Paket Free'

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-30" style={{ background: '#111014', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-16 flex items-center px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-2.5">
            <Logo variant="mark" size={28} />
            <span className="font-display font-bold text-white tracking-tight text-[15px]">Cloudtify</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, icon }) => {
            const active = path === href || (href !== '/dashboard' && path.startsWith(href))
            const IconCmp = Icon[icon]
            return (
              <Link
                key={label}
                href={href}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active ? 'text-[#93B4FA]' : 'text-[#5C5F73] hover:text-[#B0B4CC] hover:bg-white/[0.05]'}`}
                style={active ? { background: 'rgba(26,86,219,0.16)' } : undefined}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-[#1A56DB]" />}
                <IconCmp size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User / storage mini card */}
        <div className="mx-3 mb-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-display font-bold text-white text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : initials(name)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-semibold leading-none truncate">{name}</p>
              <p className="text-[#5C5F73] text-[11px] mt-0.5">{planLabel}</p>
            </div>
          </div>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-[#5C5F73]">Storage</span>
            <span className="text-[#9BA0B8] font-medium">{storage.usedGb.toFixed(1)} / {storage.totalGb} GB</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${storage.pct}%`, background: 'linear-gradient(90deg, #1A56DB, #60A5FA)' }} />
          </div>
        </div>

        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3.5 py-2.5 mt-3 rounded-xl text-[13px] font-medium text-[#5C5F73] hover:text-[#F87171] hover:bg-red-500/[0.08] transition-all duration-150">
            <Icon.logout size={17} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4" style={{ background: '#111014', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Logo variant="mark" size={26} />
          <span className="font-display font-bold text-white tracking-tight text-sm">Cloudtify</span>
        </Link>
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-display font-bold" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : initials(name)}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen bg-[#FAFAF8]">
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex" style={{ background: '#111014', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {NAV.map(({ label, href, icon }) => {
          const active = path === href
          const IconCmp = Icon[icon]
          return (
            <Link key={label} href={href} className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all ${active ? 'text-[#60A5FA]' : 'text-[#5C5F73] hover:text-[#9BA0B8]'}`}>
              <IconCmp size={18} />
              <span className="text-[9px] font-semibold tracking-wide">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
