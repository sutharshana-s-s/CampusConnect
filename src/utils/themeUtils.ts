// Theme-aware color utilities

// Theme-aware color utilities
export const getThemeColors = (isDark: boolean) => ({
  // Primary colors
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  
  // Background colors
  background: isDark ? '#0f172a' : '#f8fafc',
  surface: isDark ? '#1e293b' : '#ffffff',
  surfaceHover: isDark ? '#334155' : '#f1f5f9',
  
  // Text colors
  text: isDark ? '#f1f5f9' : '#1e293b',
  textSecondary: isDark ? '#94a3b8' : '#64748b',
  textMuted: isDark ? '#64748b' : '#9ca3af',
  
  // Border colors
  border: isDark ? '#334155' : '#e2e8f0',
  borderLight: isDark ? '#475569' : '#f1f5f9',
  
  // Status colors
  success: {
    light: isDark ? '#065f46' : '#d1fae5',
    main: '#10b981',
    dark: isDark ? '#047857' : '#059669',
    text: isDark ? '#d1fae5' : '#166534',
  },
  
  warning: {
    light: isDark ? '#78350f' : '#fef3c7',
    main: '#f59e0b',
    dark: isDark ? '#92400e' : '#d97706',
    text: isDark ? '#fde68a' : '#92400e',
  },
  
  error: {
    light: isDark ? '#7f1d1d' : '#fee2e2',
    main: '#ef4444',
    dark: isDark ? '#991b1b' : '#dc2626',
    text: isDark ? '#fecaca' : '#991b1b',
  },
  
  info: {
    light: isDark ? '#1e3a8a' : '#dbeafe',
    main: '#3b82f6',
    dark: isDark ? '#1e40af' : '#2563eb',
    text: isDark ? '#bfdbfe' : '#1e40af',
  },
  
  // Accent colors
  purple: {
    light: isDark ? '#581c87' : '#f3e8ff',
    main: '#8b5cf6',
    dark: isDark ? '#7c3aed' : '#7c3aed',
    text: isDark ? '#e9d5ff' : '#7c3aed',
  },
  
  // Interactive states
  hover: isDark ? '#334155' : '#f1f5f9',
  focus: isDark ? '#1e40af' : '#3b82f6',
  disabled: isDark ? '#475569' : '#9ca3af',
});

// Status badge colors
export const getStatusColors = (status: string, isDark: boolean) => {
  const colors = getThemeColors(isDark);
  
  switch (status.toLowerCase()) {
    case 'open':
    case 'pending':
      return {
        background: colors.warning.light,
        color: colors.warning.text,
      };
    case 'in_progress':
    case 'processing':
      return {
        background: colors.info.light,
        color: colors.info.text,
      };
    case 'resolved':
    case 'completed':
    case 'approved':
      return {
        background: colors.success.light,
        color: colors.success.text,
      };
    case 'rejected':
    case 'cancelled':
      return {
        background: colors.error.light,
        color: colors.error.text,
      };
    default:
      return {
        background: isDark ? '#374151' : '#f3f4f6',
        color: isDark ? '#9ca3af' : '#6b7280',
      };
  }
};

// Priority badge colors
export const getPriorityColors = (priority: string, isDark: boolean) => {
  const colors = getThemeColors(isDark);
  
  switch (priority.toLowerCase()) {
    case 'high':
      return {
        background: colors.error.light,
        color: colors.error.text,
      };
    case 'medium':
      return {
        background: colors.warning.light,
        color: colors.warning.text,
      };
    case 'low':
      return {
        background: colors.success.light,
        color: colors.success.text,
      };
    default:
      return {
        background: isDark ? '#374151' : '#f3f4f6',
        color: isDark ? '#9ca3af' : '#6b7280',
      };
  }
};

// Role badge colors
export const getRoleColors = (role: string, isDark: boolean) => {
  const colors = getThemeColors(isDark);
  
  switch (role.toLowerCase()) {
    case 'head':
    case 'president':
      return {
        background: colors.purple.light,
        color: colors.purple.text,
      };
    case 'secretary':
    case 'vice_president':
      return {
        background: colors.info.light,
        color: colors.info.text,
      };
    case 'member':
    case 'student':
      return {
        background: colors.success.light,
        color: colors.success.text,
      };
    default:
      return {
        background: isDark ? '#374151' : '#f3f4f6',
        color: isDark ? '#9ca3af' : '#6b7280',
      };
  }
};

// Common styled component props
export const commonInputStyles = (isDark: boolean) => `
  padding: 0.875rem 1rem;
  border: 1px solid ${getThemeColors(isDark).border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: ${getThemeColors(isDark).surface};
  color: ${getThemeColors(isDark).text};
  
  &:focus {
    outline: none;
    border-color: ${getThemeColors(isDark).primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: ${getThemeColors(isDark).textMuted};
  }
`;

export const commonButtonStyles = (isDark: boolean) => `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`; 