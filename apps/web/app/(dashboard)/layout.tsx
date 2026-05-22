'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/* ── SVG icon primitives ───────────────────────────────────────────── */
const ico = {
  w: 18, h: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function IcoGrid() {
  return (
    <svg {...ico} stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}

function IcoFolder() {
  return (
    <svg {...ico} stroke="currentColor">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function IcoBarChart() {
  return (
    <svg {...ico} stroke="currentColor">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

function IcoGear() {
  return (
    <svg {...ico} stroke="currentColor">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function IcoLogout() {
  return (
    <svg {...ico} stroke="currentColor">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

function IcoBell() {
  return (
    <svg {...ico} stroke="currentColor">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

/* Cloud logo icon */
function IcoCloud() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  )
}

/* ── Nav items ─────────────────────────────────────────────────────── */
const NAV = [
  { label: 'Dashboard',   href: '/dashboard', Icon: IcoGrid },
  { label: 'File Saya',   href: '/files',     Icon: IcoFolder },
  { label: 'Riwayat',     href: '/history',   Icon: IcoBarChart },
  { label: 'Pengaturan',  href: '/settings',  Icon: IcoGear },
]

/* ── Layout ────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState('')
  useEffect(() => { setPath(window.location.pathname) }, [])

  return (
    <div className="min-h-screen flex">

      {/* ── Desktop sidebar ───────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-30"
        style={{ background: '#111014', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="h-16 flex items-center px-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              <IcoCloud />
            </div>
            <span className="font-display font-bold text-white tracking-tight" style={{ fontSize: 15 }}>
              Cloudtify
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, href, Icon }) => {
            const active = path === href || (href !== '/dashboard' && path.startsWith(href))
            return (
              <Link key={label} href={href}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? 'text-[#93B4FA]'
                    : 'text-[#5C5F73] hover:text-[#B0B4CC] hover:bg-white/[0.05]'
                }`}
                style={active ? { background: 'rgba(26,86,219,0.16)' } : undefined}>
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-[#1A56DB]"/>
                )}
                <Icon />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User / storage mini card */}
        <div className="mx-3 mb-3 p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
              font-display font-bold text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              Z
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-semibold leading-none truncate">Zels</p>
              <p className="text-[#5C5F73] text-[11px] mt-0.5">Paket Free</p>
            </div>
          </div>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-[#5C5F73]">Storage</span>
            <span className="text-[#9BA0B8] font-medium">3,5 / 15 GB</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full"
              style={{ width: '23%', background: 'linear-gradient(90deg, #1A56DB, #60A5FA)' }} />
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/auth/login"
            className="flex items-center gap-3 px-3.5 py-2.5 mt-3 rounded-xl text-[13px] font-medium
              text-[#5C5F73] hover:text-[#F87171] hover:bg-red-500/[0.08] transition-all duration-150">
            <IcoLogout />
            Keluar
          </Link>
        </div>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4"
        style={{ background: '#111014', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
            <IcoCloud />
          </div>
          <span className="font-display font-bold text-white tracking-tight" style={{ fontSize: 14 }}>Cloudtify</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#5C5F73]
            hover:text-white hover:bg-white/[0.07] transition-all"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <IcoBell />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-display font-bold"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
            Z
          </div>
        </div>
      </header>

      {/* ── Content area ──────────────────────────────────────────── */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen bg-[#FAFAF8]">
        <div className="p-4 md:p-8 max-w-[920px]">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ─────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex"
        style={{ background: '#111014', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {NAV.map(({ label, href, Icon }) => {
          const active = path === href
          return (
            <Link key={label} href={href}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all ${
                active ? 'text-[#60A5FA]' : 'text-[#5C5F73] hover:text-[#9BA0B8]'
              }`}>
              <Icon />
              <span className="text-[9px] font-semibold tracking-wide">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
