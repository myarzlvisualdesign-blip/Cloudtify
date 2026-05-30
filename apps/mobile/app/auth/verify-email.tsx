import { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { authService } from '../../services/supabase/auth'
import { useAuthStore } from '../../state/auth.store'
import { toast } from '../../lib/toast'

export default function VerifyEmailScreen() {
  const user = useAuthStore((s) => s.user)
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    if (!user?.email) return
    setIsResending(true)
    try {
      await authService.forgotPassword(user.email)
      setResent(true)
      setTimeout(() => setResent(false), 30_000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim ulang')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-950">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 bg-primary-900/40 rounded-full items-center justify-center mb-6">
          <Text className="text-5xl">📧</Text>
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-3">
          Verifikasi Email
        </Text>
        <Text className="text-white/50 text-base text-center leading-relaxed mb-2">
          Kami sudah mengirimkan email verifikasi ke
        </Text>
        <Text className="text-primary-400 font-semibold text-base text-center mb-8">
          {user?.email ?? 'email kamu'}
        </Text>

        <View className="w-full bg-dark-800 rounded-2xl p-5 mb-8">
          <Text className="text-white/60 text-sm leading-relaxed">
            1. Buka email dari Cloudtify{'\n'}
            2. Klik tombol "Verifikasi Email"{'\n'}
            3. Kembali ke sini dan refresh
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleResend}
          disabled={isResending || resent}
          className={`w-full py-4 rounded-2xl items-center mb-4 ${resent ? 'bg-green-700' : 'bg-dark-800'}`}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#94A3B8" />
          ) : (
            <Text className={`font-medium text-base ${resent ? 'text-green-200' : 'text-white/70'}`}>
              {resent ? '✓ Email terkirim! Cek inbox' : 'Kirim ulang email verifikasi'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            authService.logout()
            useAuthStore.getState().reset()
            router.replace('/auth/login')
          }}
          className="py-2"
        >
          <Text className="text-white/40 text-sm">Gunakan email lain</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
