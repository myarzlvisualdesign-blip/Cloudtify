'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from '../../components/brand/Logo'
import { Icon, type IconKey } from '../../components/ui/icons'
import { signOut } from '../../lib/auth'

const ADMIN_NAV: { label: string; href: string; icon: IconKey }[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'grid' },
  { label: 'Pengguna', href: '/admin/users', icon: 'users' },
  { label: 'Langganan', href: '/admin/subscriptions', icon: 'card' },
  { label: 'File & Laporan', href: '/admin/files', icon: 'flag' },
  { label: 'Analitik', href: '/admin/analytics', icon: 'trend' },
  { label: 'Pengaturan', href: '/admin/settings', icon: 'gear' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState('')
  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])

  const active = ADMIN_NAV.find((n) => pathname.startsWith(n.href))

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Sidebar */}
      <aside
        className="hidden md:flex w-60 flex-col fixed left-0 top-0 bottom-0 z-30"
        style={{ background: '#111014', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="h-16 flex items-center px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-2.5">
            <Logo variant="mark" size={30} />
            <span className="font-display font-bold text-white tracking-tight text-[15px]">Cloudtify</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#1A56DB]/20 px-1.5 py-0.5 rounded">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const IconCmp = Icon[item.icon]
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive ? 'text-[#93B4FA]' : 'text-[#5C5F73] hover:text-[#B0B4CC] hover:bg-white/[0.05]'
                }`}
                style={isActive ? { background: 'rgba(26,86,219,0.16)' } : undefined}
              >
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-[#1A56DB]" />}
                <IconCmp size={17} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-4 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-3 px-3.5 py-2.5 mt-3 rounded-xl text-[13px] font-medium text-[#5C5F73] hover:text-[#B0B4CC] hover:bg-white/[0.05] transition-all">
            <Icon.home size={17} />
            Kembali ke Website
          </Link>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#5C5F73] hover:text-[#F87171] hover:bg-red-500/[0.08] transition-all">
            <Icon.logout size={17} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E5E2DD] flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="text-[#141110] font-display font-bold text-base leading-none">{active?.label ?? 'Admin'}</h1>
            <p className="text-[#A8A29E] text-[11px] mt-1">Panel Admin Cloudtify</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-[#F2F0ED] flex items-center justify-center text-[#6B6560] hover:bg-[#EBF0FF] hover:text-[#1A56DB] transition-colors">
              <Icon.bell size={17} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold text-sm" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              A
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex bg-[#111014] overflow-x-auto px-3 py-2 gap-1.5">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const IconCmp = Icon[item.icon]
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'text-white bg-[#1A56DB]' : 'text-[#9BA0B8] bg-white/[0.06]'
                }`}
              >
                <IconCmp size={14} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <main className="flex-1 p-5 md:p-7">{children}</main>
      </div>
    </div>
  )
}
