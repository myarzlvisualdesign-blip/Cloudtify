'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PAYMENT_LOGOS, INFRA_LOGOS } from './BrandLogos'

/* ── Reusable: animated badge with pulse ─────────────────────────── */
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2 rounded-full border border-[#D4DCFC] bg-[#EBF0FF]/80 backdrop-blur px-3.5 py-1.5 text-[13px] font-medium text-[#1A56DB]"
    >
      <span className="relative inline-flex w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-[#1A56DB] animate-ping opacity-60" />
        <span className="relative inline-block w-2 h-2 rounded-full bg-[#1A56DB]" />
      </span>
      Penyimpanan cloud Indonesia — 15 GB gratis selamanya
    </motion.div>
  )
}

/* ── Animated odometer counter (intersection-triggered) ──────────── */
function OdometerNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = ref.current
    if (!el) return
    let raf = 0
    let started = false
    const io = new IntersectionObserver((entries) => {
      const e = entries[0]
      if (!e?.isIntersecting || started) return
      started = true
      const start = performance.now()
      const dur = 1600
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - t, 3)
        setCurrent(Math.round(eased * value))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      io.disconnect()
    }, { threshold: 0.3 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])
  return <span ref={ref}>{current.toLocaleString('id-ID')}{suffix}</span>
}

/* ── Centerpiece: animated browser-frame product showcase ────────── */
function ProductShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-16 max-w-5xl"
    >
      {/* Soft glow underneath */}
      <div
        aria-hidden
        className="absolute -inset-x-12 -bottom-12 h-48 rounded-[100%] blur-3xl"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(26,86,219,0.40), rgba(26,86,219,0) 70%)' }}
      />

      {/* Outer chrome */}
      <div className="relative rounded-2xl border border-[#E5E2DD] bg-white shadow-elev-4 overflow-hidden">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#F2F0ED] bg-[#FAFAF8]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-white border border-[#E5E2DD] rounded-md px-3 py-1 max-w-md w-full">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A8A29E" strokeWidth="2.4" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className="font-mono text-[11px] text-[#6B6560]">cloudtify.com/files</span>
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* App body */}
        <div className="grid grid-cols-12 min-h-[420px]">
          {/* Sidebar */}
          <div className="col-span-3 lg:col-span-2 border-r border-[#F2F0ED] bg-[#0F1124] p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#1A56DB] to-[#38BDF8]" />
              <span className="text-white text-[11px] font-display font-bold tracking-tight">Cloudtify</span>
            </div>
            {[
              { l: 'Dashboard', a: false },
              { l: 'File Saya', a: true },
              { l: 'Riwayat', a: false },
              { l: 'Pengaturan', a: false },
            ].map((n) => (
              <div
                key={n.l}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] ${n.a ? 'bg-[#1A56DB]/15 text-[#93B4FA] font-semibold' : 'text-[#5C5F73]'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${n.a ? 'bg-[#60A5FA]' : 'bg-[#5C5F73]'}`} />
                {n.l}
              </div>
            ))}
            <div className="mt-auto p-2.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
              <div className="flex justify-between text-[9px] text-[#5C5F73] mb-1.5">
                <span>Storage</span>
                <span className="text-[#93B4FA] font-semibold">3,5/15 GB</span>
              </div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '23%' }}
                  transition={{ duration: 1.4, delay: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#1A56DB] to-[#60A5FA]"
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-9 lg:col-span-10 p-5 bg-[#FAFAF8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-bold text-[#141110] text-[15px]">File Saya</div>
                <div className="text-[10px] text-[#A8A29E] mt-0.5">128 file · 3,5 GB digunakan</div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="text-white text-[11px] font-semibold px-3 py-1.5 rounded-md bg-gradient-to-r from-[#1A56DB] to-[#3D6FE8] shadow-glow-sm"
              >
                + Upload
              </motion.div>
            </div>

            {/* File grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/* Photo cards (gradient stand-ins) */}
              {[
                { type: 'img', g: 'from-rose-200 via-fuchsia-200 to-indigo-200', name: 'pantai-bali.jpg', size: '2,4 MB' },
                { type: 'img', g: 'from-emerald-200 via-teal-200 to-cyan-200', name: 'sawah-ubud.jpg',  size: '3,1 MB' },
                { type: 'vid', g: 'from-orange-200 via-amber-200 to-yellow-200', name: 'sunset.mp4',     size: '21 MB' },
                { type: 'doc', g: 'from-indigo-200 via-blue-200 to-sky-200',     name: 'proposal.pdf',  size: '482 KB' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                  className="rounded-xl overflow-hidden border border-[#E5E2DD] bg-white shadow-elev-1"
                >
                  <div className={`h-20 bg-gradient-to-br ${f.g} relative`}>
                    {f.type === 'vid' && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center text-[#141110]">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </span>
                      </span>
                    )}
                    {f.type === 'doc' && (
                      <span className="absolute inset-0 flex items-center justify-center text-[#1A56DB]">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="px-2.5 py-2">
                    <div className="text-[10px] font-medium text-[#141110] truncate">{f.name}</div>
                    <div className="text-[9px] text-[#A8A29E] mt-0.5">{f.size}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Uploading row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
              className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-[#E5E2DD] shadow-elev-1"
            >
              <div className="w-7 h-7 rounded-md bg-[#EBF0FF] flex items-center justify-center text-[#1A56DB]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-[10px] text-[#141110]">
                  <span className="font-medium truncate">presentation.pptx</span>
                  <span className="text-[#1A56DB] font-semibold">68%</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-[#F2F0ED] overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '68%' }}
                    transition={{ duration: 1.8, delay: 1.9, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#1A56DB] to-[#60A5FA]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating "shared with" pill — top right */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex absolute -right-4 top-16 items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-elev-3 border border-[#E5E2DD]"
      >
        <div className="flex -space-x-2">
          {['#FB7185', '#22D3EE', '#FBBF24'].map((c) => (
            <span key={c} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[11px] text-[#494440] font-medium">3 kolaborator aktif</span>
      </motion.div>

      {/* Floating speed badge — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex absolute -left-6 bottom-20 items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 shadow-elev-3 border border-[#E5E2DD]"
      >
        <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#3D6FE8] flex items-center justify-center text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </span>
        <div className="leading-tight">
          <div className="text-[11px] text-[#A8A29E]">Kecepatan upload</div>
          <div className="text-[13px] font-display font-bold text-[#141110]">120 MB/s</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Partner & infra logo strip ───────────────────────────────────── */
function PartnerStrip() {
  return (
    <div className="mt-20 lg:mt-24 space-y-10">
      {/* Payment partners */}
      <div>
        <p className="text-center text-[#A8A29E] text-[11px] uppercase tracking-[0.22em] font-semibold mb-7">
          Metode pembayaran yang didukung
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-12">
          {PAYMENT_LOGOS.map(({ Component, name }) => (
            <span key={name} className="opacity-70 hover:opacity-100 transition-opacity">
              <Component className="h-6 sm:h-7" tone="dark" />
            </span>
          ))}
        </div>
      </div>

      {/* Infra stack */}
      <div className="pt-10 border-t border-[#E5E2DD]">
        <p className="text-center text-[#A8A29E] text-[11px] uppercase tracking-[0.22em] font-semibold mb-7">
          Dibangun di atas infrastruktur kelas enterprise
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 sm:gap-x-16 gap-y-5">
          {INFRA_LOGOS.map(({ Component, name }) => (
            <span key={name} className="opacity-70 hover:opacity-100 transition-opacity">
              <Component className="h-6 sm:h-7" tone="dark" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Hero Section ──────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-5 bg-mesh-light noise">
      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[length:64px_64px] opacity-[0.5] mask-fade-y" />

      <div className="relative mx-auto max-w-6xl text-center">
        <HeroBadge />

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold text-[#141110] mt-6 mx-auto max-w-4xl"
          style={{ fontSize: 'clamp(2.25rem, 5.6vw, 4.25rem)', lineHeight: 1.06, letterSpacing: '-0.035em' }}
        >
          Penyimpanan cloud yang <span className="gradient-text">dirancang untuk Indonesia.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-7 max-w-2xl text-[#494440] text-lg sm:text-xl leading-relaxed"
        >
          15 GB gratis selamanya, enkripsi end-to-end, dan data center di Jakarta serta Singapura.
          Pembayaran via <strong className="text-[#141110]">GoPay</strong>, <strong className="text-[#141110]">DANA</strong>, <strong className="text-[#141110]">QRIS</strong>, dan transfer bank — tanpa kartu kredit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link href="/auth/register/" className="btn-primary text-base">
            Buat akun gratis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link href="/#features" className="btn-secondary text-base">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg>
            Lihat cara kerja
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#A8A29E]"
        >
          {['Tanpa kartu kredit', 'Berhenti berlangganan kapan saja', 'Enkripsi AES-256', 'Data center Jakarta & Singapura'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              {item}
            </span>
          ))}
        </motion.div>

        <ProductShowcase />
        <PartnerStrip />

        {/* Stats bar — animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E5E2DD] border border-[#E5E2DD] rounded-3xl overflow-hidden bg-white shadow-elev-2"
        >
          {[
            { v: 52000, suffix: '+', l: 'Pengguna aktif' },
            { v: 99,    suffix: ',9%',     l: 'Uptime SLA' },
            { v: 120,   suffix: ' MB/s',   l: 'Rata-rata kecepatan upload' },
            { v: 15,    suffix: ' GB',     l: 'Penyimpanan gratis selamanya' },
          ].map((s, i) => (
            <div key={i} className="py-6 px-4 sm:px-6 text-center">
              <div className="font-display font-extrabold text-[#141110] text-2xl sm:text-3xl tracking-tight">
                <OdometerNumber value={s.v} suffix={s.suffix} />
              </div>
              <div className="text-[#6B6560] text-xs mt-1.5">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
