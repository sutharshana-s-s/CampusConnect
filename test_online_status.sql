-- =====================================================
-- Test Online Status Functionality
-- =====================================================

-- 1. First, run this to get a user ID:
-- SELECT id, email FROM auth.users LIMIT 1;

-- 2. Copy the user ID from step 1 and replace 'YOUR-ACTUAL-USER-ID' below
-- Example: If the user ID is '123e4567-e89b-12d3-a456-426614174000'
-- Then use: SELECT update_user_status('123e4567-e89b-12d3-a456-426614174000', 'online');

-- Test the update_user_status function
-- SELECT update_user_status('YOUR-ACTUAL-USER-ID', 'online');

-- 3. Check if the status was updated (replace with your user ID)
-- SELECT * FROM user_status WHERE user_id = 'YOUR-ACTUAL-USER-ID';

-- 4. Test setting status to offline (replace with your user ID)
-- SELECT update_user_status('YOUR-ACTUAL-USER-ID', 'offline');

-- 5. Check the status again (replace with your user ID)
-- SELECT * FROM user_status WHERE user_id = 'YOUR-ACTUAL-USER-ID';

-- 6. Test setting status back to online (replace with your user ID)
-- SELECT update_user_status('YOUR-ACTUAL-USER-ID', 'online');

-- 7. Check final status (replace with your user ID)
-- SELECT * FROM user_status WHERE user_id = 'YOUR-ACTUAL-USER-ID';

-- 8. Test the getOnlineUsers function (this should return the user ID)
SELECT user_id FROM user_status WHERE status = 'online';

-- 9. Check RLS policies are working (run this as the authenticated user)
-- This should return the user's own status and status of users they're chatting with
SELECT * FROM user_status;

-- 10. Test cleanup function
SELECT cleanup_inactive_users();

-- 11. Check if any users were marked offline
SELECT * FROM user_status WHERE status = 'offline'; 