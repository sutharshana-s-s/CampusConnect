-- Debug canteen orders count issue

-- 1. Check if canteen_orders table exists and has data
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
FROM canteen_orders;

-- 2. Check RLS policies on canteen_orders table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'canteen_orders';

-- 3. Check if RLS is enabled on canteen_orders
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'canteen_orders';

-- 4. Test the exact query that the dashboard is using
-- This simulates what the frontend is doing
SELECT COUNT(*) as order_count
FROM canteen_orders;

-- 5. Check current user context (if authenticated)
SELECT current_user, session_user;

-- 6. Check if there are any specific RLS policies that might be blocking access
SELECT 
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'canteen_orders' 
  AND (qual IS NOT NULL OR with_check IS NOT NULL);

-- 7. Test with different user roles (if possible)
-- This would need to be run as different authenticated users 