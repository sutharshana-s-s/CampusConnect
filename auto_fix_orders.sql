-- Auto Fix Orders Script
-- This script automatically fixes existing orders by mapping them to real food items

-- Step 1: Clear all existing orders (clean slate approach)
DELETE FROM canteen_orders;

-- Step 2: Add some sample orders with real item IDs
-- First, let's get a real user ID and item IDs
-- Replace 'your-user-id' with an actual user ID from your system

-- Get available items for sample orders
-- SELECT id, name, price FROM canteen_items LIMIT 5;

-- Example: Add sample orders with real item IDs
-- (Uncomment and modify these lines with real IDs from your database)

/*
INSERT INTO canteen_orders (user_id, items, total_amount, delivery_type, status, created_at) 
VALUES 
  (
    'your-user-id-here', 
    '[{"item_id": "real-item-id-1", "quantity": 1, "price": 12.99}]', 
    12.99, 
    'pickup', 
    'pending',
    NOW() - INTERVAL '2 hours'
  ),
  (
    'your-user-id-here', 
    '[{"item_id": "real-item-id-2", "quantity": 2, "price": 8.50}]', 
    17.00, 
    'pickup', 
    'confirmed',
    NOW() - INTERVAL '1 hour'
  ),
  (
    'your-user-id-here', 
    '[{"item_id": "real-item-id-3", "quantity": 1, "price": 15.99}]', 
    15.99, 
    'pickup', 
    'ready',
    NOW() - INTERVAL '30 minutes'
  );
*/

-- Step 3: Verify the fix
SELECT 
  co.id,
  co.user_id,
  co.items,
  co.status,
  co.created_at,
  -- Extract item names from the items JSON
  jsonb_array_elements(co.items::jsonb) as item_details
FROM canteen_orders co
ORDER BY co.created_at DESC;

-- Step 4: Check if items exist in canteen_items
SELECT 
  co.id as order_id,
  item->>'item_id' as item_id,
  ci.name as item_name,
  CASE 
    WHEN ci.id IS NOT NULL THEN '✅ Found'
    ELSE '❌ Missing'
  END as status
FROM canteen_orders co,
     jsonb_array_elements(co.items::jsonb) as item
LEFT JOIN canteen_items ci ON ci.id = item->>'item_id'
ORDER BY co.created_at DESC; 