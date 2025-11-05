# File Renaming and Upload Guide

## Current Assets → Supabase Storage Mapping

### Category Images

| Your Current File | Rename To | Upload Path |
|-------------------|-----------|-------------|
| `Romper with hearts.png` | `rompers-onesies.jpg` | `categories/rompers-onesies.jpg` |
| `Pink Dress.png` | `dresses-sets.jpg` | `categories/dresses-sets.jpg` |
| `Flowers Sets.png` | `seasonal-collection.jpg` | `categories/seasonal-collection.jpg` |
| `Chloe sets.png` | `essential-sets.jpg` | `categories/essential-sets.jpg` |

### Product Images

| Your Current File | Rename To | Upload Path |
|-------------------|-----------|-------------|
| `Romper with hearts.png` | `heart-romper.jpg` | `products/heart-romper.jpg` |
| `Romper with stripes.png` | `striped-romper.jpg` | `products/striped-romper.jpg` |
| `Pink Dress.png` | `pink-romper.jpg` | `products/pink-romper.jpg` |
| `Pink Dress.png` | `pink-dress.jpg` | `products/pink-dress.jpg` |
| `Flowers Sets.png` | `flower-set.jpg` | `products/flower-set.jpg` |
| `Chloe sets.png` | `chloe-set.jpg` | `products/chloe-set.jpg` |
| `Flowers Sets.png` | `spring-flowers.jpg` | `products/spring-flowers.jpg` |
| `Pink with Flowers.png` | `summer-bloom.jpg` | `products/summer-bloom.jpg` |
| `Chloe sets.png` | `chloe-essential.jpg` | `products/chloe-essential.jpg` |
| `Romper with hearts.png` | `basic-hearts.jpg` | `products/basic-hearts.jpg` |

## Step-by-Step Process

### 1. Prepare Your Images

Copy your current asset images and rename them according to the table above. You'll be uploading the same image multiple times with different names for different products.

### 2. Convert PNG to JPG (Optional but Recommended)

Since your current files are PNG, you may want to convert them to JPG for better web performance:

- Use any image editor (Paint, Photoshop, GIMP, online converters)
- Save as JPG with 85-90% quality
- Or keep as PNG and update the extensions in the upload paths

### 3. Upload to Supabase

**Via Supabase Dashboard:**
1. Go to Storage → Buckets → `product-images`
2. Create folders: `categories/` and `products/`
3. Upload renamed files to respective folders

**PowerShell Script (Advanced):**
```powershell
# Example to copy and rename files
Copy-Item "C:\Users\John\Desktop\Ionic\baby-clothing-shop\src\assets\Romper with hearts.png" "rompers-onesies.jpg"
Copy-Item "C:\Users\John\Desktop\Ionic\baby-clothing-shop\src\assets\Pink Dress.png" "dresses-sets.jpg"
# ... continue for all files
```

### 4. Verify Upload

Check that your Supabase Storage structure looks like:
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

## Alternative: Update Schema to Match Your Files

If you prefer to keep your current filenames, you can update the database schema instead:

```sql
-- Update category images to match your current files
UPDATE categories SET image = 'assets/Romper with hearts.png' WHERE name = 'Rompers & Onesies';
UPDATE categories SET image = 'assets/Pink Dress.png' WHERE name = 'Dresses & Sets';
-- ... etc
```

However, using Supabase Storage with the renamed files is recommended for better performance and scalability.

## Quick Test

After uploading, test one image URL:
```
https://your-project-id.supabase.co/storage/v1/object/public/product-images/products/heart-romper.jpg
```

If it loads, you're all set! 🎉