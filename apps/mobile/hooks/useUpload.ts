import { useCallback, useRef } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { useQueryClient } from '@tanstack/react-query'
import { uploadFile } from '../services/storage/r2'
import { useUploadStore } from '../state/upload.store'
import { useAuthStore } from '../state/auth.store'
import { FILE_KEYS } from './useFiles'
import { isBlockedExtension, isAllowedMimeType, sanitizeFileName } from '@cloudtify/utils'
import { CloudtifyError } from '@cloudtify/utils'
import { toast } from '../lib/toast'
import { nanoid } from '../lib/nanoid'
import type { UploadQueueItem } from '@cloudtify/types'

export function useUpload(folderId?: string | null) {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const subscription = useAuthStore((s) => s.subscription)
  const { addToQueue, updateItem, canAddMore } = useUploadStore()
  const abortControllers = useRef<Map<string, AbortController>>(new Map())

  const validateFile = useCallback(
    (name: string, mimeType: string, sizeBytes: number) => {
      if (isBlockedExtension(name)) {
        throw new CloudtifyError('UNSUPPORTED_FILE_TYPE')
      }
      if (!isAllowedMimeType(mimeType)) {
        throw new CloudtifyError('UNSUPPORTED_FILE_TYPE')
      }
      const maxMB = subscription?.max_file_size_mb ?? 50
      if (sizeBytes > maxMB * 1024 * 1024) {
        throw new CloudtifyError('FILE_TOO_LARGE')
      }
    },
    [subscription]
  )

  const enqueueFile = useCallback(
    async (name: string, mimeType: string, sizeBytes: number, uri: string) => {
      if (!user) return
      validateFile(name, mimeType, sizeBytes)

      const queueId = nanoid()
      const item: UploadQueueItem = {
        id: queueId,
        file: { name, size: sizeBytes, type: mimeType, uri },
        folder_id: folderId ?? null,
        status: 'queued',
        progress: 0,
        created_at: Date.now(),
      }

      addToQueue(item)

      if (!canAddMore()) return

      const controller = new AbortController()
      abortControllers.current.set(queueId, controller)

      updateItem(queueId, { status: 'uploading' })

      try {
        const result = await uploadFile(
          uri,
          sanitizeFileName(name),
          mimeType,
          sizeBytes,
          {
            folderId: folderId ?? null,
            signal: controller.signal,
            onProgress: (uploaded, total) => {
              const progress = Math.round((uploaded / total) * 100)
              updateItem(queueId, { progress, status: 'uploading' })
            },
          }
        )
        updateItem(queueId, { status: 'done', progress: 100 })
        qc.invalidateQueries({ queryKey: FILE_KEYS.lists() })
        qc.invalidateQueries({ queryKey: ['storage'] })
        return result
      } catch (error) {
        if (controller.signal.aborted) {
          updateItem(queueId, { status: 'cancelled' })
          return
        }
        const msg = error instanceof Error ? error.message : 'Upload gagal'
        updateItem(queueId, { status: 'error', error: msg })
        toast.error(msg)
      } finally {
        abortControllers.current.delete(queueId)
      }
    },
    [user, folderId, addToQueue, updateItem, canAddMore, validateFile, qc]
  )

  const pickDocuments = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    })
    if (result.canceled) return

    for (const asset of result.assets) {
      await enqueueFile(
        asset.name,
        asset.mimeType ?? 'application/octet-stream',
        asset.size ?? 0,
        asset.uri
      )
    }
  }, [enqueueFile])

  const pickImages = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 1,
    })
    if (result.canceled) return

    for (const asset of result.assets) {
      await enqueueFile(
        asset.fileName ?? `file-${Date.now()}`,
        asset.mimeType ?? 'image/jpeg',
        asset.fileSize ?? 0,
        asset.uri
      )
    }
  }, [enqueueFile])

  const cancelUpload = useCallback((queueId: string) => {
    const controller = abortControllers.current.get(queueId)
    controller?.abort()
  }, [])

  return { pickDocuments, pickImages, enqueueFile, cancelUpload }
}
