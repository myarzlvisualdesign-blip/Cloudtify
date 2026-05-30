import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../services/supabase/client'
import { useAuthStore } from '../../state/auth.store'
import { formatFileDate } from '@cloudtify/utils'
import type { Notification } from '@cloudtify/types'
import Svg, { Polyline } from 'react-native-svg'

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="15 18 9 12 15 6" stroke="#94A3B8" strokeWidth={2} />
    </Svg>
  )
}

const NOTIF_ICONS: Record<string, string> = {
  upload_complete: '✅',
  share_accessed:  '🔗',
  storage_warning: '⚠️',
  subscription:    '🌟',
  system:          'ℹ️',
}

export default function NotificationsScreen() {
  const user = useAuthStore((s) => s.user)

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data as Notification[]
    },
    enabled: !!user,
  })

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-dark-800 items-center justify-center"
        >
          <BackIcon />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Notifikasi</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          contentContainerClassName="pb-8"
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-4xl mb-4">🔔</Text>
              <Text className="text-white/50 text-sm">Belum ada notifikasi</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              className={`flex-row items-start px-5 py-4 border-b border-dark-800 ${
                !item.is_read ? 'bg-dark-800/30' : ''
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center mr-3 mt-0.5">
                <Text className="text-lg">{NOTIF_ICONS[item.type] ?? '🔔'}</Text>
              </View>
              <View className="flex-1">
                <Text className={`text-sm font-medium mb-0.5 ${!item.is_read ? 'text-white' : 'text-white/70'}`}>
                  {item.title}
                </Text>
                <Text className="text-white/40 text-xs leading-relaxed">{item.body}</Text>
                <Text className="text-white/25 text-xs mt-1">{formatFileDate(item.created_at)}</Text>
              </View>
              {!item.is_read && (
                <View className="w-2 h-2 rounded-full bg-primary-400 mt-2 ml-2" />
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}
