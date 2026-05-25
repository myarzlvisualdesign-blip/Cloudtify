'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="bg-[#FAFAF8] px-5 py-24 sm:py-32">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[36px] overflow-hidden px-8 py-16 sm:px-16 sm:py-24 noise"
          style={{ background: 'linear-gradient(140deg, #07112F 0%, #14378E 35%, #1A56DB 70%, #3D6FE8 100%)' }}
        >
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.7]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, rgba(0,0,0,0) 1px)', backgroundSize: '24px 24px' }}
          />
          {/* Glowing concentric rings */}
          <div className="absolute -right-32 -top-32 w-[480px] h-[480px] rounded-full border border-white/[0.06]" />
          <div className="absolute -right-24 -top-24 w-[400px] h-[400px] rounded-full border border-white/[0.10]" />
          <div className="absolute -right-16 -top-16 w-[320px] h-[320px] rounded-full border border-white/[0.16]" />
          {/* Gradient glow */}
          <div className="absolute top-1/2 -right-10 w-72 h-72 rounded-full blur-3xl opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.5), rgba(96,165,250,0) 70%)' }}
          />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#93B4FA] mb-5">
              <span className="w-6 h-px bg-[#93B4FA]" /> Mulai sekarang
            </span>
            <h2 className="font-display font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl tracking-super-tight leading-[1.04] mb-6">
              Simpan berkas Anda dengan aman.<br />
              <span className="bg-gradient-to-r from-[#93B4FA] to-white bg-clip-text text-transparent">15 GB gratis selamanya.</span>
            </h2>
            <p className="text-white/70 text-lg sm:text-xl mb-10 leading-relaxed max-w-lg">
              Tanpa kartu kredit dan tanpa masa uji coba berbatas. Tingkatkan paket kapan saja saat Anda membutuhkan ruang lebih.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register/"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1A56DB] font-bold px-7 py-3.5 rounded-xl text-base transition-all duration-200 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5"
              >
                Buat akun gratis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link href="/#pricing" className="btn-ghost-dark text-base">
                Lihat paket harga
              </Link>
            </div>

            {/* Trust microcopy */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/60">
              {['Aktivasi dalam 60 detik', 'Tanpa kartu kredit', 'Enkripsi AES-256', 'Data center Asia Tenggara'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#93B4FA" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
