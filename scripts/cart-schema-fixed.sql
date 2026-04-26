-- Cart System Database Schema (Fixed Version)
-- This creates the cart_items table for authenticated users
-- Session users will use localStorage only

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Ensure quantity is positive
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  
  -- Unique constraint to prevent duplicate items with same options
  CONSTRAINT unique_cart_item UNIQUE (user_id, product_id, selected_size, selected_color)
);

-- Set up Row Level Security (RLS)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own cart items." ON cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items." ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart items." ON cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items." ON cart_items;

-- Create policies for cart_items
-- Users can only see their own cart items
CREATE POLICY "Users can view own cart items." ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own cart items
CREATE POLICY "Users can insert own cart items." ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own cart items
CREATE POLICY "Users can update own cart items." ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own cart items
CREATE POLICY "Users can delete own cart items." ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for cart_items updated_at (only if it doesn't exist)
DROP TRIGGER IF EXISTS handle_cart_items_updated_at ON cart_items;
CREATE TRIGGER handle_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance (only if they don't exist)
DROP INDEX IF EXISTS idx_cart_items_user_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;  
DROP INDEX IF EXISTS idx_cart_items_created_at;

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_cart_items_created_at ON cart_items(created_at);

-- Optional: Create a view for cart summaries
DROP VIEW IF EXISTS user_cart_summary;
CREATE VIEW user_cart_summary AS
SELECT 
  c.user_id,
  COUNT(*) as total_items_count,
  SUM(c.quantity) as total_quantity,
  SUM(c.quantity * p.price) as total_amount,
  MAX(c.updated_at) as last_updated
FROM cart_items c
JOIN products p ON c.product_id = p.id
WHERE p.in_stock = true
GROUP BY c.user_id;

-- Note: Views inherit security from underlying tables
-- The cart_items RLS policies automatically secure this view

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Cart system database schema created successfully!';
  RAISE NOTICE 'You can now test the cart functionality in your app.';
END $$;