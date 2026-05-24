'use client'
import { motion } from 'framer-motion'

interface Testimonial {
  quote: string
  name: string
  role: string
  initial: string
  bg: string
  city: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Akhirnya cloud storage yang bisa bayar pakai GoPay. Antarmukanya bersih, upload cepat. Workflow editing video saya jadi lebih lancar.',
    name: 'Budi Santoso',
    role: 'Video editor freelance',
    initial: 'B',
    bg: 'linear-gradient(135deg,#1A56DB,#3D6FE8)',
    city: 'Jakarta',
  },
  {
    quote:
      'Saya sebelumnya pakai Google Drive untuk arsip foto pernikahan. Migrasi ke Cloudtify hemat 60% biaya bulanan. Servernya benar-benar di Asia, latensi rendah banget.',
    name: 'Rizka Pratiwi',
    role: 'Wedding photographer',
    initial: 'R',
    bg: 'linear-gradient(135deg,#F472B6,#EC4899)',
    city: 'Bandung',
  },
  {
    quote:
      'Sebagai admin di studio animasi 12 orang, fitur team workspace + audit log Cloudtify sangat membantu. Kompetitor minta kontrak tahunan — di sini bayar bulanan.',
    name: 'Andi Wijaya',
    role: 'Studio manager',
    initial: 'A',
    bg: 'linear-gradient(135deg,#10B981,#34D399)',
    city: 'Yogyakarta',
  },
  {
    quote:
      'Suka banget fitur share link bisa diset expiry. Klien saya tidak punya akses selamanya, hanya selama project berjalan. Lebih profesional.',
    name: 'Sari Lestari',
    role: 'UI designer freelance',
    initial: 'S',
    bg: 'linear-gradient(135deg,#F59E0B,#FBBF24)',
    city: 'Surabaya',
  },
  {
    quote:
      'Tim saya share file via WhatsApp dulu, sekarang via Cloudtify link. Lebih cepat, tidak ada compresi, dan ada audit jejak siapa saja yang akses.',
    name: 'Hendra Kurniawan',
    role: 'Marketing manager',
    initial: 'H',
    bg: 'linear-gradient(135deg,#8B5CF6,#A78BFA)',
    city: 'Medan',
  },
  {
    quote:
      'Storage 500 GB Rp15.000/bulan beneran masuk akal buat content creator. Saya nggak perlu mikirin penuh-penuh.',
    name: 'Dewi Anggraini',
    role: 'TikToker · 280K followers',
    initial: 'D',
    bg: 'linear-gradient(135deg,#EF4444,#F87171)',
    city: 'Bali',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24">
          <polygon points="12 2 15 9 22 9 17 14 19 22 12 17 5 22 7 14 2 9 9 9 12 2" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="relative bg-[#F2F0ED] py-24 sm:py-32 px-5 overflow-hidden">
      {/* Decorative quote mark */}
      <div className="pointer-events-none absolute top-10 right-10 font-display text-[20rem] leading-none text-[#1A56DB]/[0.04] select-none font-extrabold">"</div>

      <div className="relative section-inner">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#1A56DB]">
            <span className="w-6 h-px bg-[#1A56DB]" /> Testimoni
          </span>
          <h2 className="font-display font-extrabold text-[#141110] tracking-super-tight mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.04]">
            Dipakai 52.000+ <span className="gradient-text">profesional Indonesia.</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-2 text-[#494440] text-sm">
            <Stars />
            <span className="font-semibold">4,8/5</span>
            <span className="text-[#A8A29E]">·</span>
            <span className="text-[#A8A29E]">1.847 review verified</span>
          </div>
        </div>

        {/* Featured testimonial (first one, big) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-elev-3 border border-[#E5E2DD] mb-6"
        >
          <Stars />
          <p className="font-display font-bold text-[#141110] text-2xl sm:text-3xl leading-[1.3] tracking-tight">
            "{TESTIMONIALS[0]!.quote}"
          </p>
          <div className="mt-7 flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl" style={{ background: TESTIMONIALS[0]!.bg }}>
              {TESTIMONIALS[0]!.initial}
            </span>
            <div>
              <div className="font-display font-bold text-[#141110]">{TESTIMONIALS[0]!.name}</div>
              <div className="text-[#A8A29E] text-sm">{TESTIMONIALS[0]!.role} · {TESTIMONIALS[0]!.city}</div>
            </div>
          </div>
        </motion.div>

        {/* Smaller testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {TESTIMONIALS.slice(1).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 border border-[#E5E2DD] hover:border-[#C2D0F8] hover:shadow-elev-2 transition-all hover:-translate-y-0.5"
            >
              <Stars />
              <p className="text-[#141110] text-[15px] leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F2F0ED]">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm" style={{ background: t.bg }}>
                  {t.initial}
                </span>
                <div>
                  <div className="font-semibold text-[#141110] text-sm">{t.name}</div>
                  <div className="text-[#A8A29E] text-xs">{t.role} · {t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
