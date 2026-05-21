import { View, Text, TouchableOpacity } from 'react-native'
import { formatFileDate } from '@cloudtify/utils'
import type { Folder } from '@cloudtify/types'

interface Props {
  folder: Folder
  onPress: () => void
  onLongPress?: () => void
  isSelected?: boolean
}

export function FolderCard({ folder, onPress, onLongPress, isSelected }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      className={`flex-row items-center py-3 px-1 border-b border-dark-800 ${isSelected ? 'bg-primary-600/10' : ''}`}
    >
      <View
        className="w-12 h-12 rounded-xl mr-3 items-center justify-center"
        style={{ backgroundColor: folder.color ?? '#1E3A8A' }}
      >
        <Text className="text-2xl">{folder.icon ?? '📁'}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-medium text-sm" numberOfLines={1}>{folder.name}</Text>
        <Text className="text-white/40 text-xs mt-0.5">{formatFileDate(folder.created_at)}</Text>
      </View>
      <Text className="text-white/30">›</Text>
    </TouchableOpacity>
  )
}
