import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { id } from 'date-fns/locale'

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function formatGigabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024)
}

export function gbToBytes(gb: number): number {
  return gb * 1024 * 1024 * 1024
}

export function formatStoragePercent(usedBytes: number, totalGB: number): number {
  const totalBytes = totalGB * 1024 * 1024 * 1024
  if (totalBytes === 0) return 0
  return Math.min(100, Math.round((usedBytes / totalBytes) * 100))
}

export function formatCurrency(amount: number, currency = 'IDR'): string {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatIDR(amount: number): string {
  return `Rp${new Intl.NumberFormat('id-ID').format(amount)}`
}

export function formatFileDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return `Hari ini, ${format(date, 'HH:mm')}`
  if (isYesterday(date)) return `Kemarin, ${format(date, 'HH:mm')}`
  return format(date, 'd MMM yyyy', { locale: id })
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: id })
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatUploadSpeed(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`
}

export function formatETA(remainingBytes: number, bytesPerSecond: number): string {
  if (bytesPerSecond <= 0) return 'Menghitung...'
  const seconds = Math.ceil(remainingBytes / bytesPerSecond)
  if (seconds < 60) return `${seconds} detik`
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} menit`
  return `${Math.ceil(seconds / 3600)} jam`
}

export function truncateFileName(name: string, maxLength = 30): string {
  if (name.length <= maxLength) return name
  const ext = name.lastIndexOf('.')
  if (ext === -1) return `${name.slice(0, maxLength - 3)}...`
  const extension = name.slice(ext)
  const base = name.slice(0, ext)
  const allowedBaseLength = maxLength - extension.length - 3
  return `${base.slice(0, allowedBaseLength)}...${extension}`
}

export function formatPlanYearlySaving(monthlyIDR: number, yearlyIDR: number): string {
  const yearFromMonthly = monthlyIDR * 12
  const saving = yearFromMonthly - yearlyIDR
  const pct = Math.round((saving / yearFromMonthly) * 100)
  return `Hemat ${pct}% (${formatIDR(saving)})`
}
