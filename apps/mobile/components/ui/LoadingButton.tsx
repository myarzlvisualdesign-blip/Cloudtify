import { ActivityIndicator, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native'

interface Props extends TouchableOpacityProps {
  label: string
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
}

const VARIANTS = {
  primary:   'bg-primary-500',
  secondary: 'bg-dark-700 border border-dark-600',
  danger:    'bg-red-600',
}

export function LoadingButton({ label, isLoading, variant = 'primary', className = '', disabled, ...props }: Props) {
  const base = `rounded-xl py-4 items-center justify-center flex-row gap-2 ${VARIANTS[variant]} ${className}`
  const opacity = disabled || isLoading ? 'opacity-50' : ''

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || isLoading}
      className={`${base} ${opacity}`}
    >
      {isLoading && <ActivityIndicator size="small" color="white" />}
      <Text className="text-white font-semibold text-base">{label}</Text>
    </TouchableOpacity>
  )
}
