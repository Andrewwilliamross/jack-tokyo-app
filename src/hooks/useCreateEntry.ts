// src/hooks/useCreateEntry.ts
// Custom hook for creating a new entry

import { useState } from 'react';
import { createEntry } from '../services/entryService';
import type { Tables } from '../integrations/supabase/types';
import { useAuthStore } from '../lib/store/auth';

type Entry = Tables<'entries'>;

export function useCreateEntry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();

  async function handleCreate(entry: Partial<Entry>): Promise<Entry | null> {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      const newEntry = await createEntry(entry, user.id);
      return newEntry;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating entry (useCreateEntry):', err);
      // Optionally surface error to user here if you have a toast system
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createEntry: handleCreate, loading, error };
} 