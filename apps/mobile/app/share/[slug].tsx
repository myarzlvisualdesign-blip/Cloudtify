import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, Linking,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../services/supabase/client'
import { formatBytes } from '@cloudtify/utils'
import { LoadingButton } from '../../components/ui/LoadingButton'
import { toast } from '../../lib/toast'
import type { Share } from '@cloudtify/types'

export default function ShareAccessScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const [password, setPassword] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const { data: share, isLoading, error } = useQuery({
    queryKey: ['share', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shares')
        .select('*, files(name, size_bytes, mime_type)')
        .eq('slug', slug!)
        .single()
      if (error) throw error
      return data as Share & { files: { name: string; size_bytes: number; mime_type: string } }
    },
    enabled: !!slug,
  })

  const handleUnlock = async () => {
    if (!share?.id) return
    setUnlocking(true)
    try {
      const { data, error } = await supabase.functions.invoke<{ download_url: string }>(
        'share-access',
        { body: { share_id: share.id, password } }
      )
      if (error) throw error
      setDownloadUrl(data?.download_url ?? null)
      setUnlocked(true)
    } catch {
      toast.error('Password salah atau link sudah kedaluwarsa')
    } finally {
      setUnlocking(false)
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-dark-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  if (error || !share) {
    return (
      <SafeAreaView className="flex-1 bg-dark-950 items-center justify-center px-8">
        <Text className="text-5xl mb-4">🔗</Text>
        <Text className="text-white text-xl font-bold text-center mb-2">Link tidak ditemukan</Text>
        <Text className="text-white/50 text-sm text-center">
          Link berbagi ini tidak valid atau sudah kedaluwarsa.
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-dark-800 rounded-2xl items-center justify-center mb-4">
            <Text className="text-4xl">
              {share.files?.mime_type?.startsWith('image/') ? '🖼️' :
               share.files?.mime_type?.startsWith('video/') ? '🎬' :
               share.files?.mime_type?.startsWith('audio/') ? '🎵' : '📄'}
            </Text>
          </View>
          <Text className="text-white font-bold text-xl text-center" numberOfLines={2}>
            {share.files?.name ?? 'File'}
          </Text>
          {share.files?.size_bytes && (
            <Text className="text-white/50 text-sm mt-1">
              {formatBytes(share.files.size_bytes)}
            </Text>
          )}
        </View>

        {share.is_password_protected && !unlocked ? (
          <View className="gap-4">
            <Text className="text-white/60 text-sm text-center">
              File ini dilindungi password
            </Text>
            <View>
              <Text className="text-white/70 text-sm font-medium mb-2">Password</Text>
              <TextInput
                className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base"
                placeholder="Masukkan password"
                placeholderTextColor="#475569"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <LoadingButton
              label="Buka File"
              onPress={handleUnlock}
              isLoading={unlocking}
              disabled={!password.trim()}
            />
          </View>
        ) : unlocked && downloadUrl ? (
          <View className="gap-4">
            <Text className="text-green-400 text-sm text-center">✓ File siap diunduh</Text>
            <LoadingButton
              label="Unduh File"
              onPress={async () => {
                if (downloadUrl) await Linking.openURL(downloadUrl)
              }}
              isLoading={false}
            />
          </View>
        ) : (
          <LoadingButton
            label="Unduh File"
            onPress={async () => {
              const { data } = await supabase.functions.invoke<{ download_url: string }>(
                'share-access',
                { body: { share_id: share.id } }
              )
              if (data?.download_url) await Linking.openURL(data.download_url)
            }}
            isLoading={false}
          />
        )}

        {share.expires_at && (
          <Text className="text-white/30 text-xs text-center mt-4">
            Kedaluwarsa: {new Date(share.expires_at).toLocaleDateString('id-ID')}
          </Text>
        )}
      </View>
    </SafeAreaView>
  )
}
