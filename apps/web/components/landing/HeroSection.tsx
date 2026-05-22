'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

/* ── Custom visual: Floating storage visualisation ─────────────────── */
function HeroVisual() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none">
      {/* Ambient glow — rgba, not transparent */}
      <div className="absolute inset-0 rounded-3xl"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 60% 40%, rgba(26,86,219,0.12) 0%, rgba(250,250,248,0) 72%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative"
      >
        <svg viewBox="0 0 480 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <defs>
            <filter id="card-shadow" x="-8%" y="-8%" width="116%" height="132%">
              <feDropShadow dx="0" dy="6" stdDeviation="18" floodColor="#141110" floodOpacity="0.07"/>
            </filter>
            <filter id="sm-shadow" x="-12%" y="-12%" width="124%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#141110" floodOpacity="0.05"/>
            </filter>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1A56DB"/>
              <stop offset="100%" stopColor="#38BDF8"/>
            </linearGradient>
            <linearGradient id="bar-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1A56DB"/>
              <stop offset="100%" stopColor="#60A5FA"/>
            </linearGradient>
          </defs>

          {/* ── Background circle ────────────────────── */}
          <circle cx="268" cy="228" r="186" fill="#EBF0FF" opacity="0.55"/>
          <circle cx="268" cy="228" r="138" fill="rgba(255,255,255,0.35)"/>

          {/* ── Main file card ───────────────────────── */}
          <g filter="url(#card-shadow)">
            <rect x="118" y="108" width="226" height="172" rx="18" fill="white"/>
            {/* Card header */}
            <rect x="118" y="108" width="226" height="50" rx="18" fill="#F7F6F3"/>
            <rect x="118" y="136" width="226" height="22" fill="#F7F6F3"/>
            {/* Traffic-light dots */}
            <circle cx="138" cy="133" r="5" fill="#F87171" opacity="0.7"/>
            <circle cx="155" cy="133" r="5" fill="#FCD34D" opacity="0.7"/>
            <circle cx="172" cy="133" r="5" fill="#4ADE80" opacity="0.7"/>
            {/* File name label */}
            <rect x="138" y="165" width="72" height="9" rx="4.5" fill="#D1CEC9"/>
            <rect x="138" y="180" width="50" height="7" rx="3.5" fill="#E5E2DD"/>
            {/* Mini file icon */}
            <rect x="138" y="158" width="0" height="0"/>
            {/* Right side lines */}
            <rect x="224" y="162" width="100" height="8" rx="4" fill="#E5E2DD"/>
            <rect x="224" y="176" width="74" height="7" rx="3.5" fill="#EBE9E4"/>
            <rect x="224" y="189" width="88" height="7" rx="3.5" fill="#EBE9E4"/>
            <rect x="224" y="202" width="60" height="7" rx="3.5" fill="#EBE9E4"/>
            {/* Upload progress bar */}
            <rect x="138" y="218" width="182" height="24" rx="12" fill="#F0EFEC"/>
            <rect x="138" y="218" width="118" height="24" rx="12" fill="url(#bar-grad)" opacity="0.9"/>
            <circle cx="246" cy="230" r="3.5" fill="white" opacity="0.85"/>
            <rect x="253" y="227" width="42" height="6" rx="3" fill="white" opacity="0.5"/>
            <rect x="300" y="226" width="18" height="8" rx="4" fill="#1A56DB" opacity="0.4"/>
          </g>

          {/* ── Top-right small card (rotated) ───────── */}
          <motion.g
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <g transform="rotate(9 390 152)" filter="url(#sm-shadow)">
              <rect x="348" y="108" width="116" height="88" rx="14" fill="white"/>
              <rect x="348" y="108" width="116" height="34" rx="14" fill="#F7F6F3"/>
              <rect x="348" y="128" width="116" height="14" fill="#F7F6F3"/>
              <rect x="362" y="120" width="40" height="7" rx="3.5" fill="#D1CEC9"/>
              <rect x="362" y="152" width="88" height="7" rx="3.5" fill="#E5E2DD"/>
              <rect x="362" y="165" width="64" height="7" rx="3.5" fill="#EBE9E4"/>
              {/* Mini storage bar */}
              <rect x="362" y="178" width="88" height="5" rx="2.5" fill="#F0EFEC"/>
              <rect x="362" y="178" width="58" height="5" rx="2.5" fill="#1A56DB" opacity="0.65"/>
            </g>
          </motion.g>

          {/* ── Storage ring ─────────────────────────── */}
          <motion.g
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <g filter="url(#sm-shadow)">
              <circle cx="386" cy="334" r="50" fill="white"/>
              <circle cx="386" cy="334" r="36" fill="none" stroke="#F0EFEC" strokeWidth="7"/>
              <circle cx="386" cy="334" r="36" fill="none" stroke="url(#ring-grad)" strokeWidth="7"
                strokeDasharray="226" strokeDashoffset="82" strokeLinecap="round"
                transform="rotate(-90 386 334)"/>
              <rect x="374" y="330" width="24" height="8" rx="4" fill="#D1CEC9"/>
              <rect x="378" y="341" width="16" height="5" rx="2.5" fill="#EBE9E4"/>
            </g>
          </motion.g>

          {/* ── Bottom-left floating card ─────────────── */}
          <motion.g
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
            <g transform="rotate(-7 96 360)" filter="url(#sm-shadow)">
              <rect x="44" y="326" width="104" height="70" rx="12" fill="white"/>
              <rect x="58" y="340" width="36" height="7" rx="3.5" fill="#D1CEC9"/>
              <rect x="58" y="353" width="62" height="6" rx="3" fill="#E5E2DD"/>
              <rect x="58" y="365" width="48" height="6" rx="3" fill="#E5E2DD"/>
              <rect x="58" y="378" width="30" height="5" rx="2.5" fill="#4ADE80" opacity="0.55"/>
            </g>
          </motion.g>

          {/* ── Decorative particles ──────────────────── */}
          <circle cx="102" cy="188" r="6" fill="#1A56DB" opacity="0.13"/>
          <circle cx="440" cy="222" r="4" fill="#38BDF8" opacity="0.22"/>
          <circle cx="150" cy="416" r="9" fill="#1A56DB" opacity="0.08"/>
          <circle cx="420" cy="392" r="5" fill="#1A56DB" opacity="0.18"/>
          <circle cx="64"  cy="276" r="4" fill="#60A5FA" opacity="0.2"/>

          {/* ── Connecting dashed lines ───────────────── */}
          <line x1="108" y1="194" x2="132" y2="228" stroke="#1A56DB" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="5 4"/>
          <line x1="344" y1="178" x2="386" y2="284" stroke="#1A56DB" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="5 4"/>
        </svg>
      </motion.div>
    </div>
  )
}

function fadeUpProps(delay: number) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: 'easeOut' as const, delay },
  }
}

/* ── Hero Section ──────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF8] pt-28 pb-20 px-6">
      {/* Subtle warm-blue ambient — no `transparent` keyword */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(26,86,219,0.07) 0%, rgba(250,250,248,0) 68%)' }}/>

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: 'radial-gradient(circle, #C5C1BB 1px, rgba(250,250,248,0) 1px)', backgroundSize: '30px 30px' }}/>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* ── Left: copy ───────────────────────────────── */}
          <div className="flex-1 lg:max-w-[54%] text-center lg:text-left">

            {/* Badge */}
            <motion.div
              {...fadeUpProps(0)}
              className="inline-flex items-center gap-2 rounded-full border border-[#D4DCFC] bg-[#EBF0FF] px-4 py-1.5 text-sm text-[#1A56DB] font-medium mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-pulse"/>
              Cloud storage Indonesia — mulai Rp15.000/bln
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUpProps(0.10)}
              className="font-display font-extrabold text-[#141110] leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 3.75rem)' }}>
              Simpan semua file kamu,<br/>
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #1A56DB 0%, #2B9FD4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                tanpa kompromi.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              {...fadeUpProps(0.20)}
              className="text-[#6B6560] text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-9">
              15 GB gratis selamanya. Enkripsi penuh, server Asia Tenggara,
              bayar pakai GoPay, DANA, atau QRIS — tanpa kartu kredit.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUpProps(0.30)}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1A56DB]/25"
                style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                Mulai Gratis — 15 GB
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/#pricing"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#6B6560] font-semibold px-7 py-3.5 rounded-xl text-base border border-[#E5E2DD] transition-all duration-200 hover:border-[#C5C1BB] hover:text-[#141110] hover:shadow-sm">
                Lihat Paket Harga
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              {...fadeUpProps(0.40)}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
              {[
                'Tanpa kartu kredit',
                'Batalkan kapan saja',
                'Enkripsi AES-256',
                'Server SEA',
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[#A8A29E] text-sm">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: visual ────────────────────────────── */}
          <div className="flex-1 w-full lg:max-w-[46%]">
            <HeroVisual />
          </div>
        </div>

        {/* ── Stats bar ───────────────────────────────────── */}
        <motion.div
          {...fadeUpProps(0.50)}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E5E2DD] border border-[#E5E2DD] rounded-2xl overflow-hidden bg-white shadow-[0_1px_6px_rgba(20,17,16,0.04)]">
          {[
            ['52.000+', 'Pengguna aktif'],
            ['99,9%',   'Uptime SLA'],
            ['4,8 / 5', 'Rating pengguna'],
            ['15 GB',   'Gratis selamanya'],
          ].map(([val, lbl]) => (
            <div key={lbl} className="py-5 px-6 text-center">
              <div className="font-display font-bold text-[#141110] text-xl">{val}</div>
              <div className="text-[#A8A29E] text-xs mt-0.5">{lbl}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
