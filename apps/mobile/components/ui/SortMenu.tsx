import { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native'
import Svg, { Line, Polyline, Path } from 'react-native-svg'
import type { SortField, SortOrder } from '@cloudtify/types'

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: 'Tanggal upload', value: 'created_at' },
  { label: 'Terakhir diubah', value: 'updated_at' },
  { label: 'Nama', value: 'name' },
  { label: 'Ukuran', value: 'size_bytes' },
]

interface Props {
  sortBy: SortField
  sortOrder: SortOrder
  onChange: (by: SortField, order: SortOrder) => void
}

function IcoSort() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Line x1={8} y1={6} x2={21} y2={6} stroke="#94A3B8" strokeWidth={2} />
      <Line x1={8} y1={12} x2={21} y2={12} stroke="#94A3B8" strokeWidth={2} />
      <Line x1={8} y1={18} x2={21} y2={18} stroke="#94A3B8" strokeWidth={2} />
      <Line x1={3} y1={6} x2={3.01} y2={6} stroke="#94A3B8" strokeWidth={2} />
      <Line x1={3} y1={12} x2={3.01} y2={12} stroke="#94A3B8" strokeWidth={2} />
      <Line x1={3} y1={18} x2={3.01} y2={18} stroke="#94A3B8" strokeWidth={2} />
    </Svg>
  )
}

export function SortMenu({ sortBy, sortOrder, onChange }: Props) {
  const [visible, setVisible] = useState(false)

  const handleSelect = (field: SortField) => {
    const newOrder: SortOrder =
      field === sortBy ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc'
    onChange(field, newOrder)
    setVisible(false)
  }

  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Urutkan'

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="w-9 h-9 bg-dark-800 rounded-xl items-center justify-center"
      >
        <IcoSort />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setVisible(false)}
        >
          <View className="absolute bottom-0 left-0 right-0 bg-dark-900 rounded-t-3xl pb-10">
            <View className="w-10 h-1 rounded-full bg-dark-600 mx-auto mt-3 mb-6" />
            <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest px-6 mb-4">
              Urutkan berdasarkan
            </Text>

            {SORT_OPTIONS.map((opt) => {
              const active = opt.value === sortBy
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => handleSelect(opt.value)}
                  className={`flex-row items-center justify-between px-6 py-3.5 ${active ? 'bg-primary-600/10' : ''}`}
                >
                  <Text className={`text-base ${active ? 'text-primary-400 font-medium' : 'text-white/80'}`}>
                    {opt.label}
                  </Text>
                  {active && (
                    <Text className="text-primary-400 text-sm">
                      {sortOrder === 'asc' ? '↑ A–Z' : '↓ Z–A'}
                    </Text>
                  )}
                </TouchableOpacity>
              )
            })}

            {/* Order toggle */}
            <View className="mx-6 mt-4 flex-row gap-2">
              {(['asc', 'desc'] as SortOrder[]).map((order) => (
                <TouchableOpacity
                  key={order}
                  onPress={() => { onChange(sortBy, order); setVisible(false) }}
                  className={`flex-1 py-3 rounded-xl items-center ${sortOrder === order ? 'bg-primary-600' : 'bg-dark-800'}`}
                >
                  <Text className={`text-sm font-medium ${sortOrder === order ? 'text-white' : 'text-white/50'}`}>
                    {order === 'asc' ? '↑ Terlama' : '↓ Terbaru'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
