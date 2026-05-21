import { useState, useRef } from 'react'
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'

const { width: SCREEN_W } = Dimensions.get('window')

const SLIDES = [
  {
    id: '1',
    title: 'Simpan Semua File\ndi Satu Tempat',
    subtitle: 'Foto, video, dokumen — semua aman tersimpan dan mudah diakses kapan saja.',
    icon: '☁️',
    gradient: ['#1E3A8A', '#0EA5E9'] as [string, string],
  },
  {
    id: '2',
    title: 'Bagikan dengan\nMudah & Aman',
    subtitle: 'Kirim link berbagi dengan password dan tanggal kadaluarsa. Privasi tetap terjaga.',
    icon: '🔒',
    gradient: ['#1E1B4B', '#7C3AED'] as [string, string],
  },
  {
    id: '3',
    title: 'Harga Terjangkau\nuntuk Semua',
    subtitle: 'Mulai gratis 15 GB. Upgrade mulai Rp15.000/bulan. Bayar pakai GoPay, DANA, atau QRIS.',
    icon: '💰',
    gradient: ['#064E3B', '#10B981'] as [string, string],
  },
]

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const goNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
      setCurrentIndex(currentIndex + 1)
    } else {
      router.replace('/auth/register')
    }
  }

  const goToLogin = () => router.push('/auth/login')

  const currentSlide = SLIDES[currentIndex]!

  return (
    <LinearGradient colors={currentSlide.gradient} className="flex-1">
      <SafeAreaView className="flex-1">
        {/* Skip */}
        <View className="flex-row justify-end px-6 pt-4">
          <TouchableOpacity onPress={goToLogin}>
            <Text className="text-white/60 font-medium text-base">Masuk</Text>
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_W }} className="flex-1 items-center justify-center px-8">
              <Text className="text-8xl mb-8">{item.icon}</Text>
              <Text className="text-white text-4xl font-bold text-center leading-tight mb-4">
                {item.title}
              </Text>
              <Text className="text-white/70 text-lg text-center leading-relaxed">
                {item.subtitle}
              </Text>
            </View>
          )}
        />

        {/* Dots */}
        <View className="flex-row justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </View>

        {/* CTA */}
        <View className="px-6 pb-8 gap-3">
          <TouchableOpacity
            onPress={goNext}
            className="bg-white rounded-2xl py-4 items-center"
          >
            <Text className="text-dark-950 font-bold text-lg">
              {currentIndex < SLIDES.length - 1 ? 'Lanjut' : 'Mulai Gratis'}
            </Text>
          </TouchableOpacity>

          {currentIndex === SLIDES.length - 1 && (
            <TouchableOpacity onPress={goToLogin} className="py-3 items-center">
              <Text className="text-white/70 text-base">
                Sudah punya akun? <Text className="text-white font-semibold">Masuk</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}
