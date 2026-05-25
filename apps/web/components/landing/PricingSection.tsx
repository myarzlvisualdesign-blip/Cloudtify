'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Plan {
  name: string
  blurb: string
  priceMonthly: number
  priceYearly: number
  storage: string
  highlight?: boolean
  badge?: string
  features: string[]
  ctaLabel: string
  ctaHref: string
}

const PLANS: Plan[] = [
  {
    name: 'Gratis',
    blurb: 'Untuk penggunaan pribadi.',
    priceMonthly: 0,
    priceYearly: 0,
    storage: '15 GB',
    features: [
      '15 GB penyimpanan',
      'Maksimum 1 GB per berkas',
      'Sinkronisasi pada dua perangkat',
      'Tautan berbagi berlaku hingga 7 hari',
      'Dukungan komunitas',
    ],
    ctaLabel: 'Mulai gratis',
    ctaHref: '/auth/register/',
  },
  {
    name: 'Pro',
    blurb: 'Untuk kreator, pekerja lepas, dan UMKM.',
    priceMonthly: 15000,
    priceYearly: 150000,
    storage: '500 GB',
    highlight: true,
    badge: 'Pilihan terpopuler',
    features: [
      '500 GB penyimpanan',
      'Maksimum 50 GB per berkas',
      'Sinkronisasi tanpa batas perangkat',
      'Tautan berbagi dengan kata sandi & masa berlaku kustom',
      'Riwayat versi hingga 30 hari',
      'Dukungan prioritas 24/7',
      'Pencarian cerdas dan penandaan otomatis',
    ],
    ctaLabel: 'Coba Pro gratis 7 hari',
    ctaHref: '/auth/register/',
  },
  {
    name: 'Business',
    blurb: 'Untuk tim dan perusahaan.',
    priceMonthly: 49000,
    priceYearly: 490000,
    storage: '2 TB per pengguna',
    features: [
      '2 TB per pengguna',
      'Tanpa batas ukuran berkas',
      'Ruang kerja tim dengan peran terstruktur',
      'Catatan audit dan SSO',
      'Riwayat versi hingga 90 hari',
      'Manajer keberhasilan pelanggan',
      'SLA dengan jaminan uptime 99,99%',
    ],
    ctaLabel: 'Hubungi tim penjualan',
    ctaHref: 'mailto:sales@cloudtify.com',
  },
]

export function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="relative bg-[#FAFAF8] py-24 sm:py-32 px-5">
      <div className="absolute inset-0 bg-mesh-light opacity-50 pointer-events-none" />
      <div className="relative section-inner">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#1A56DB]">
            <span className="w-6 h-px bg-[#1A56DB]" /> Harga
          </span>
          <h2 className="font-display font-extrabold text-[#141110] tracking-super-tight mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[1.04]">
            Sederhana. <span className="gradient-text">Transparan.</span>
          </h2>
          <p className="mt-5 text-[#494440] text-lg leading-relaxed">
            Tanpa biaya tersembunyi, tanpa kontrak yang mengikat. Pembayaran langsung dari aplikasi menggunakan metode favorit Anda.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-full bg-white border border-[#E5E2DD] shadow-elev-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!yearly ? 'bg-[#141110] text-white' : 'text-[#6B6560]'}`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${yearly ? 'bg-[#141110] text-white' : 'text-[#6B6560]'}`}
            >
              Tahunan
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">−16%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan, i) => {
            const amount = yearly ? plan.priceYearly : plan.priceMonthly
            const period = yearly ? 'tahun' : 'bulan'
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-3xl p-7 ${
                  plan.highlight
                    ? 'bg-[#0B0F1E] text-white border-2 border-[#1A56DB] shadow-glow-lg lg:scale-[1.04]'
                    : 'bg-white border border-[#E5E2DD] hover:border-[#C2D0F8] hover:shadow-elev-3 transition-all'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#1A56DB] to-[#3D6FE8] text-white text-[11px] font-semibold shadow-glow-sm whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                <div className={`text-sm font-mono uppercase tracking-[0.12em] ${plan.highlight ? 'text-[#93B4FA]' : 'text-[#1A56DB]'}`}>
                  {plan.name}
                </div>
                <h3 className={`mt-2 font-display font-bold text-xl ${plan.highlight ? 'text-white' : 'text-[#141110]'}`}>
                  {plan.blurb}
                </h3>

                <div className="mt-6">
                  {amount === 0 ? (
                    <div className={`font-display font-extrabold text-5xl tracking-super-tight ${plan.highlight ? 'text-white' : 'text-[#141110]'}`}>
                      Rp0
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className={plan.highlight ? 'text-white/60 text-lg' : 'text-[#494440] text-lg'}>Rp</span>
                      <span className={`font-display font-extrabold text-5xl tracking-super-tight ${plan.highlight ? 'text-white' : 'text-[#141110]'}`}>
                        {amount.toLocaleString('id-ID')}
                      </span>
                      <span className={plan.highlight ? 'text-white/50 text-sm' : 'text-[#A8A29E] text-sm'}>/{period}</span>
                    </div>
                  )}
                  <div className={`mt-1.5 text-xs ${plan.highlight ? 'text-white/55' : 'text-[#A8A29E]'}`}>
                    {plan.storage} · pembayaran via e-wallet, QRIS, atau transfer bank
                  </div>
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`mt-7 block text-center font-semibold rounded-xl py-3 text-sm transition-all ${
                    plan.highlight
                      ? 'bg-white text-[#0B0F1E] hover:bg-[#FAFAF8] hover:-translate-y-0.5'
                      : 'bg-[#141110] text-white hover:bg-[#1F1C19] hover:-translate-y-0.5'
                  }`}
                >
                  {plan.ctaLabel}
                </Link>

                <ul className={`mt-7 space-y-3 text-sm ${plan.highlight ? 'text-white/85' : 'text-[#494440]'}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${plan.highlight ? 'bg-[#1A56DB]/30 text-[#93B4FA]' : 'bg-[#EBF0FF] text-[#1A56DB]'}`}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-[#A8A29E] text-sm">
          Membutuhkan kapasitas lebih besar atau perjanjian khusus?{' '}
          <a href="mailto:enterprise@cloudtify.com" className="text-[#1A56DB] font-semibold hover:underline">
            Hubungi tim enterprise →
          </a>
        </div>
      </div>
    </section>
  )
}
