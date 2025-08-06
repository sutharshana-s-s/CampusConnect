import { useCallback } from 'react';
import { errorService } from '../services/errorService';

export const useErrorHandler = () => {
  const handleApiError = useCallback((error: any, context?: string) => {
    errorService.handleApiError(error, context);
  }, []);

  const handleNetworkError = useCallback((error: any, context?: string) => {
    errorService.handleNetworkError(error, context);
  }, []);

  const handleAuthError = useCallback((error: any, context?: string) => {
    errorService.handleAuthError(error, context);
  }, []);

  const handleValidationError = useCallback((errors: any, context?: string) => {
    errorService.handleValidationError(errors, context);
  }, []);

  const handlePermissionError = useCallback((error: any, context?: string) => {
    errorService.handlePermissionError(error, context);
  }, []);

  const handleDatabaseError = useCallback((error: any, context?: string) => {
    errorService.handleDatabaseError(error, context);
  }, []);

  const handleUnexpectedError = useCallback((error: any, context?: string) => {
    errorService.handleUnexpectedError(error, context);
  }, []);

  const clearToasts = useCallback(() => {
    errorService.clearToasts();
  }, []);

  return {
    handleApiError,
    handleNetworkError,
    handleAuthError,
    handleValidationError,
    handlePermissionError,
    handleDatabaseError,
    handleUnexpectedError,
    clearToasts,
  };
}; 