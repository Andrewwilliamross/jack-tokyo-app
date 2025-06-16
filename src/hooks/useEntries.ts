// src/hooks/useEntries.ts
// Custom hook for fetching entries for the current user

import { useEffect, useState } from 'react';
import { fetchEntries } from '../services/entryService';
import type { Tables } from '../integrations/supabase/types';

type Entry = Tables<'entries'>;

export function useEntries(userId: string) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchEntries(userId)
      .then(setEntries)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { entries, loading, error };
} 