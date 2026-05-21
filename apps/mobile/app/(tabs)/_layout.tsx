import { Tabs, Redirect } from 'expo-router'
import { View, Text, Platform } from 'react-native'
import { BlurView } from 'expo-blur'
import { useAuthStore } from '../../state/auth.store'

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View className="items-center justify-center gap-0.5 pt-1">
      <Text className={`text-2xl ${focused ? 'opacity-100' : 'opacity-40'}`}>{icon}</Text>
      <Text
        className={`text-xs font-medium ${focused ? 'text-primary-400' : 'text-white/40'}`}
        style={{ fontSize: 10 }}
      >
        {label}
      </Text>
    </View>
  )
}

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Redirect href="/auth/login" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#0F172A',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          ) : null,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Beranda" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📁" label="File" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 rounded-2xl items-center justify-center ${focused ? 'bg-primary-500' : 'bg-primary-600'}`}>
              <Text className="text-white text-2xl">+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🔍" label="Cari" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}
