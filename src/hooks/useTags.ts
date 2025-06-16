// src/hooks/useTags.ts
// Custom hook for fetching global tags

import { useEffect, useState } from 'react';
import { fetchTags } from '../services/tagService';
import type { Tables } from '../integrations/supabase/types';

type Tag = Tables<'tags'>;

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTags()
      .then(setTags)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { tags, loading, error };
} 