'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatIDR } from '@cloudtify/utils'
import { PLAN_PRICE_IDR_MONTHLY, PLAN_PRICE_IDR_YEARLY } from '@cloudtify/types'

function Check({ light }: { light?: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke={light ? 'rgba(255,255,255,0.85)' : '#22C55E'}
      strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

const PLANS = [
  {
    name: 'free' as const,
    label: 'Free',
    storage: '15 GB',
    desc: 'Untuk pemakaian pribadi ringan',
    features: ['Upload maks 50 MB/file', 'Maks 3 link berbagi', 'Basic link sharing', 'Kecepatan standar'],
    cta: 'Mulai Gratis',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'plus' as const,
    label: 'Plus',
    storage: '100 GB',
    desc: 'Untuk pengguna aktif sehari-hari',
    features: ['Upload maks 200 MB/file', 'Maks 10 link berbagi', 'Link dengan password', 'Tanpa iklan', 'Kecepatan lebih cepat'],
    cta: 'Pilih Plus',
    href: '/auth/register?plan=plus',
    highlight: false,
  },
  {
    name: 'pro' as const,
    label: 'Pro',
    storage: '500 GB',
    desc: 'Untuk profesional & kreator',
    features: ['Upload maks 500 MB/file', 'Maks 50 link berbagi', 'Link kadaluarsa custom', 'Prioritas server', 'Statistik link', 'Tanpa iklan'],
    cta: 'Pilih Pro',
    href: '/auth/register?plan=pro',
    highlight: true,
  },
  {
    name: 'ultra' as const,
    label: 'Ultra',
    storage: '2 TB',
    desc: 'Untuk tim & bisnis skala besar',
    features: ['Upload maks 2 GB/file', 'Link berbagi tak terbatas', 'Private Vault terenkripsi', 'Priority support', 'Kecepatan tertinggi', 'Tanpa iklan'],
    cta: 'Pilih Ultra',
    href: '/auth/register?plan=ultra',
    highlight: false,
  },
]

// inline animation — no Variants object needed

export function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="bg-[#FAFAF8] px-6 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#1A56DB] text-xs font-semibold tracking-widest uppercase mb-3">Paket Harga</p>
          <h2 className="font-display font-extrabold text-[#141110] text-3xl md:text-4xl leading-tight tracking-tight mb-4">
            Harga yang jujur,<br className="hidden sm:block"/> tanpa kejutan.
          </h2>
          <p className="text-[#A8A29E] text-base max-w-sm mx-auto mb-8">
            Tidak ada biaya tersembunyi. Bayar pakai GoPay, DANA, OVO, atau QRIS.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-[#F2F0ED] rounded-xl p-1 gap-1 border border-[#E5E2DD]">
            <button onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${!yearly ? 'bg-white shadow-sm text-[#141110]' : 'text-[#A8A29E] hover:text-[#6B6560]'}`}>
              Bulanan
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${yearly ? 'bg-white shadow-sm text-[#141110]' : 'text-[#A8A29E] hover:text-[#6B6560]'}`}>
              Tahunan
              <span className="bg-emerald-100 text-emerald-700 text-[11px] px-2 py-0.5 rounded-full font-bold">−33%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          {PLANS.map((plan, i) => {
            const monthly      = PLAN_PRICE_IDR_MONTHLY[plan.name]
            const yearlyMo     = plan.name !== 'free' ? Math.round(PLAN_PRICE_IDR_YEARLY[plan.name] / 12) : 0
            const displayPrice = yearly ? yearlyMo : monthly

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.07 }}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-200 ${
                  plan.highlight
                    ? 'shadow-2xl shadow-[#1A56DB]/18 scale-[1.02]'
                    : 'border border-[#E5E2DD] hover:border-[#C2D0F8] hover:shadow-[0_8px_24px_rgba(20,17,16,0.07)]'
                }`}
                style={plan.highlight
                  ? { background: 'linear-gradient(160deg, #0F2D8A 0%, #1A56DB 55%, #2B7FD4 100%)' }
                  : { background: '#fff' }
                }>

                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap tracking-wide shadow-sm">
                    Paling Populer
                  </div>
                )}

                <div className="mb-5">
                  <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${plan.highlight ? 'text-blue-200' : 'text-[#A8A29E]'}`}>
                    {plan.label}
                  </div>
                  <div className={`font-display font-extrabold leading-none text-[2.1rem] tracking-tight mb-1 ${plan.highlight ? 'text-white' : 'text-[#141110]'}`}>
                    {displayPrice === 0 ? 'Gratis' : formatIDR(displayPrice)}
                    {displayPrice > 0 && (
                      <span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-blue-200' : 'text-[#A8A29E]'}`}>/bln</span>
                    )}
                  </div>
                  {yearly && plan.name !== 'free' && (
                    <div className={`text-xs mb-2 ${plan.highlight ? 'text-blue-200' : 'text-emerald-600'}`}>
                      Hemat {formatIDR(PLAN_PRICE_IDR_MONTHLY[plan.name] * 12 - PLAN_PRICE_IDR_YEARLY[plan.name])}/tahun
                    </div>
                  )}
                  <div className={`font-display font-bold text-base mt-3 ${plan.highlight ? 'text-white' : 'text-[#1A56DB]'}`}>
                    {plan.storage}
                    <span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-blue-200' : 'text-[#A8A29E]'}`}>storage</span>
                  </div>
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-blue-100/70' : 'text-[#A8A29E]'}`}>{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? 'text-blue-50' : 'text-[#6B6560]'}`}>
                      <Check light={plan.highlight}/>
                      {feat}
                    </li>
                  ))}
                </ul>

                <a href={plan.href}
                  className={`w-full text-center rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 ${
                    plan.highlight
                      ? 'bg-white text-[#1A56DB] hover:shadow-lg hover:shadow-black/10'
                      : 'text-white hover:opacity-90 hover:shadow-md hover:shadow-[#1A56DB]/20'
                  }`}
                  style={!plan.highlight ? { background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' } : undefined}>
                  {plan.cta}
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Payment row */}
        <div className="text-center mt-12">
          <p className="text-[#A8A29E] text-sm mb-4">Metode pembayaran</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['GoPay', 'DANA', 'OVO', 'ShopeePay', 'QRIS', 'BCA VA', 'Mandiri VA', 'Kartu Kredit'].map((m) => (
              <span key={m} className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E2DD] text-[#6B6560] text-xs font-medium shadow-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
