export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          theme: string
          email_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          theme?: string
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme?: string
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          title: string
          description: string | null
          research_notes: string | null
          location_id: string | null
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          research_notes?: string | null
          location_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          research_notes?: string | null
          location_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      locations: {
        Row: {
          id: string
          city: string
          ward: string | null
          custom_location: string | null
          coordinates: unknown | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city: string
          ward?: string | null
          custom_location?: string | null
          coordinates?: unknown | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city?: string
          ward?: string | null
          custom_location?: string | null
          coordinates?: unknown | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          entry_id: string
          storage_path: string
          media_type: 'image' | 'video'
          is_preview: boolean
          file_size: number
          mime_type: string
          width: number | null
          height: number | null
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          storage_path: string
          media_type: 'image' | 'video'
          is_preview?: boolean
          file_size: number
          mime_type: string
          width?: number | null
          height?: number | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          storage_path?: string
          media_type?: 'image' | 'video'
          is_preview?: boolean
          file_size?: number
          mime_type?: string
          width?: number | null
          height?: number | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          is_preset: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          is_preset?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_preset?: boolean
          created_at?: string
        }
      }
      entry_tags: {
        Row: {
          entry_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          entry_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          entry_id?: string
          tag_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      media_type: 'image' | 'video'
      entry_status: 'draft' | 'published' | 'archived'
    }
  }
} 