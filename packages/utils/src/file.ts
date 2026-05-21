import {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  AUDIO_EXTENSIONS,
  DOCUMENT_EXTENSIONS,
  BLOCKED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
} from '@cloudtify/types'
import type { FileCategory } from '@cloudtify/types'

export function getFileExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot).toLowerCase()
}

export function getFileCategory(mimeType: string, name: string): FileCategory {
  const ext = getFileExtension(name)
  if (mimeType.startsWith('image/') || IMAGE_EXTENSIONS.includes(ext as string)) return 'image'
  if (mimeType.startsWith('video/') || VIDEO_EXTENSIONS.includes(ext as string)) return 'video'
  if (mimeType.startsWith('audio/') || AUDIO_EXTENSIONS.includes(ext as string)) return 'audio'
  if (DOCUMENT_EXTENSIONS.includes(ext as string) || mimeType === 'application/pdf') return 'document'
  if (mimeType.includes('zip') || mimeType.includes('archive') || ext === '.zip') return 'archive'
  return 'other'
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/')
}

export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType === 'application/pdf'
  )
}

export function isBlockedExtension(name: string): boolean {
  const ext = getFileExtension(name)
  return BLOCKED_EXTENSIONS.includes(ext as never)
}

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.some((allowed) => {
    if (typeof allowed === 'string' && allowed.endsWith('/')) {
      return mimeType.startsWith(allowed)
    }
    return mimeType === allowed
  })
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 255)
}

export function getFileCategoryIcon(category: FileCategory): string {
  switch (category) {
    case 'image':    return 'image'
    case 'video':    return 'film'
    case 'audio':    return 'music'
    case 'document': return 'file-text'
    case 'archive':  return 'archive'
    default:         return 'file'
  }
}

export function getFileCategoryColor(category: FileCategory): string {
  switch (category) {
    case 'image':    return '#3B82F6'
    case 'video':    return '#8B5CF6'
    case 'audio':    return '#F59E0B'
    case 'document': return '#EF4444'
    case 'archive':  return '#6B7280'
    default:         return '#9CA3AF'
  }
}
