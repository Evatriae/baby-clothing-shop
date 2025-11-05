# Supabase Storage Setup Guide

## Overview
This guide helps you set up Supabase Storage for the baby clothing shop landing page images.

## Steps to Set Up Storage

### 1. Create Storage Bucket in Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set bucket name: `images`
5. Make it **Public** (so images can be accessed without authentication)
6. Click **Create bucket**

### 2. Create Folder Structure

In the `images` bucket, create the following folders:
- `landing/` - For landing page images
- `products/` - For product images
- `branding/` - For logos and brand assets
- `placeholders/` - For placeholder images

### 3. Upload Images

#### Landing Page Hero Image
1. Go to the `images` bucket
2. Navigate to the `landing/` folder
3. Upload your hero image with the name: `hero-image.webp`
4. Make sure it's publicly accessible

#### Home Page Hero Image
1. Go to the `images` bucket
2. Navigate to the `landing/` folder
3. Upload your home hero image with the name: `baby-clothes-hero.png`
4. Make sure it's publicly accessible

### 4. Set Up Storage Policies (if needed)

If you need to make the bucket public, run this SQL in the SQL Editor:

```sql
-- Make the images bucket publicly readable
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policy to allow public read access
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update" ON storage.objects 
FOR UPDATE WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

### 5. Test the Setup

After uploading the image, your landing page should automatically load the image from Supabase storage. If the image is not found, it will fallback to the local assets.

## Expected Bucket Structure

```
images/
├── landing/
│   ├── hero-image.webp (landing page)
│   └── baby-clothes-hero.png (home page)
├── products/
│   └── [product images]
├── branding/
│   └── logo.png
└── placeholders/
    └── product-placeholder.png
```

## Troubleshooting

### Image Not Loading
1. Check that the bucket is public
2. Verify the image path matches exactly: `landing/hero-image.webp`
3. Check browser console for any CORS errors
4. Ensure the image is uploaded and publicly accessible

### Storage Policies
If you get permission errors:
1. Make sure the bucket is set to public
2. Run the storage policies SQL above
3. Check that RLS is properly configured

### Image Format
- Recommended format: WebP for better compression
- Fallback: PNG or JPEG
- Max recommended size: 2MB for web performance

## Benefits of Using Supabase Storage

1. **CDN Performance**: Images served through Supabase CDN
2. **Scalability**: Handle large numbers of images
3. **Security**: Controlled access with policies
4. **Management**: Easy to update images without code changes
5. **Cost-effective**: Pay only for what you use
6. **Backup**: Automatic backup and redundancy