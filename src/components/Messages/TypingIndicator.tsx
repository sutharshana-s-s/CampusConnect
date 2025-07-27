import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const TypingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.isDark ? '#475569' : '#f1f5f9'};
  border-radius: 1rem;
  border-bottom-left-radius: 0.25rem;
  align-self: flex-start;
  margin-top: 0.5rem;
  max-width: 70%;
`;

const TypingText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.textSecondary};
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.$delay}s;
`;

interface TypingIndicatorProps {
  userName: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userName }) => {
  return (
    <TypingContainer>
      <TypingText>{userName} is typing</TypingText>
      <DotsContainer>
        <Dot $delay={0} />
        <Dot $delay={0.16} />
        <Dot $delay={0.32} />
      </DotsContainer>
    </TypingContainer>
  );
};

export default TypingIndicator; 