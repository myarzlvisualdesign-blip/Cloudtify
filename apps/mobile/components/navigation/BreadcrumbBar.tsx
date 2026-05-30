import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { folderService } from '../../services/supabase/files'
import { useAuthStore } from '../../state/auth.store'

interface Props {
  folderId: string
  className?: string
}

export function BreadcrumbBar({ folderId, className = '' }: Props) {
  const user = useAuthStore((s) => s.user)

  const { data: crumbs = [], isLoading } = useQuery({
    queryKey: ['breadcrumbs', folderId],
    queryFn: () => folderService.getBreadcrumbs(folderId, user!.id),
    enabled: !!user && !!folderId,
  })

  if (isLoading) {
    return (
      <View className={`flex-row items-center ${className}`}>
        <ActivityIndicator size="small" color="#475569" />
      </View>
    )
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerClassName="flex-row items-center gap-1"
    >
      <TouchableOpacity onPress={() => router.push('/(tabs)/files')}>
        <Text className="text-white/40 text-xs">File saya</Text>
      </TouchableOpacity>

      {crumbs.map((crumb, i) => (
        <View key={crumb.id} className="flex-row items-center gap-1">
          <Text className="text-white/25 text-xs">›</Text>
          {i === crumbs.length - 1 ? (
            <Text className="text-white/70 text-xs font-medium" numberOfLines={1}>
              {crumb.name}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: '/(tabs)/files', params: { folder_id: crumb.id } })
              }
            >
              <Text className="text-white/40 text-xs" numberOfLines={1}>{crumb.name}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  )
}
