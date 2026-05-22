'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

function CloudLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect width="30" height="30" rx="8" fill="#1A56DB"/>
      <path d="M9 21H21C23.2 21 25 19.2 25 17C25 14.8 23.2 13 21 13C20.6 11.5 19.5 10.2 18 9.5C16.5 8.8 14.8 8.7 13.2 9.3C11.7 9.9 10.5 11 9.9 12.5C8.3 12.6 7 14 7 15.7C7 18.1 7.9 21 9 21Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 19V14M13 16L15 14L17 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E5E2DD] shadow-[0_1px_12px_rgba(20,17,16,0.06)]'
        : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <CloudLogo />
          <span className="font-display font-extrabold text-[#141110] text-lg tracking-tight leading-none">
            Cloud<span className="text-[#1A56DB]">tify</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['FAQ', '/#faq']].map(([label, href]) => (
            <Link key={label} href={href!}
              className="px-4 py-2 rounded-lg text-[#6B6560] hover:text-[#141110] hover:bg-[#F2F0ED] text-sm font-medium transition-all duration-150">
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/auth/login"
            className="text-[#6B6560] hover:text-[#141110] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#F2F0ED] transition-all duration-150">
            Masuk
          </Link>
          <Link href="/auth/register"
            className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[#1A56DB]/20 hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
            Mulai Gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#6B6560] hover:bg-[#F2F0ED] transition-colors">
          {isOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E5E2DD] bg-[#FAFAF8] px-6 py-4">
          <div className="space-y-0.5 mb-4">
            {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['FAQ', '/#faq']].map(([label, href]) => (
              <Link key={label} href={href!} onClick={() => setIsOpen(false)}
                className="block text-[#6B6560] hover:text-[#141110] hover:bg-[#F2F0ED] text-sm py-2.5 px-3 rounded-lg font-medium transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 pt-3 border-t border-[#E5E2DD]">
            <Link href="/auth/login" className="flex-1 text-center border border-[#E5E2DD] text-[#6B6560] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#F2F0ED] transition-colors">
              Masuk
            </Link>
            <Link href="/auth/register" className="flex-1 text-center text-white py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
