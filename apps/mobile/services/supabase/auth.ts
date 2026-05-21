import { supabase } from './client'
import { parseSupabaseError } from '@cloudtify/utils'
import type { RegisterInput, LoginInput } from '@cloudtify/types'

export const authService = {
  async register({ full_name, email, password, referral_code }: RegisterInput) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, referral_code },
        emailRedirectTo: 'cloudtify://auth/verify',
      },
    })
    if (error) throw parseSupabaseError(error)
    return data
  },

  async login({ email, password }: LoginInput) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw parseSupabaseError(error)
    return data
  },

  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'cloudtify://auth/callback' },
    })
    if (error) throw parseSupabaseError(error)
    return data
  },

  async loginWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: 'cloudtify://auth/callback' },
    })
    if (error) throw parseSupabaseError(error)
    return data
  },

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'cloudtify://auth/reset-password',
    })
    if (error) throw parseSupabaseError(error)
  },

  async resetPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw parseSupabaseError(error)
  },

  async changePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw parseSupabaseError(error)
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw parseSupabaseError(error)
  },

  async logoutAllDevices() {
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    if (error) throw parseSupabaseError(error)
  },

  async deleteAccount() {
    // Call edge function to handle full account deletion
    const { error } = await supabase.functions.invoke('delete-account')
    if (error) throw parseSupabaseError(error)
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw parseSupabaseError(error)
    return data.session
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw parseSupabaseError(error)
    return data.user
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
