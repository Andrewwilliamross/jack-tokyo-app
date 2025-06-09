
import { supabase, STORAGE_BUCKETS, MEDIA_CONFIG, getMediaStoragePath, validateMediaFile } from '../config/client'
import { Database } from '../types/database.types'

type Media = Database['public']['Tables']['media']['Row']

export const uploadMedia = async (
  entryId: string,
  file: File,
  isPreview: boolean = false
): Promise<Media> => {
  // Validate file
  const validation = validateMediaFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Get storage path
  const storagePath = getMediaStoragePath(entryId, file)

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.MEDIA)
    .upload(storagePath, file)

  if (uploadError) {
    throw new Error(`Failed to upload media: ${uploadError.message}`)
  }

  // Get file metadata
  const metadata = await getFileMetadata(file)

  // Create media record
  const { data: media, error: insertError } = await supabase
    .from('media')
    .insert({
      entry_id: entryId,
      storage_path: storagePath,
      media_type: metadata.type,
      is_preview: isPreview,
      file_size: file.size,
      mime_type: file.type,
      width: metadata.width,
      height: metadata.height,
      duration: metadata.duration,
    })
    .select()
    .single()

  if (insertError) {
    // Clean up uploaded file if database insert fails
    await supabase.storage.from(STORAGE_BUCKETS.MEDIA).remove([storagePath])
    throw new Error(`Failed to create media record: ${insertError.message}`)
  }

  return media
}

export const deleteMedia = async (mediaId: string): Promise<void> => {
  // Get media record
  const { data: media, error: fetchError } = await supabase
    .from('media')
    .select('storage_path')
    .eq('id', mediaId)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch media record: ${fetchError.message}`)
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKETS.MEDIA)
    .remove([media.storage_path])

  if (storageError) {
    throw new Error(`Failed to delete media from storage: ${storageError.message}`)
  }

  // Delete database record
  const { error: deleteError } = await supabase
    .from('media')
    .delete()
    .eq('id', mediaId)

  if (deleteError) {
    throw new Error(`Failed to delete media record: ${deleteError.message}`)
  }
}

export const getMediaUrl = (storagePath: string): string => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.MEDIA)
    .getPublicUrl(storagePath)
  return data.publicUrl
}

const getFileMetadata = async (file: File): Promise<{
  type: 'image' | 'video'
  width?: number
  height?: number
  duration?: number
}> => {
  return new Promise((resolve, reject) => {
    if (MEDIA_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      const img = new Image()
      img.onload = () => {
        resolve({
          type: 'image',
          width: img.width,
          height: img.height,
        })
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    } else if (MEDIA_CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type as any)) {
      const video = document.createElement('video')
      video.onloadedmetadata = () => {
        resolve({
          type: 'video',
          width: video.videoWidth,
          height: video.videoHeight,
          duration: Math.round(video.duration),
        })
      }
      video.onerror = () => reject(new Error('Failed to load video'))
      video.src = URL.createObjectURL(file)
    } else {
      reject(new Error('Unsupported file type'))
    }
  })
}
