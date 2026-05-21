'use client'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            ☁️
          </div>
          <span className="text-[#0F172A]">Cloud<span className="text-blue-500">tify</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['FAQ', '/#faq']].map(([label, href]) => (
            <Link key={label} href={href!} className="text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors px-4 py-2 rounded-xl hover:bg-[#F8FAFF]">
            Masuk
          </Link>
          <Link href="/auth/register" className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            Mulai Gratis
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#64748B] hover:bg-[#F0F4FF] transition-colors">
          <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-6 py-4 space-y-3">
          {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['FAQ', '/#faq']].map(([label, href]) => (
            <Link key={label} href={href!} onClick={() => setIsOpen(false)} className="block text-[#64748B] hover:text-[#0F172A] text-base py-2 border-b border-[#F1F5F9] last:border-0">
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/auth/login" className="flex-1 text-center border-2 border-blue-200 text-blue-600 py-3 rounded-2xl text-sm font-semibold">
              Masuk
            </Link>
            <Link href="/auth/register" className="flex-1 text-center text-white py-3 rounded-2xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
