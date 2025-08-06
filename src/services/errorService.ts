import { toast } from 'react-hot-toast';

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
  context?: string;
}

export class ErrorService {
  private static instance: ErrorService;

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  // Handle API errors
  handleApiError(error: any, context?: string): void {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let errorCode = 'UNKNOWN_ERROR';

    // Handle different types of errors
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Handle specific error codes
    if (error?.code) {
      errorCode = error.code;
      errorMessage = this.getErrorMessageForCode(error.code, errorMessage);
    }

    // Log error for debugging
    this.logError({
      message: errorMessage,
      code: errorCode,
      details: error,
      context
    });

    // Show user-friendly message
    this.showErrorToast(errorMessage, context);
  }

  // Handle network errors
  handleNetworkError(error: any, context?: string): void {
    const errorMessage = 'Network error. Please check your connection and try again.';
    
    this.logError({
      message: errorMessage,
      code: 'NETWORK_ERROR',
      details: error,
      context
    });

    this.showErrorToast(errorMessage, context);
  }

  // Handle authentication errors
  handleAuthError(error: any, context?: string): void {
    let errorMessage = 'Authentication failed. Please log in again.';
    
    if (error?.message?.includes('token')) {
      errorMessage = 'Your session has expired. Please log in again.';
    }

    this.logError({
      message: errorMessage,
      code: 'AUTH_ERROR',
      details: error,
      context
    });

    this.showErrorToast(errorMessage, context);
  }

  // Handle validation errors
  handleValidationError(errors: any, context?: string): void {
    const errorMessage = 'Please check your input and try again.';
    
    this.logError({
      message: errorMessage,
      code: 'VALIDATION_ERROR',
      details: errors,
      context
    });

    this.showErrorToast(errorMessage, context);
  }

  // Handle permission errors
  handlePermissionError(error: any, context?: string): void {
    const errorMessage = 'You don\'t have permission to perform this action.';
    
    this.logError({
      message: errorMessage,
      code: 'PERMISSION_ERROR',
      details: error,
      context
    });

    this.showErrorToast(errorMessage, context);
  }

  // Handle database errors
  handleDatabaseError(error: any, context?: string): void {
    let errorMessage = 'Database error. Please try again later.';
    
    if (error?.code === 'PGRST200') {
      errorMessage = 'Data not found. Please refresh the page.';
    } else if (error?.code === 'PGRST116') {
      errorMessage = 'No data available.';
    }

    this.logError({
      message: errorMessage,
      code: 'DATABASE_ERROR',
      details: error,
      context
    });

    this.showErrorToast(errorMessage, context);
  }

  // Get user-friendly error messages for specific codes
  private getErrorMessageForCode(code: string, defaultMessage: string): string {
    const errorMessages: Record<string, string> = {
      'PGRST200': 'Data not found. Please refresh the page.',
      'PGRST116': 'No data available.',
      'PGRST400': 'Invalid request. Please check your input.',
      'PGRST401': 'Authentication required. Please log in.',
      'PGRST403': 'Access denied. You don\'t have permission.',
      'PGRST404': 'Resource not found.',
      'PGRST500': 'Server error. Please try again later.',
      'NETWORK_ERROR': 'Network error. Please check your connection.',
      'AUTH_ERROR': 'Authentication failed. Please log in again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'PERMISSION_ERROR': 'You don\'t have permission to perform this action.',
      'DATABASE_ERROR': 'Database error. Please try again later.',
      'UPLOAD_ERROR': 'File upload failed. Please try again.',
      'DELETE_ERROR': 'Failed to delete item. Please try again.',
      'UPDATE_ERROR': 'Failed to update. Please try again.',
      'CREATE_ERROR': 'Failed to create item. Please try again.',
      'FETCH_ERROR': 'Failed to load data. Please refresh the page.',
    };

    return errorMessages[code] || defaultMessage;
  }

  // Show error toast with context
  private showErrorToast(message: string, context?: string): void {
    const fullMessage = context ? `${context}: ${message}` : message;
    
    toast.error(fullMessage, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#dc2626',
        color: '#fff',
        border: '1px solid #b91c1c',
      },
    });
  }

  // Log error for debugging (in production, send to error tracking service)
  private logError(errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Service:', {
        message: errorInfo.message,
        code: errorInfo.code,
        context: errorInfo.context,
        details: errorInfo.details,
        timestamp: new Date().toISOString(),
      });
    } else {
      // In production, send to error tracking service
      // Example: Sentry.captureException(new Error(errorInfo.message), {
      //   tags: { code: errorInfo.code, context: errorInfo.context },
      //   extra: errorInfo.details
      // });
    }
  }

  // Handle unexpected errors
  handleUnexpectedError(error: any, context?: string): void {
    const errorMessage = 'An unexpected error occurred. Please try refreshing the page.';
    
    this.logError({
      message: errorMessage,
      code: 'UNEXPECTED_ERROR',
      details: error,
      context
    });

    this.showErrorToast(errorMessage, context);
  }

  // Clear all toasts
  clearToasts(): void {
    toast.dismiss();
  }
}

// Export singleton instance
export const errorService = ErrorService.getInstance(); 