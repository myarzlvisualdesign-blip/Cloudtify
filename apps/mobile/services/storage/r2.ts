import * as FileSystem from 'expo-file-system'
import { supabase } from '../supabase/client'
import { parseSupabaseError } from '@cloudtify/utils'
import {
  MAX_CHUNK_SIZE_BYTES,
  MIN_MULTIPART_SIZE_BYTES,
  UPLOAD_RETRY_MAX,
  UPLOAD_RETRY_DELAY_MS,
} from '@cloudtify/types'
import type { UploadInitResponse } from '@cloudtify/types'

// ─── UPLOAD ──────────────────────────────────────────────────

export interface UploadOptions {
  folderId?: string | null
  onProgress?: (uploadedBytes: number, totalBytes: number) => void
  onChunkComplete?: (chunkIndex: number, total: number) => void
  signal?: AbortSignal
}

export interface UploadResult {
  fileId: string
  r2Key: string
}

export async function uploadFile(
  fileUri: string,
  fileName: string,
  mimeType: string,
  fileSize: number,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { folderId = null, onProgress, onChunkComplete, signal } = options

  // 1. Initiate upload via Edge Function
  const { data: initData, error: initError } = await supabase.functions.invoke<UploadInitResponse>(
    'upload-init',
    {
      body: {
        file_name: fileName,
        mime_type: mimeType,
        size_bytes: fileSize,
        folder_id: folderId,
      },
    }
  )
  if (initError || !initData) throw new Error('Upload initiation failed')

  const isMultipart = fileSize > MIN_MULTIPART_SIZE_BYTES

  if (!isMultipart) {
    // Single PUT upload
    await uploadSingleFile(fileUri, initData.upload_url, mimeType, fileSize, onProgress, signal)
  } else {
    // Chunked multipart upload
    await uploadMultipart(
      fileUri,
      fileSize,
      initData.upload_id,
      initData.multipart_upload_id!,
      initData.r2_key,
      onProgress,
      onChunkComplete,
      signal
    )
  }

  // 2. Complete upload — Edge Function finalizes and creates DB record
  const { data: completeData, error: completeError } = await supabase.functions.invoke<{ file_id: string }>(
    'upload-complete',
    { body: { upload_id: initData.upload_id } }
  )
  if (completeError || !completeData) throw new Error('Upload completion failed')

  return { fileId: completeData.file_id, r2Key: initData.r2_key }
}

async function uploadSingleFile(
  fileUri: string,
  uploadUrl: string,
  mimeType: string,
  fileSize: number,
  onProgress?: (uploaded: number, total: number) => void,
  signal?: AbortSignal
): Promise<void> {
  const task = FileSystem.createUploadTask(
    uploadUrl,
    fileUri,
    {
      httpMethod: 'PUT',
      headers: { 'Content-Type': mimeType },
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    },
    (progress) => {
      onProgress?.(progress.totalBytesSent, progress.totalBytesExpectedToSend)
    }
  )

  if (signal) {
    signal.addEventListener('abort', () => task.cancelAsync())
  }

  const result = await task.uploadAsync()
  if (!result || result.status < 200 || result.status >= 300) {
    throw new Error(`Upload failed with status ${result?.status}`)
  }
}

async function uploadMultipart(
  fileUri: string,
  fileSize: number,
  uploadId: string,
  multipartId: string,
  r2Key: string,
  onProgress?: (uploaded: number, total: number) => void,
  onChunkComplete?: (index: number, total: number) => void,
  signal?: AbortSignal
): Promise<void> {
  const chunkSize = MAX_CHUNK_SIZE_BYTES
  const totalChunks = Math.ceil(fileSize / chunkSize)
  const parts: Array<{ part_number: number; etag: string }> = []
  let uploadedBytes = 0

  for (let i = 0; i < totalChunks; i++) {
    if (signal?.aborted) throw new Error('Upload cancelled')

    const start = i * chunkSize
    const end = Math.min(start + chunkSize, fileSize)
    const chunkSizeActual = end - start

    // Get pre-signed URL for this part from Edge Function
    const { data: partData, error: partError } = await supabase.functions.invoke<{ part_url: string }>(
      'upload-chunk-url',
      {
        body: {
          upload_id: uploadId,
          multipart_id: multipartId,
          r2_key: r2Key,
          part_number: i + 1,
          chunk_index: i,
        },
      }
    )
    if (partError || !partData) throw new Error(`Failed to get URL for chunk ${i}`)

    // Upload with retry
    const etag = await uploadChunkWithRetry(
      fileUri,
      partData.part_url,
      start,
      chunkSizeActual,
      UPLOAD_RETRY_MAX
    )

    parts.push({ part_number: i + 1, etag })
    uploadedBytes += chunkSizeActual
    onProgress?.(uploadedBytes, fileSize)
    onChunkComplete?.(i + 1, totalChunks)
  }

  // Complete multipart upload
  const { error } = await supabase.functions.invoke('upload-multipart-complete', {
    body: { upload_id: uploadId, multipart_id: multipartId, r2_key: r2Key, parts },
  })
  if (error) throw parseSupabaseError(error)
}

async function uploadChunkWithRetry(
  fileUri: string,
  partUrl: string,
  start: number,
  size: number,
  maxRetries: number
): Promise<string> {
  let attempt = 0
  while (attempt <= maxRetries) {
    try {
      // Read chunk bytes
      const chunkBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
        position: start,
        length: size,
      })

      const response = await fetch(partUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': String(size),
        },
        body: Buffer.from(chunkBase64, 'base64'),
      })

      if (!response.ok) throw new Error(`Chunk upload failed: ${response.status}`)

      const etag = response.headers.get('etag') ?? `part-${Date.now()}`
      return etag.replace(/"/g, '')
    } catch (error) {
      attempt++
      if (attempt > maxRetries) throw error
      await new Promise((r) => setTimeout(r, UPLOAD_RETRY_DELAY_MS * attempt))
    }
  }
  throw new Error('Chunk upload failed after retries')
}

// ─── DOWNLOAD ────────────────────────────────────────────────

export async function getDownloadUrl(fileId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ download_url: string }>(
    'file-download-url',
    { body: { file_id: fileId } }
  )
  if (error) throw parseSupabaseError(error)
  return data!.download_url
}

export async function downloadFile(
  fileId: string,
  fileName: string,
  onProgress?: (downloaded: number, total: number) => void
): Promise<string> {
  const url = await getDownloadUrl(fileId)
  const destPath = `${FileSystem.documentDirectory}downloads/${fileName}`

  const downloadTask = FileSystem.createDownloadResumable(
    url,
    destPath,
    {},
    (progress) => {
      onProgress?.(progress.totalBytesWritten, progress.totalBytesExpectedToWrite)
    }
  )

  const result = await downloadTask.downloadAsync()
  if (!result?.uri) throw new Error('Download failed')
  return result.uri
}

// ─── THUMBNAIL ────────────────────────────────────────────────

export function getThumbnailUrl(thumbnailKey: string | null | undefined): string | null {
  if (!thumbnailKey) return null
  const baseUrl = process.env.EXPO_PUBLIC_R2_THUMBNAIL_URL
  if (!baseUrl) return null
  return `${baseUrl}/${thumbnailKey}`
}

export function getPublicFileUrl(r2Key: string): string {
  const baseUrl = process.env.EXPO_PUBLIC_R2_PUBLIC_URL
  if (!baseUrl) return ''
  return `${baseUrl}/${r2Key}`
}
