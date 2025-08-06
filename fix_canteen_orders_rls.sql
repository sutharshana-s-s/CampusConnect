-- Fix RLS policies for canteen_orders to allow dashboard stats

-- 1. First, let's check current RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'canteen_orders';

-- 2. Drop existing policies if they're too restrictive
DROP POLICY IF EXISTS "Users can view their own orders" ON canteen_orders;
DROP POLICY IF EXISTS "Vendors can view all orders" ON canteen_orders;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON canteen_orders;

-- 3. Create more permissive policies for dashboard stats
-- Allow all authenticated users to read canteen_orders for stats
CREATE POLICY "Enable read access for dashboard stats" ON canteen_orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert their own orders" ON canteen_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own orders
CREATE POLICY "Users can update their own orders" ON canteen_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow vendors to update order status
CREATE POLICY "Vendors can update order status" ON canteen_orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'canteen_vendor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'canteen_vendor'
    )
  );

-- 4. Verify the policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'canteen_orders';

-- 5. Test the count query
SELECT COUNT(*) as total_orders FROM canteen_orders; 