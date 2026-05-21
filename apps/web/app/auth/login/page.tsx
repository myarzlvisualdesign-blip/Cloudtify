'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel (desktop only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 60%, #06B6D4 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 -translate-y-1/4 translate-x-1/4 bg-white" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 translate-y-1/4 -translate-x-1/4 bg-white" />
        <div className="relative text-center px-12 max-w-md">
          <div className="text-8xl mb-6">☁️</div>
          <h2 className="text-white text-3xl font-bold mb-4">Cloudtify</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Cloud storage premium untuk Indonesia. 15 GB gratis selamanya.
          </p>
          <div className="mt-10 space-y-3">
            {['✓ Upload super cepat via Cloudflare CDN', '✓ Bayar pakai GoPay, DANA, OVO, QRIS', '✓ Aman & terenkripsi end-to-end'].map((item) => (
              <p key={item} className="text-blue-100 text-sm">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#EEF2FF]">
        <div className="w-full max-w-md">
          {/* Logo (mobile only) */}
          <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-8 justify-center">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              ☁️
            </div>
            <span className="text-[#0F172A]">Cloud<span className="text-blue-500">tify</span></span>
          </div>

          <div className="card p-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Selamat datang!</h1>
            <p className="text-[#64748B] text-sm mb-8">Masuk ke akun Cloudtify kamu</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#374151] text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-sm text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[#374151] text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 pr-12 text-sm text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] text-lg">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/auth/forgot-password" className="text-blue-500 text-xs font-medium hover:underline">Lupa password?</Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}
              >
                {loading ? '⏳ Masuk...' : 'Masuk →'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-[#94A3B8] text-xs">atau</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <button className="w-full flex items-center justify-center gap-3 bg-[#F8FAFF] border border-[#E2E8F0] text-[#374151] font-semibold py-3.5 rounded-2xl text-sm hover:bg-white hover:shadow-sm transition-all">
              <span className="text-xl">🔵</span>
              Masuk dengan Google
            </button>

            <p className="text-center text-[#64748B] text-sm mt-6">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-blue-500 font-bold hover:underline">Daftar gratis</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
