'use client'
import { useState } from 'react'
import { formatIDR } from '@cloudtify/utils'
import { PLAN_PRICE_IDR_MONTHLY, PLAN_PRICE_IDR_YEARLY } from '@cloudtify/types'

const PLANS = [
  {
    name: 'free' as const,
    label: 'Free',
    storage: '15 GB',
    features: [
      'Upload max 50 MB per file',
      'Berbagi link basic',
      'Max 3 link berbagi',
      'Tersedia iklan',
      'Kecepatan standar',
    ],
    cta: 'Mulai Gratis',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'plus' as const,
    label: 'Plus',
    storage: '100 GB',
    features: [
      'Upload max 200 MB per file',
      'Link berbagi dengan password',
      'Max 10 link berbagi',
      'Tanpa iklan',
      'Kecepatan lebih cepat',
    ],
    cta: 'Coba Plus',
    href: '/auth/register?plan=plus',
    highlighted: false,
  },
  {
    name: 'pro' as const,
    label: 'Pro',
    storage: '500 GB',
    features: [
      'Upload max 500 MB per file',
      'Link dengan tanggal kadaluarsa',
      'Max 50 link berbagi',
      'Tanpa iklan',
      'Prioritas server',
      'Statistik link berbagi',
    ],
    cta: 'Coba Pro',
    href: '/auth/register?plan=pro',
    highlighted: true,  // most popular
  },
  {
    name: 'ultra' as const,
    label: 'Ultra',
    storage: '2 TB',
    features: [
      'Upload max 2 GB per file',
      'Private Vault terenkripsi',
      'Link berbagi tak terbatas',
      'Tanpa iklan',
      'Speed terbaik',
      'Priority support',
    ],
    cta: 'Coba Ultra',
    href: '/auth/register?plan=ultra',
    highlighted: false,
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Harga yang <span className="text-blue-400">masuk akal</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Tidak ada biaya tersembunyi. Tidak perlu kartu kredit. Bisa bayar pakai GoPay, DANA, OVO, QRIS.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-[#1E293B] rounded-2xl p-1.5">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${!isYearly ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${isYearly ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
            >
              Tahunan <span className="text-green-400 text-xs ml-1">Hemat 33%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const monthlyPrice = PLAN_PRICE_IDR_MONTHLY[plan.name]
            const yearlyMonthlyPrice = plan.name !== 'free'
              ? Math.round(PLAN_PRICE_IDR_YEARLY[plan.name] / 12)
              : 0
            const displayPrice = isYearly ? yearlyMonthlyPrice : monthlyPrice

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-6 flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50'
                    : 'bg-[#0F172A] border border-white/5'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    PALING POPULER
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">
                    {plan.label}
                  </div>
                  <div className="text-4xl font-bold text-white mb-0.5">
                    {displayPrice === 0 ? 'Gratis' : formatIDR(displayPrice)}
                    {displayPrice > 0 && <span className="text-white/40 text-lg font-normal">/bln</span>}
                  </div>
                  {isYearly && plan.name !== 'free' && (
                    <div className="text-green-400 text-sm">
                      Dibayar tahunan ({formatIDR(PLAN_PRICE_IDR_YEARLY[plan.name])}/thn)
                    </div>
                  )}
                  <div className="text-2xl font-bold text-blue-400 mt-3">{plan.storage}</div>
                  <div className="text-white/40 text-sm">storage</div>
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className={`w-full text-center rounded-xl py-3 font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-[#1E293B] hover:bg-[#263452] text-white/80 hover:text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            )
          })}
        </div>

        {/* Payment methods */}
        <div className="text-center mt-10">
          <p className="text-white/40 text-sm mb-4">Metode pembayaran yang tersedia</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['GoPay', 'DANA', 'OVO', 'ShopeePay', 'QRIS', 'Transfer Bank', 'Virtual Account', 'Kartu Kredit'].map(
              (method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-white/60 text-xs border border-white/5"
                >
                  {method}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
