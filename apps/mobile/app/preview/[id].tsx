import { useState } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Share, Linking, Alert,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { useFile, useDeleteFile, useToggleFavorite } from '../../hooks/useFiles'
import { useAuthStore } from '../../state/auth.store'
import { formatBytes, getFileCategory } from '@cloudtify/utils'
import { getSignedDownloadUrl } from '../../services/storage/r2'
import { toast } from '../../lib/toast'
import Svg, { Path, Polyline, Line, Circle } from 'react-native-svg'

function IcoClose() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <Line x1={18} y1={6} x2={6} y2={18} stroke="#94A3B8" strokeWidth={2} />
      <Line x1={6} y1={6} x2={18} y2={18} stroke="#94A3B8" strokeWidth={2} />
    </Svg>
  )
}
function IcoDownload() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="8 17 12 21 16 17" stroke="white" strokeWidth={2} />
      <Line x1={12} y1={12} x2={12} y2={21} stroke="white" strokeWidth={2} />
      <Path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" stroke="white" strokeWidth={2} />
    </Svg>
  )
}
function IcoShare() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={18} cy={5} r={3} stroke="white" strokeWidth={1.8} />
      <Circle cx={6} cy={12} r={3} stroke="white" strokeWidth={1.8} />
      <Circle cx={18} cy={19} r={3} stroke="white" strokeWidth={1.8} />
      <Line x1={8.59} y1={13.51} x2={15.42} y2={17.49} stroke="white" strokeWidth={1.8} />
      <Line x1={15.41} y1={6.51} x2={8.59} y2={10.49} stroke="white" strokeWidth={1.8} />
    </Svg>
  )
}
function IcoTrash() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="3 6 5 6 21 6" stroke="#F87171" strokeWidth={1.8} />
      <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#F87171" strokeWidth={1.8} />
      <Path d="M10 11v6M14 11v6" stroke="#F87171" strokeWidth={1.8} />
    </Svg>
  )
}

const FILE_ICON: Record<string, string> = {
  image: '🖼️', video: '🎬', audio: '🎵', document: '📄', archive: '📦', other: '📎',
}

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const { data: file, isLoading } = useFile(id!)
  const { mutate: deleteFile } = useDeleteFile()
  const { mutate: toggleFavorite } = useToggleFavorite()
  const [downloading, setDownloading] = useState(false)

  if (isLoading || !file) {
    return (
      <View className="flex-1 bg-dark-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  const category = getFileCategory(file.mime_type, file.name)
  const isImage = category === 'image'

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const url = await getSignedDownloadUrl(file.r2_key)
      await Linking.openURL(url)
    } catch {
      toast.error('Gagal mengunduh file')
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    try {
      const url = await getSignedDownloadUrl(file.r2_key)
      await Share.share({ message: `${file.name}\n${url}`, url })
    } catch {
      // User dismissed
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Hapus File',
      `Hapus "${file.name}"? File akan dipindahkan ke Sampah.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            deleteFile(file.id)
            router.back()
          },
        },
      ]
    )
  }

  return (
    <View className="flex-1 bg-dark-950">
      {/* Header */}
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center px-4 py-3 gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-dark-800 items-center justify-center"
          >
            <IcoClose />
          </TouchableOpacity>
          <Text className="flex-1 text-white font-medium text-base" numberOfLines={1}>
            {file.name}
          </Text>
          <TouchableOpacity
            onPress={() => toggleFavorite({ fileId: file.id, isFavorite: !file.is_favorite })}
            className="w-9 h-9 rounded-full bg-dark-800 items-center justify-center"
          >
            <Text className="text-base">{file.is_favorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Preview area */}
      <View className="flex-1 items-center justify-center bg-dark-900">
        {isImage && file.r2_key ? (
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_R2_PUBLIC_URL}/${file.r2_key}` }}
            className="w-full h-full"
            contentFit="contain"
          />
        ) : (
          <View className="items-center gap-4">
            <Text className="text-7xl">{FILE_ICON[category] ?? '📎'}</Text>
            <Text className="text-white/50 text-sm text-center px-8">
              Pratinjau tidak tersedia untuk tipe file ini
            </Text>
          </View>
        )}
      </View>

      {/* Info & actions */}
      <SafeAreaView edges={['bottom']}>
        <View className="bg-dark-900 border-t border-dark-800 px-5 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white/50 text-xs">Ukuran</Text>
              <Text className="text-white text-sm font-medium">{formatBytes(file.size_bytes)}</Text>
            </View>
            <View>
              <Text className="text-white/50 text-xs">Tipe</Text>
              <Text className="text-white text-sm font-medium capitalize">{category}</Text>
            </View>
            <View>
              <Text className="text-white/50 text-xs">Visibilitas</Text>
              <Text className="text-white text-sm font-medium capitalize">{file.visibility}</Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleDownload}
              disabled={downloading}
              className="flex-1 bg-primary-600 rounded-xl py-3.5 flex-row items-center justify-center gap-2"
            >
              {downloading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <IcoDownload />
              )}
              <Text className="text-white font-semibold">Unduh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 bg-dark-700 rounded-xl py-3.5 flex-row items-center justify-center gap-2"
            >
              <IcoShare />
              <Text className="text-white font-semibold">Bagikan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="w-12 bg-dark-700 rounded-xl items-center justify-center"
            >
              <IcoTrash />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
