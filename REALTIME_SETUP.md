# Real-time Messaging Setup Guide

This guide will help you set up the real-time messaging features including live chat, typing indicators, and online status.

## Database Tables

### 1. User Status Table

Create a new table called `user_status` for tracking online status and typing indicators:

```sql
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

-- Create unique constraint on user_id
CREATE UNIQUE INDEX idx_user_status_user_id ON user_status(user_id);
```

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own status and status of users they're chatting with
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

### 3. Enable Realtime for Tables

Enable realtime for the messaging tables:

```sql
-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for conversations table
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Enable realtime for user_status table
ALTER PUBLICATION supabase_realtime ADD TABLE user_status;
```

### 4. Create Functions for Status Management

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

-- Function to mark user as offline
CREATE OR REPLACE FUNCTION mark_user_offline(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_status 
  SET status = 'offline', is_typing = FALSE, typing_in_conversation = NULL, updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;
```

### 5. Create Triggers for Automatic Status Updates

```sql
-- Trigger to automatically mark users as offline after inactivity
CREATE OR REPLACE FUNCTION check_user_activity()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_status 
  SET status = 'offline', is_typing = FALSE, typing_in_conversation = NULL
  WHERE last_seen < NOW() - INTERVAL '5 minutes' AND status = 'online';
END;
$$;

-- Option 1: If you have the pg_cron extension enabled
-- First enable the extension (requires admin access)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Then create a cron job to run this function every minute
-- SELECT cron.schedule(
--   'check-user-activity',
--   '* * * * *',
--   'SELECT check_user_activity();'
-- );

-- Option 2: Manual cleanup (recommended for most users)
-- You can run this manually or set up a simple cleanup function
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

## Features Implemented

### ✅ Real-time Messaging

1. **Live Message Updates**
   - Messages appear instantly without page refresh
   - Real-time synchronization across all devices
   - Automatic message delivery confirmation

2. **Typing Indicators**
   - Shows when someone is typing
   - Real-time typing status updates
   - Automatic timeout after 1 second of inactivity

3. **Online Status**
   - Real-time online/offline status
   - Automatic status updates based on user activity
   - Visual indicators in chat and conversation lists

### ✅ Enhanced User Experience

1. **Auto-scroll**
   - Automatically scrolls to new messages
   - Smooth scrolling animation
   - Maintains scroll position when typing

2. **Visual Feedback**
   - Animated typing indicators
   - Pulsing online status dots
   - Real-time status updates

3. **Performance Optimizations**
   - Efficient real-time subscriptions
   - Automatic cleanup of subscriptions
   - Optimized database queries

## Usage

### For Users:

1. **Start a Conversation**
   - Contact a seller through the marketplace
   - Real-time messaging begins immediately

2. **See Online Status**
   - Green dot indicates user is online
   - Gray dot indicates user is offline
   - Status updates in real-time

3. **Typing Indicators**
   - See when someone is typing
   - Your typing status is shown to others
   - Automatic timeout after stopping

### For Developers:

1. **Real-time Subscriptions**
   ```typescript
   const { isUserOnline, typingUsers, handleTypingChange } = useRealtimeMessaging();
   ```

2. **Status Management**
   ```typescript
   // Update user status
   await updateUserStatus(userId, 'online', true, conversationId);
   ```

3. **Typing Indicators**
   ```typescript
   // Start typing
   handleTypingChange(conversationId, true);
   
   // Stop typing
   handleTypingChange(conversationId, false);
   ```

## Security Features

- **Row Level Security**: Users can only see relevant status information
- **Authentication Required**: All real-time features require user authentication
- **Data Validation**: All inputs are validated before database operations
- **Rate Limiting**: Built-in protection against spam and abuse

## Performance Considerations

- **Efficient Subscriptions**: Only subscribe to relevant data
- **Automatic Cleanup**: Subscriptions are cleaned up when components unmount
- **Optimized Queries**: Database queries are optimized for real-time updates
- **Connection Management**: Automatic reconnection handling

## Troubleshooting

### Common Issues:

1. **Messages not appearing in real-time**
   - Check if realtime is enabled for the messages table
   - Verify RLS policies are correctly configured
   - Check browser console for subscription errors

2. **Typing indicators not working**
   - Ensure user_status table exists and has correct permissions
   - Check if typing_in_conversation field is properly set
   - Verify realtime subscription is active

3. **Online status not updating**
   - Check if updateUserStatus function is being called
   - Verify user_status table has correct RLS policies
   - Check if realtime is enabled for user_status table

4. **Cron extension error**
   - The pg_cron extension is not enabled by default in Supabase
   - Use the manual cleanup function instead: `SELECT cleanup_inactive_users();`
   - Or enable pg_cron in your Supabase dashboard (requires admin access)

### Debug Commands:

```sql
-- Check if realtime is enabled
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Check user status
SELECT * FROM user_status WHERE user_id = 'your-user-id';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_status';

-- Manually cleanup inactive users (if cron is not available)
SELECT cleanup_inactive_users();

-- Check for inactive users
SELECT * FROM user_status WHERE last_seen < NOW() - INTERVAL '5 minutes' AND status = 'online';
```

## Future Enhancements

- **Push Notifications**: Browser notifications for new messages
- **Message Reactions**: Like, heart, and other reactions
- **File Sharing**: Send images and documents
- **Voice Messages**: Audio message support
- **Read Receipts**: Show when messages are read
- **Message Search**: Search within conversations 