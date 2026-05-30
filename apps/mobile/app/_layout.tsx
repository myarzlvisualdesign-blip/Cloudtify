import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import { useAuthStore } from '../state/auth.store'
import { supabase } from '../services/supabase/client'
import { analyticsService } from '../services/analytics'
import '../styles/global.css'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
    mutations: {
      retry: 1,
    },
  },
})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  const { setUser, setSession, setProfile, setSubscription, setInitialized } = useAuthStore()

  useEffect(() => {
    // Track app open
    analyticsService.track({ event: 'app_open', properties: { platform: 'mobile', version: '1.0.0' } })

    // Initialize auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setInitialized(true)
    })

    // Listen to auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch profile and subscription
          const [profileRes, subRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', session.user.id).single(),
            supabase
              .from('user_active_subscription')
              .select('*')
              .eq('user_id', session.user.id)
              .single(),
          ])
          if (profileRes.data) setProfile(profileRes.data)
          if (subRes.data) setSubscription(subRes.data)
        } else {
          setProfile(null)
          setSubscription(null)
        }
      }
    )

    return () => authSub.unsubscribe()
  }, [setUser, setSession, setProfile, setSubscription, setInitialized])

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" backgroundColor="#0A0F1E" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="preview/[id]" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="share/[slug]" />
            <Stack.Screen name="subscription/upgrade" options={{ presentation: 'modal' }} />
            <Stack.Screen name="folders/create" options={{ presentation: 'modal' }} />
            <Stack.Screen name="profile/notifications" />
            <Stack.Screen name="profile/storage" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
