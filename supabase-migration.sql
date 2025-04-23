-- Create the inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Convert existing user_id values to UUID (if previously stored as text)
ALTER TABLE inventory
  ALTER COLUMN user_id TYPE uuid
  USING user_id::uuid;

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS inventory_user_id_idx ON inventory (user_id);

-- Set up Row Level Security (RLS) to restrict data access
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own inventory items
CREATE POLICY "Users can view their own inventory"
  ON inventory FOR SELECT
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own inventory items
CREATE POLICY "Users can insert their own inventory"
  ON inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own inventory items
CREATE POLICY "Users can update their own inventory"
  ON inventory FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own inventory items
CREATE POLICY "Users can delete their own inventory"
  ON inventory FOR DELETE
  USING (auth.uid() = user_id);

-- Add price column (numeric to handle currency properly)
ALTER TABLE inventory ADD COLUMN price NUMERIC(10, 2) DEFAULT 0;

-- Add condition column (using enum type for consistent values)
DO $$
BEGIN
  CREATE TYPE item_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS condition item_condition DEFAULT 'good';

-- Add description column
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Add purchase date column
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS purchase_date DATE;

-- Add category column 
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS category TEXT;

-- Add status column to track if item is sold or available
DO $$
BEGIN
  CREATE TYPE item_status AS ENUM ('available', 'pending', 'sold');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS status item_status DEFAULT 'available';