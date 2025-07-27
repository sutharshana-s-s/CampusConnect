# Messaging System Database Setup

This guide will help you set up the database tables needed for the messaging system in Supabase.

## Database Tables

### 1. Conversations Table

Create a new table called `conversations` with the following structure:

```sql
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
  item_title TEXT NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0
);
```

### 2. Messages Table

Create a new table called `messages` with the following structure:

```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);
```

## Row Level Security (RLS) Policies

### Conversations Table Policies

```sql
-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view conversations they're part of
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
  );

-- Policy: Users can insert conversations
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = buyer_id
  );

-- Policy: Users can update conversations they're part of
CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
  );
```

### Messages Table Policies

```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages in conversations they're part of
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
    )
  );

-- Policy: Users can insert messages
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

-- Policy: Users can update messages they sent
CREATE POLICY "Users can update their messages" ON messages
  FOR UPDATE USING (
    auth.uid() = sender_id
  );
```

## Indexes for Performance

```sql
-- Index for faster conversation lookups
CREATE INDEX idx_conversations_buyer_seller ON conversations(buyer_id, seller_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- Index for faster message lookups
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

## Features Implemented

### ✅ Complete Messaging System

1. **Messages Page** (`/messages`)
   - View all conversations
   - Search conversations
   - Real-time chat interface
   - Message history

2. **Contact Seller Modal**
   - Multiple contact options
   - Direct messaging
   - Email integration
   - Copy seller ID

3. **Redux State Management**
   - Conversations management
   - Messages management
   - Real-time updates
   - Error handling

4. **Database Integration**
   - Supabase tables
   - Row Level Security
   - Real-time subscriptions
   - Optimized queries

## Usage

### For Buyers:
1. Browse marketplace items
2. Click "Contact Seller" on any item
3. Choose contact method or send direct message
4. View all conversations in Messages page

### For Sellers:
1. Receive messages from buyers
2. Reply through Messages page
3. Manage multiple conversations
4. Track item inquiries

## Navigation

The Messages page is accessible through:
- Sidebar navigation (MessageSquare icon)
- Direct URL: `/messages`
- After sending a message through contact modal

## Security Features

- **Row Level Security**: Users can only access their own conversations
- **Authentication Required**: Only logged-in users can send/receive messages
- **Data Validation**: All inputs are validated before database operations
- **Error Handling**: Comprehensive error handling and user feedback

## Future Enhancements

- Real-time notifications
- File/image sharing
- Message status indicators
- Conversation archiving
- Block user functionality
- Message search within conversations 