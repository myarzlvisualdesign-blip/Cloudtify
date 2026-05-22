'use client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase/client'

export interface Profile {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  referral_code: string | null
  created_at: string
}

const appUrl =
  (typeof window !== 'undefined' && window.location.origin) ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://cloudtify-web.pages.dev'

/* ── Auth actions ─────────────────────────────────────────────────── */

export async function signUp(email: string, password: string, fullName: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${appUrl}/dashboard/`,
    },
  })
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${appUrl}/auth/callback/` },
  })
}

export async function signOut() {
  await supabase.auth.signOut()
  if (typeof window !== 'undefined') window.location.href = '/auth/login/'
}

/* ── React hook: current user + profile ───────────────────────────── */

export function useUser({ redirectTo }: { redirectTo?: string } = {}) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load(u: User | null) {
      if (!active) return
      setUser(u)
      if (u) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, referral_code, created_at')
          .eq('id', u.id)
          .maybeSingle()
        if (active) setProfile(data as Profile | null)
      } else {
        setProfile(null)
        if (redirectTo && typeof window !== 'undefined') {
          window.location.href = redirectTo
        }
      }
      if (active) setLoading(false)
    }

    supabase.auth.getUser().then(({ data }) => load(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => load(session?.user ?? null))

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [redirectTo])

  return { user, profile, loading }
}

/** Best-effort display name from profile or auth metadata. */
export function displayName(user: User | null, profile: Profile | null): string {
  return (
    profile?.full_name ||
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email?.split('@')[0] ||
    'Pengguna'
  )
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
