import { useState } from 'react'
import {
  ScrollView, View, Text, TouchableOpacity, Linking,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { supabase } from '../../services/supabase/client'
import { midtransService } from '../../services/payment/midtrans'
import { analyticsService } from '../../services/analytics'
import { formatIDR, formatPlanYearlySaving } from '@cloudtify/utils'
import { useAuthStore } from '../../state/auth.store'
import { LoadingButton } from '../../components/ui/LoadingButton'
import { toast } from '../../lib/toast'
import type { Plan } from '@cloudtify/types'

type BillingCycle = 'monthly' | 'yearly'

const PLAN_COLORS: Record<string, [string, string]> = {
  free:  ['#1E293B', '#334155'],
  plus:  ['#1E3A8A', '#2563EB'],
  pro:   ['#4C1D95', '#7C3AED'],
  ultra: ['#064E3B', '#059669'],
}

const PLAN_FEATURES: Record<string, string[]> = {
  free:  ['15 GB storage', 'Upload max 50 MB', 'Ada iklan', 'Share link basic', 'Max 3 share links'],
  plus:  ['100 GB storage', 'Upload max 200 MB', 'Tanpa iklan', 'Link dengan password', 'Max 10 share links'],
  pro:   ['500 GB storage', 'Upload max 500 MB', 'Tanpa iklan', 'Link dengan tanggal kadaluarsa', 'Max 50 share links', 'Prioritas server'],
  ultra: ['2 TB storage', 'Upload max 2 GB', 'Tanpa iklan', 'Private Vault terenkripsi', 'Share links tak terbatas', 'Priority support', 'Speed terbaik'],
}

export default function UpgradeScreen() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const currentSubscription = useAuthStore((s) => s.subscription)

  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return data as Plan[]
    },
  })

  const handleCheckout = async () => {
    if (!selectedPlanId) { toast.error('Pilih paket terlebih dahulu'); return }
    setIsCheckingOut(true)
    try {
      analyticsService.track({
        event: 'subscription_started',
        properties: { plan: selectedPlanId, billing_cycle: billingCycle },
      })
      const result = await midtransService.createTransaction(selectedPlanId, billingCycle)
      await Linking.openURL(result.redirect_url)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout gagal')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-white/60 text-base">✕</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-white text-2xl font-bold">Upgrade Paket</Text>
          <Text className="text-white/50 text-sm">Pilih paket yang sesuai kebutuhanmu</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-36">
        {/* Billing toggle */}
        <View className="mx-5 my-4 bg-dark-800 rounded-xl p-1 flex-row">
          <TouchableOpacity
            onPress={() => setBillingCycle('monthly')}
            className={`flex-1 py-2.5 rounded-lg items-center ${billingCycle === 'monthly' ? 'bg-primary-600' : ''}`}
          >
            <Text className={`font-medium text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-white/50'}`}>
              Bulanan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBillingCycle('yearly')}
            className={`flex-1 py-2.5 rounded-lg items-center ${billingCycle === 'yearly' ? 'bg-primary-600' : ''}`}
          >
            <Text className={`font-medium text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-white/50'}`}>
              Tahunan 💰
            </Text>
          </TouchableOpacity>
        </View>

        {/* Plans */}
        <View className="px-5 gap-3">
          {plans.filter((p) => p.name !== 'free').map((plan) => {
            const isSelected = selectedPlanId === plan.id
            const isCurrent = currentSubscription?.plan_id === plan.id
            const price = billingCycle === 'monthly' ? plan.price_monthly_idr : Math.round(plan.price_yearly_idr / 12)
            const colors = PLAN_COLORS[plan.name] ?? ['#1E293B', '#334155']
            const features = PLAN_FEATURES[plan.name] ?? []

            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
                className={`rounded-2xl overflow-hidden border-2 ${isSelected ? 'border-primary-400' : 'border-transparent'}`}
              >
                <LinearGradient colors={colors as [string, string]} className="p-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <View>
                      <Text className="text-white/60 text-xs uppercase tracking-wider">{plan.display_name}</Text>
                      <View className="flex-row items-baseline gap-1">
                        <Text className="text-white text-3xl font-bold">{formatIDR(price)}</Text>
                        <Text className="text-white/50 text-sm">/bln</Text>
                      </View>
                      {billingCycle === 'yearly' && plan.price_monthly_idr > 0 && (
                        <Text className="text-green-300 text-xs mt-1">
                          {formatPlanYearlySaving(plan.price_monthly_idr, plan.price_yearly_idr)}
                        </Text>
                      )}
                    </View>
                    <View className="items-end">
                      <Text className="text-white text-2xl font-bold">{plan.storage_gb >= 1024 ? `${plan.storage_gb / 1024} TB` : `${plan.storage_gb} GB`}</Text>
                      <Text className="text-white/50 text-xs">storage</Text>
                    </View>
                  </View>

                  <View className="gap-1.5">
                    {features.map((feat, i) => (
                      <View key={i} className="flex-row items-center gap-2">
                        <Text className="text-green-400 text-xs">✓</Text>
                        <Text className="text-white/80 text-sm">{feat}</Text>
                      </View>
                    ))}
                  </View>

                  {isCurrent && (
                    <View className="mt-3 bg-white/20 rounded-lg px-3 py-1.5 self-start">
                      <Text className="text-white text-xs font-medium">Paket aktif</Text>
                    </View>
                  )}
                  {isSelected && !isCurrent && (
                    <View className="mt-3 bg-primary-500 rounded-lg px-3 py-1.5 self-start">
                      <Text className="text-white text-xs font-medium">✓ Dipilih</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Payment methods */}
        <View className="mx-5 mt-5 bg-dark-800 rounded-2xl p-4">
          <Text className="text-white/60 text-sm font-medium mb-3">Metode pembayaran</Text>
          <View className="flex-row flex-wrap gap-2">
            {['GoPay', 'DANA', 'OVO', 'ShopeePay', 'QRIS', 'Transfer Bank'].map((method) => (
              <View key={method} className="bg-dark-700 rounded-lg px-3 py-1.5">
                <Text className="text-white/70 text-xs">{method}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trust signals */}
        <View className="mx-5 mt-4 gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-green-400 text-sm">🔒</Text>
            <Text className="text-white/50 text-xs">Pembayaran aman via Midtrans (terdaftar OJK)</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-green-400 text-sm">↩️</Text>
            <Text className="text-white/50 text-xs">Bisa batalkan kapan saja, tidak ada komitmen jangka panjang</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-dark-950 border-t border-dark-800">
        <LoadingButton
          onPress={handleCheckout}
          isLoading={isCheckingOut}
          label={selectedPlanId ? `Lanjut Bayar ${billingCycle === 'yearly' ? '(Tahunan)' : '(Bulanan)'}` : 'Pilih paket terlebih dahulu'}
          disabled={!selectedPlanId}
        />
      </View>
    </SafeAreaView>
  )
}
