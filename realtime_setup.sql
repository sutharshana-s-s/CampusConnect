-- =====================================================
-- Real-time Messaging Setup SQL File
-- =====================================================

-- =====================================================
-- 1. DIAGNOSTIC QUERIES - Run these first to check current state
-- =====================================================

-- Check if tables exist
SELECT 'user_status table exists:' as check_type,
       EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_status') as exists;

SELECT 'conversations table exists:' as check_type,
       EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversations') as exists;

SELECT 'messages table exists:' as check_type,
       EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') as exists;

-- Check user_status table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_status' 
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_status';

-- Check existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_status';

-- Check if tables are enabled for realtime
SELECT schemaname, tablename, pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('user_status', 'conversations', 'messages');

-- Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name IN ('update_user_status', 'cleanup_inactive_users');

-- Check data counts
SELECT 'user_status count:' as table_name, COUNT(*) as count FROM user_status
UNION ALL
SELECT 'conversations count:' as table_name, COUNT(*) as count FROM conversations
UNION ALL
SELECT 'messages count:' as table_name, COUNT(*) as count FROM messages;

-- =====================================================
-- 2. SETUP COMMANDS - Run these to configure real-time features
-- =====================================================

-- Create user_status table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS user_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('online', 'offline', 'away')) DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_typing BOOLEAN DEFAULT FALSE,
  typing_in_conversation UUID REFERENCES conversations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint (if it doesn't exist)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_status_user_id ON user_status(user_id);

-- Enable RLS on user_status table
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view relevant status" ON user_status;
DROP POLICY IF EXISTS "Users can update their status" ON user_status;
DROP POLICY IF EXISTS "Users can insert their status" ON user_status;

-- Create RLS policies
CREATE POLICY "Users can view relevant status" ON user_status
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
      AND (conversations.buyer_id = user_status.user_id OR conversations.seller_id = user_status.user_id)
    )
  );

CREATE POLICY "Users can update their status" ON user_status
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their status" ON user_status
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime for all messaging tables
-- Note: These commands will fail if tables are already added, which is fine
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already added to publication, ignore error
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already added to publication, ignore error
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE user_status;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already added to publication, ignore error
    END;
END $$;

-- Create or replace update_user_status function
CREATE OR REPLACE FUNCTION update_user_status(
  p_user_id UUID,
  p_status TEXT,
  p_is_typing BOOLEAN DEFAULT FALSE,
  p_typing_in_conversation UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_status (user_id, status, is_typing, typing_in_conversation, last_seen)
  VALUES (p_user_id, p_status, p_is_typing, p_typing_in_conversation, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    status = EXCLUDED.status,
    is_typing = EXCLUDED.is_typing,
    typing_in_conversation = EXCLUDED.typing_in_conversation,
    last_seen = EXCLUDED.last_seen,
    updated_at = NOW();
END;
$$;

-- Create or replace cleanup_inactive_users function
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_status 
  SET status = 'offline', is_typing = FALSE, typing_in_conversation = NULL, updated_at = NOW()
  WHERE last_seen < NOW() - INTERVAL '5 minutes' AND status = 'online';
END;
$$;

-- =====================================================
-- 3. VERIFICATION QUERIES - Run these to confirm setup
-- =====================================================

-- Verify RLS is enabled
SELECT 'RLS enabled on user_status:' as check_type,
       rowsecurity as enabled
FROM pg_tables 
WHERE tablename = 'user_status';

-- Verify RLS policies exist
SELECT 'RLS policies on user_status:' as check_type,
       COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'user_status';

-- Verify realtime is enabled
SELECT 'Realtime tables:' as check_type,
       COUNT(*) as table_count
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('user_status', 'conversations', 'messages');

-- Verify functions exist
SELECT 'Functions created:' as check_type,
       COUNT(*) as function_count
FROM information_schema.routines 
WHERE routine_name IN ('update_user_status', 'cleanup_inactive_users');

-- =====================================================
-- 4. TEST COMMANDS - Run these to test the setup
-- =====================================================

-- Test the update_user_status function (replace 'your-user-id' with actual user ID)
-- SELECT update_user_status('your-user-id', 'online');

-- Check the test status
-- SELECT * FROM user_status WHERE user_id = 'your-user-id';

-- Test cleanup function
-- SELECT cleanup_inactive_users();

-- =====================================================
-- 5. CLEANUP COMMANDS (Optional)
-- =====================================================

-- To remove all real-time setup (if needed):
-- DROP FUNCTION IF EXISTS update_user_status(UUID, TEXT, BOOLEAN, UUID);
-- DROP FUNCTION IF EXISTS cleanup_inactive_users();
-- DROP TABLE IF EXISTS user_status CASCADE;
-- ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS user_status;

-- =====================================================
-- END OF SETUP
-- ===================================================== 