-- Create storage policies for the media bucket
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Users can upload media for their entries"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'media' AND
    auth.uid() IS NOT NULL AND
    (
        -- Check if the path matches the pattern: {entry_id}/{type}/{filename}
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM entries
            WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "Users can update their own media"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'media' AND
    auth.uid() IS NOT NULL AND
    (
        -- Check if the path matches the pattern: {entry_id}/{type}/{filename}
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM entries
            WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'media' AND
    auth.uid() IS NOT NULL AND
    (
        -- Check if the path matches the pattern: {entry_id}/{type}/{filename}
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM entries
            WHERE created_by = auth.uid()
        )
    )
); 