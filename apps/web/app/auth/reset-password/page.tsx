'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '../../../components/brand/Logo'
import { Field } from '../../../components/ui/Input'
import { Icon } from '../../../components/ui/icons'
import { supabase } from '../../../lib/supabase/client'
import { updatePassword } from '../../../lib/auth'

export default function ResetPasswordPage() {
  const [phase, setPhase] = useState<'checking' | 'ready' | 'invalid' | 'done'>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let resolved = false
    const ok = () => { resolved = true; setPhase('ready') }

    // The recovery link establishes a session (detectSessionInUrl exchanges the code).
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) ok()
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) ok()
    })
    const t = setTimeout(() => { if (!resolved) setPhase('invalid') }, 3500)

    return () => { sub.subscription.unsubscribe(); clearTimeout(t) }
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password minimal 8 karakter.')
    if (password !== confirm) return setError('Password tidak cocok.')
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) { setError(error.message); return }
    setPhase('done')
    setTimeout(() => window.location.replace('/dashboard/'), 1600)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8"><Logo size={34} /></div>

        {phase === 'checking' && (
          <div className="flex items-center gap-3 text-[#6B6560] text-sm">
            <svg className="animate-spin text-[#1A56DB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
            Memverifikasi link reset…
          </div>
        )}

        {phase === 'invalid' && (
          <div className="bg-white border border-[#E5E2DD] rounded-2xl p-8 text-center shadow-sm">
            <h1 className="font-display font-extrabold text-[#141110] text-xl tracking-tight mb-2">Link tidak valid</h1>
            <p className="text-[#6B6560] text-sm mb-6">Link reset password sudah kedaluwarsa atau dibuka di perangkat berbeda. Minta link baru ya.</p>
            <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>Minta link baru</Link>
          </div>
        )}

        {phase === 'done' && (
          <div className="bg-white border border-[#E5E2DD] rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-500">
              <Icon.check size={26} />
            </div>
            <h1 className="font-display font-extrabold text-[#141110] text-xl tracking-tight mb-2">Password berhasil diubah</h1>
            <p className="text-[#6B6560] text-sm">Mengalihkan ke dashboard…</p>
          </div>
        )}

        {phase === 'ready' && (
          <>
            <h1 className="font-display font-extrabold text-[#141110] text-2xl tracking-tight mb-1">Buat password baru</h1>
            <p className="text-[#A8A29E] text-sm mb-8">Masukkan password baru untuk akun kamu.</p>

            {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">{error}</div>}

            <form onSubmit={submit} className="space-y-4">
              <Field label="Password baru" type="password" icon={<Icon.lock size={16} />} placeholder="Min. 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Field label="Konfirmasi password" type="password" icon={<Icon.lock size={16} />} placeholder="Ulangi password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required error={confirm && password !== confirm ? 'Password tidak cocok' : undefined} />
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25 disabled:opacity-60 mt-2" style={{ background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' }}>
                {loading ? 'Menyimpan…' : <>Simpan password <Icon.arrowRight size={16} /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
