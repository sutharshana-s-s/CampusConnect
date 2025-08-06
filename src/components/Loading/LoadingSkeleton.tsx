import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonElement = styled.div<{ 
  $width: string; 
  $height: string; 
  $borderRadius: string;
}>`
  width: ${props => props.$width};
  height: ${props => props.$height};
  border-radius: ${props => props.$borderRadius};
  background: linear-gradient(
    90deg,
    ${props => props.theme.isDark ? '#374151' : '#f3f4f6'} 25%,
    ${props => props.theme.isDark ? '#4b5563' : '#e5e7eb'} 50%,
    ${props => props.theme.isDark ? '#374151' : '#f3f4f6'} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.25rem',
  className
}) => {
  return (
    <SkeletonElement
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      className={className}
    />
  );
};

// Predefined skeleton components
export const CardSkeleton: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <LoadingSkeleton height="1.5rem" width="60%" style={{ marginBottom: '0.5rem' }} />
    <LoadingSkeleton height="1rem" width="100%" style={{ marginBottom: '0.5rem' }} />
    <LoadingSkeleton height="1rem" width="80%" />
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0' }}>
    <LoadingSkeleton height="1rem" width="2rem" />
    <LoadingSkeleton height="1rem" width="150px" />
    <LoadingSkeleton height="1rem" width="100px" />
    <LoadingSkeleton height="1rem" width="80px" />
    <LoadingSkeleton height="1rem" width="60px" />
  </div>
);

export const ListItemSkeleton: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
    <LoadingSkeleton height="2.5rem" width="2.5rem" borderRadius="50%" />
    <div style={{ flex: 1 }}>
      <LoadingSkeleton height="1rem" width="60%" style={{ marginBottom: '0.25rem' }} />
      <LoadingSkeleton height="0.75rem" width="40%" />
    </div>
  </div>
);

export default LoadingSkeleton; 