// src/hooks/useMediaUpload.ts
// Custom hook for uploading media files

import { useState } from 'react';
import { uploadMedia } from '../services/mediaService';

export function useMediaUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  async function handleUpload(userId: string, entryId: string, file: File) {
    setLoading(true);
    setError(null);
    setUrl(null);
    try {
      const publicUrl = await uploadMedia(userId, entryId, file);
      setUrl(publicUrl);
      return publicUrl;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { uploadMedia: handleUpload, url, loading, error };
} 