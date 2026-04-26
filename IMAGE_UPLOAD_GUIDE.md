# Image Upload Reference Guide

## Required Image Files for Supabase Storage

### Category Images (upload to `categories/` folder):

| Category Name | Filename | Upload Path |
|---------------|----------|-------------|
| Rompers & Onesies | `rompers-onesies.jpg` | `categories/rompers-onesies.jpg` |
| Dresses & Sets | `dresses-sets.jpg` | `categories/dresses-sets.jpg` |
| Seasonal Collection | `seasonal-collection.jpg` | `categories/seasonal-collection.jpg` |
| Essential Sets | `essential-sets.jpg` | `categories/essential-sets.jpg` |

### Product Images (upload to `products/` folder):

| Product Name | Filename | Upload Path |
|--------------|----------|-------------|
| Heart Romper | `heart-romper.jpg` | `products/heart-romper.jpg` |
| Striped Romper | `striped-romper.jpg` | `products/striped-romper.jpg` |
| Pink Romper | `pink-romper.jpg` | `products/pink-romper.jpg` |
| Pink Dress | `pink-dress.jpg` | `products/pink-dress.jpg` |
| Flower Set | `flower-set.jpg` | `products/flower-set.jpg` |
| Chloe Set | `chloe-set.jpg` | `products/chloe-set.jpg` |
| Spring Flowers | `spring-flowers.jpg` | `products/spring-flowers.jpg` |
| Summer Bloom | `summer-bloom.jpg` | `products/summer-bloom.jpg` |
| Chloe Essential | `chloe-essential.jpg` | `products/chloe-essential.jpg` |
| Basic Hearts | `basic-hearts.jpg` | `products/basic-hearts.jpg` |

## How to Upload

### Method 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to your project dashboard
   - Go to **Storage** → **Buckets**
   - Click on `product-images` bucket

2. **Create Folders**
   - Click "New folder" and create `categories`
   - Click "New folder" and create `products`

3. **Upload Images**
   - Click on `categories` folder
   - Upload category images with exact filenames above
   - Click on `products` folder  
   - Upload product images with exact filenames above

### Method 2: Using the Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Upload files (example)
supabase storage upload product-images/categories/rompers-onesies.jpg ./your-image.jpg
supabase storage upload product-images/products/heart-romper.jpg ./your-product-image.jpg
```

### Method 3: Programmatic Upload (Advanced)

```typescript
// Example using the ProductService
const file = // your File object from input
const imagePath = await this.productService.uploadImage(file, 'products/heart-romper.jpg');
console.log('Uploaded to:', imagePath);
```

## Important Notes

- ✅ **Use exact filenames** from the table above
- ✅ **File extensions**: Use `.jpg`, `.png`, or `.webp`
- ✅ **File size**: Keep under 5MB per image
- ✅ **Image quality**: Recommended 800x600px or higher for products
- ✅ **Categories**: Recommended 400x300px for category thumbnails

## Testing Your Upload

After uploading, you can test the images by:

1. **Check in Supabase Dashboard**: Verify files appear in Storage
2. **Test URL**: Visit `https://your-project.supabase.co/storage/v1/object/public/product-images/products/heart-romper.jpg`
3. **Run the app**: Images should automatically load from Supabase Storage

## Troubleshooting

**Images not loading?**
- Check filenames match exactly (case-sensitive)
- Verify files are in correct folders (`categories/` or `products/`)
- Ensure bucket policies are set up correctly
- Check that bucket is public

**Need different image names?**
- Update the database records to match your actual filenames
- Or rename your files to match the schema exactly