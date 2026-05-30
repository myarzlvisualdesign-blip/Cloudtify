import { Tabs, Redirect } from 'expo-router'
import { View, Text, Platform } from 'react-native'
import { BlurView } from 'expo-blur'
import { useAuthStore } from '../../state/auth.store'
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg'

/* ── SVG tab icons ─────────────────────────────────────────────────── */
function IcoHome({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={c} strokeWidth={1.9} />
      <Polyline points="9 22 9 12 15 12 15 22" stroke={c} strokeWidth={1.9} />
    </Svg>
  )
}
function IcoFiles({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        stroke={c} strokeWidth={1.9} />
    </Svg>
  )
}
function IcoSearch({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={11} cy={11} r={8} stroke={c} strokeWidth={1.9} />
      <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke={c} strokeWidth={1.9} />
    </Svg>
  )
}
function IcoProfile({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={1.9} />
      <Circle cx={12} cy={7} r={4} stroke={c} strokeWidth={1.9} />
    </Svg>
  )
}

function TabIcon({
  Icon, label, focused,
}: {
  Icon: React.FC<{ c: string }>
  label: string
  focused: boolean
}) {
  const color = focused ? '#3B82F6' : '#475569'
  return (
    <View className="items-center gap-0.5 pt-1">
      <Icon c={color} />
      <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color }}>{label}</Text>
    </View>
  )
}

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Redirect href="/auth/login" />

  const tabBarHeight = Platform.OS === 'ios' ? 84 : 62
  const tabBarPaddingBottom = Platform.OS === 'ios' ? 24 : 8

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: Platform.OS === 'android' ? 1 : 0,
          borderTopColor: '#1E293B',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#0A0F1E',
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={90}
              tint="dark"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          ) : null,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={IcoHome} label="Beranda" focused={focused} /> }}
      />
      <Tabs.Screen
        name="files"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={IcoFiles} label="File" focused={focused} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={IcoSearch} label="Cari" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={IcoProfile} label="Profil" focused={focused} /> }}
      />
    </Tabs>
  )
}
