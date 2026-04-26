-- Admin Setup Script
-- This script ensures the products and categories tables have the correct RLS policies
-- so that authenticated admin users can perform CRUD operations.

-- 1. Enable RLS on products and categories
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access for products" ON products;
DROP POLICY IF EXISTS "Allow admin CRUD for products" ON products;
DROP POLICY IF EXISTS "Allow public read access for categories" ON categories;
DROP POLICY IF EXISTS "Allow admin CRUD for categories" ON categories;

-- 3. Products Policies
-- Allow anyone (including anonymous users) to view products
CREATE POLICY "Allow public read access for products" ON products
  FOR SELECT USING (true);

-- Allow only authenticated users to INSERT, UPDATE, DELETE products
-- In a real app, you'd check for a specific 'admin' role, but for this demo
-- we'll allow any authenticated user (which is only our admin account)
CREATE POLICY "Allow admin CRUD for products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Categories Policies
-- Allow anyone to view categories
CREATE POLICY "Allow public read access for categories" ON categories
  FOR SELECT USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Allow admin CRUD for categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Success Message
DO $$
BEGIN
  RAISE NOTICE 'Admin RLS policies established successfully!';
  RAISE NOTICE 'Authenticated users can now manage products and categories.';
END $$;
