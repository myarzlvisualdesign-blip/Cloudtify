'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '../../../components/brand/Logo'
import { Field } from '../../../components/ui/Input'
import { Icon } from '../../../components/ui/icons'
import { signUp, signInWithGoogle } from '../../../lib/auth'

function SuccessScreen({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="bg-white border border-[#E5E2DD] rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] border border-emerald-100 flex items-center justify-center mx-auto mb-6 text-emerald-500">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        </div>
        <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-3">
          Akun Anda berhasil dibuat
        </h1>
        <p className="text-[#6B6560] text-sm mb-1">
          Anda menerima <strong className="text-[#1A56DB]">15 GB penyimpanan gratis</strong> selamanya.
        </p>
        <p className="text-[#A8A29E] text-xs mb-8">
          Masuk sebagai <span className="font-medium">{email}</span>.
        </p>
        <Link
          href="/dashboard/"
          className="flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25 transition-all duration-200 mb-3"
          style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}
        >
          Buka dasbor <Icon.arrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', referral: '' })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [fieldErr, setFieldErr] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({})

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (fieldErr[key as keyof typeof fieldErr]) setFieldErr((p) => ({ ...p, [key]: undefined }))
  }

  function validateStep1(): boolean {
    const next: typeof fieldErr = {}
    if (!form.name.trim()) next.name = 'Mohon isi nama lengkap Anda.'
    else if (form.name.trim().length < 2) next.name = 'Nama terlalu singkat.'
    if (!form.email.trim()) next.email = 'Mohon isi alamat email Anda.'
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Format email belum sesuai.'
    setFieldErr(next)
    return Object.keys(next).length === 0
  }

  function validateStep2(): boolean {
    const next: typeof fieldErr = {}
    if (!form.password) next.password = 'Mohon buat kata sandi.'
    else if (form.password.length < 8) next.password = 'Kata sandi minimal 8 karakter.'
    if (!form.confirm) next.confirm = 'Mohon ulangi kata sandi Anda.'
    else if (form.password !== form.confirm) next.confirm = 'Kata sandi tidak cocok.'
    setFieldErr(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (step === 1) {
      if (!validateStep1()) return
      setStep(2)
      return
    }
    if (!validateStep2()) return

    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.name)
    if (error) {
      setError(error.message.includes('already') ? 'Alamat email ini sudah terdaftar.' : error.message)
      setLoading(false)
      return
    }
    setLoading(false)
    setStep(3)
  }

  async function handleGoogle() {
    setError('')
    const { error } = await signInWithGoogle()
    if (error) setError('Pendaftaran melalui Google sedang tidak tersedia. Silakan coba metode lain.')
  }

  const strength = form.password.length >= 16 ? 3 : form.password.length >= 10 ? 2 : form.password.length >= 6 ? 1 : 0
  const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat'][strength]
  const strengthColor = ['#E5E2DD', '#EF4444', '#F59E0B', '#22C55E'][strength]

  if (step === 3) return <SuccessScreen email={form.email} />

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12" style={{ background: '#0B1C4D' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(26,86,219,0.35) 0%, rgba(11,28,77,0) 70%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, rgba(11,28,77,0) 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative"><Logo wordmark="light" size={34} /></div>
        <div className="relative">
          <h2 className="font-display font-extrabold text-white text-3xl leading-tight tracking-tight mb-4">
            Mulai gratis.<br />Tanpa kartu kredit.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs">
            Buat akun sekarang dan dapatkan 15 GB penyimpanan gratis selamanya.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '15 GB Gratis', sub: 'Selamanya' },
              { label: 'Unggahan cepat', sub: 'Jaringan global' },
              { label: 'Enkripsi', sub: 'AES-256' },
              { label: 'Aplikasi mobile', sub: 'iOS & Android' },
            ].map(({ label, sub }) => (
              <div key={label} className="rounded-xl p-3.5 text-left" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-white text-sm font-semibold font-display">{label}</p>
                <p className="text-white/40 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white/70 text-sm leading-relaxed italic">
            &ldquo;Saya berlangganan paket Pro untuk pencadangan foto klien. Kapasitas 500 GB sangat memadai, dan tagihan dalam Rupiah membuat anggaran lebih mudah dikelola.&rdquo;
          </p>
          <p className="text-white/40 text-xs mt-3 font-medium">— Dewi R., fotografer lepas</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10"><Logo size={34} /></div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${s < step ? 'bg-[#22C55E] text-white' : s === step ? 'text-white' : 'bg-[#E5E2DD] text-[#A8A29E]'}`}
                  style={s === step ? { background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' } : undefined}
                >
                  {s < step ? <Icon.check size={13} /> : s}
                </div>
                <span className={`text-xs font-medium ${s <= step ? 'text-[#141110]' : 'text-[#A8A29E]'}`}>
                  {s === 1 ? 'Informasi akun' : 'Kata sandi'}
                </span>
                {s < 2 && <div className={`w-8 h-0.5 rounded-full transition-all ${step > s ? 'bg-[#1A56DB]' : 'bg-[#E5E2DD]'}`} />}
              </div>
            ))}
          </div>

          <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-1">
            {step === 1 ? 'Buat akun baru' : 'Atur kata sandi'}
          </h1>
          <p className="text-[#A8A29E] text-sm mb-8">
            {step === 1 ? 'Pendaftaran gratis dengan 15 GB penyimpanan yang langsung aktif.' : 'Pilih kata sandi yang kuat untuk melindungi akun Anda.'}
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {step === 1 && (
              <>
                <Field label="Nama lengkap" icon={<Icon.user size={16} />} placeholder="Nama Anda" value={form.name} onChange={(e) => set('name', e.target.value)} error={fieldErr.name} autoComplete="name" />
                <Field label="Alamat email" type="email" icon={<Icon.mail size={16} />} placeholder="nama@perusahaan.com" value={form.email} onChange={(e) => set('email', e.target.value)} error={fieldErr.email} autoComplete="email" />
                <Field label="Kode referral (opsional)" icon={<Icon.share size={16} />} placeholder="Masukkan kode referral" value={form.referral} onChange={(e) => set('referral', e.target.value)} />

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-[#E5E2DD]" />
                  <span className="text-[#A8A29E] text-xs font-medium">atau lanjutkan dengan</span>
                  <div className="flex-1 h-px bg-[#E5E2DD]" />
                </div>
                <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 bg-white border border-[#E5E2DD] text-[#141110] font-semibold py-3.5 rounded-xl text-sm hover:border-[#C2BDB8] hover:shadow-sm transition-all duration-200">
                  <Icon.google size={18} />
                  Lanjutkan dengan Google
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Field label="Kata sandi" type="password" icon={<Icon.lock size={16} />} placeholder="Minimal 8 karakter" value={form.password} onChange={(e) => set('password', e.target.value)} error={fieldErr.password} autoComplete="new-password" />
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((level) => (
                          <div key={level} className="flex-1 h-1 rounded-full transition-all" style={{ background: strength >= level ? strengthColor : '#E5E2DD' }} />
                        ))}
                      </div>
                      <p className="text-[10px] font-medium" style={{ color: strengthColor }}>Kekuatan: {strengthLabel}</p>
                    </div>
                  )}
                </div>
                <Field label="Konfirmasi kata sandi" type="password" icon={<Icon.lock size={16} />} placeholder="Ulangi kata sandi" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} error={fieldErr.confirm} autoComplete="new-password" />
                <div className="bg-[#F2F0ED] rounded-xl p-4 text-xs text-[#6B6560] leading-relaxed">
                  Dengan membuat akun, Anda menyetujui{' '}
                  <Link href="/terms" className="text-[#1A56DB] hover:opacity-75">Syarat Layanan</Link>{' '}dan{' '}
                  <Link href="/privacy" className="text-[#1A56DB] hover:opacity-75">Kebijakan Privasi</Link> Cloudtify.
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm mt-2 transition-all duration-200 hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25 disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                  Memproses…
                </>
              ) : step === 1 ? (
                <>Lanjutkan <Icon.arrowRight size={16} /></>
              ) : (
                <>Buat akun gratis <Icon.arrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-[#A8A29E] text-sm mt-7">
            Sudah memiliki akun?{' '}
            <Link href="/auth/login" className="text-[#1A56DB] font-semibold hover:opacity-75">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
