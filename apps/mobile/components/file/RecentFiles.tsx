import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../services/supabase/client'
import { formatBytes, getFileCategory, getFileCategoryIcon, getFileCategoryColor } from '@cloudtify/utils'
import { getThumbnailUrl } from '../../services/storage/r2'
import type { CloudFile } from '@cloudtify/types'

const ICON_MAP: Record<string, string> = {
  image: '🖼️', video: '🎬', audio: '🎵', document: '📄', archive: '📦', other: '📎',
}

interface Props {
  userId?: string
}

export function RecentFiles({ userId }: Props) {
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files', 'recent', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', userId!)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(5)
      if (error) throw error
      return data as CloudFile[]
    },
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <View className="px-5 py-4 items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    )
  }

  if (!files.length) {
    return (
      <View className="px-5 py-6 items-center">
        <Text className="text-4xl mb-2">📂</Text>
        <Text className="text-white/40 text-sm text-center">Belum ada file. Upload sekarang!</Text>
      </View>
    )
  }

  return (
    <View>
      {files.map((file) => {
        const category = getFileCategory(file.mime_type, file.name)
        const color = getFileCategoryColor(category)
        const icon = getFileCategoryIcon(category)
        const thumbnail = getThumbnailUrl(file.thumbnail_key)

        return (
          <TouchableOpacity
            key={file.id}
            onPress={() => router.push({ pathname: '/preview/[id]', params: { id: file.id } })}
            className="flex-row items-center px-5 py-3 active:bg-dark-800/50"
          >
            <View className="w-10 h-10 rounded-xl overflow-hidden mr-3 items-center justify-center bg-dark-800">
              {thumbnail ? (
                <Image source={{ uri: thumbnail }} className="w-full h-full" contentFit="cover" />
              ) : (
                <Text style={{ color }} className="text-xl">
                  {ICON_MAP[icon] ?? '📎'}
                </Text>
              )}
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-white text-sm font-medium" numberOfLines={1}>{file.name}</Text>
              <Text className="text-white/40 text-xs mt-0.5">{formatBytes(file.size_bytes)}</Text>
            </View>
            <Text className="text-white/30 text-lg">›</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
