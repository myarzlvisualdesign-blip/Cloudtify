'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function IcoDashboard({ active }: { active: boolean }) {
  const c = active ? '#fff' : '#64748B'
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={3} width={7} height={7} rx={1.5} stroke={c} strokeWidth={2} />
      <rect x={14} y={3} width={7} height={7} rx={1.5} stroke={c} strokeWidth={2} />
      <rect x={3} y={14} width={7} height={7} rx={1.5} stroke={c} strokeWidth={2} />
      <rect x={14} y={14} width={7} height={7} rx={1.5} stroke={c} strokeWidth={2} />
    </svg>
  )
}

function IcoUsers({ active }: { active: boolean }) {
  const c = active ? '#fff' : '#64748B'
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={2} />
      <circle cx={9} cy={7} r={4} stroke={c} strokeWidth={2} />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={c} strokeWidth={2} />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={c} strokeWidth={2} />
    </svg>
  )
}

function IcoSubscription({ active }: { active: boolean }) {
  const c = active ? '#fff' : '#64748B'
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={1} y={4} width={22} height={16} rx={2} stroke={c} strokeWidth={2} />
      <line x1={1} y1={10} x2={23} y2={10} stroke={c} strokeWidth={2} />
    </svg>
  )
}

function IcoFiles({ active }: { active: boolean }) {
  const c = active ? '#fff' : '#64748B'
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={c} strokeWidth={2} />
      <polyline points="14 2 14 8 20 8" stroke={c} strokeWidth={2} />
      <line x1={16} y1={13} x2={8} y2={13} stroke={c} strokeWidth={2} />
      <line x1={16} y1={17} x2={8} y2={17} stroke={c} strokeWidth={2} />
    </svg>
  )
}

function IcoAnalytics({ active }: { active: boolean }) {
  const c = active ? '#fff' : '#64748B'
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={18} y1={20} x2={18} y2={10} stroke={c} strokeWidth={2} />
      <line x1={12} y1={20} x2={12} y2={4} stroke={c} strokeWidth={2} />
      <line x1={6} y1={20} x2={6} y2={14} stroke={c} strokeWidth={2} />
    </svg>
  )
}

function IcoSettings({ active }: { active: boolean }) {
  const c = active ? '#fff' : '#64748B'
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={3} stroke={c} strokeWidth={2} />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={c} strokeWidth={2} />
    </svg>
  )
}

function IcoHome() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#94A3B8" strokeWidth={2} />
      <polyline points="9 22 9 12 15 12 15 22" stroke="#94A3B8" strokeWidth={2} />
    </svg>
  )
}

function IcoBell() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#64748B" strokeWidth={2} />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#64748B" strokeWidth={2} />
    </svg>
  )
}

function IcoCloud() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="white" stroke="none" />
    </svg>
  )
}

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', Icon: IcoDashboard },
  { label: 'Pengguna', href: '/admin/users', Icon: IcoUsers },
  { label: 'Langganan', href: '/admin/subscriptions', Icon: IcoSubscription },
  { label: 'File & Laporan', href: '/admin/files', Icon: IcoFiles },
  { label: 'Analitik', href: '/admin/analytics', Icon: IcoAnalytics },
  { label: 'Pengaturan', href: '/admin/settings', Icon: IcoSettings },
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
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              <IcoCloud />
            </div>
            <span className="text-[#0F172A]">Cloud<span className="text-blue-500">Admin</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map(({ label, href, Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active ? 'text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
              >
                <Icon active={active} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#E2E8F0]">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-2xl text-[#94A3B8] hover:text-[#64748B] text-xs hover:bg-[#F1F5F9] transition-colors">
            <IcoHome />
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
            <button className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center hover:bg-[#EFF6FF] transition-colors">
              <IcoBell />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              A
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex bg-white border-b border-[#E2E8F0] overflow-x-auto px-4 py-2 gap-2 flex-shrink-0">
          {ADMIN_NAV.map(({ label, href, Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={label}
                href={href}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active ? 'text-white' : 'text-[#64748B] bg-[#F1F5F9]'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
              >
                <Icon active={active} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
