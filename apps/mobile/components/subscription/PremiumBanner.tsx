import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

interface Props { className?: string }

export function PremiumBanner({ className = '' }: Props) {
  return (
    <LinearGradient
      colors={['#1E3A8A', '#7C3AED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={`rounded-2xl p-4 flex-row items-center justify-between ${className}`}
    >
      <View className="flex-1 mr-3">
        <Text className="text-white font-bold text-base">Upgrade ke Plus</Text>
        <Text className="text-white/70 text-xs mt-0.5">100 GB · Tanpa iklan · Mulai Rp15.000/bln</Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push('/subscription/upgrade')}
        className="bg-white rounded-xl px-4 py-2"
      >
        <Text className="text-primary-700 font-bold text-sm">Upgrade</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
