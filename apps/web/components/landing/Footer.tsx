'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '../brand/Logo'

const LINK_COLUMNS = [
  {
    title: 'Produk',
    links: [
      ['Fitur', '/#features'],
      ['Harga', '/#pricing'],
      ['Aplikasi iOS', '#'],
      ['Aplikasi Android', '#'],
      ['Web app', '/dashboard/'],
    ],
  },
  {
    title: 'Sumber daya',
    links: [
      ['Pusat bantuan', '/help/'],
      ['Status sistem', '#'],
      ['Roadmap', '#'],
      ['Changelog', '#'],
      ['Blog', '#'],
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      ['Tentang kami', '#'],
      ['Karir', '#'],
      ['Press kit', '#'],
      ['Kontak', 'mailto:halo@cloudtify.com'],
      ['Affiliate', '#'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Syarat layanan', '/terms/'],
      ['Kebijakan privasi', '/privacy/'],
      ['Kebijakan cookie', '#'],
      ['UU PDP compliance', '#'],
      ['Security disclosure', 'mailto:security@cloudtify.com'],
    ],
  },
] as const

const SOCIALS = [
  { label: 'Twitter', href: '#', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'Instagram', href: '#', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { label: 'TikTok', href: '#', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.71a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.14z"/></svg> },
  { label: 'YouTube', href: '#', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-4-.5-5.9a3 3 0 0 0-2.1-2.1C18.5 3.5 12 3.5 12 3.5s-6.5 0-8.4.5a3 3 0 0 0-2.1 2.1C1 8 1 12 1 12s0 4 .5 5.9a3 3 0 0 0 2.1 2.1c1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.9.5-5.9zm-13.4 4.1V7.9l6.1 4.1z"/></svg> },
  { label: 'Discord', href: '#', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.32 4.37A19.79 19.79 0 0 0 16.34 3a14.61 14.61 0 0 0-.66 1.36 18.27 18.27 0 0 0-5.4 0A14.6 14.6 0 0 0 9.62 3a19.79 19.79 0 0 0-3.98 1.37C2.3 9.14 1.45 13.78 1.88 18.36a19.94 19.94 0 0 0 6.09 3.08c.49-.66.93-1.36 1.31-2.1a13 13 0 0 1-2.07-.99c.17-.13.34-.25.5-.39a14.36 14.36 0 0 0 12.58 0c.16.14.33.26.5.39a13 13 0 0 1-2.07.99c.38.74.82 1.44 1.31 2.1a19.94 19.94 0 0 0 6.09-3.08c.5-5.32-.85-9.92-3.8-13.99zM8.52 15.62c-1.18 0-2.16-1.08-2.16-2.4 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.09 2.16 2.42 0 1.32-.95 2.4-2.16 2.4zm7.96 0c-1.18 0-2.16-1.08-2.16-2.4 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.09 2.16 2.42 0 1.32-.95 2.4-2.16 2.4z"/></svg> },
]

const BADGES = ['ISO 27001', 'UU PDP Indonesia', 'GDPR Ready', 'SOC 2 Type II*']

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <footer className="relative bg-[#0A0907] text-white pt-20 pb-10 px-5 overflow-hidden">
      {/* Top mesh glow */}
      <div className="pointer-events-none absolute -top-32 left-0 right-0 h-64 opacity-50"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(26,86,219,0.30), rgba(10,9,7,0) 70%)' }}
      />
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
      />

      <div className="relative section-inner-wide">
        {/* Newsletter row */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pb-14 mb-14 border-b border-white/10">
          <div>
            <Logo size={36} wordmark="light" />
            <h3 className="mt-6 font-display font-extrabold text-3xl sm:text-4xl tracking-super-tight leading-[1.1]">
              Update bulanan, tanpa spam.
            </h3>
            <p className="mt-3 text-white/60 max-w-md">
              Tips storage, fitur baru, dan promo eksklusif. Unsubscribe kapan saja dengan 1 klik.
            </p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); setEmail('') }}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-self-end"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailmu@contoh.com"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#60A5FA]/50 focus:bg-white/[0.08]"
            />
            <button
              type="submit"
              className="bg-white text-[#0B0F1E] font-semibold px-6 py-3.5 rounded-xl text-sm hover:opacity-90 transition-all"
            >
              {submitted ? '✓ Terima kasih!' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-14">
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Cloud storage premium untuk Indonesia. Server lokal, harga e-wallet, fitur seimbang dengan global.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <span key={b} className="inline-flex items-center text-[10px] font-mono text-white/45 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold text-white text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href!} className="text-white/55 hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="text-white/45 text-xs">
            © {new Date().getFullYear()} Cloudtify. Made in Indonesia 🇮🇩 with ❤️.
            <br className="md:hidden" />
            <span className="ml-0 md:ml-3">All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/55 hover:text-white bg-white/[0.04] hover:bg-white/[0.10] border border-white/[0.06] hover:border-white/[0.16] transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Massive wordmark */}
        <div className="mt-14 select-none overflow-hidden mask-fade-x">
          <p className="font-display font-extrabold tracking-super-tight leading-none text-center"
            style={{ fontSize: 'clamp(4rem, 18vw, 14rem)' }}
          >
            <span className="text-white">Cloud</span>
            <span className="gradient-text">tify</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
