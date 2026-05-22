'use client'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    role: 'Mahasiswa — Universitas Indonesia',
    initials: 'BS',
    color: '#1A56DB',
    rating: 5,
    text: 'Akhirnya ada cloud storage yang murah dan bisa bayar pakai GoPay. Upload tugas jauh lebih mudah, antarmukanya bersih dan cepat.',
  },
  {
    name: 'Dewi Rahayu',
    role: 'Fotografer Freelance',
    initials: 'DR',
    color: '#7C3AED',
    rating: 5,
    text: 'Saya pakai paket Pro untuk backup foto klien. 500 GB sangat cukup, harganya jauh lebih terjangkau dibanding kompetitor internasional.',
  },
  {
    name: 'Agus Pratama',
    role: 'Pemilik UMKM, Surabaya',
    initials: 'AP',
    color: '#059669',
    rating: 5,
    text: 'Link berbagi berpassword sangat membantu saat kirim file ke klien. Terlihat profesional dan klien pun lebih percaya.',
  },
  {
    name: 'Sari Indah',
    role: 'Guru SD — Yogyakarta',
    initials: 'SI',
    color: '#D97706',
    rating: 5,
    text: 'Gratis 15 GB sudah lebih dari cukup. Foto keluarga tersimpan aman dan bisa diakses dari mana saja tanpa ribet.',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

// inline animation — no Variants object needed

export function TestimonialsSection() {
  return (
    <section className="bg-[#F2F0ED] px-6 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header — intentionally left-aligned */}
        <div className="mb-14 max-w-lg">
          <p className="text-[#1A56DB] text-xs font-semibold tracking-widest uppercase mb-3">Testimoni</p>
          <h2 className="font-display font-extrabold text-[#141110] text-3xl md:text-4xl leading-tight tracking-tight mb-3">
            Dipercaya ribuan<br/>pengguna Indonesia.
          </h2>
          <p className="text-[#6B6560] text-base">
            Bergabunglah dengan lebih dari 52.000 pengguna aktif yang sudah merasakannya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.48, ease: 'easeOut', delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl border border-[#E5E2DD] p-7 hover:border-[#C2D0F8] hover:shadow-[0_8px_24px_rgba(26,86,219,0.07)] transition-all duration-200">
              <Stars n={t.rating} />
              <p className="text-[#141110] text-sm leading-relaxed mb-6 font-medium">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-xs text-white flex-shrink-0"
                  style={{ backgroundColor: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-display font-semibold text-[#141110] text-sm">{t.name}</div>
                  <div className="text-[#A8A29E] text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
