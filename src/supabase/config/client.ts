import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
})

// Storage configuration
export const STORAGE_BUCKETS = {
  MEDIA: 'media',
} as const

// Media upload configuration
export const MEDIA_CONFIG = {
  MAX_FILE_SIZE: 4 * 1024 * 1024 * 1024, // 4GB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'] as const,
  MAX_IMAGE_DIMENSION: 4096, // 4K
  MAX_VIDEO_DURATION: 300, // 5 minutes
} as const

// Helper function to validate media file
export const validateMediaFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${MEDIA_CONFIG.MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB`,
    }
  }

  // Check file type
  const isImage = MEDIA_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any)
  const isVideo = MEDIA_CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type as any)

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: 'File type not supported. Please upload an image (JPEG, PNG, WebP) or video (MP4, WebM)',
    }
  }

  return { valid: true }
}

// Helper function to get storage path for media
export const getMediaStoragePath = (entryId: string, file: File): string => {
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const mediaType = MEDIA_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any) ? 'images' : 'videos'
  
  return `${entryId}/${mediaType}/${timestamp}.${extension}`
} 