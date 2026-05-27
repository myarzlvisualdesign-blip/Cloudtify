'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '../../../components/brand/Logo'
import { Field } from '../../../components/ui/Input'
import { Icon } from '../../../components/ui/icons'
import { resetPassword } from '../../../lib/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [fieldErr, setFieldErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setFieldErr('Mohon isi alamat email Anda.')
    if (!EMAIL_RE.test(email.trim())) return setFieldErr('Format email belum sesuai.')
    setFieldErr('')
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8"><Logo size={34} /></div>

        {sent ? (
          <div className="bg-white border border-[#E5E2DD] rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-500">
              <Icon.mail size={26} />
            </div>
            <h1 className="font-display font-extrabold text-[#141110] text-xl tracking-tight mb-2">Periksa kotak masuk Anda</h1>
            <p className="text-[#6B6560] text-sm mb-1">Kami telah mengirim tautan pemulihan ke</p>
            <p className="text-[#141110] text-sm font-semibold mb-6">{email}</p>
            <p className="text-[#A8A29E] text-xs mb-6">Tidak melihat surel? Periksa folder spam, atau kirim ulang setelah satu menit.</p>
            <Link href="/auth/login" className="text-[#1A56DB] text-sm font-semibold hover:opacity-75">← Kembali ke halaman masuk</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-1">Lupa kata sandi?</h1>
            <p className="text-[#A8A29E] text-sm mb-8">Masukkan alamat email Anda, kami akan mengirimkan tautan untuk memperbarui kata sandi.</p>

            {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">{error}</div>}

            <form onSubmit={submit} noValidate className="space-y-4">
              <Field
                label="Alamat email"
                type="email"
                icon={<Icon.mail size={16} />}
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (fieldErr) setFieldErr('') }}
                error={fieldErr}
                autoComplete="email"
              />
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25 disabled:opacity-60 disabled:hover:translate-y-0 mt-2" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                {loading ? (
                  <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg> Mengirim…</>
                ) : (
                  <>Kirim tautan pemulihan <Icon.arrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-[#A8A29E] text-sm mt-7">
              Sudah ingat kata sandi Anda?{' '}
              <Link href="/auth/login" className="text-[#1A56DB] font-semibold hover:opacity-75">Masuk</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
