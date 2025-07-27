import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  item_id: string;
  item_title: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  messages: Message[];
}

interface MessagesState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages (
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          is_read
        )
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ 
    conversationId, 
    senderId, 
    receiverId, 
    content 
  }: {
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        is_read: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation's last message and timestamp
    await supabase
      .from('conversations')
      .update({
        last_message: content,
        last_message_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return data;
  }
);

export const createConversation = createAsyncThunk(
  'messages/createConversation',
  async ({ 
    itemId, 
    itemTitle, 
    buyerId, 
    sellerId,
    initialMessage 
  }: {
    itemId: string;
    itemTitle: string;
    buyerId: string;
    sellerId: string;
    initialMessage: string;
  }) => {
    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        item_id: itemId,
        item_title: itemTitle,
        buyer_id: buyerId,
        seller_id: sellerId,
        last_message: initialMessage,
        last_message_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (convError) throw convError;

    // Create initial message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: buyerId,
        receiver_id: sellerId,
        content: initialMessage,
        is_read: false,
      })
      .select()
      .single();

    if (msgError) throw msgError;

    return { conversation, message };
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentConversation) {
        state.currentConversation.messages.push(action.payload);
      }
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unread_count = 0;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentConversation) {
          state.currentConversation.messages = action.payload;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.currentConversation) {
          state.currentConversation.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to send message';
      })
      // Create conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload.conversation);
        state.currentConversation = action.payload.conversation;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create conversation';
      });
  },
});

export const { 
  setCurrentConversation, 
  addMessage, 
  markConversationAsRead, 
  clearError 
} = messagesSlice.actions;

export default messagesSlice.reducer; 