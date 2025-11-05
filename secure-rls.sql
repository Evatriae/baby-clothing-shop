-- Re-enable RLS with proper policies
-- Run this in your Supabase SQL Editor to secure your database

-- Drop existing policies first
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for service role and trigger" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Re-enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create secure policies that allow the trigger to work
CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role and trigger" ON profiles
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    auth.uid() = id
  );

CREATE POLICY "Enable update for users based on id" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" ON profiles
  FOR DELETE USING (auth.uid() = id);