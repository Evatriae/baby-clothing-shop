-- Quick fix: Update database to use existing local assets
-- This will make images load immediately while you prepare Supabase Storage

-- Update categories to use existing asset files
UPDATE categories SET image = 'assets/Romper with hearts.png' WHERE name = 'Rompers & Onesies';
UPDATE categories SET image = 'assets/Pink Dress.png' WHERE name = 'Dresses & Sets';
UPDATE categories SET image = 'assets/Flowers Sets.png' WHERE name = 'Seasonal Collection';
UPDATE categories SET image = 'assets/Chloe sets.png' WHERE name = 'Essential Sets';

-- Update products to use existing asset files
UPDATE products SET image = 'assets/Romper with hearts.png' WHERE name = 'Heart Romper';
UPDATE products SET image = 'assets/Romper with stripes.png' WHERE name = 'Striped Romper';
UPDATE products SET image = 'assets/pink.jpeg' WHERE name = 'Pink Romper';
UPDATE products SET image = 'assets/Pink Dress.png' WHERE name = 'Pink Dress';
UPDATE products SET image = 'assets/Flowers Sets.png' WHERE name = 'Flower Set';
UPDATE products SET image = 'assets/Chloe sets.png' WHERE name = 'Chloe Set';
UPDATE products SET image = 'assets/Flowers Sets.png' WHERE name = 'Spring Flowers';
UPDATE products SET image = 'assets/Pink with Flowers.png' WHERE name = 'Summer Bloom';
UPDATE products SET image = 'assets/Chloe sets.png' WHERE name = 'Chloe Essential';
UPDATE products SET image = 'assets/Romper with hearts.png' WHERE name = 'Basic Hearts';

-- Verify the updates
SELECT 'Categories:' as type, name, image FROM categories
UNION ALL
SELECT 'Products:' as type, name, image FROM products
ORDER BY type, name;