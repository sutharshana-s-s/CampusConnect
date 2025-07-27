 import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    isDark: boolean;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      accent: string;
    };
  }
} 