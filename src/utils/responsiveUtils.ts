// Responsive breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '480px',
  md: '640px',
  lg: '768px',
  xl: '1024px',
  '2xl': '1280px',
} as const;

// Responsive media queries
export const media = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;

// Common responsive grid layouts
export const gridLayouts = {
  // Single column on mobile, 2 columns on tablet, 4 on desktop
  stats: `
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    
    ${media.sm} {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    
    ${media.md} {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    ${media.lg} {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  `,
  
  // Cards layout: 1 -> 2 -> 3 -> 4 columns
  cards: `
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    
    ${media.sm} {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    
    ${media.md} {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    ${media.lg} {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    
    ${media.xl} {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    
    ${media['2xl']} {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  `,
  
  // Quick actions: 1 -> 2 -> 3 -> 4 columns
  quickActions: `
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    
    ${media.sm} {
      grid-template-columns: repeat(2, 1fr);
    }
    
    ${media.md} {
      grid-template-columns: repeat(2, 1fr);
    }
    
    ${media.lg} {
      grid-template-columns: repeat(3, 1fr);
    }
    
    ${media.xl} {
      grid-template-columns: repeat(4, 1fr);
    }
  `,
  
  // Content layout: single column on mobile, sidebar on desktop
  content: `
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    
    ${media.lg} {
      grid-template-columns: 1fr;
    }
    
    ${media.xl} {
      grid-template-columns: 2fr 1fr;
    }
  `,
} as const;

// Common responsive padding
export const responsivePadding = `
  padding: 1rem;
  
  ${media.sm} {
    padding: 1.25rem;
  }
  
  ${media.md} {
    padding: 1.5rem;
  }
  
  ${media.lg} {
    padding: 1.75rem;
  }
  
  ${media.xl} {
    padding: 2rem;
  }
`;

// Common responsive font sizes
export const responsiveFontSizes = {
  title: `
    font-size: 1.75rem;
    
    ${media.sm} {
      font-size: 2rem;
    }
    
    ${media.md} {
      font-size: 2.25rem;
    }
    
    ${media.lg} {
      font-size: 2.5rem;
    }
  `,
  
  subtitle: `
    font-size: 1rem;
    
    ${media.sm} {
      font-size: 1.125rem;
    }
  `,
  
  body: `
    font-size: 0.875rem;
    
    ${media.sm} {
      font-size: 1rem;
    }
  `,
  
  small: `
    font-size: 0.75rem;
    
    ${media.sm} {
      font-size: 0.875rem;
    }
  `,
} as const;

// Common responsive spacing
export const responsiveSpacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '2rem',
} as const;

// Responsive container max-widths
export const containerMaxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

// Helper function to create responsive styles
export const createResponsiveStyles = (styles: Record<string, string>) => {
  return Object.entries(styles)
    .map(([breakpoint, style]) => {
      if (breakpoint === 'base') {
        return style;
      }
      return `${media[breakpoint as keyof typeof media]} { ${style} }`;
    })
    .join('\n');
};

// Common responsive button styles
export const responsiveButtonStyles = `
  padding: 0.625rem 0.75rem;
  font-size: 0.75rem;
  min-width: 100px;
  
  ${media.sm} {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    min-width: 120px;
  }
`;

// Common responsive card styles
export const responsiveCardStyles = `
  padding: 1rem;
  
  ${media.sm} {
    padding: 1.25rem;
  }
  
  ${media.md} {
    padding: 1.5rem;
  }
`; 