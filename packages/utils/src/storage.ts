import { STORAGE_WARNING_PCT, STORAGE_CRITICAL_PCT } from '@cloudtify/types'

export type StorageStatus = 'ok' | 'warning' | 'critical' | 'full'

export function getStorageStatus(usedBytes: number, totalGB: number): StorageStatus {
  const totalBytes = totalGB * 1024 * 1024 * 1024
  if (totalBytes === 0) return 'full'
  const pct = (usedBytes / totalBytes) * 100
  if (pct >= 100) return 'full'
  if (pct >= STORAGE_CRITICAL_PCT) return 'critical'
  if (pct >= STORAGE_WARNING_PCT) return 'warning'
  return 'ok'
}

export function getStorageStatusColor(status: StorageStatus): string {
  switch (status) {
    case 'ok':       return '#22C55E'
    case 'warning':  return '#F59E0B'
    case 'critical': return '#EF4444'
    case 'full':     return '#DC2626'
  }
}

export function getRemainingBytes(usedBytes: number, totalGB: number): number {
  const totalBytes = totalGB * 1024 * 1024 * 1024
  return Math.max(0, totalBytes - usedBytes)
}

export function canUploadFile(usedBytes: number, totalGB: number, fileSizeBytes: number): boolean {
  return getRemainingBytes(usedBytes, totalGB) >= fileSizeBytes
}

export function getStorageBreakdown(usage: {
  image_bytes: number
  video_bytes: number
  document_bytes: number
  audio_bytes: number
  other_bytes: number
  trash_bytes: number
}): Array<{ label: string; bytes: number; color: string }> {
  return [
    { label: 'Gambar',    bytes: usage.image_bytes,    color: '#3B82F6' },
    { label: 'Video',     bytes: usage.video_bytes,    color: '#8B5CF6' },
    { label: 'Dokumen',   bytes: usage.document_bytes, color: '#EF4444' },
    { label: 'Audio',     bytes: usage.audio_bytes,    color: '#F59E0B' },
    { label: 'Lainnya',   bytes: usage.other_bytes,    color: '#6B7280' },
    { label: 'Sampah',    bytes: usage.trash_bytes,    color: '#9CA3AF' },
  ].filter((item) => item.bytes > 0)
}
