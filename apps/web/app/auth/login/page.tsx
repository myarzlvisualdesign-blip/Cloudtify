'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '../../../components/brand/Logo'
import { Field } from '../../../components/ui/Input'
import { Icon } from '../../../components/ui/icons'
import { signIn, signInWithGoogle } from '../../../lib/auth'

const PERKS = [
  'Upload super cepat via Cloudflare CDN',
  'Bayar pakai GoPay, DANA, OVO, QRIS',
  'Aman & terenkripsi end-to-end',
  'Server Asia Tenggara — latensi rendah',
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(
        error.message.includes('Invalid login')
          ? 'Email atau password salah.'
          : error.message,
      )
      setLoading(false)
      return
    }
    window.location.href = '/dashboard/'
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError('Login Google belum aktif. Hubungi admin.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12"
        style={{ background: '#0B1C4D' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(26,86,219,0.35) 0%, rgba(11,28,77,0) 70%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.18]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, rgba(11,28,77,0) 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative">
          <Logo wordmark="light" size={34} />
        </div>
        <div className="relative">
          <h2 className="font-display font-extrabold text-white text-3xl leading-tight tracking-tight mb-4">
            Cloud storage Indonesia<br />yang sesungguhnya.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs">
            15 GB gratis selamanya, enkripsi penuh, bayar pakai GoPay atau QRIS.
          </p>
          <div className="space-y-3">
            {PERKS.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-white/65 text-sm">
                <span className="text-[#5BB8FF]"><Icon.check size={15} /></span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div
          className="relative border border-white/[0.08] rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <p className="text-white/70 text-sm leading-relaxed italic">
            &ldquo;Akhirnya cloud storage yang bisa bayar pakai GoPay. Antarmukanya bersih, upload cepat.&rdquo;
          </p>
          <p className="text-white/40 text-xs mt-3 font-medium">— Budi S., Pengguna Pro</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Logo size={34} />
          </div>

          <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-1">
            Selamat datang kembali
          </h1>
          <p className="text-[#A8A29E] text-sm mb-8">Masuk ke akun Cloudtify kamu</p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Email"
              type="email"
              icon={<Icon.user size={16} />}
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Field
              label="Password"
              type="password"
              icon={<Icon.lock size={16} />}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              hint={
                <Link href="/auth/forgot-password" className="text-[#1A56DB] text-xs font-medium hover:opacity-75">
                  Lupa password?
                </Link>
              }
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25 disabled:opacity-60 disabled:hover:translate-y-0 mt-2"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                  Masuk...
                </>
              ) : (
                <>Masuk <Icon.arrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E5E2DD]" />
            <span className="text-[#A8A29E] text-xs font-medium">atau</span>
            <div className="flex-1 h-px bg-[#E5E2DD]" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#E5E2DD] text-[#141110] font-semibold py-3.5 rounded-xl text-sm hover:border-[#C2BDB8] hover:shadow-sm transition-all duration-200 disabled:opacity-60"
          >
            <Icon.google size={18} />
            {googleLoading ? 'Mengalihkan…' : 'Masuk dengan Google'}
          </button>

          <p className="text-center text-[#A8A29E] text-sm mt-7">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-[#1A56DB] font-semibold hover:opacity-75">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
