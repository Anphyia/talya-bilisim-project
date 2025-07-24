import { RestaurantTheme } from './types';

export const defaultRestaurantTheme: RestaurantTheme = {
  id: 'default',
  name: 'Default Restaurant Theme',
  colors: {
    primary: '#b2d98b', // Pistachio green
    secondary: '#1d665d', // Eucalyptus green
    accent: '#FF4D50',
    background: '#fbfaf2', // Frost white
    foreground: '#061611', // Black Glaze
    muted: '#6b7280',
    border: '#e5e7eb',
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

export const goldenRestaurantTheme: RestaurantTheme = {
  ...defaultRestaurantTheme,
  id: 'golden',
  name: 'Golden Restaurant Theme',
  colors: {
    primary: '#fbba00', // Selective yellow
    secondary: '#e5781e', // Vivid Tangelo
    accent: '#5a3d2b', // Royal brown
    background: '#f4eed8', // Eggshell white
    foreground: '#171717', // Charcoal Gray
    muted: '#64748b',
    border: '#334155',
  },
};

export const oceanRestaurantTheme: RestaurantTheme = {
  ...defaultRestaurantTheme,
  id: 'ocean',
  name: 'Ocean Restaurant Theme',
  colors: {
    primary: '#0077b6', // Deep Sky Blue
    secondary: '#00b4d8', // Turquoise Blue
    accent: '#90e0ef', // Light Cyan
    background: '#caf0f8', // Alice Blue
    foreground: '#03045e', // Navy Blue
    muted: '#6c757d', // Muted Gray
    border: '#ade8f4', // Light Blue Border
  },
};

export const availableThemes = [
  defaultRestaurantTheme,
  goldenRestaurantTheme,
  oceanRestaurantTheme,
];

export const getThemeById = (id: string): RestaurantTheme => {
  return availableThemes.find(theme => theme.id === id) || defaultRestaurantTheme;
};
