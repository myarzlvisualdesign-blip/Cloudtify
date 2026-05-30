import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { fileService } from '../../services/supabase/files'
import { useAuthStore } from '../../state/auth.store'
import { FileCard } from '../../components/file/FileCard'
import { EmptyState } from '../../components/ui/EmptyState'
import Svg, { Circle, Line } from 'react-native-svg'

const FILTERS = [
  { label: 'Semua', value: '' },
  { label: 'Foto', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Dokumen', value: 'document' },
  { label: 'Audio', value: 'audio' },
]

function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <Circle cx={11} cy={11} r={8} stroke="#475569" strokeWidth={2} />
      <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke="#475569" strokeWidth={2} />
    </Svg>
  )
}

export default function SearchScreen() {
  const user = useAuthStore((s) => s.user)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const debouncedQuery = useDebounce(query, 350)

  const { data, isLoading } = useQuery({
    queryKey: ['search', user?.id, debouncedQuery, category],
    queryFn: () =>
      fileService.list(user!.id, {
        search: debouncedQuery || undefined,
        category: category || undefined,
        limit: 30,
      }),
    enabled: !!user && (!!debouncedQuery || !!category),
    staleTime: 15_000,
  })

  const files = data?.files ?? []
  const showEmpty = (!!debouncedQuery || !!category) && !isLoading && !files.length

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top']}>
      {/* Search input */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold mb-4">Cari File</Text>
        <View className="flex-row items-center bg-dark-800 border border-dark-700 rounded-2xl px-4 py-3 gap-3">
          <SearchIcon />
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Cari nama file..."
            placeholderTextColor="#475569"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text className="text-white/40 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Type filters */}
      <View>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(f) => f.value}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 pb-3 gap-2"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCategory(item.value)}
              className={`px-4 py-2 rounded-xl border ${
                category === item.value
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-dark-800 border-dark-700'
              }`}
            >
              <Text className={`text-sm font-medium ${category === item.value ? 'text-white' : 'text-white/60'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : showEmpty ? (
        <EmptyState
          icon="🔍"
          title="Tidak ada hasil"
          subtitle={`Tidak ada file yang cocok dengan "${debouncedQuery}"`}
        />
      ) : !debouncedQuery && !category ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">🔍</Text>
          <Text className="text-white/40 text-sm text-center">
            Ketik nama file untuk mulai mencari
          </Text>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(f) => f.id}
          contentContainerClassName="px-5 pb-28"
          renderItem={({ item }) => (
            <FileCard
              file={item}
              onPress={() => router.push({ pathname: '/preview/[id]', params: { id: item.id } })}
            />
          )}
          ListHeaderComponent={
            files.length > 0 ? (
              <Text className="text-white/40 text-xs mb-3">
                {data?.total ?? files.length} hasil ditemukan
              </Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  )
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
