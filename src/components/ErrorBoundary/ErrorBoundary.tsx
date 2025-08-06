import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: ${props => props.theme.isDark ? '#1e293b' : '#f8fafc'};
  color: ${props => props.theme.colors.text};
`;

const ErrorIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: ${props => props.theme.isDark ? '#dc2626' : '#fef2f2'};
  color: ${props => props.theme.isDark ? '#fecaca' : '#dc2626'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const ErrorTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$variant === 'primary' ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryDark};
    }
  ` : `
    background: transparent;
    color: ${props.theme.colors.textSecondary};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.isDark ? '#374151' : '#f3f4f6'};
    }
  `}
`;

const ErrorDetails = styled.details`
  margin-top: 2rem;
  text-align: left;
  max-width: 600px;
  width: 100%;
  
  summary {
    cursor: pointer;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  pre {
    background: ${props => props.theme.isDark ? '#374151' : '#f3f4f6'};
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    overflow-x: auto;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Show user-friendly error message
    toast.error('Something went wrong. Please try refreshing the page.');

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>
            <AlertTriangle size={32} />
          </ErrorIcon>
          
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          
          <ErrorMessage>
            We encountered an unexpected error. This might be a temporary issue. 
            Please try refreshing the page or going back to the dashboard.
          </ErrorMessage>
          
          <ActionButtons>
            <Button $variant="primary" onClick={this.handleRetry}>
              <RefreshCw size={16} />
              Refresh Page
            </Button>
            
            <Button $variant="secondary" onClick={this.handleGoHome}>
              <Home size={16} />
              Go to Dashboard
            </Button>
          </ActionButtons>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>Error Details (Development Only)</summary>
              <pre>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 