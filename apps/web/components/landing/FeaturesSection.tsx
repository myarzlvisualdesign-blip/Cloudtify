'use client'
import { motion } from 'framer-motion'

/* ── Icon set (custom SVG, consistent 1.8px stroke) ──────────────── */
const icons = {
  bolt:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  shield:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  globe:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  phone:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>,
  refresh: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  share:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  bar:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  gift:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
}

/* ── Inline mini bar chart for the large cell ──────────────────────── */
function MiniBarViz() {
  const bars = [
    { h: 28, label: 'Foto',     color: '#1A56DB' },
    { h: 20, label: 'Video',    color: '#60A5FA' },
    { h: 16, label: 'Dok',      color: '#BAD0FC' },
    { h: 10, label: 'Lainnya',  color: '#E0EAFF' },
  ]
  return (
    <div className="mt-5 flex items-end gap-3">
      {bars.map((b) => (
        <div key={b.label} className="flex flex-col items-center gap-1.5">
          <div className="w-7 rounded-t-md transition-all" style={{ height: b.h, background: b.color }}/>
          <span className="text-[10px] text-[#A8A29E]">{b.label}</span>
        </div>
      ))}
      <div className="ml-2 flex flex-col gap-1">
        <span className="text-[#141110] font-display font-bold text-base">3,5 GB</span>
        <span className="text-[#A8A29E] text-xs">dari 15 GB</span>
      </div>
    </div>
  )
}

/* ── Feature data ──────────────────────────────────────────────────── */
interface Feature {
  icon: keyof typeof icons
  title: string
  desc: string
  accent: string
  size: 'large' | 'normal'
}

const FEATURES: Feature[] = [
  {
    icon: 'bolt',
    title: 'Upload super cepat',
    desc: 'Chunked upload dengan CDN global Cloudflare. Stabil meski koneksi naik-turun.',
    accent: '#1A56DB',
    size: 'large',
  },
  {
    icon: 'shield',
    title: 'Enkripsi end-to-end',
    desc: 'AES-256 at-rest. TLS in-transit. Link berbagi bisa diproteksi password.',
    accent: '#7C3AED',
    size: 'normal',
  },
  {
    icon: 'globe',
    title: 'Dibuat untuk Indonesia',
    desc: 'GoPay, DANA, OVO, ShopeePay, QRIS — harga dalam Rupiah, antarmuka bahasa Indonesia.',
    accent: '#DC2626',
    size: 'normal',
  },
  {
    icon: 'phone',
    title: 'Aplikasi mobile ringan',
    desc: 'iOS & Android. Preview foto dan video langsung. Dark mode.',
    accent: '#059669',
    size: 'normal',
  },
  {
    icon: 'bar',
    title: 'Dashboard storage jelas',
    desc: 'Pantau penggunaan per kategori secara real-time.',
    accent: '#0891B2',
    size: 'large',
  },
  {
    icon: 'share',
    title: 'Berbagi aman & fleksibel',
    desc: 'Link berpassword, tanggal kadaluarsa, batas unduhan.',
    accent: '#D97706',
    size: 'normal',
  },
  {
    icon: 'refresh',
    title: 'Recycle bin 30 hari',
    desc: 'File terhapus tetap aman selama 30 hari. Pulihkan kapan saja.',
    accent: '#65A30D',
    size: 'normal',
  },
  {
    icon: 'gift',
    title: 'Program referral',
    desc: 'Ajak teman, dapat bonus storage. Semakin banyak, semakin besar.',
    accent: '#BE185D',
    size: 'normal',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-[#F2F0ED] px-6 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 max-w-xl">
          <p className="text-[#1A56DB] text-xs font-semibold tracking-widest uppercase mb-3">Fitur Unggulan</p>
          <h2 className="font-display font-extrabold text-[#141110] text-3xl md:text-4xl leading-tight tracking-tight mb-4">
            Satu platform.<br/>Semua yang kamu butuhkan.
          </h2>
          <p className="text-[#6B6560] text-base leading-relaxed">
            Dirancang dari nol untuk pengalaman penyimpanan cloud terbaik di Indonesia.
          </p>
        </div>

        {/* Bento grid — 3-col on desktop, varied row heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.06 }}
              whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(20,17,16,0.08)' }}
              className={`bg-white rounded-2xl border border-[#E5E2DD] p-6 cursor-default transition-colors hover:border-[#C2D0F8] ${feat.size === 'large' ? 'lg:col-span-1' : ''}`}
              style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform"
                style={{ backgroundColor: feat.accent + '14', color: feat.accent }}>
                {icons[feat.icon]}
              </div>

              <h3 className="font-display font-bold text-[#141110] text-base mb-2">{feat.title}</h3>
              <p className="text-[#6B6560] text-sm leading-relaxed">{feat.desc}</p>

              {/* Extra visual only on "dashboard" card */}
              {feat.icon === 'bar' && <MiniBarViz />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
