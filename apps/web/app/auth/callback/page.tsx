'use client'
import { useEffect, useState } from 'react'
import { Logo } from '../../../components/brand/Logo'
import { supabase } from '../../../lib/supabase/client'

export default function AuthCallback() {
  const [error, setError] = useState('')

  useEffect(() => {
    async function finish() {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        // PKCE: exchange the ?code= for a session.
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
          if (error) throw error
        }
        // Confirm we actually have a session (also covers hash-based tokens).
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          window.location.replace('/dashboard/')
        } else {
          // Give detectSessionInUrl a beat, then re-check.
          setTimeout(async () => {
            const { data: d2 } = await supabase.auth.getSession()
            window.location.replace(d2.session ? '/dashboard/' : '/auth/login/')
          }, 800)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal masuk. Coba lagi.')
        setTimeout(() => window.location.replace('/auth/login/'), 2200)
      }
    }
    finish()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-6 px-6">
      <Logo size={40} />
      {error ? (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      ) : (
        <div className="flex items-center gap-3 text-[#6B6560] text-sm">
          <svg className="animate-spin text-[#1A56DB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
          Menyiapkan akun kamu…
        </div>
      )}
    </div>
  )
}
