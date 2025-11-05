# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage for your baby clothing shop images.

## Setup Steps

### 1. Create Storage Bucket
Run the `storage-setup.sql` script in your Supabase SQL editor to create the storage bucket and policies.

### 2. Upload Images
You'll need to upload your product images to the Supabase Storage bucket. Here's the recommended folder structure:

```
product-images/
├── categories/
│   ├── rompers-onesies.jpg
│   ├── dresses-sets.jpg
│   ├── seasonal-collection.jpg
│   └── essential-sets.jpg
└── products/
    ├── heart-romper.jpg
    ├── striped-romper.jpg
    ├── pink-romper.jpg
    ├── pink-dress.jpg
    ├── flower-set.jpg
    ├── chloe-set.jpg
    ├── spring-flowers.jpg
    ├── summer-bloom.jpg
    ├── chloe-essential.jpg
    └── basic-hearts.jpg
```

### 3. Upload Methods

#### Option A: Supabase Dashboard (Recommended for initial setup)
1. Go to your Supabase Dashboard
2. Navigate to Storage → Buckets
3. Select the `product-images` bucket
4. Create folders: `categories/` and `products/`
5. Upload images to their respective folders
6. Make sure to use the exact filenames from the schema

#### Option B: Programmatic Upload (Advanced)
You can use the upload methods in ProductService:

```typescript
// Example usage
const file = // your File object
const imagePath = await this.productService.uploadImage(file, 'products/heart-romper.jpg');
```

### 4. Update Database
After uploading images, run the updated `products-schema.sql` to populate the database with the correct image paths.

## Image Requirements

- **Format**: JPG, PNG, WebP, or GIF
- **Size**: Maximum 5MB per image
- **Resolution**: Recommended 800x600px or higher for product images
- **Categories**: Recommended 400x300px for category thumbnails

## How It Works

The ProductService automatically:
1. **Converts paths to URLs**: Storage paths are converted to full Supabase CDN URLs
2. **Backwards compatibility**: Still supports local `assets/` paths during development
3. **Error handling**: Gracefully handles missing images
4. **Performance**: Uses Supabase CDN for fast image delivery

## URL Structure

Images are served from Supabase's CDN with URLs like:
```
https://your-project.supabase.co/storage/v1/object/public/product-images/products/heart-romper.jpg
```

## Admin Features

The ProductService includes methods for image management:
- `uploadImage(file, filename)`: Upload new images
- `deleteImage(imagePath)`: Remove unused images
- `getImageUrl(imagePath)`: Get full CDN URL for any image path

## Security

- **Public read access**: All images are publicly viewable
- **Authenticated uploads**: Only authenticated users can upload/modify images
- **File type restrictions**: Only image formats are allowed
- **Size limits**: 5MB maximum per file