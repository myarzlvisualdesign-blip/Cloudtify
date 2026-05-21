import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { formatBytes, formatFileDate, getFileCategory, getFileCategoryIcon, getFileCategoryColor, truncateFileName } from '@cloudtify/utils'
import { getThumbnailUrl } from '../../services/storage/r2'
import type { CloudFile } from '@cloudtify/types'

interface Props {
  file: CloudFile
  onPress: () => void
  onLongPress?: () => void
  onToggleSelect?: () => void
  isSelected?: boolean
  showMenu?: boolean
  onMenu?: () => void
}

export function FileCard({ file, onPress, onLongPress, isSelected, onMenu }: Props) {
  const category = getFileCategory(file.mime_type, file.name)
  const icon = getFileCategoryIcon(category)
  const color = getFileCategoryColor(category)
  const thumbnailUrl = getThumbnailUrl(file.thumbnail_key)

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      className={`flex-row items-center py-3 px-1 border-b border-dark-800 ${isSelected ? 'bg-primary-600/10' : ''}`}
    >
      {/* Thumbnail / Icon */}
      <View className="w-12 h-12 rounded-xl overflow-hidden mr-3 items-center justify-center bg-dark-800">
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            className="w-full h-full"
            contentFit="cover"
          />
        ) : (
          <Text style={{ color }} className="text-2xl">
            {icon === 'image' ? '🖼️' :
             icon === 'film' ? '🎬' :
             icon === 'music' ? '🎵' :
             icon === 'file-text' ? '📄' :
             icon === 'archive' ? '📦' : '📎'}
          </Text>
        )}
      </View>

      {/* Info */}
      <View className="flex-1 min-w-0">
        <Text className="text-white font-medium text-sm" numberOfLines={1}>
          {truncateFileName(file.name, 40)}
        </Text>
        <View className="flex-row items-center gap-2 mt-0.5">
          <Text className="text-white/40 text-xs">{formatBytes(file.size_bytes)}</Text>
          <Text className="text-white/20 text-xs">·</Text>
          <Text className="text-white/40 text-xs">{formatFileDate(file.created_at)}</Text>
          {file.is_favorite && <Text className="text-xs">⭐</Text>}
        </View>
      </View>

      {/* Select indicator / Menu */}
      {isSelected ? (
        <View className="w-6 h-6 bg-primary-500 rounded-full items-center justify-center">
          <Text className="text-white text-xs">✓</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onMenu} className="w-8 h-8 items-center justify-center">
          <Text className="text-white/40 text-lg">⋯</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}
