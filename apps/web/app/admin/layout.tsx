'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Pengguna', href: '/admin/users', icon: '👥' },
  { label: 'Langganan', href: '/admin/subscriptions', icon: '💳' },
  { label: 'File & Laporan', href: '/admin/files', icon: '📁' },
  { label: 'Analitik', href: '/admin/analytics', icon: '📈' },
  { label: 'Pengaturan', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState('')
  useEffect(() => { setPathname(window.location.pathname) }, [])

  const activeLabel = ADMIN_NAV.find(n => pathname.startsWith(n.href))?.label ?? 'Admin'

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-[#E2E8F0] shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              ☁️
            </div>
            <span className="text-[#0F172A]">Cloud<span className="text-blue-500">Admin</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active ? 'text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#E2E8F0]">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-2xl text-[#94A3B8] hover:text-[#64748B] text-xs hover:bg-[#F1F5F9] transition-colors">
            <span>🏠</span>
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-[#0F172A] font-bold text-base">{activeLabel}</h1>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-base hover:bg-[#EFF6FF] transition-colors">
              🔔
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              A
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex bg-white border-b border-[#E2E8F0] overflow-x-auto px-4 py-2 gap-2 flex-shrink-0">
          {ADMIN_NAV.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active ? 'text-white' : 'text-[#64748B] bg-[#F1F5F9]'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
