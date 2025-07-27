-- =====================================================
-- Debug Online Status Issues
-- =====================================================

-- 1. Check current user status data
SELECT 
    user_id,
    status,
    last_seen,
    is_typing,
    typing_in_conversation,
    created_at,
    updated_at
FROM user_status 
ORDER BY updated_at DESC;

-- 2. Check if there are any users in the system
SELECT 
    id,
    email,
    created_at
FROM auth.users 
LIMIT 5;

-- 3. Check if the update_user_status function is working
-- Replace 'your-actual-user-id' with a real user ID from step 2
-- SELECT update_user_status('your-actual-user-id', 'online');

-- 4. Check RLS policies are working
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_status';

-- 5. Test if you can insert/update status manually
-- Replace 'your-actual-user-id' with a real user ID
-- INSERT INTO user_status (user_id, status, last_seen) 
-- VALUES ('your-actual-user-id', 'online', NOW())
-- ON CONFLICT (user_id) 
-- DO UPDATE SET status = 'online', last_seen = NOW(), updated_at = NOW();

-- 6. Check if realtime is properly configured
SELECT 
    schemaname,
    tablename,
    pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'user_status';

-- 7. Check for any recent errors in the function
-- This will show if there are any issues with the function execution
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'update_user_status';

-- 8. Test the cleanup function to see if it's marking users offline
-- SELECT cleanup_inactive_users();

-- 9. Check if there are any conversations to test with
SELECT 
    id,
    buyer_id,
    seller_id,
    item_title,
    created_at
FROM conversations 
LIMIT 5; 