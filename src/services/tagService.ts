// src/services/tagService.ts
// Service for CRUD operations on tags (global, persistent across users)

import { supabase } from '../supabase/config/client';
import type { Database } from '../supabase/types/database.types';

type Tag = Database['public']['Tables']['tags']['Row'];

/**
 * Fetch all tags (global).
 */
export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Create a new tag.
 */
export async function createTag(tag: Partial<Tag>): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .insert({
      name: tag.name || '',
      is_preset: tag.is_preset,
      created_at: tag.created_at,
      id: tag.id
    })
    .select()
    .single();
  if (error) throw error;
  return data;
} 