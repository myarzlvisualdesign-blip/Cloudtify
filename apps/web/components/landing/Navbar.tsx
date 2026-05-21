'use client'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0F1E]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">☁️</span>
          <span className="text-white">Cloud<span className="text-blue-400">tify</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            ['Fitur', '/#features'],
            ['Harga', '/#pricing'],
            ['FAQ', '/#faq'],
          ].map(([label, href]) => (
            <Link key={label} href={href!} className="text-white/60 hover:text-white text-sm transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Mulai Gratis
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/60 text-2xl"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0A0F1E] px-6 py-4 space-y-4">
          {[['Fitur', '/#features'], ['Harga', '/#pricing'], ['FAQ', '/#faq']].map(([label, href]) => (
            <Link
              key={label}
              href={href!}
              onClick={() => setIsOpen(false)}
              className="block text-white/70 hover:text-white text-base"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/auth/login" className="flex-1 text-center border border-white/10 text-white/70 py-3 rounded-xl text-sm">
              Masuk
            </Link>
            <Link href="/auth/register" className="flex-1 text-center bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold">
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
