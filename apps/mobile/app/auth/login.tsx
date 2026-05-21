import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '@cloudtify/types'
import { authService } from '../../services/supabase/auth'
import { analyticsService } from '../../services/analytics'
import { FormError } from '../../components/forms/FormError'
import { LoadingButton } from '../../components/ui/LoadingButton'
import { toast } from '../../lib/toast'

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true)
    try {
      await authService.login(values)
      analyticsService.track({ event: 'login_success', properties: { method: 'email' } })
      router.replace('/(tabs)/home')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login gagal')
    } finally {
      setIsLoading(false)
    }
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
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Text className="text-white/60 text-base">← Kembali</Text>
          </TouchableOpacity>

          <View className="mb-10">
            <Text className="text-white text-4xl font-bold mb-2">Selamat datang</Text>
            <Text className="text-white/50 text-base">Masuk ke akun Cloudtify kamu</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Email */}
            <View>
              <Text className="text-white/70 text-sm font-medium mb-2">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base"
                    placeholder="email@kamu.com"
                    placeholderTextColor="#475569"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <FormError message={errors.email?.message} />
            </View>

            {/* Password */}
            <View>
              <Text className="text-white/70 text-sm font-medium mb-2">Password</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base pr-14"
                      placeholder="••••••••"
                      placeholderTextColor="#475569"
                      secureTextEntry={!showPassword}
                      autoComplete="current-password"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Text className="text-white/50 text-sm">{showPassword ? 'Sembunyikan' : 'Tampilkan'}</Text>
                </TouchableOpacity>
              </View>
              <FormError message={errors.password?.message} />
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              onPress={() => router.push('/auth/forgot-password')}
              className="self-end"
            >
              <Text className="text-primary-400 text-sm font-medium">Lupa password?</Text>
            </TouchableOpacity>

            {/* Submit */}
            <LoadingButton
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              label="Masuk"
              className="mt-2"
            />

            {/* Divider */}
            <View className="flex-row items-center gap-4 my-2">
              <View className="flex-1 h-px bg-dark-700" />
              <Text className="text-white/30 text-sm">atau</Text>
              <View className="flex-1 h-px bg-dark-700" />
            </View>

            {/* Google */}
            <TouchableOpacity
              onPress={() => authService.loginWithGoogle()}
              className="flex-row items-center justify-center gap-3 bg-dark-800 border border-dark-700 rounded-xl py-4"
            >
              <Text className="text-xl">🇬</Text>
              <Text className="text-white font-medium text-base">Lanjut dengan Google</Text>
            </TouchableOpacity>

            {/* Apple (iOS only) */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => authService.loginWithApple()}
                className="flex-row items-center justify-center gap-3 bg-white rounded-xl py-4"
              >
                <Text className="text-xl">🍎</Text>
                <Text className="text-dark-950 font-medium text-base">Lanjut dengan Apple</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Register link */}
          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            className="mt-8 py-3 items-center"
          >
            <Text className="text-white/60 text-base">
              Belum punya akun?{' '}
              <Text className="text-primary-400 font-semibold">Daftar gratis</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
