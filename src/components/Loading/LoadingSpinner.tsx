import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ $size: string; $color: string }>`
  display: inline-block;
  width: ${props => {
    switch (props.$size) {
      case 'small': return '1rem';
      case 'large': return '3rem';
      default: return '2rem';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '1rem';
      case 'large': return '3rem';
      default: return '2rem';
    }
  }};
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid ${props => props.$color || props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color, 
  className 
}) => {
  return (
    <SpinnerContainer 
      $size={size} 
      $color={color || ''} 
      className={className}
    />
  );
};

export default LoadingSpinner; 