import { View } from 'react-native'
import { formatStoragePercent, getStorageStatus, getStorageStatusColor } from '@cloudtify/utils'

interface Props {
  usedBytes: number
  totalGB: number
  height?: number
}

export function StorageBar({ usedBytes, totalGB, height = 8 }: Props) {
  const pct = formatStoragePercent(usedBytes, totalGB)
  const status = getStorageStatus(usedBytes, totalGB)
  const color = getStorageStatusColor(status)

  return (
    <View
      className="w-full rounded-full overflow-hidden bg-dark-700"
      style={{ height }}
    >
      <View
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </View>
  )
}
