import { supabase } from '../config/client'
import { Database } from '../types/database.types'

type Entry = Database['public']['Tables']['entries']['Row']
type EntryInsert = Database['public']['Tables']['entries']['Insert']
type EntryUpdate = Database['public']['Tables']['entries']['Update']

export const createEntry = async (
  entry: Omit<EntryInsert, 'created_by'>,
  userId: string
): Promise<Entry> => {
  const payload = {
    title: entry.title,
    description: entry.description,
    research_notes: entry.research_notes,
    location_id: entry.location_id,
    status: entry.status,
    created_by: userId
  };
  console.log('Supabase createEntry payload:', payload);
  const { data, error } = await supabase
    .from('entries')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create entry: ${error.message}`);
  }

  return data;
}

export const updateEntry = async (
  entryId: string,
  updates: EntryUpdate,
  userId: string
): Promise<Entry> => {
  const { data, error } = await supabase
    .from('entries')
    .update(updates)
    .eq('id', entryId)
    .eq('created_by', userId) // Ensure user owns the entry
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update entry: ${error.message}`)
  }

  return data
}

export const deleteEntry = async (
  entryId: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId)
    .eq('created_by', userId) // Ensure user owns the entry

  if (error) {
    throw new Error(`Failed to delete entry: ${error.message}`)
  }
}

export const getEntry = async (entryId: string): Promise<Entry> => {
  const { data, error } = await supabase
    .from('entries')
    .select(`
      *,
      location:locations(*),
      media:media(*),
      tags:entry_tags(
        tag:tags(*)
      )
    `)
    .eq('id', entryId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch entry: ${error.message}`)
  }

  return data
}

export const listEntries = async (
  filters: {
    status?: Entry['status']
    locationId?: string
    userId?: string
    tagId?: string
  } = {},
  page: number = 1,
  pageSize: number = 10
): Promise<{
  entries: Entry[]
  total: number
}> => {
  let query = supabase
    .from('entries')
    .select(`
      *,
      location:locations(*),
      media:media(*),
      tags:entry_tags(
        tag:tags(*)
      )
    `, { count: 'exact' })

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.locationId) {
    query = query.eq('location_id', filters.locationId)
  }
  if (filters.userId) {
    query = query.eq('created_by', filters.userId)
  }
  if (filters.tagId) {
    query = query.eq('entry_tags.tag_id', filters.tagId)
  }

  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  // Order by creation date
  query = query.order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to list entries: ${error.message}`)
  }

  return {
    entries: data || [],
    total: count || 0,
  }
} 