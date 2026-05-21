'use client'
import { useState } from 'react'
import { formatIDR } from '@cloudtify/utils'
import { PLAN_PRICE_IDR_MONTHLY, PLAN_PRICE_IDR_YEARLY } from '@cloudtify/types'

const PLANS = [
  {
    name: 'free' as const,
    label: 'Free',
    storage: '15 GB',
    emoji: '🌱',
    color: '#F0FDF4',
    features: ['Upload max 50 MB/file', 'Max 3 link berbagi', 'Basic link sharing', 'Tersedia iklan', 'Kecepatan standar'],
    cta: 'Mulai Gratis',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'plus' as const,
    label: 'Plus',
    storage: '100 GB',
    emoji: '⚡',
    color: '#EFF6FF',
    features: ['Upload max 200 MB/file', 'Max 10 link berbagi', 'Link dengan password', 'Tanpa iklan', 'Kecepatan lebih cepat'],
    cta: 'Coba Plus',
    href: '/auth/register?plan=plus',
    highlighted: false,
  },
  {
    name: 'pro' as const,
    label: 'Pro',
    storage: '500 GB',
    emoji: '🚀',
    color: 'white',
    features: ['Upload max 500 MB/file', 'Max 50 link berbagi', 'Link kadaluarsa custom', 'Tanpa iklan', 'Prioritas server', 'Statistik link berbagi'],
    cta: 'Coba Pro',
    href: '/auth/register?plan=pro',
    highlighted: true,
  },
  {
    name: 'ultra' as const,
    label: 'Ultra',
    storage: '2 TB',
    emoji: '💎',
    color: '#FEFCE8',
    features: ['Upload max 2 GB/file', 'Link berbagi tak terbatas', 'Private Vault enkripsi', 'Tanpa iklan', 'Speed tertinggi', 'Priority support'],
    cta: 'Coba Ultra',
    href: '/auth/register?plan=ultra',
    highlighted: false,
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Paket Harga</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            Harga yang <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>masuk akal</span>
          </h2>
          <p className="text-[#64748B] text-base max-w-md mx-auto mb-8">
            Tidak ada biaya tersembunyi. Bayar pakai GoPay, DANA, OVO, QRIS.
          </p>

          <div className="inline-flex items-center bg-[#F1F5F9] rounded-2xl p-1.5 gap-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!isYearly ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isYearly ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              Tahunan
              <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-bold">-33%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {PLANS.map((plan) => {
            const monthly = PLAN_PRICE_IDR_MONTHLY[plan.name]
            const yearlyMonthly = plan.name !== 'free' ? Math.round(PLAN_PRICE_IDR_YEARLY[plan.name] / 12) : 0
            const displayPrice = isYearly ? yearlyMonthly : monthly

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-6 flex flex-col transition-all hover:shadow-lg ${
                  plan.highlighted
                    ? 'border-2 shadow-xl shadow-blue-500/15'
                    : 'border border-[#E2E8F0]'
                }`}
                style={{
                  background: plan.highlighted ? 'linear-gradient(160deg, #2563EB 0%, #0EA5E9 60%, #06B6D4 100%)' : plan.color,
                  borderColor: plan.highlighted ? '#2563EB' : undefined,
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    ⭐ PALING POPULER
                  </div>
                )}

                <div className="mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 ${plan.highlighted ? 'bg-white/20' : 'bg-white'}`}>
                    {plan.emoji}
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.highlighted ? 'text-blue-100' : 'text-[#94A3B8]'}`}>
                    {plan.label}
                  </div>
                  <div className={`text-3xl font-bold mb-0.5 ${plan.highlighted ? 'text-white' : 'text-[#0F172A]'}`}>
                    {displayPrice === 0 ? 'Gratis' : formatIDR(displayPrice)}
                    {displayPrice > 0 && <span className={`text-base font-normal ml-1 ${plan.highlighted ? 'text-blue-100' : 'text-[#94A3B8]'}`}>/bln</span>}
                  </div>
                  {isYearly && plan.name !== 'free' && (
                    <div className={`text-xs ${plan.highlighted ? 'text-blue-100' : 'text-emerald-600'}`}>
                      Hemat {formatIDR(PLAN_PRICE_IDR_MONTHLY[plan.name] * 12 - PLAN_PRICE_IDR_YEARLY[plan.name])}/thn
                    </div>
                  )}
                  <div className={`text-xl font-bold mt-3 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`}>
                    {plan.storage} <span className={`text-sm font-normal ${plan.highlighted ? 'text-blue-100' : 'text-[#94A3B8]'}`}>storage</span>
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-start gap-2 text-sm ${plan.highlighted ? 'text-blue-50' : 'text-[#64748B]'}`}>
                      <span className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-cyan-200' : 'text-emerald-500'}`}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className={`w-full text-center rounded-2xl py-3 font-bold text-sm transition-all hover:scale-105 ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:shadow-lg'
                      : 'text-white hover:shadow-md'
                  }`}
                  style={!plan.highlighted ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}
                >
                  {plan.cta}
                </a>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-[#94A3B8] text-sm mb-4">Metode pembayaran tersedia</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['GoPay', 'DANA', 'OVO', 'ShopeePay', 'QRIS', 'BCA VA', 'Mandiri VA', 'Kartu Kredit'].map((m) => (
              <span key={m} className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-medium shadow-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
