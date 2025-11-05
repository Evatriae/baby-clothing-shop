-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  description TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read access)
CREATE POLICY "Categories are viewable by everyone." ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert categories." ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update categories." ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete categories." ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone." ON products
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert products." ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update products." ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete products." ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for categories updated_at
CREATE TRIGGER handle_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create trigger for products updated_at
CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert sample categories
-- Updated to use correct Supabase Storage paths with proper extensions
INSERT INTO categories (name, image) VALUES
('Rompers & Onesies', 'categories/rompers-onesies.png'),
('Dresses & Sets', 'categories/dresses-sets.png'),
('Seasonal Collection', 'categories/seasonal-collection.png'),
('Essential Sets', 'categories/essential-sets.png');

-- Insert sample products
-- Updated to use correct Supabase Storage paths with proper extensions
INSERT INTO products (category_id, name, price, image, description, sizes, colors, featured) VALUES
-- Rompers & Onesies
((SELECT id FROM categories WHERE name = 'Rompers & Onesies'), 'Heart Romper', 24.99, 'products/heart-romper.png', 'Adorable romper with heart patterns. Made from 100% organic cotton, perfect for sensitive baby skin. Features snap closures for easy diaper changes.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Pink', 'White', 'Lavender'], true),
((SELECT id FROM categories WHERE name = 'Rompers & Onesies'), 'Striped Romper', 22.99, 'products/striped-romper.png', 'Classic striped design that never goes out of style. Soft, breathable fabric ensures all-day comfort. Easy-care machine washable.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Blue/White', 'Pink/White', 'Gray/White'], false),
((SELECT id FROM categories WHERE name = 'Rompers & Onesies'), 'Pink Romper', 26.99, 'products/pink-romper.png', 'Beautiful pink romper with delicate details. Premium quality fabric with a comfortable fit. Perfect for special occasions.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Pink', 'Rose', 'Coral'], true),

-- Dresses & Sets
((SELECT id FROM categories WHERE name = 'Dresses & Sets'), 'Pink Dress', 32.99, 'products/pink-dress.png', 'Elegant pink dress perfect for special occasions. Features beautiful embroidered details and a comfortable fit.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Pink', 'White', 'Lavender'], true),
((SELECT id FROM categories WHERE name = 'Dresses & Sets'), 'Flower Set', 34.99, 'products/flower-set.png', 'Complete flower-themed outfit set. Includes matching top and bottom with coordinating accessories.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Pink Floral', 'Blue Floral', 'Yellow Floral'], false),
((SELECT id FROM categories WHERE name = 'Dresses & Sets'), 'Chloe Set', 36.99, 'products/chloe-set.png', 'Premium designer-inspired set with attention to detail. High-quality materials and craftsmanship.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Blush', 'Ivory', 'Sage'], true),

-- Seasonal Collection
((SELECT id FROM categories WHERE name = 'Seasonal Collection'), 'Spring Flowers', 29.99, 'products/spring-flowers.png', 'Celebrate spring with this beautiful floral collection. Fresh colors and patterns perfect for the season.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Spring Bloom', 'Cherry Blossom', 'Tulip Pink'], false),
((SELECT id FROM categories WHERE name = 'Seasonal Collection'), 'Summer Bloom', 31.99, 'products/summer-bloom.png', 'Vibrant summer collection with bold floral prints. Lightweight fabric perfect for hot days.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Summer Pink', 'Sunshine Yellow', 'Ocean Blue'], true),

-- Essential Sets
((SELECT id FROM categories WHERE name = 'Essential Sets'), 'Chloe Essential', 27.99, 'products/chloe-essential.png', 'Essential everyday set with versatile styling. Mix and match pieces for different looks.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Natural', 'Stone', 'Cream'], false),
((SELECT id FROM categories WHERE name = 'Essential Sets'), 'Basic Hearts', 24.99, 'products/basic-hearts.png', 'Classic heart pattern basics that never go out of style. Perfect for building a capsule wardrobe.', ARRAY['0-3M', '3-6M', '6-9M', '9-12M'], ARRAY['Pink Hearts', 'Blue Hearts', 'Gray Hearts'], true);