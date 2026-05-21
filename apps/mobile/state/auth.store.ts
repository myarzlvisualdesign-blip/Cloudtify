import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile, UserActiveSubscription } from '@cloudtify/types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  subscription: UserActiveSubscription | null
  isLoading: boolean
  isInitialized: boolean

  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setSubscription: (sub: UserActiveSubscription | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  subscription: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setSubscription: (subscription) => set({ subscription }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  reset: () => set({
    user: null,
    session: null,
    profile: null,
    subscription: null,
    isLoading: false,
  }),
}))

// Selectors
export const useIsAuthenticated = () => useAuthStore((s) => !!s.user)
export const useCurrentPlan = () => useAuthStore((s) => s.subscription?.plan_name ?? 'free')
export const useStorageGB = () => useAuthStore((s) => s.subscription?.total_storage_gb ?? 15)
export const useIsPremium = () => useAuthStore((s) =>
  s.subscription ? s.subscription.plan_name !== 'free' : false
)
