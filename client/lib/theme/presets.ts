import { RestaurantTheme } from './types';

export const defaultRestaurantTheme: RestaurantTheme = {
  id: 'default',
  name: 'Default Restaurant Theme',
  colors: {
    primary: '#059669', // Green
    secondary: '#065f46', // Dark green
    accent: '#FF4D50', // Red
    background: 'oklch(95.08% 0.0481 184.07)', // Light background
    foreground: '#1f2937', // Dark text for main content
    muted: '#6b7280', // Gray
    border: '#e5e7eb', // Light gray border
  },
  layout: {
    headerPosition: 'top',
    logoPosition: 'center',
    gridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    spacing: {
      container: '1rem',
      section: '2rem',
      element: '1rem',
    },
  },
  typography: {
    fontFamily: {
      heading: 'var(--font-geist-sans)',
      body: 'var(--font-geist-sans)',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

export const lightRestaurantTheme: RestaurantTheme = {
  ...defaultRestaurantTheme,
  id: 'light',
  name: 'Light Restaurant Theme',
  colors: {
    primary: '#059669',
    secondary: '#065f46',
    accent: '#FF4D50',
    background: '#ffffff',
    foreground: '#1f2937',
    muted: '#6b7280',
    border: '#e5e7eb',
  },
};

export const premiumRestaurantTheme: RestaurantTheme = {
  ...defaultRestaurantTheme,
  id: 'premium',
  name: 'Premium Restaurant Theme',
  colors: {
    primary: '#d4af37', // Gold
    secondary: '#b8860b', // Dark gold
    accent: '#8b0000', // Dark red
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#64748b',
    border: '#334155',
  },
};

export const availableThemes = [
  defaultRestaurantTheme,
  lightRestaurantTheme,
  premiumRestaurantTheme,
];

export const getThemeById = (id: string): RestaurantTheme => {
  return availableThemes.find(theme => theme.id === id) || defaultRestaurantTheme;
};
