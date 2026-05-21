import { View, Text, TouchableOpacity } from 'react-native'

interface Props {
  icon: string
  title: string
  subtitle?: string
  action?: { label: string; onPress: () => void }
}

export function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-white text-xl font-semibold text-center mb-2">{title}</Text>
      {subtitle && (
        <Text className="text-white/50 text-sm text-center leading-relaxed">{subtitle}</Text>
      )}
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          className="mt-6 bg-primary-600 rounded-xl px-6 py-3"
        >
          <Text className="text-white font-medium">{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
