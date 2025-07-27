import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageSquare, Send, User, Clock, Search, Filter } from 'lucide-react';
import type { RootState, AppDispatch } from '../store/store';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage, 
  setCurrentConversation,
  markConversationAsRead 
} from '../store/slices/messagesSlice';
import { useRealtimeMessaging } from '../hooks/useRealtimeMessaging';
import TypingIndicator from '../components/Messages/TypingIndicator';
import OnlineStatusIndicator from '../components/Messages/OnlineStatusIndicator';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeIn} 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const HeaderSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  line-height: 1.5;
  
  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
`;

const SearchContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const MessagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;
  }
`;

const ConversationsList = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`;

const ConversationsHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
`;

const ConversationsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ConversationItem = styled.div<{ $isActive: boolean }>`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$isActive ? `
    background-color: ${props.theme.isDark ? '#334155' : '#f8fafc'};
    border-left: 3px solid #8b5cf6;
  ` : `
    &:hover {
      background-color: ${props.theme.isDark ? '#475569' : '#f1f5f9'};
    }
  `}
`;

const ConversationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const ConversationAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConversationTime = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin-top: 0.125rem;
`;

const ConversationPreview = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 600px;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ChatAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ChatInfo = styled.div`
  flex: 1;
`;

const ChatName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

const ChatStatus = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin-top: 0.125rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div<{ $isOwn: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.4;
  
  ${props => props.$isOwn ? `
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 0.25rem;
  ` : `
    background-color: ${props.theme.isDark ? '#475569' : '#f1f5f9'};
    color: ${props.theme.colors.text};
    align-self: flex-start;
    border-bottom-left-radius: 0.25rem;
  `}
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
  text-align: right;
`;

const ChatInput = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 0.75rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendIcon = styled(Send)`
  width: 1.25rem;
  height: 1.25rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled(MessageSquare)`
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;



const Messages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { conversations, currentConversation, loading, error } = useSelector((state: RootState) => state.messages);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  // Real-time messaging hook
  const { 
    isUserOnline, 
    typingUsers, 
    handleTypingChange 
  } = useRealtimeMessaging();
  
  // Auto-scroll to bottom when new messages arrive
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations when component mounts
  useEffect(() => {
    if (user) {
      dispatch(fetchConversations(user.id));
    }
  }, [dispatch, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const filteredConversations = conversations.filter(conv => {
    const otherUserId = conv.buyer_id === user?.id ? conv.seller_id : conv.buyer_id;
    const otherUserName = otherUserId?.slice(0, 8) || 'Unknown';
    return (
      otherUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.item_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentConversation || !user) return;

    // Stop typing indicator
    handleTypingChange(currentConversation.id, false);

    dispatch(sendMessage({
      conversationId: currentConversation.id,
      senderId: user.id,
      receiverId: currentConversation.buyer_id === user.id ? currentConversation.seller_id : currentConversation.buyer_id,
      content: newMessage
    }));

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Update typing indicator
    if (currentConversation) {
      handleTypingChange(currentConversation.id, value.length > 0);
    }
  };

  const handleConversationSelect = (conversation: any) => {
    dispatch(setCurrentConversation(conversation));
    dispatch(fetchMessages(conversation.id));
    dispatch(markConversationAsRead(conversation.id));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <EmptyState>
        <EmptyIcon />
        <EmptyTitle>Please log in to view messages</EmptyTitle>
        <EmptyText>You need to be logged in to access your conversations.</EmptyText>
      </EmptyState>
    );
  }

  if (loading) {
    return (
      <EmptyState>
        <EmptyIcon />
        <EmptyTitle>Loading conversations...</EmptyTitle>
        <EmptyText>Please wait while we fetch your messages.</EmptyText>
      </EmptyState>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <EmptyIcon />
        <EmptyTitle>Error loading messages</EmptyTitle>
        <EmptyText>{error}</EmptyText>
      </EmptyState>
    );
  }

  return (
    <MessagesContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle>Messages</HeaderTitle>
          <HeaderSubtitle>Chat with sellers and buyers</HeaderSubtitle>
        </HeaderContent>
      </Header>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </SearchContainer>

      <MessagesGrid>
        <ConversationsList>
          <ConversationsHeader>
            <ConversationsTitle>Conversations ({filteredConversations.length})</ConversationsTitle>
          </ConversationsHeader>
          
          {filteredConversations.length === 0 ? (
            <EmptyState>
              <EmptyIcon />
              <EmptyTitle>No conversations yet</EmptyTitle>
              <EmptyText>Start a conversation by contacting a seller in the marketplace.</EmptyText>
            </EmptyState>
          ) : (
            <>
              {filteredConversations.map(conversation => {
                const otherUserId = conversation.buyer_id === user?.id ? conversation.seller_id : conversation.buyer_id;
                const otherUserName = otherUserId?.slice(0, 8) || 'Unknown';
                
                return (
                  <ConversationItem
                    key={conversation.id}
                    $isActive={currentConversation?.id === conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <ConversationHeader>
                      <ConversationAvatar>
                        {otherUserName.slice(0, 2).toUpperCase()}
                      </ConversationAvatar>
                                        <ConversationInfo>
                    <ConversationName>{otherUserName}</ConversationName>
                    <ConversationTime>{formatTime(conversation.last_message_time || conversation.updated_at)}</ConversationTime>
                    <OnlineStatusIndicator 
                      isOnline={isUserOnline(otherUserId)} 
                      showText={false} 
                      size="small" 
                    />
                  </ConversationInfo>
                    </ConversationHeader>
                    <ConversationPreview>{conversation.item_title}</ConversationPreview>
                  </ConversationItem>
                );
              })}
            </>
          )}
        </ConversationsList>

        {currentConversation ? (
          <ChatContainer>
            <ChatHeader>
              <ChatAvatar>
                {(currentConversation.buyer_id === user?.id ? currentConversation.seller_id : currentConversation.buyer_id)?.slice(0, 2).toUpperCase()}
              </ChatAvatar>
              <ChatInfo>
                <ChatName>{(currentConversation.buyer_id === user?.id ? currentConversation.seller_id : currentConversation.buyer_id)?.slice(0, 8)}</ChatName>
                <ChatStatus>
                  About: {currentConversation.item_title}
                  <OnlineStatusIndicator 
                    isOnline={isUserOnline(currentConversation.buyer_id === user?.id ? currentConversation.seller_id : currentConversation.buyer_id)} 
                    showText={true} 
                    size="small" 
                  />
                </ChatStatus>
              </ChatInfo>
            </ChatHeader>

            <ChatMessages>
              {currentConversation.messages?.map(message => (
                <MessageBubble key={message.id} $isOwn={message.sender_id === user?.id}>
                  {message.content}
                  <MessageTime>
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </MessageTime>
                </MessageBubble>
              ))}
              
              {/* Typing indicators */}
              {typingUsers.map((typingUser, index) => (
                <TypingIndicator 
                  key={`typing-${index}`} 
                  userName={(currentConversation.buyer_id === user?.id ? currentConversation.seller_id : currentConversation.buyer_id)?.slice(0, 8) || 'Someone'} 
                />
              ))}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </ChatMessages>

            <ChatInput>
              <MessageInput
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
              />
              <SendButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <SendIcon />
              </SendButton>
            </ChatInput>
          </ChatContainer>
        ) : (
          <EmptyState>
            <EmptyIcon />
            <EmptyTitle>No conversation selected</EmptyTitle>
            <EmptyText>Choose a conversation from the list to start chatting.</EmptyText>
          </EmptyState>
        )}
      </MessagesGrid>
    </MessagesContainer>
  );
};

export default Messages; 