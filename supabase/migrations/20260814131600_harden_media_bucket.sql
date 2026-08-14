BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media') THEN
    RAISE EXCEPTION 'Storage bucket media does not exist';
  END IF;
END;
$$;

UPDATE storage.buckets
   SET file_size_limit = 10485760,
       allowed_mime_types = ARRAY[
         'image/jpeg',
         'image/png',
         'image/webp',
         'image/gif',
         'application/pdf',
         'audio/mpeg',
         'audio/ogg',
         'video/mp4'
       ]::text[]
 WHERE id = 'media';

COMMIT;
