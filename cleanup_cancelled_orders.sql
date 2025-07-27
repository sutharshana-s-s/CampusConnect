-- Cleanup Cancelled Orders
-- This script removes all cancelled orders from the canteen_orders table

-- First, let's see how many cancelled orders exist
SELECT 
  COUNT(*) as cancelled_orders_count,
  MIN(created_at) as oldest_cancelled,
  MAX(created_at) as newest_cancelled
FROM canteen_orders 
WHERE status = 'cancelled';

-- Delete all cancelled orders
DELETE FROM canteen_orders 
WHERE status = 'cancelled';

-- Verify the cleanup
SELECT 
  status,
  COUNT(*) as count
FROM canteen_orders 
GROUP BY status
ORDER BY count DESC;

-- Show remaining orders
SELECT 
  COUNT(*) as total_remaining_orders
FROM canteen_orders; 