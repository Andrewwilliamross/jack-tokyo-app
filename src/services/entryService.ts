// src/services/entryService.ts
// Service for CRUD operations on journal entries using Supabase

import { supabase } from '../supabase/config/client';
import type { Database } from '../supabase/types/database.types';

export type Entry = Database['public']['Tables']['entries']['Row'];

/**
 * Fetch all entries for the current user.
 */
export async function fetchEntries(userId: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Create a new entry.
 */
export async function createEntry(entry: Partial<Entry>, userId: string): Promise<Entry> {
  console.log('Payload being sent to Supabase (createEntry):', { ...entry, created_by: userId }); // DEBUG LOG
  const { data, error } = await supabase
    .from('entries')
    .insert([{ ...entry, created_by: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Update an existing entry.
 */
export async function updateEntry(id: string, updates: Partial<Entry>): Promise<Entry> {
  const { data, error } = await supabase
    .from('entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Delete an entry.
 */
export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id);
  if (error) throw error;
} 