import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, type RegisterInput } from '@cloudtify/types'
import { authService } from '../../services/supabase/auth'
import { analyticsService } from '../../services/analytics'
import { FormError } from '../../components/forms/FormError'
import { LoadingButton } from '../../components/ui/LoadingButton'
import { toast } from '../../lib/toast'

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (values: RegisterInput) => {
    setIsLoading(true)
    try {
      await authService.register(values)
      analyticsService.track({
        event: 'signup_complete',
        properties: { method: 'email', referral: values.referral_code },
      })
      router.replace('/auth/verify-email')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Pendaftaran gagal')
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
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Text className="text-white/60 text-base">← Kembali</Text>
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-white text-4xl font-bold mb-2">Buat akun</Text>
            <Text className="text-white/50 text-base">
              Gratis 15 GB. Tidak perlu kartu kredit.
            </Text>
          </View>

          <View className="gap-4">
            {/* Full Name */}
            <View>
              <Text className="text-white/70 text-sm font-medium mb-2">Nama lengkap</Text>
              <Controller
                control={control}
                name="full_name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base"
                    placeholder="Nama kamu"
                    placeholderTextColor="#475569"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <FormError message={errors.full_name?.message} />
            </View>

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
                      placeholder="Min. 8 karakter + huruf kapital + angka"
                      placeholderTextColor="#475569"
                      secureTextEntry={!showPassword}
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

            {/* Confirm Password */}
            <View>
              <Text className="text-white/70 text-sm font-medium mb-2">Ulangi password</Text>
              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base"
                    placeholder="••••••••"
                    placeholderTextColor="#475569"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <FormError message={errors.confirm_password?.message} />
            </View>

            {/* Referral Code (optional) */}
            <View>
              <Text className="text-white/70 text-sm font-medium mb-2">
                Kode referral <Text className="text-white/30">(opsional)</Text>
              </Text>
              <Controller
                control={control}
                name="referral_code"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 text-white text-base"
                    placeholder="Masukkan kode referral"
                    placeholderTextColor="#475569"
                    autoCapitalize="characters"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            {/* Terms notice */}
            <Text className="text-white/40 text-xs text-center leading-relaxed">
              Dengan mendaftar, kamu menyetujui{' '}
              <Text className="text-primary-400">Syarat & Ketentuan</Text>
              {' '}dan{' '}
              <Text className="text-primary-400">Kebijakan Privasi</Text> kami.
            </Text>

            <LoadingButton
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              label="Buat Akun Gratis"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            className="mt-6 py-3 items-center"
          >
            <Text className="text-white/60 text-base">
              Sudah punya akun?{' '}
              <Text className="text-primary-400 font-semibold">Masuk</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
