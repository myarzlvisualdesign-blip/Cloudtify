'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'File Saya', href: '/files', icon: '📁' },
  { label: 'Riwayat', href: '/history', icon: '📊' },
  { label: 'Pengaturan', href: '/settings', icon: '⚙️' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState('')
  useEffect(() => { setPathname(window.location.pathname) }, [])

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E2E8F0] shadow-sm z-20">
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              ☁️
            </div>
            <span className="text-[#0F172A]">Cloud<span className="text-blue-500">tify</span></span>
          </Link>
        </div>

        {/* User card */}
        <div className="mx-4 mt-4 p-4 rounded-3xl" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">Z</div>
            <div>
              <p className="text-white font-bold text-sm">Zels!</p>
              <p className="text-blue-100 text-xs">Paket Free</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-blue-100">Storage</span>
              <span className="text-white font-semibold">3.5 / 15 GB</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '23%' }} />
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          {NAV.map((item) => {
            const active = pathname === item.href
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
          <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 rounded-2xl text-red-400 hover:bg-red-50 text-xs font-medium transition-colors">
            <span>🚪</span>
            <span>Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-[#E2E8F0] shadow-sm h-14 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            ☁️
          </div>
          <span className="text-[#0F172A]">Cloud<span className="text-blue-500">tify</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-sm">🔔</button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>Z</div>
        </div>
      </header>

      {/* Content */}
      <main className="md:ml-64 pb-24 md:pb-6 pt-14 md:pt-0">
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-[#E2E8F0] shadow-lg">
        <div className="flex items-center">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-all relative"
              >
                <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className={`text-[10px] font-semibold ${active ? 'text-blue-600' : 'text-[#94A3B8]'}`}>{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-1.5" />}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
