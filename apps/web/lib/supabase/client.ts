import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client — anon key only
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true },
})

// Admin client pakai service role — hanya dipakai di Edge/server function
// Untuk static export, admin panel auth dilakukan via anon key + is_admin() check
export function createClient() {
  return supabase
}
