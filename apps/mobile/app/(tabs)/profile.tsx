import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore, useCurrentPlan, useStorageGB } from '../../state/auth.store'
import { authService } from '../../services/supabase/auth'
import { StorageBar } from '../../components/storage/StorageBar'
import { formatBytes } from '@cloudtify/utils'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../services/supabase/client'
import type { StorageUsage } from '@cloudtify/types'
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg'

/* ── Row icon helpers ──────────────────────────────────────────────── */
function IcoRow({ d, stroke = '#94A3B8' }: { d: string; stroke?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d={d} stroke={stroke} strokeWidth={1.8} />
    </Svg>
  )
}

const PLAN_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  free:  { label: 'Free',  bg: '#1E293B', text: '#94A3B8' },
  plus:  { label: 'Plus',  bg: '#1E3A8A', text: '#93C5FD' },
  pro:   { label: 'Pro',   bg: '#4C1D95', text: '#C4B5FD' },
  ultra: { label: 'Ultra', bg: '#064E3B', text: '#6EE7B7' },
}

export default function ProfileScreen() {
  const { user, profile, reset } = useAuthStore()
  const plan = useCurrentPlan()
  const totalGB = useStorageGB()
  const badge = PLAN_BADGE[plan] ?? PLAN_BADGE.free!

  const { data: storage } = useQuery({
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
  const initials = (profile?.full_name ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    Alert.alert('Keluar', 'Kamu yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await authService.logout()
          reset()
          router.replace('/auth/login')
        },
      },
    ])
  }

  const SETTINGS_ROWS = [
    {
      section: 'Akun',
      items: [
        {
          label: 'Notifikasi',
          icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
          onPress: () => router.push('/profile/notifications'),
        },
        {
          label: 'Storage Detail',
          icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
          onPress: () => router.push('/profile/storage'),
        },
      ],
    },
    {
      section: 'Langganan',
      items: [
        {
          label: 'Upgrade Paket',
          icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
          onPress: () => router.push('/subscription/upgrade'),
          accent: '#3B82F6',
        },
      ],
    },
    {
      section: 'Tentang',
      items: [
        {
          label: 'Bantuan & FAQ',
          icon: 'M9 9a3 3 0 1 1 6 0c0 2-3 3-3 3m0 4h.01',
          onPress: () => {},
        },
        {
          label: 'Kebijakan Privasi',
          icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
          onPress: () => {},
        },
      ],
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-dark-950" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-32">
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-white text-2xl font-bold">Profil</Text>
        </View>

        {/* User card */}
        <View className="mx-5 mt-3 bg-dark-800 rounded-2xl p-5">
          <View className="flex-row items-center gap-4 mb-4">
            {/* Avatar */}
            <View className="w-16 h-16 rounded-full bg-primary-700 items-center justify-center">
              <Text className="text-white text-xl font-bold">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg" numberOfLines={1}>
                {profile?.full_name ?? 'Pengguna'}
              </Text>
              <Text className="text-white/50 text-sm" numberOfLines={1}>{user?.email}</Text>
              <View
                className="mt-1.5 px-2.5 py-0.5 rounded-full self-start"
                style={{ backgroundColor: badge.bg }}
              >
                <Text style={{ color: badge.text }} className="text-xs font-semibold">
                  {badge.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Storage bar */}
          <View className="border-t border-dark-700 pt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/60 text-xs">Storage terpakai</Text>
              <Text className="text-white/60 text-xs">
                {formatBytes(usedBytes)} / {totalGB} GB
              </Text>
            </View>
            <StorageBar usedBytes={usedBytes} totalGB={totalGB} />
          </View>
        </View>

        {/* Settings sections */}
        {SETTINGS_ROWS.map((section) => (
          <View key={section.section} className="mx-5 mt-4">
            <Text className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 px-1">
              {section.section}
            </Text>
            <View className="bg-dark-800 rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={item.onPress}
                  className={`flex-row items-center px-5 py-4 ${i > 0 ? 'border-t border-dark-700' : ''}`}
                >
                  <View className="w-8 h-8 rounded-xl bg-dark-700 items-center justify-center mr-4">
                    <IcoRow d={item.icon} stroke={item.accent ?? '#94A3B8'} />
                  </View>
                  <Text className="flex-1 text-white/90 text-base">{item.label}</Text>
                  <Text className="text-white/30 text-lg">›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View className="mx-5 mt-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-dark-800 rounded-2xl px-5 py-4 flex-row items-center"
          >
            <Text className="flex-1 text-red-400 text-base font-medium">Keluar</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white/20 text-xs text-center mt-6">
          Cloudtify v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
