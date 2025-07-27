# Real-time Setup Diagnostic

Run these queries to check your current setup and identify what needs to be configured.

## 1. Check if Tables Exist

```sql
-- Check if user_status table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_status'
) as user_status_exists;

-- Check if conversations table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'conversations'
) as conversations_exists;

-- Check if messages table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'messages'
) as messages_exists;
```

## 2. Check Table Structure

```sql
-- Check user_status table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_status' 
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_status';
```

## 3. Check RLS Policies

```sql
-- Check existing policies on user_status
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_status';
```

## 4. Check Realtime Configuration

```sql
-- Check if tables are enabled for realtime
SELECT schemaname, tablename, pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('user_status', 'conversations', 'messages');
```

## 5. Check Functions

```sql
-- Check if update_user_status function exists
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name = 'update_user_status';

-- Check if cleanup_inactive_users function exists
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name = 'cleanup_inactive_users';
```

## 6. Test Data

```sql
-- Check if there's any data in user_status
SELECT COUNT(*) as user_status_count FROM user_status;

-- Check if there are any conversations
SELECT COUNT(*) as conversations_count FROM conversations;

-- Check if there are any messages
SELECT COUNT(*) as messages_count FROM messages;
```

## Quick Fix Commands

Based on the results above, run these commands for any missing pieces:

### If RLS is not enabled:
```sql
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
```

### If RLS policies are missing:
```sql
-- Policy: Users can view relevant status
CREATE POLICY "Users can view relevant status" ON user_status
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
      AND (conversations.buyer_id = user_status.user_id OR conversations.seller_id = user_status.user_id)
    )
  );

-- Policy: Users can update their own status
CREATE POLICY "Users can update their status" ON user_status
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can insert their own status
CREATE POLICY "Users can insert their status" ON user_status
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### If realtime is not enabled:
```sql
-- Enable realtime for all messaging tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE user_status;
```

### If functions are missing:
```sql
-- Function to update user status
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

-- Function to cleanup inactive users
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
```

## Test Real-time Features

Once everything is set up, test with:

```sql
-- Insert a test user status
SELECT update_user_status('your-user-id', 'online');

-- Check the status
SELECT * FROM user_status WHERE user_id = 'your-user-id';

-- Cleanup test data
SELECT cleanup_inactive_users();
```

Run these diagnostic queries and let me know the results! This will help us identify exactly what needs to be configured. 🚀 