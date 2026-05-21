import { supabase } from './client'
import { parseSupabaseError } from '@cloudtify/utils'
import type { CloudFile, Folder } from '@cloudtify/types'
import type { SortField, SortOrder } from '@cloudtify/types'

export interface FileListOptions {
  folder_id?: string | null
  limit?: number
  offset?: number
  sort_by?: SortField
  sort_order?: SortOrder
  search?: string
  category?: string
  include_deleted?: boolean
}

export const fileService = {
  async list(userId: string, opts: FileListOptions = {}): Promise<{ files: CloudFile[]; total: number }> {
    const {
      folder_id = null,
      limit = 20,
      offset = 0,
      sort_by = 'created_at',
      sort_order = 'desc',
      search,
      category,
      include_deleted = false,
    } = opts

    let query = supabase
      .from('files')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_deleted', include_deleted ? true : false)

    if (folder_id === null) {
      query = query.is('folder_id', null)
    } else if (folder_id) {
      query = query.eq('folder_id', folder_id)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (category) {
      switch (category) {
        case 'image':    query = query.like('mime_type', 'image/%'); break
        case 'video':    query = query.like('mime_type', 'video/%'); break
        case 'audio':    query = query.like('mime_type', 'audio/%'); break
        case 'document': query = query.in('mime_type', ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']); break
      }
    }

    query = query.order(sort_by, { ascending: sort_order === 'asc' })
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query
    if (error) throw parseSupabaseError(error)
    return { files: data ?? [], total: count ?? 0 }
  },

  async getById(fileId: string, userId: string): Promise<CloudFile> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single()
    if (error) throw parseSupabaseError(error)
    return data
  },

  async rename(fileId: string, userId: string, name: string): Promise<CloudFile> {
    const { data, error } = await supabase
      .from('files')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', fileId)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw parseSupabaseError(error)
    return data
  },

  async move(fileIds: string[], userId: string, targetFolderId: string | null): Promise<void> {
    const { error } = await supabase
      .from('files')
      .update({ folder_id: targetFolderId, updated_at: new Date().toISOString() })
      .in('id', fileIds)
      .eq('user_id', userId)
    if (error) throw parseSupabaseError(error)
  },

  async softDelete(fileId: string, userId: string): Promise<void> {
    const { error } = await supabase.rpc('soft_delete_file', {
      p_file_id: fileId,
      p_user_id: userId,
    })
    if (error) throw parseSupabaseError(error)
  },

  async bulkSoftDelete(fileIds: string[], userId: string): Promise<void> {
    for (const id of fileIds) {
      await this.softDelete(id, userId)
    }
  },

  async restore(fileId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('files')
      .update({ is_deleted: false, deleted_at: null, permanent_delete_at: null })
      .eq('id', fileId)
      .eq('user_id', userId)
    if (error) throw parseSupabaseError(error)
  },

  async permanentDelete(fileId: string, userId: string): Promise<void> {
    // Call edge function — needs to delete from R2 too
    const { error } = await supabase.functions.invoke('delete-file-permanent', {
      body: { file_id: fileId, user_id: userId },
    })
    if (error) throw parseSupabaseError(error)
  },

  async toggleFavorite(fileId: string, userId: string, isFavorite: boolean): Promise<void> {
    const { error } = await supabase
      .from('files')
      .update({ is_favorite: isFavorite })
      .eq('id', fileId)
      .eq('user_id', userId)
    if (error) throw parseSupabaseError(error)
  },

  async getTrash(userId: string): Promise<CloudFile[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', true)
      .order('deleted_at', { ascending: false })
    if (error) throw parseSupabaseError(error)
    return data ?? []
  },

  async emptyTrash(userId: string): Promise<void> {
    const { data } = await supabase
      .from('files')
      .select('id')
      .eq('user_id', userId)
      .eq('is_deleted', true)
    if (!data?.length) return
    for (const file of data) {
      await this.permanentDelete(file.id, userId)
    }
  },
}

export const folderService = {
  async list(userId: string, parentId: string | null = null): Promise<Folder[]> {
    let query = supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('name', { ascending: true })

    if (parentId === null) {
      query = query.is('parent_id', null)
    } else {
      query = query.eq('parent_id', parentId)
    }

    const { data, error } = await query
    if (error) throw parseSupabaseError(error)
    return data ?? []
  },

  async create(userId: string, name: string, parentId?: string | null): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .insert({ user_id: userId, name, parent_id: parentId ?? null })
      .select()
      .single()
    if (error) throw parseSupabaseError(error)
    return data
  },

  async rename(folderId: string, userId: string, name: string): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .update({ name })
      .eq('id', folderId)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw parseSupabaseError(error)
    return data
  },

  async delete(folderId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('folders')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', folderId)
      .eq('user_id', userId)
    if (error) throw parseSupabaseError(error)
  },

  async getBreadcrumbs(folderId: string, userId: string): Promise<Array<{ id: string; name: string }>> {
    const breadcrumbs: Array<{ id: string; name: string }> = []
    let currentId: string | null = folderId

    while (currentId) {
      const { data } = await supabase
        .from('folders')
        .select('id, name, parent_id')
        .eq('id', currentId)
        .eq('user_id', userId)
        .single()

      if (!data) break
      breadcrumbs.unshift({ id: data.id, name: data.name })
      currentId = data.parent_id
    }

    return breadcrumbs
  },
}
