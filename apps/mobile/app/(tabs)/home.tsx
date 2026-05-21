import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../state/auth.store'
import { supabase } from '../../services/supabase/client'
import { StorageBar } from '../../components/storage/StorageBar'
import { RecentFiles } from '../../components/file/RecentFiles'
import { QuickActions } from '../../components/ui/QuickActions'
import { PremiumBanner } from '../../components/subscription/PremiumBanner'
import { formatBytes } from '@cloudtify/utils'
import type { StorageUsage } from '@cloudtify/types'

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const subscription = useAuthStore((s) => s.subscription)

  const { data: storage, isLoading: storageLoading, refetch } = useQuery({
    queryKey: ['storage', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('storage_usage')
        .select('*')
        .eq('user_id', user!.id)
        .single()
      if (error) throw error
      return data as StorageUsage
    },
    enabled: !!user,
  })

  const totalGB = subscription?.total_storage_gb ?? 15
  const usedBytes = storage?.used_bytes ?? 0

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 17) return 'Selamat siang'
    return 'Selamat malam'
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-28"
        refreshControl={
          <RefreshControl refreshing={storageLoading} onRefresh={refetch} tintColor="#3B82F6" />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-white/50 text-sm">{greeting()},</Text>
            <Text className="text-white text-2xl font-bold" numberOfLines={1}>
              {profile?.full_name?.split(' ')[0] ?? 'Pengguna'} 👋
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile/notifications')}
            className="w-10 h-10 bg-dark-800 rounded-full items-center justify-center"
          >
            <Text className="text-lg">🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Storage Card */}
        <View className="mx-5 mt-4 bg-dark-800 rounded-2xl p-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-semibold text-base">Storage kamu</Text>
            <TouchableOpacity onPress={() => router.push('/profile/storage')}>
              <Text className="text-primary-400 text-sm">Detail →</Text>
            </TouchableOpacity>
          </View>

          <StorageBar usedBytes={usedBytes} totalGB={totalGB} />

          <View className="flex-row justify-between mt-3">
            <Text className="text-white/50 text-sm">
              {formatBytes(usedBytes)} dipakai
            </Text>
            <Text className="text-white/50 text-sm">
              {totalGB} GB total
            </Text>
          </View>

          <View className="flex-row gap-3 mt-3">
            <View className="flex-1">
              <Text className="text-white/40 text-xs">File</Text>
              <Text className="text-white font-medium">{storage?.file_count ?? 0}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white/40 text-xs">Folder</Text>
              <Text className="text-white font-medium">{storage?.folder_count ?? 0}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white/40 text-xs">Paket</Text>
              <Text className="text-white font-medium capitalize">
                {subscription?.plan_name ?? 'Free'}
              </Text>
            </View>
          </View>
        </View>

        {/* Premium upsell */}
        {subscription?.plan_name === 'free' && (
          <PremiumBanner className="mx-5 mt-4" />
        )}

        {/* Quick actions */}
        <QuickActions className="mx-5 mt-5" />

        {/* Recent files */}
        <View className="mt-6">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text className="text-white font-semibold text-lg">Terbaru</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/files')}>
              <Text className="text-primary-400 text-sm">Lihat semua</Text>
            </TouchableOpacity>
          </View>
          <RecentFiles userId={user?.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
