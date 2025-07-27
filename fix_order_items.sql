-- Fix Order Items Issue
-- This script addresses the problem where orders show item IDs instead of food names

-- Option 1: Clear all existing orders (RECOMMENDED for development)
-- This removes all orders so students can place new ones with proper item names
DELETE FROM canteen_orders;

-- Option 2: Update existing orders to use real item IDs (if you want to keep existing orders)
-- First, let's see what items we have available
-- SELECT id, name, price FROM canteen_items ORDER BY name;

-- Then update orders to use real item IDs (example - adjust based on your actual items)
-- UPDATE canteen_orders 
-- SET items = '[{"item_id": "real-item-id-1", "quantity": 1, "price": 10.00}, {"item_id": "real-item-id-2", "quantity": 2, "price": 15.00}]'
-- WHERE id = 'order-id-here';

-- Option 3: Add sample orders with real item IDs
-- First, get some real item IDs from canteen_items
-- INSERT INTO canteen_orders (user_id, items, total_amount, delivery_type, status) 
-- VALUES 
--   ('user-id-here', '[{"item_id": "real-item-id-1", "quantity": 1, "price": 10.00}]', 10.00, 'pickup', 'pending'),
--   ('user-id-here', '[{"item_id": "real-item-id-2", "quantity": 2, "price": 15.00}]', 30.00, 'pickup', 'confirmed');

-- Check current orders and their items
SELECT 
  id,
  user_id,
  items,
  status,
  created_at
FROM canteen_orders 
ORDER BY created_at DESC;

-- Check available menu items
SELECT 
  id,
  name,
  price,
  category
FROM canteen_items 
ORDER BY name; 