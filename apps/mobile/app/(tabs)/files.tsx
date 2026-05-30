import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../state/auth.store'
import { useFiles } from '../../hooks/useFiles'
import { useUpload } from '../../hooks/useUpload'
import { FileCard } from '../../components/file/FileCard'
import { FolderCard } from '../../components/file/FolderCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { BreadcrumbBar } from '../../components/navigation/BreadcrumbBar'
import { SortMenu } from '../../components/ui/SortMenu'
import { useQuery } from '@tanstack/react-query'
import { folderService } from '../../services/supabase/files'
import type { SortField, SortOrder } from '@cloudtify/types'

export default function FilesScreen() {
  const { folder_id } = useLocalSearchParams<{ folder_id?: string }>()
  const user = useAuthStore((s) => s.user)
  const [sortBy, setSortBy] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const isSelecting = selectedIds.size > 0

  const { pickDocuments, pickImages } = useUpload(folder_id ?? null)

  function IcoFolderPlus() {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="#94A3B8" strokeWidth={2} />
        <Path d="M12 11v6M9 14h6" stroke="#94A3B8" strokeWidth={2} />
      </Svg>
    )
}

  // Folders in current directory
  const { data: folders = [] } = useQuery({
    queryKey: ['folders', user?.id, folder_id ?? null],
    queryFn: () => folderService.list(user!.id, folder_id ?? null),
    enabled: !!user,
  })

  // Files in current directory
  const {
    data: filesPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useFiles({
    folder_id: folder_id ?? null,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const files = filesPages?.pages.flatMap((p) => p.files) ?? []

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleCreateFolder = () => router.push({ pathname: '/folders/create', params: { parent_id: folder_id } })

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-2xl font-bold">
            {folder_id ? 'Folder' : 'File saya'}
          </Text>
          <View className="flex-row gap-2">
            <SortMenu
              sortBy={sortBy}
              sortOrder={sortOrder}
              onChange={(by, order) => { setSortBy(by); setSortOrder(order) }}
            />
            <TouchableOpacity
              onPress={handleCreateFolder}
              className="w-9 h-9 bg-dark-800 rounded-xl items-center justify-center"
            >
              <IcoFolderPlus />
            </TouchableOpacity>
          </View>
        </View>

        {/* Breadcrumbs */}
        {folder_id && <BreadcrumbBar folderId={folder_id} className="mt-2" />}
      </View>

      {/* Bulk action bar */}
      {isSelecting && (
        <View className="mx-5 mb-3 bg-primary-600 rounded-xl px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white font-medium">{selectedIds.size} dipilih</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity>
              <Text className="text-white text-sm">Pindah</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-red-300 text-sm">Hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedIds(new Set())}>
              <Text className="text-white/70 text-sm">Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={[...folders.map((f) => ({ type: 'folder' as const, item: f })),
                 ...files.map((f) => ({ type: 'file' as const, item: f }))]}
          keyExtractor={(row) => row.item.id}
          contentContainerClassName="px-5 pb-28"
          numColumns={1}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#3B82F6" />
          }
          onEndReached={() => { if (hasNextPage) fetchNextPage() }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <EmptyState
              icon="📁"
              title="Belum ada file"
              subtitle="Upload file pertama kamu sekarang"
              action={{ label: 'Upload File', onPress: pickDocuments }}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#3B82F6" className="py-4" />
            ) : null
          }
          renderItem={({ item: row }) =>
            row.type === 'folder' ? (
              <FolderCard
                folder={row.item}
                onPress={() => router.push({ pathname: '/(tabs)/files', params: { folder_id: row.item.id } })}
                isSelected={selectedIds.has(row.item.id)}
                onLongPress={() => toggleSelect(row.item.id)}
              />
            ) : (
              <FileCard
                file={row.item}
                onPress={() => router.push({ pathname: '/preview/[id]', params: { id: row.item.id } })}
                isSelected={selectedIds.has(row.item.id)}
                onLongPress={() => toggleSelect(row.item.id)}
                onToggleSelect={() => toggleSelect(row.item.id)}
              />
            )
          }
        />
      )}

      {/* FAB upload */}
      {!isSelecting && (
        <TouchableOpacity
          onPress={pickDocuments}
          className="absolute bottom-24 right-5 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
          style={{ elevation: 8 }}
        >
          <Text className="text-white text-3xl font-light">+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}
