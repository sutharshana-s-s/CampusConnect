# 🖼️ Image Upload Setup Guide

This guide will help you set up image uploads for the marketplace using Supabase Storage.

## 📋 Prerequisites

- Supabase project with Storage enabled
- Proper Row Level Security (RLS) policies configured

## 🚀 Setup Steps

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Configure the bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ Check this (for public image access)
   - **File size limit**: `5MB` (or your preferred limit)
   - **Allowed MIME types**: `image/*`

### 2. Configure RLS Policies

Create the following RLS policies for the `images` bucket:

#### Policy 1: Allow authenticated users to upload images
```sql
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);
```

#### Policy 2: Allow public read access to images
```sql
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'images'
);
```

#### Policy 3: Allow users to delete their own images
```sql
CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Features Implemented

### ✅ Drag & Drop Upload
- Users can drag and drop image files directly onto the upload area
- Visual feedback when dragging files over the upload zone

### ✅ Multiple Image Support
- Upload multiple images at once
- Preview all uploaded images before submitting

### ✅ Image Preview
- Real-time preview of uploaded images
- Grid layout for multiple images
- Remove individual images before submission

### ✅ File Validation
- Accepts only image files (PNG, JPG, JPEG)
- File size limit enforcement
- Proper error handling

### ✅ Loading States
- Upload progress indication
- Disabled submit button during upload
- Success/error notifications

## 🔧 Usage

### For Users:
1. Click **"Sell Item"** in the marketplace
2. Fill in item details
3. **Upload Images**:
   - Click the upload area to select files, OR
   - Drag and drop image files onto the upload area
4. Preview and remove images as needed
5. Submit the listing

### For Developers:
The image upload functionality is implemented in:
- `src/components/Marketplace/SellItemModal.tsx` - Upload UI and logic
- `src/lib/supabase.ts` - Upload utility functions

## 🛠️ Technical Details

### File Structure
```
marketplace/
├── {userId}/
│   ├── {timestamp}-{random}.jpg
│   ├── {timestamp}-{random}.png
│   └── ...
```

### Database Schema
The `marketplace_items` table stores image URLs in the `images` field:
```sql
images: string[] -- Array of public URLs to uploaded images
```

### Security
- Files are stored in user-specific folders
- RLS policies ensure users can only access their own files
- Public read access for marketplace display
- Authenticated users can upload and delete their own images

## 🐛 Troubleshooting

### Common Issues:

1. **"Failed to upload image" error**
   - Check if the `images` bucket exists
   - Verify RLS policies are configured correctly
   - Ensure file size is within limits

2. **Images not displaying**
   - Check if the bucket is set to public
   - Verify the public URL is being generated correctly
   - Check browser console for CORS errors

3. **Permission denied errors**
   - Ensure user is authenticated
   - Check RLS policies match the expected behavior
   - Verify bucket permissions

### Debug Steps:
1. Check Supabase Dashboard > Storage > Logs
2. Verify environment variables are correct
3. Test with a simple image upload first
4. Check browser network tab for failed requests

## 📱 Mobile Support

The image upload works on mobile devices:
- Tap to select files from gallery/camera
- Responsive design for small screens
- Touch-friendly interface

## 🔄 Future Enhancements

Potential improvements:
- Image compression before upload
- Cropping and editing tools
- Bulk image management
- Image optimization for different screen sizes
- Cloudinary integration for advanced image processing

---

**Need help?** Check the Supabase documentation or create an issue in the project repository. 