-- Canteen Orders RLS Setup
-- This file sets up Row Level Security policies for the canteen_orders table

-- Enable RLS on canteen_orders table
ALTER TABLE canteen_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own orders" ON canteen_orders;
DROP POLICY IF EXISTS "Canteen vendors can view all orders" ON canteen_orders;
DROP POLICY IF EXISTS "Users can create orders" ON canteen_orders;
DROP POLICY IF EXISTS "Canteen vendors can update order status" ON canteen_orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON canteen_orders;

-- Policy: Students can view their own orders
CREATE POLICY "Users can view their own orders" ON canteen_orders
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Policy: Canteen vendors can view all orders
CREATE POLICY "Canteen vendors can view all orders" ON canteen_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'canteen_vendor'
    )
  );

-- Policy: Super admins can view all orders
CREATE POLICY "Super admins can view all orders" ON canteen_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Policy: Users can create their own orders
CREATE POLICY "Users can create orders" ON canteen_orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Policy: Canteen vendors can update order status
CREATE POLICY "Canteen vendors can update order status" ON canteen_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'canteen_vendor'
    )
  );

-- Policy: Super admins can update any order
CREATE POLICY "Super admins can update any order" ON canteen_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Policy: Users can update their own orders (for cancellation)
CREATE POLICY "Users can update their own orders" ON canteen_orders
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Enable realtime for canteen_orders table
ALTER PUBLICATION supabase_realtime ADD TABLE canteen_orders; 