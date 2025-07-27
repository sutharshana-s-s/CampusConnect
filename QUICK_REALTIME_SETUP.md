# Quick Real-time Setup Guide

This is a simplified setup guide for the essential real-time messaging features.

## Essential Database Setup

### 1. Create User Status Table

```sql
-- Create the user_status table
CREATE TABLE user_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('online', 'offline', 'away')) DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_typing BOOLEAN DEFAULT FALSE,
  typing_in_conversation UUID REFERENCES conversations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint
CREATE UNIQUE INDEX idx_user_status_user_id ON user_status(user_id);
```

### 2. Enable Row Level Security

```sql
-- Enable RLS
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;

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

### 3. Enable Realtime

```sql
-- Enable realtime for all messaging tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE user_status;
```

### 4. Create Status Management Function

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
```

## What This Enables

✅ **Real-time messaging** - Live message delivery
✅ **Typing indicators** - See when someone is typing  
✅ **Online status** - Real-time online/offline status
✅ **Auto-scroll** - Smooth message navigation

## Testing the Setup

1. **Start your app** - The real-time features should work immediately
2. **Open two browser windows** - Log in with different users
3. **Start a conversation** - Contact a seller through marketplace
4. **Test real-time features**:
   - Send messages (should appear instantly)
   - Type in the message box (should show typing indicator)
   - Check online status (green dots should appear)

## Manual Cleanup (Optional)

If you want to manually clean up inactive users:

```sql
-- Create cleanup function
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

-- Run manually when needed
SELECT cleanup_inactive_users();
```

## Troubleshooting

### Common Issues:

1. **"schema cron does not exist"** - This is normal, the cron extension isn't needed for basic functionality
2. **Messages not appearing in real-time** - Check if realtime is enabled for the messages table
3. **Typing indicators not working** - Verify user_status table exists and has correct permissions

### Quick Fixes:

```sql
-- Check if realtime is enabled
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Check user status
SELECT * FROM user_status WHERE user_id = 'your-user-id';

-- Manually cleanup inactive users
SELECT cleanup_inactive_users();
```

That's it! Your real-time messaging should now be fully functional! 🚀 