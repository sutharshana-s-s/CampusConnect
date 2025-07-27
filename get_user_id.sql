-- =====================================================
-- Get User ID for Testing
-- =====================================================

-- Get all users with their IDs
SELECT 
    id as user_id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- Or get just the first user
SELECT 
    id as user_id,
    email
FROM auth.users 
LIMIT 1; 