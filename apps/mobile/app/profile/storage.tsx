import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../services/supabase/client'
import { useAuthStore, useStorageGB } from '../../state/auth.store'
import { formatBytes, formatStoragePercent, getStorageStatusColor, getStorageStatus } from '@cloudtify/utils'
import { StorageBar } from '../../components/storage/StorageBar'
import type { StorageUsage } from '@cloudtify/types'
import Svg, { Polyline } from 'react-native-svg'

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="15 18 9 12 15 6" stroke="#94A3B8" strokeWidth={2} />
    </Svg>
  )
}

const CATEGORY_COLORS = {
  image_bytes:    '#3B82F6',
  video_bytes:    '#A855F7',
  audio_bytes:    '#F59E0B',
  document_bytes: '#10B981',
  other_bytes:    '#6B7280',
}

const CATEGORY_LABELS: Record<string, string> = {
  image_bytes:    'Foto & Gambar',
  video_bytes:    'Video',
  audio_bytes:    'Audio & Musik',
  document_bytes: 'Dokumen',
  other_bytes:    'Lainnya',
}

export default function StorageDetailScreen() {
  const user = useAuthStore((s) => s.user)
  const totalGB = useStorageGB()

  const { data: storage, isLoading } = useQuery({
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

  const usedBytes = storage?.used_bytes ?? 0
  const pct = formatStoragePercent(usedBytes, totalGB)
  const status = getStorageStatus(usedBytes, totalGB)
  const statusColor = getStorageStatusColor(status)

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
        <Text className="text-white text-xl font-bold">Storage Detail</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10">
          {/* Overview card */}
          <View className="bg-dark-800 rounded-2xl p-5 mt-2 mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white/50 text-xs mb-1">Terpakai</Text>
                <Text className="text-white text-3xl font-bold">
                  {formatBytes(usedBytes)}
                </Text>
                <Text className="text-white/50 text-sm">dari {totalGB} GB</Text>
              </View>
              <View
                className="w-20 h-20 rounded-full border-4 items-center justify-center"
                style={{ borderColor: statusColor }}
              >
                <Text className="text-white font-bold text-lg">{pct}%</Text>
              </View>
            </View>

            <StorageBar usedBytes={usedBytes} totalGB={totalGB} height={10} />

            {pct >= 80 && (
              <View className="mt-4 flex-row items-center gap-2 bg-amber-500/10 rounded-xl px-3 py-2.5">
                <Text className="text-amber-400 text-sm">⚠️</Text>
                <Text className="text-amber-200 text-xs flex-1">
                  Storage hampir penuh. Upgrade paket untuk ruang lebih.
                </Text>
              </View>
            )}
          </View>

          {/* Category breakdown */}
          <Text className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
            Rincian per Kategori
          </Text>

          <View className="bg-dark-800 rounded-2xl overflow-hidden mb-5">
            {Object.entries(CATEGORY_COLORS).map(([key, color], i) => {
              const bytes = (storage as Record<string, number> | undefined)?.[key] ?? 0
              const catPct = usedBytes > 0 ? Math.round((bytes / usedBytes) * 100) : 0
              const isLast = i === Object.keys(CATEGORY_COLORS).length - 1

              return (
                <View
                  key={key}
                  className={`flex-row items-center px-5 py-4 ${!isLast ? 'border-b border-dark-700' : ''}`}
                >
                  <View
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: color }}
                  />
                  <Text className="flex-1 text-white/80 text-sm">
                    {CATEGORY_LABELS[key]}
                  </Text>
                  <Text className="text-white/40 text-xs mr-3">{catPct}%</Text>
                  <Text className="text-white text-sm font-medium">{formatBytes(bytes)}</Text>
                </View>
              )
            })}
          </View>

          {/* Stats */}
          <Text className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
            Statistik
          </Text>
          <View className="bg-dark-800 rounded-2xl overflow-hidden">
            {[
              { label: 'Total File', value: String(storage?.file_count ?? 0) },
              { label: 'Total Folder', value: String(storage?.folder_count ?? 0) },
              { label: 'Di Sampah', value: formatBytes(storage?.trash_bytes ?? 0) },
            ].map((row, i) => (
              <View
                key={row.label}
                className={`flex-row items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-dark-700' : ''}`}
              >
                <Text className="text-white/60 text-sm">{row.label}</Text>
                <Text className="text-white font-medium text-sm">{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Upgrade CTA if near limit */}
          {pct >= 70 && (
            <TouchableOpacity
              onPress={() => router.push('/subscription/upgrade')}
              className="mt-5 bg-primary-600 rounded-2xl p-5 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-white font-bold text-base">Butuh lebih banyak ruang?</Text>
                <Text className="text-white/70 text-xs mt-0.5">Upgrade mulai Rp15.000/bulan</Text>
              </View>
              <Text className="text-white text-lg">→</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
