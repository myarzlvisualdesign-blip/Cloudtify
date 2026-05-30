import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { authService } from '../../services/supabase/auth'
import { toast } from '../../lib/toast'
import { LoadingButton } from '../../components/ui/LoadingButton'
import Svg, { Polyline, Line } from 'react-native-svg'

function BackChevron() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="15 18 9 12 15 6" stroke="#94A3B8" strokeWidth={2} />
    </Svg>
  )
}

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    if (!email.trim()) return
    setIsLoading(true)
    try {
      await authService.forgotPassword(email.trim())
      setSent(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim email')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-dark-950">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-6">📬</Text>
          <Text className="text-white text-2xl font-bold text-center mb-3">
            Cek email kamu
          </Text>
          <Text className="text-white/50 text-base text-center leading-relaxed mb-8">
            Kami sudah mengirimkan link reset password ke {email}.
            Cek folder spam jika tidak ditemukan.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/auth/login')}
            className="bg-primary-600 rounded-2xl px-8 py-4 w-full items-center"
          >
            <Text className="text-white font-semibold text-base">Kembali ke Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center mb-8"
          >
            <BackChevron />
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-white text-3xl font-bold mb-2">Lupa Password?</Text>
            <Text className="text-white/50 text-base leading-relaxed">
              Masukkan email akun kamu. Kami akan kirimkan link untuk reset password.
            </Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-white/70 text-sm font-medium mb-2">Email</Text>
              <TextInput
                className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base"
                placeholder="email@kamu.com"
                placeholderTextColor="#475569"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <LoadingButton
              onPress={handleSend}
              isLoading={isLoading}
              label="Kirim Link Reset"
              disabled={!email.trim()}
              className="mt-2"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            className="mt-8 py-3 items-center"
          >
            <Text className="text-white/50 text-sm">
              Ingat password?{' '}
              <Text className="text-primary-400 font-semibold">Masuk</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
