import { create } from 'zustand'
import type { UploadQueueItem } from '@cloudtify/types'
import { MAX_UPLOAD_CONCURRENT } from '@cloudtify/types'

interface UploadState {
  queue: UploadQueueItem[]
  activeCount: number

  addToQueue: (item: UploadQueueItem) => void
  updateItem: (id: string, updates: Partial<UploadQueueItem>) => void
  removeFromQueue: (id: string) => void
  cancelUpload: (id: string) => void
  clearCompleted: () => void
  canAddMore: () => boolean
}

export const useUploadStore = create<UploadState>((set, get) => ({
  queue: [],
  activeCount: 0,

  addToQueue: (item) =>
    set((s) => ({ queue: [...s.queue, item] })),

  updateItem: (id, updates) =>
    set((s) => ({
      queue: s.queue.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),

  removeFromQueue: (id) =>
    set((s) => ({
      queue: s.queue.filter((item) => item.id !== id),
    })),

  cancelUpload: (id) =>
    set((s) => ({
      queue: s.queue.map((item) =>
        item.id === id ? { ...item, status: 'cancelled' } : item
      ),
    })),

  clearCompleted: () =>
    set((s) => ({
      queue: s.queue.filter((item) => !['done', 'cancelled', 'error'].includes(item.status)),
    })),

  canAddMore: () => {
    const active = get().queue.filter((i) => i.status === 'uploading').length
    return active < MAX_UPLOAD_CONCURRENT
  },
}))

// Selectors
export const useUploadQueue = () => useUploadStore((s) => s.queue)
export const useActiveUploads = () => useUploadStore((s) => s.queue.filter((i) => i.status === 'uploading'))
export const usePendingUploads = () => useUploadStore((s) => s.queue.filter((i) => i.status === 'queued'))
export const useHasActiveUploads = () => useUploadStore((s) => s.queue.some((i) => ['uploading', 'queued'].includes(i.status)))
