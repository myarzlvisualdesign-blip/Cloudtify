import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useUpload } from '../../hooks/useUpload'
import Svg, { Path, Line, Polyline, Circle, Rect } from 'react-native-svg'

function IcoUpload() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#3B82F6" strokeWidth={2} />
      <Polyline points="17 8 12 3 7 8" stroke="#3B82F6" strokeWidth={2} />
      <Line x1={12} y1={3} x2={12} y2={15} stroke="#3B82F6" strokeWidth={2} />
    </Svg>
  )
}

function IcoPhoto() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={3} width={18} height={18} rx={2} stroke="#A855F7" strokeWidth={2} />
      <Circle cx={8.5} cy={8.5} r={1.5} stroke="#A855F7" strokeWidth={2} />
      <Polyline points="21 15 16 10 5 21" stroke="#A855F7" strokeWidth={2} />
    </Svg>
  )
}

function IcoFolder() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        stroke="#F59E0B" strokeWidth={2} />
    </Svg>
  )
}

function IcoStar() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Polyline
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        stroke="#F59E0B" strokeWidth={2}
      />
    </Svg>
  )
}

interface Props {
  className?: string
}

export function QuickActions({ className = '' }: Props) {
  const { pickDocuments, pickImages } = useUpload(null)

  const actions = [
    { label: 'Upload File', Icon: IcoUpload, bg: '#1E3A8A22', onPress: pickDocuments },
    { label: 'Upload Foto', Icon: IcoPhoto, bg: '#4C1D9522', onPress: pickImages },
    { label: 'Folder Baru', Icon: IcoFolder, bg: '#78350F22', onPress: () => router.push('/folders/create') },
    { label: 'Favorit', Icon: IcoStar, bg: '#78350F22', onPress: () => router.push({ pathname: '/(tabs)/files' }) },
  ]

  return (
    <View className={`${className}`}>
      <Text className="text-white font-semibold text-lg mb-3">Aksi Cepat</Text>
      <View className="flex-row gap-3">
        {actions.map(({ label, Icon, bg, onPress }) => (
          <TouchableOpacity
            key={label}
            onPress={onPress}
            className="flex-1 rounded-2xl py-4 items-center gap-2"
            style={{ backgroundColor: bg }}
          >
            <Icon />
            <Text className="text-white/70 text-xs font-medium text-center" numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
