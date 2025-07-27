-- Canteen Items RLS Policies
-- This sets up Row Level Security policies for the canteen_items table

-- Enable RLS on canteen_items table
ALTER TABLE canteen_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Vendors can view their own items" ON canteen_items;
DROP POLICY IF EXISTS "Students can view available items" ON canteen_items;
DROP POLICY IF EXISTS "Vendors can create their own items" ON canteen_items;
DROP POLICY IF EXISTS "Vendors can update their own items" ON canteen_items;
DROP POLICY IF EXISTS "Vendors can delete their own items" ON canteen_items;
DROP POLICY IF EXISTS "Super admins can manage all items" ON canteen_items;

-- Policy: Vendors can view their own items
CREATE POLICY "Vendors can view their own items" ON canteen_items
  FOR SELECT USING (
    auth.uid() = vendor_id
  );

-- Policy: Students can view available items (for ordering)
CREATE POLICY "Students can view available items" ON canteen_items
  FOR SELECT USING (
    is_available = true
  );

-- Policy: Vendors can create their own items
CREATE POLICY "Vendors can create their own items" ON canteen_items
  FOR INSERT WITH CHECK (
    auth.uid() = vendor_id
  );

-- Policy: Vendors can update their own items
CREATE POLICY "Vendors can update their own items" ON canteen_items
  FOR UPDATE USING (
    auth.uid() = vendor_id
  );

-- Policy: Vendors can delete their own items
CREATE POLICY "Vendors can delete their own items" ON canteen_items
  FOR DELETE USING (
    auth.uid() = vendor_id
  );

-- Policy: Super admins can manage all items
CREATE POLICY "Super admins can manage all items" ON canteen_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'canteen_items'
ORDER BY cmd, policyname; 