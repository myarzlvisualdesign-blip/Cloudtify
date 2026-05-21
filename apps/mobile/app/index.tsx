import { Redirect } from 'expo-router'
import { useAuthStore } from '../state/auth.store'
import { View, ActivityIndicator } from 'react-native'

export default function Index() {
  const { user, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-950">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  if (!user) {
    return <Redirect href="/onboarding" />
  }

  return <Redirect href="/(tabs)/home" />
}
