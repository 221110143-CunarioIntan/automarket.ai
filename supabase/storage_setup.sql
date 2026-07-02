-- ============================================================
-- Supabase Storage setup for vehicle-images bucket.
-- Run this once via Supabase Dashboard → SQL Editor.
-- Idempotent: safe to re-run.
--
-- Path convention:
--   originals/{vehicle_id}/{image_uuid}.{ext}
--   webps/{vehicle_id}/{image_uuid}.webp
-- storage.foldername(name)[1] = 'originals' | 'webps'
-- storage.foldername(name)[2] = vehicle_id
-- ============================================================

-- Create the bucket (public read so <img src> works without signed URLs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Drop existing policies (idempotency)
DROP POLICY IF EXISTS "public read vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "owners upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "owners delete vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "owners update vehicle images" ON storage.objects;

-- Anyone can read (bucket is public — URLs get treated as long-lived unguessable)
CREATE POLICY "public read vehicle images"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'vehicle-images');

-- Vehicle owner can upload
CREATE POLICY "owners upload vehicle images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'vehicle-images'
        AND (storage.foldername(name))[1] IN ('originals', 'webps')
        AND EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE id = ((storage.foldername(name))[2])::uuid
              AND user_id = auth.uid()
        )
    );

-- Vehicle owner can delete their own images
CREATE POLICY "owners delete vehicle images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'vehicle-images'
        AND (storage.foldername(name))[1] IN ('originals', 'webps')
        AND EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE id = ((storage.foldername(name))[2])::uuid
              AND user_id = auth.uid()
        )
    );

-- Vehicle owner can update (rare — kept for symmetry)
CREATE POLICY "owners update vehicle images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'vehicle-images'
        AND (storage.foldername(name))[1] IN ('originals', 'webps')
        AND EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE id = ((storage.foldername(name))[2])::uuid
              AND user_id = auth.uid()
        )
    );
