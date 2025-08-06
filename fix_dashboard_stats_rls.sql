-- Fix RLS policies for dashboard stats

-- 1. Add a policy specifically for dashboard stats that allows all authenticated users to read
-- This is needed because the dashboard needs to count all orders for statistics
CREATE POLICY "Dashboard stats can read all orders" ON canteen_orders
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. Verify the new policy was created
SELECT 
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'canteen_orders' 
  AND policyname = 'Dashboard stats can read all orders';

-- 3. Test the count query again
SELECT COUNT(*) as total_orders FROM canteen_orders;

-- 4. Show all policies for canteen_orders
SELECT 
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'canteen_orders'
ORDER BY cmd, policyname; 