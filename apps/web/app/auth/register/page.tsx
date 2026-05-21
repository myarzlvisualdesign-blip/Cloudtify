'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', referral: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep(3)
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center px-6">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
            ✅
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Akun Berhasil Dibuat!</h1>
          <p className="text-[#64748B] text-sm mb-2">Kamu mendapatkan <strong className="text-blue-600">15 GB storage gratis</strong> selamanya.</p>
          <p className="text-[#94A3B8] text-xs mb-8">Cek email {form.email} untuk verifikasi akun.</p>
          <Link href="/dashboard" className="btn-primary w-full block text-center py-4 text-base">
            Buka Dashboard →
          </Link>
          <Link href="/auth/login" className="block mt-3 text-[#64748B] text-sm hover:text-blue-500 transition-colors">
            Atau masuk ke akun yang sudah ada
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 60%, #06B6D4 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 -translate-y-1/4 translate-x-1/4 bg-white" />
        <div className="relative text-center px-12 max-w-md">
          <div className="text-8xl mb-6">☁️</div>
          <h2 className="text-white text-3xl font-bold mb-4">Mulai Gratis</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Daftar sekarang dan dapatkan 15 GB storage gratis selamanya.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[['🆓', '15 GB Gratis', 'Selamanya'], ['⚡', 'Upload Cepat', 'CDN Global'], ['🔒', 'Enkripsi', 'Enterprise'], ['📱', 'App Mobile', 'iOS & Android']].map(([icon, title, sub]) => (
              <div key={title} className="bg-white/10 rounded-2xl p-3 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-white text-xs font-bold">{title}</p>
                <p className="text-blue-100 text-[10px]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#EEF2FF]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-8 justify-center">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              ☁️
            </div>
            <span className="text-[#0F172A]">Cloud<span className="text-blue-500">tify</span></span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s <= step ? 'text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`} style={s <= step ? { background: 'linear-gradient(135deg, #2563EB, #06B6D4)' } : undefined}>
                  {s < step ? '✓' : s}
                </div>
                <span className={`text-xs font-medium ${s <= step ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{s === 1 ? 'Info Akun' : 'Password'}</span>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > s ? '' : 'bg-[#E2E8F0]'}`} style={step > s ? { background: 'linear-gradient(90deg, #2563EB, #06B6D4)' } : undefined} />}
              </div>
            ))}
          </div>

          <div className="card p-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
              {step === 1 ? 'Buat Akun Baru' : 'Buat Password'}
            </h1>
            <p className="text-[#64748B] text-sm mb-6">
              {step === 1 ? 'Daftar gratis, 15 GB storage langsung aktif' : 'Buat password yang kuat untuk amankan akun'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-[#374151] text-sm font-semibold mb-2">Nama Lengkap</label>
                    <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nama kamu" className="w-full bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-[#374151] text-sm font-semibold mb-2">Email</label>
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="nama@email.com" className="w-full bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-[#374151] text-sm font-semibold mb-2">Kode Referral <span className="text-[#94A3B8] font-normal">(opsional)</span></label>
                    <input type="text" value={form.referral} onChange={(e) => set('referral', e.target.value)} placeholder="Masukkan kode referral" className="w-full bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-[#374151] text-sm font-semibold mb-2">Password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min. 8 karakter + huruf besar + angka" className="w-full bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" required />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-lg">{showPass ? '🙈' : '👁️'}</button>
                    </div>
                    {form.password && (
                      <div className="mt-2 flex gap-1">
                        {[8, 12, 16].map((len, i) => (
                          <div key={len} className={`flex-1 h-1.5 rounded-full ${form.password.length >= len ? '' : 'bg-[#E2E8F0]'}`} style={form.password.length >= len ? { background: i === 0 ? '#FB923C' : i === 1 ? '#FBBF24' : '#22C55E' } : undefined} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#374151] text-sm font-semibold mb-2">Konfirmasi Password</label>
                    <input type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Ulangi password" className="w-full bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" required />
                    {form.confirm && form.password !== form.confirm && (
                      <p className="text-red-500 text-xs mt-1">Password tidak cocok</p>
                    )}
                  </div>
                  <div className="bg-[#F8FAFF] rounded-2xl p-3 text-xs text-[#64748B]">
                    Dengan mendaftar, kamu menyetujui <Link href="/terms" className="text-blue-500 hover:underline">Syarat & Ketentuan</Link> dan <Link href="/privacy" className="text-blue-500 hover:underline">Kebijakan Privasi</Link> Cloudtify.
                  </div>
                </>
              )}

              <button type="submit" disabled={loading || (step === 2 && form.password !== form.confirm && form.confirm !== '')} className="w-full text-white font-bold py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] disabled:opacity-70" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                {loading ? '⏳ Membuat akun...' : step === 1 ? 'Lanjut →' : 'Buat Akun Gratis 🎉'}
              </button>
            </form>

            <p className="text-center text-[#64748B] text-sm mt-6">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-blue-500 font-bold hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
