// src/services/mediaService.ts
// Service for media upload, fetch, and delete using Supabase Storage

import { supabase } from '../supabase/config/client';

/**
 * Upload a media file to Supabase Storage.
 * @param userId - The user's ID
 * @param entryId - The entry's ID
 * @param file - The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadMedia(userId: string, entryId: string, file: File): Promise<string> {
  const filePath = `media/${userId}/${entryId}/${file.name}`;
  const { error } = await supabase.storage.from('media').upload(filePath, file);
  if (error) throw error;
  const { data } = supabase.storage.from('media').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Delete a media file from Supabase Storage.
 */
export async function deleteMedia(userId: string, entryId: string, fileName: string): Promise<void> {
  const filePath = `media/${userId}/${entryId}/${fileName}`;
  const { error } = await supabase.storage.from('media').remove([filePath]);
  if (error) throw error;
} 