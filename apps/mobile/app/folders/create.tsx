import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQueryClient } from '@tanstack/react-query'
import { folderService } from '../../services/supabase/files'
import { useAuthStore } from '../../state/auth.store'
import { LoadingButton } from '../../components/ui/LoadingButton'
import { toast } from '../../lib/toast'
import Svg, { Line } from 'react-native-svg'

const FOLDER_COLORS = [
  '#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626',
  '#0891B2', '#BE185D', '#65A30D', '#6B7280', '#374151',
]
const FOLDER_ICONS = ['📁', '📂', '🗂️', '📋', '📝', '🎨', '🎵', '🎬', '📸', '📦']

function CloseIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <Line x1={18} y1={6} x2={6} y2={18} stroke="#94A3B8" strokeWidth={2} />
      <Line x1={6} y1={6} x2={18} y2={18} stroke="#94A3B8" strokeWidth={2} />
    </Svg>
  )
}

export default function CreateFolderScreen() {
  const { parent_id } = useLocalSearchParams<{ parent_id?: string }>()
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  const [name, setName] = useState('')
  const [color, setColor] = useState(FOLDER_COLORS[0]!)
  const [icon, setIcon] = useState(FOLDER_ICONS[0]!)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim() || !user) return
    setIsLoading(true)
    try {
      await folderService.create(user.id, name.trim(), parent_id ?? null)
      qc.invalidateQueries({ queryKey: ['folders'] })
      toast.success('Folder berhasil dibuat')
      router.back()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal membuat folder')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-white text-2xl font-bold">Folder Baru</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-9 h-9 rounded-full bg-dark-800 items-center justify-center"
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Preview */}
          <View className="items-center mb-8">
            <View
              className="w-20 h-20 rounded-2xl items-center justify-center mb-2"
              style={{ backgroundColor: color }}
            >
              <Text className="text-4xl">{icon}</Text>
            </View>
            <Text className="text-white/60 text-sm">
              {name || 'Nama Folder'}
            </Text>
          </View>

          {/* Name input */}
          <View className="mb-6">
            <Text className="text-white/70 text-sm font-medium mb-2">Nama Folder</Text>
            <TextInput
              className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base"
              placeholder="Nama folder..."
              placeholderTextColor="#475569"
              value={name}
              onChangeText={setName}
              autoFocus
              maxLength={50}
            />
            <Text className="text-white/30 text-xs mt-1.5 text-right">{name.length}/50</Text>
          </View>

          {/* Color picker */}
          <View className="mb-6">
            <Text className="text-white/70 text-sm font-medium mb-3">Warna</Text>
            <View className="flex-row flex-wrap gap-3">
              {FOLDER_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  className={`w-10 h-10 rounded-xl ${color === c ? 'ring-2 ring-white' : ''}`}
                  style={{
                    backgroundColor: c,
                    borderWidth: color === c ? 2 : 0,
                    borderColor: 'white',
                  }}
                />
              ))}
            </View>
          </View>

          {/* Icon picker */}
          <View className="mb-8">
            <Text className="text-white/70 text-sm font-medium mb-3">Ikon</Text>
            <View className="flex-row flex-wrap gap-2">
              {FOLDER_ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setIcon(ic)}
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    icon === ic ? 'bg-primary-600' : 'bg-dark-800'
                  }`}
                >
                  <Text className="text-2xl">{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <LoadingButton
            label="Buat Folder"
            onPress={handleCreate}
            isLoading={isLoading}
            disabled={!name.trim()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
