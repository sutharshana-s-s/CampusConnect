import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { supabase, subscribeToMessages, subscribeToConversations, subscribeToUserStatus, updateUserStatus, markMessageAsRead, getOnlineUsers } from '../lib/supabase';
import { addMessage, setCurrentConversation } from '../store/slices/messagesSlice';
import type { RootState, AppDispatch } from '../store/store';
import type { Message, Conversation } from '../store/slices/messagesSlice';

interface UserStatus {
  user_id: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
  is_typing?: boolean;
  typing_in_conversation?: string;
}

interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  conversationId: string;
}

export const useRealtimeMessaging = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentConversation } = useSelector((state: RootState) => state.messages);
  
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messageSubscriptionRef = useRef<any>();
  const conversationSubscriptionRef = useRef<any>();
  const statusSubscriptionRef = useRef<any>();

  // Update user status when component mounts/unmounts
  useEffect(() => {
    if (!user) return;

    // Debounce function to prevent rapid status updates
    let statusUpdateTimeout: NodeJS.Timeout;
    const debouncedStatusUpdate = (status: 'online' | 'offline' | 'away') => {
      clearTimeout(statusUpdateTimeout);
      statusUpdateTimeout = setTimeout(() => {
        updateUserStatus(user.id, status);
      }, 100);
    };

    // Set user as online
    debouncedStatusUpdate('online');

    // Fetch initial online users
    const fetchInitialOnlineUsers = async () => {
      try {
        const onlineUserIds = await getOnlineUsers();
        setOnlineUsers(new Set(onlineUserIds));
        console.log('Initial online users:', onlineUserIds); // Debug log
      } catch (error) {
        console.error('Error fetching initial online users:', error);
      }
    };

    fetchInitialOnlineUsers();

    // Set up online status tracking
    const handleOnline = () => debouncedStatusUpdate('online');
    const handleOffline = () => debouncedStatusUpdate('offline');
    const handleBeforeUnload = () => updateUserStatus(user.id, 'offline'); // Immediate for beforeunload

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Subscribe to user status changes
    statusSubscriptionRef.current = subscribeToUserStatus(user.id, (payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        const status: UserStatus = payload.new;
        console.log('Status update received:', status); // Debug log
        
        if (status.status === 'online') {
          setOnlineUsers(prev => new Set(prev).add(status.user_id));
        } else {
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(status.user_id);
            return newSet;
          });
        }
      }
    });

    return () => {
      clearTimeout(statusUpdateTimeout);
      updateUserStatus(user.id, 'offline');
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (statusSubscriptionRef.current) {
        supabase.removeChannel(statusSubscriptionRef.current);
      }
    };
  }, [user]);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!user) return;

    conversationSubscriptionRef.current = subscribeToConversations(user.id, (payload) => {
      if (payload.eventType === 'UPDATE') {
        // Handle conversation updates (new messages, read status, etc.)
        const conversation: Conversation = payload.new;
        if (currentConversation?.id === conversation.id) {
          dispatch(setCurrentConversation(conversation));
        }
      }
    });

    return () => {
      if (conversationSubscriptionRef.current) {
        supabase.removeChannel(conversationSubscriptionRef.current);
      }
    };
  }, [user, currentConversation, dispatch]);

  // Subscribe to messages in current conversation
  useEffect(() => {
    if (!currentConversation) return;

    messageSubscriptionRef.current = subscribeToMessages(currentConversation.id, (message: Message) => {
      // Add new message to current conversation
      dispatch(addMessage(message));
      
      // Mark message as read if we're the receiver
      if (message.receiver_id === user?.id) {
        markMessageAsRead(message.id);
      }
    });

    return () => {
      if (messageSubscriptionRef.current) {
        supabase.removeChannel(messageSubscriptionRef.current);
      }
    };
  }, [currentConversation, user, dispatch]);

  // Handle typing indicators
  const handleTypingStart = useCallback(async (conversationId: string) => {
    if (!user || !conversationId) return;
    
    setIsTyping(true);
    await updateUserStatus(user.id, 'online', true, conversationId);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [user]);

  const handleTypingStop = useCallback(async (conversationId: string) => {
    if (!user || !conversationId) return;
    
    setIsTyping(false);
    await updateUserStatus(user.id, 'online', false, undefined);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [user]);

  const handleTypingChange = useCallback((conversationId: string, isTyping: boolean) => {
    if (isTyping) {
      handleTypingStart(conversationId);
    } else {
      // Add delay before stopping typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        handleTypingStop(conversationId);
      }, 1000);
    }
  }, [handleTypingStart, handleTypingStop]);

  // Check if user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Get typing indicators for current conversation
  const getTypingIndicators = useCallback(() => {
    if (!currentConversation) return [];
    
    return typingUsers.filter(
      indicator => 
        indicator.conversationId === currentConversation.id && 
        indicator.userId !== user?.id
    );
  }, [currentConversation, typingUsers, user]);

  return {
    isUserOnline,
    isTyping,
    typingUsers: getTypingIndicators(),
    handleTypingChange,
    handleTypingStart,
    handleTypingStop
  };
}; 