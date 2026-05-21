import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { fileService, type FileListOptions } from '../services/supabase/files'
import { useAuthStore } from '../state/auth.store'
import { toast } from '../lib/toast'

export const FILE_KEYS = {
  all:        ['files'] as const,
  lists:      () => [...FILE_KEYS.all, 'list'] as const,
  list:       (opts: FileListOptions) => [...FILE_KEYS.lists(), opts] as const,
  detail:     (id: string) => [...FILE_KEYS.all, 'detail', id] as const,
  trash:      () => [...FILE_KEYS.all, 'trash'] as const,
  favorites:  () => [...FILE_KEYS.all, 'favorites'] as const,
  recent:     () => [...FILE_KEYS.all, 'recent'] as const,
}

export function useFiles(opts: FileListOptions = {}) {
  const user = useAuthStore((s) => s.user)

  return useInfiniteQuery({
    queryKey: FILE_KEYS.list(opts),
    queryFn: ({ pageParam = 0 }) =>
      fileService.list(user!.id, { ...opts, offset: pageParam as number, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, p) => acc + p.files.length, 0)
      return loaded < lastPage.total ? loaded : undefined
    },
    initialPageParam: 0,
    enabled: !!user,
    staleTime: 30_000,
  })
}

export function useFile(fileId: string) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: FILE_KEYS.detail(fileId),
    queryFn: () => fileService.getById(fileId, user!.id),
    enabled: !!user && !!fileId,
  })
}

export function useTrashFiles() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: FILE_KEYS.trash(),
    queryFn: () => fileService.getTrash(user!.id),
    enabled: !!user,
  })
}

export function useRenameFile() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({ fileId, name }: { fileId: string; name: string }) =>
      fileService.rename(fileId, user!.id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FILE_KEYS.lists() })
      toast.success('File berhasil diubah namanya')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteFile() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (fileId: string) => fileService.softDelete(fileId, user!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FILE_KEYS.all })
      toast.success('File dipindahkan ke sampah')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useRestoreFile() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (fileId: string) => fileService.restore(fileId, user!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FILE_KEYS.all })
      toast.success('File berhasil dipulihkan')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useMoveFiles() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({ fileIds, targetFolderId }: { fileIds: string[]; targetFolderId: string | null }) =>
      fileService.move(fileIds, user!.id, targetFolderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FILE_KEYS.lists() })
      toast.success('File berhasil dipindahkan')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({ fileId, isFavorite }: { fileId: string; isFavorite: boolean }) =>
      fileService.toggleFavorite(fileId, user!.id, isFavorite),
    onSuccess: () => qc.invalidateQueries({ queryKey: FILE_KEYS.all }),
  })
}
