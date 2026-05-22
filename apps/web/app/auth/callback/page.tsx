'use client'
import { useEffect, useState } from 'react'
import { Logo } from '../../../components/brand/Logo'
import { supabase } from '../../../lib/supabase/client'

export default function AuthCallback() {
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Provider returned an explicit error (e.g. user cancelled / access denied).
    const providerErr = params.get('error_description') || params.get('error')
    if (providerErr && !params.get('code')) {
      setError(decodeURIComponent(providerErr))
      const t = setTimeout(() => window.location.replace('/auth/login/'), 2600)
      return () => clearTimeout(t)
    }

    let done = false
    const finish = () => {
      if (done) return
      done = true
      window.location.replace('/dashboard/')
    }

    // The client (detectSessionInUrl + PKCE) exchanges the ?code= automatically.
    // We only WAIT for the resulting session — no manual exchange (avoids the
    // double-exchange that consumes the code verifier).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) finish()
    })

    let tries = 0
    const iv = setInterval(async () => {
      tries++
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        clearInterval(iv)
        finish()
      } else if (tries > 16) {
        // ~8s elapsed and still nothing — surface a friendly error.
        clearInterval(iv)
        if (!done) {
          setError('Gagal menyelesaikan login Google. Silakan coba lagi.')
          setTimeout(() => window.location.replace('/auth/login/'), 2600)
        }
      }
    }, 500)

    return () => {
      sub.subscription.unsubscribe()
      clearInterval(iv)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo size={40} />
      {error ? (
        <p className="text-red-600 text-sm font-medium max-w-sm">{error}</p>
      ) : (
        <div className="flex items-center gap-3 text-[#6B6560] text-sm">
          <svg className="animate-spin text-[#1A56DB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
          Menyiapkan akun kamu…
        </div>
      )}
    </div>
  )
}
