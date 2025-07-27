import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { createConversation } from '../../store/slices/messagesSlice';
import type { RootState, AppDispatch } from '../../store/store';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  itemId: string;
  itemTitle: string;
  currentUserId: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitleText = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#475569' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
`;

const CloseIcon = styled(X)`
  width: 1.5rem;
  height: 1.5rem;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const SellerInfo = styled.div`
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SellerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const SellerAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

const SellerDetails = styled.div`
  flex: 1;
`;

const SellerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

const SellerId = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ItemInfo = styled.div`
  background-color: ${props => props.theme.isDark ? '#1e293b' : '#f1f5f9'};
  border-radius: 0.5rem;
  padding: 0.75rem;
  border-left: 3px solid #8b5cf6;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const ContactOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ContactOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    border-color: #8b5cf6;
    background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  }
`;

const ContactIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  color: #8b5cf6;
`;

const ContactText = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;

const ContactDescription = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin-top: 0.125rem;
`;

const MessageForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  min-height: 6rem;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled(Send)`
  width: 1.25rem;
  height: 1.25rem;
`;

const ContactSellerModal: React.FC<ContactSellerModalProps> = ({ 
  isOpen, 
  onClose, 
  sellerId, 
  itemId,
  itemTitle,
  currentUserId 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      await dispatch(createConversation({
        itemId,
        itemTitle,
        buyerId: currentUserId,
        sellerId,
        initialMessage: message
      })).unwrap();
      
      toast.success('Message sent successfully!');
      setMessage('');
      onClose();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopySellerId = () => {
    navigator.clipboard.writeText(sellerId);
    toast.success('Seller ID copied to clipboard!');
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`Inquiry about: ${itemTitle}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in your item "${itemTitle}" on the student marketplace.\n\nPlease let me know if it's still available and we can discuss the details.\n\nThanks!`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <ModalTitleText>Contact Seller</ModalTitleText>
            <CloseButton onClick={onClose}>
              <CloseIcon />
            </CloseButton>
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <SellerInfo>
            <SellerHeader>
              <SellerAvatar>
                {sellerId?.slice(0, 2).toUpperCase() || 'SE'}
              </SellerAvatar>
              <SellerDetails>
                <SellerName>Seller</SellerName>
                <SellerId>ID: {sellerId?.slice(0, 8)}...</SellerId>
              </SellerDetails>
            </SellerHeader>
            <ItemInfo>
              <ItemTitle>Item: {itemTitle}</ItemTitle>
            </ItemInfo>
          </SellerInfo>

          <ContactOptions>
            <ContactOption onClick={handleCopySellerId}>
              <ContactIcon>
                <User />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Copy Seller ID</ContactLabel>
                <ContactDescription>Copy the seller's ID to contact them directly</ContactDescription>
              </ContactText>
            </ContactOption>

            <ContactOption onClick={handleEmailContact}>
              <ContactIcon>
                <Mail />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Send Email</ContactLabel>
                <ContactDescription>Open your email client with a pre-filled message</ContactDescription>
              </ContactText>
            </ContactOption>
          </ContactOptions>

          <MessageForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Send a Direct Message</FormLabel>
              <FormTextarea
                placeholder="Hi! I'm interested in your item. Is it still available? What's the best way to meet up?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isSending}>
              <ButtonIcon />
              {isSending ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </MessageForm>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ContactSellerModal; 