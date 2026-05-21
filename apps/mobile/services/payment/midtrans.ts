import { supabase } from '../supabase/client'
import { parseSupabaseError } from '@cloudtify/utils'
import type { MidtransTokenResponse } from '@cloudtify/types'

export const midtransService = {
  async createTransaction(
    planId: string,
    billingCycle: 'monthly' | 'yearly',
    couponCode?: string
  ): Promise<MidtransTokenResponse> {
    const { data, error } = await supabase.functions.invoke<MidtransTokenResponse>(
      'payment-create',
      {
        body: {
          plan_id: planId,
          billing_cycle: billingCycle,
          coupon_code: couponCode,
          payment_method: 'midtrans',
        },
      }
    )
    if (error) throw parseSupabaseError(error)
    return data!
  },

  async verifyPayment(orderId: string): Promise<{ status: string; subscription_active: boolean }> {
    const { data, error } = await supabase.functions.invoke<{
      status: string
      subscription_active: boolean
    }>('payment-verify', { body: { order_id: orderId } })
    if (error) throw parseSupabaseError(error)
    return data!
  },

  async getPaymentHistory(): Promise<unknown[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*, plans(display_name)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) throw parseSupabaseError(error)
    return data ?? []
  },
}
