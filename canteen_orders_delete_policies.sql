-- Canteen Orders Delete Policies
-- This adds RLS policies to allow canteen vendors to delete orders

-- Drop existing delete policies if they exist
DROP POLICY IF EXISTS "Canteen vendors can delete orders" ON canteen_orders;
DROP POLICY IF EXISTS "Super admins can delete any order" ON canteen_orders;

-- Policy: Canteen vendors can delete delivered or cancelled orders
CREATE POLICY "Canteen vendors can delete orders" ON canteen_orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'canteen_vendor'
    )
    AND (status = 'delivered' OR status = 'cancelled')
  );

-- Policy: Super admins can delete any order
CREATE POLICY "Super admins can delete any order" ON canteen_orders
  FOR DELETE USING (
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
WHERE tablename = 'canteen_orders' 
AND cmd = 'DELETE'; 