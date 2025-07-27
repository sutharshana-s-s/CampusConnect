-- Storage Bucket Setup for Canteen Image Uploads
-- Run these commands in your Supabase SQL Editor

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the images bucket

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND 
    auth.role() = 'authenticated'
  );

-- Policy: Allow users to view their own uploaded images
CREATE POLICY "Allow users to view uploaded images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'images' AND 
    auth.role() = 'authenticated'
  );

-- Policy: Allow users to update their own uploaded images
CREATE POLICY "Allow users to update uploaded images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'images' AND 
    auth.role() = 'authenticated'
  );

-- Policy: Allow users to delete their own uploaded images
CREATE POLICY "Allow users to delete uploaded images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND 
    auth.role() = 'authenticated'
  );

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'images';

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY cmd, policyname; 