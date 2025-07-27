import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { setTheme } from '../store/slices/settingsSlice';
import type { RootState } from '../store/store';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const settingsTheme = useSelector((state: RootState) => state.settings.theme);
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  // Determine the actual theme based on system preference and user setting
  useEffect(() => {
    const getSystemTheme = (): Theme => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    let theme: Theme;
    switch (settingsTheme) {
      case 'dark':
        theme = 'dark';
        break;
      case 'light':
        theme = 'light';
        break;
      case 'system':
      default:
        theme = getSystemTheme();
        break;
    }

    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [settingsTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (settingsTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settingsTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  const isDark = currentTheme === 'dark';

  // Create styled-components theme object
  const styledTheme = {
    isDark,
    colors: {
      primary: isDark ? '#3b82f6' : '#3b82f6',
      secondary: isDark ? '#64748b' : '#64748b',
      background: isDark ? '#0f172a' : '#f8fafc',
      surface: isDark ? '#1e293b' : '#ffffff',
      text: isDark ? '#f1f5f9' : '#1e293b',
      textSecondary: isDark ? '#94a3b8' : '#64748b',
      border: isDark ? '#334155' : '#e2e8f0',
      accent: isDark ? '#3b82f6' : '#3b82f6',
    },
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={styledTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}; 