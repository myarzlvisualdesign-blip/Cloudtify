'use client'
import { useState } from 'react'
import Link from 'next/link'

/* ── SVG icons ─────────────────────────────────────────────────────── */
function IcoCloud() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  )
}
function IcoUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}
function IcoMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}
function IcoLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
function IcoGift() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  )
}
function IcoEye({ off }: { off?: boolean }) {
  return off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function IcoArrowR() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}
function IcoCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E"
      strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IcoCheckCircle() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#22C55E"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}
function IcoGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

/* ── Success screen ─────────────────────────────────────────────────── */
function SuccessScreen({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="bg-white border border-[#E5E2DD] rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] border border-emerald-100 flex items-center justify-center mx-auto mb-6">
          <IcoCheckCircle />
        </div>
        <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-3">
          Akun berhasil dibuat!
        </h1>
        <p className="text-[#6B6560] text-sm mb-1">
          Kamu mendapatkan <strong className="text-[#1A56DB]">15 GB storage gratis</strong> selamanya.
        </p>
        <p className="text-[#A8A29E] text-xs mb-8">
          Cek email <span className="font-medium">{email}</span> untuk verifikasi akun.
        </p>
        <Link href="/dashboard"
          className="flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm
            hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25 transition-all duration-200 mb-3"
          style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
          Buka Dashboard <IcoArrowR />
        </Link>
        <Link href="/auth/login" className="block text-[#A8A29E] text-xs hover:text-[#1A56DB] transition-colors">
          Atau masuk ke akun yang sudah ada
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', referral: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [step, setStep]         = useState(1)

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

  /* Password strength */
  const strength = form.password.length >= 16 ? 3 : form.password.length >= 10 ? 2 : form.password.length >= 6 ? 1 : 0
  const strengthLabel  = ['', 'Lemah', 'Cukup', 'Kuat'][strength]
  const strengthColor  = ['', '#EF4444', '#F59E0B', '#22C55E'][strength]

  if (step === 3) return <SuccessScreen email={form.email} />

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12"
        style={{ background: '#0B1C4D' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(26,86,219,0.35) 0%, rgba(11,28,77,0) 70%)' }}/>
        <div className="absolute inset-0 pointer-events-none opacity-[0.18]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, rgba(11,28,77,0) 1px)', backgroundSize: '28px 28px' }}/>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
            <IcoCloud />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">Cloudtify</span>
        </div>

        {/* Middle */}
        <div className="relative">
          <h2 className="font-display font-extrabold text-white text-3xl leading-tight tracking-tight mb-4">
            Mulai gratis.<br/>Tanpa kartu kredit.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs">
            Daftar sekarang dan dapatkan 15 GB storage gratis selamanya.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '15 GB Gratis',  sub: 'Selamanya' },
              { label: 'Upload Cepat',  sub: 'CDN Global' },
              { label: 'Enkripsi',      sub: 'AES-256' },
              { label: 'App Mobile',    sub: 'iOS & Android' },
            ].map(({ label, sub }) => (
              <div key={label} className="rounded-xl p-3.5 text-left"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-white text-sm font-semibold font-display">{label}</p>
                <p className="text-white/40 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white/70 text-sm leading-relaxed italic">
            &ldquo;Saya pakai paket Pro untuk backup foto klien. 500 GB sangat cukup, harganya jauh lebih terjangkau.&rdquo;
          </p>
          <p className="text-white/40 text-xs mt-3 font-medium">— Dewi R., Fotografer Freelance</p>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              <IcoCloud />
            </div>
            <span className="font-display font-bold text-[#141110] text-lg tracking-tight">Cloudtify</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  s < step ? 'bg-[#22C55E] text-white' :
                  s === step ? 'text-white' : 'bg-[#E5E2DD] text-[#A8A29E]'
                }`}
                  style={s === step ? { background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' } : undefined}>
                  {s < step ? <IcoCheck /> : s}
                </div>
                <span className={`text-xs font-medium ${s <= step ? 'text-[#141110]' : 'text-[#A8A29E]'}`}>
                  {s === 1 ? 'Info Akun' : 'Password'}
                </span>
                {s < 2 && (
                  <div className={`w-8 h-0.5 rounded-full transition-all ${step > s ? 'bg-[#1A56DB]' : 'bg-[#E5E2DD]'}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-1">
            {step === 1 ? 'Buat Akun Baru' : 'Buat Password'}
          </h1>
          <p className="text-[#A8A29E] text-sm mb-8">
            {step === 1 ? 'Daftar gratis, 15 GB storage langsung aktif' : 'Buat password yang kuat untuk keamanan akun'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-[#141110] text-sm font-semibold mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoUser /></span>
                    <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                      placeholder="Nama kamu"
                      className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#141110]
                        placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/60 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all"
                      required />
                  </div>
                </div>
                <div>
                  <label className="block text-[#141110] text-sm font-semibold mb-2">Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoMail /></span>
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#141110]
                        placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/60 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all"
                      required />
                  </div>
                </div>
                <div>
                  <label className="block text-[#141110] text-sm font-semibold mb-2">
                    Kode Referral <span className="text-[#A8A29E] font-normal">(opsional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoGift /></span>
                    <input type="text" value={form.referral} onChange={(e) => set('referral', e.target.value)}
                      placeholder="Masukkan kode referral"
                      className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#141110]
                        placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/60 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all" />
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-[#E5E2DD]" />
                  <span className="text-[#A8A29E] text-xs font-medium">atau daftar dengan</span>
                  <div className="flex-1 h-px bg-[#E5E2DD]" />
                </div>

                <button type="button"
                  className="w-full flex items-center justify-center gap-3 bg-white border border-[#E5E2DD]
                    text-[#141110] font-semibold py-3.5 rounded-xl text-sm
                    hover:border-[#C2BDB8] hover:shadow-sm transition-all duration-200">
                  <IcoGoogle />
                  Daftar dengan Google
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-[#141110] text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoLock /></span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      placeholder="Min. 8 karakter"
                      className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-11 pr-12 py-3.5 text-sm text-[#141110]
                        placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/60 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all"
                      required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#6B6560] transition-colors">
                      <IcoEye off={showPass} />
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3].map((level) => (
                          <div key={level} className="flex-1 h-1 rounded-full transition-all"
                            style={{ background: strength >= level ? strengthColor ?? '#E5E2DD' : '#E5E2DD' }} />
                        ))}
                      </div>
                      <p className="text-[10px] font-medium" style={{ color: strengthColor ?? '#A8A29E' }}>
                        {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[#141110] text-sm font-semibold mb-2">Konfirmasi Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IcoLock /></span>
                    <input
                      type="password"
                      value={form.confirm}
                      onChange={(e) => set('confirm', e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full bg-white border border-[#E5E2DD] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#141110]
                        placeholder-[#C2BDB8] focus:outline-none focus:border-[#1A56DB]/60 focus:ring-2 focus:ring-[#1A56DB]/10 transition-all"
                      required />
                  </div>
                  {form.confirm && form.password !== form.confirm && (
                    <p className="text-red-500 text-xs mt-1.5">Password tidak cocok</p>
                  )}
                </div>
                <div className="bg-[#F2F0ED] rounded-xl p-4 text-xs text-[#6B6560] leading-relaxed">
                  Dengan mendaftar, kamu menyetujui{' '}
                  <Link href="/terms" className="text-[#1A56DB] hover:opacity-75">Syarat & Ketentuan</Link>{' '}
                  dan{' '}
                  <Link href="/privacy" className="text-[#1A56DB] hover:opacity-75">Kebijakan Privasi</Link> Cloudtify.
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || (step === 2 && form.password !== form.confirm && form.confirm !== '')}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm mt-2
                transition-all duration-200 hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"/>
                  </svg>
                  Membuat akun...
                </span>
              ) : step === 1 ? (
                <>Lanjut <IcoArrowR /></>
              ) : (
                <>Buat Akun Gratis <IcoArrowR /></>
              )}
            </button>
          </form>

          <p className="text-center text-[#A8A29E] text-sm mt-7">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-[#1A56DB] font-semibold hover:opacity-75 transition-opacity">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
