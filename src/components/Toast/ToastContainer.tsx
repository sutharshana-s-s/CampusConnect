import React from 'react';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

const StyledToaster = styled(Toaster)`
  .toast {
    border-radius: 0.75rem;
    font-weight: 500;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid;
  }

  .toast.success {
    background: ${props => props.theme.isDark ? '#065f46' : '#f0fdf4'};
    color: ${props => props.theme.isDark ? '#d1fae5' : '#166534'};
    border-color: ${props => props.theme.isDark ? '#047857' : '#bbf7d0'};
  }

  .toast.error {
    background: ${props => props.theme.isDark ? '#7f1d1d' : '#fef2f2'};
    color: ${props => props.theme.isDark ? '#fecaca' : '#dc2626'};
    border-color: ${props => props.theme.isDark ? '#991b1b' : '#fecaca'};
  }

  .toast.warning {
    background: ${props => props.theme.isDark ? '#78350f' : '#fffbeb'};
    color: ${props => props.theme.isDark ? '#fde68a' : '#d97706'};
    border-color: ${props => props.theme.isDark ? '#92400e' : '#fed7aa'};
  }

  .toast.info {
    background: ${props => props.theme.isDark ? '#1e3a8a' : '#eff6ff'};
    color: ${props => props.theme.isDark ? '#bfdbfe' : '#2563eb'};
    border-color: ${props => props.theme.isDark ? '#1e40af' : '#bfdbfe'};
  }

  .toast.loading {
    background: ${props => props.theme.isDark ? '#374151' : '#f9fafb'};
    color: ${props => props.theme.isDark ? '#d1d5db' : '#6b7280'};
    border-color: ${props => props.theme.isDark ? '#4b5563' : '#e5e7eb'};
  }
`;

const ToastContainer: React.FC = () => {
  return (
    <StyledToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          minWidth: '300px',
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#6b7280',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToastContainer; 