-- Clear all items from canteen_items table
-- WARNING: This will delete ALL items from ALL vendors

-- Option 1: Delete all items (most destructive)
DELETE FROM canteen_items;

-- Option 2: Delete items for a specific vendor (safer)
-- Replace 'your-vendor-id-here' with the actual vendor ID
-- DELETE FROM canteen_items WHERE vendor_id = 'your-vendor-id-here';

-- Option 3: Delete items for multiple specific vendors
-- DELETE FROM canteen_items WHERE vendor_id IN ('vendor-id-1', 'vendor-id-2');

-- Option 4: Delete items older than a certain date
-- DELETE FROM canteen_items WHERE created_at < '2024-01-01';

-- Option 5: Delete only unavailable items
-- DELETE FROM canteen_items WHERE is_available = false;

-- Option 6: Delete items by category
-- DELETE FROM canteen_items WHERE category = 'dessert';

-- Verify the deletion
SELECT COUNT(*) as remaining_items FROM canteen_items;

-- Show remaining items (if any)
SELECT id, name, vendor_id, created_at FROM canteen_items ORDER BY created_at DESC LIMIT 10; 