import React from 'react';
import styled from 'styled-components';
import { Circle } from 'lucide-react';

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusDot = styled.div<{ $isOnline: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? '#10b981' : '#6b7280'};
  box-shadow: 0 0 0 2px ${props => props.theme.isDark ? '#1e293b' : '#ffffff'};
  position: relative;
  
  ${props => props.$isOnline && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.25rem;
      height: 0.25rem;
      border-radius: 50%;
      background-color: #ffffff;
      animation: pulse 2s infinite;
    }
  `}
`;

const StatusText = styled.span<{ $isOnline: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isOnline ? '#10b981' : '#6b7280'};
  font-weight: 500;
`;

const pulse = `
  @keyframes pulse {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const StatusIndicator = styled.div`
  ${pulse}
`;

interface OnlineStatusIndicatorProps {
  isOnline: boolean;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({ 
  isOnline, 
  showText = true, 
  size = 'medium' 
}) => {
  const getStatusText = () => {
    return isOnline ? 'Online' : 'Offline';
  };

  const getDotSize = () => {
    switch (size) {
      case 'small':
        return '0.375rem';
      case 'large':
        return '0.75rem';
      default:
        return '0.5rem';
    }
  };

  return (
    <StatusContainer>
      <StatusIndicator>
        <StatusDot 
          $isOnline={isOnline} 
          style={{ width: getDotSize(), height: getDotSize() }}
        />
      </StatusIndicator>
      {showText && (
        <StatusText $isOnline={isOnline}>
          {getStatusText()}
        </StatusText>
      )}
    </StatusContainer>
  );
};

export default OnlineStatusIndicator; 