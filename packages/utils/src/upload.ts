import { MAX_CHUNK_SIZE_BYTES, MIN_MULTIPART_SIZE_BYTES } from '@cloudtify/types'

export interface ChunkInfo {
  index: number
  start: number
  end: number
  size: number
  isLast: boolean
}

export function getChunks(fileSizeBytes: number, chunkSize = MAX_CHUNK_SIZE_BYTES): ChunkInfo[] {
  const chunks: ChunkInfo[] = []
  let offset = 0
  let index = 0

  while (offset < fileSizeBytes) {
    const end = Math.min(offset + chunkSize, fileSizeBytes)
    chunks.push({
      index,
      start: offset,
      end,
      size: end - offset,
      isLast: end >= fileSizeBytes,
    })
    offset = end
    index++
  }

  return chunks
}

export function needsMultipart(fileSizeBytes: number): boolean {
  return fileSizeBytes > MIN_MULTIPART_SIZE_BYTES
}

export function calculateProgress(uploadedBytes: number, totalBytes: number): number {
  if (totalBytes === 0) return 0
  return Math.min(100, Math.round((uploadedBytes / totalBytes) * 100))
}

export function getUploadSpeedBps(
  bytesUploaded: number,
  startTimeMs: number,
  currentTimeMs: number
): number {
  const elapsed = (currentTimeMs - startTimeMs) / 1000
  if (elapsed <= 0) return 0
  return bytesUploaded / elapsed
}

export function generateUploadKey(userId: string, uploadId: string, fileName: string): string {
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)
  return `users/${userId}/files/${uploadId}/${sanitized}`
}

export function generateThumbnailKey(userId: string, fileId: string): string {
  return `users/${userId}/thumbnails/${fileId}.webp`
}
