export interface RestaurantColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface RestaurantLayout {
  headerPosition: 'top' | 'side';
  logoPosition: 'left' | 'center' | 'right';
  gridColumns: {
    mobile: 1 | 2;
    tablet: 2 | 3;
    desktop: 3 | 4;
  };
  spacing: {
    container: string;
    section: string;
    element: string;
  };
}

export interface RestaurantTypography {
  fontFamily: {
    heading: string;
    body: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeights: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface RestaurantTheme {
  id: string;
  name: string;
  colors: RestaurantColors;
  layout: RestaurantLayout;
  typography: RestaurantTypography;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface RestaurantBranding {
  name: string;
  logo?: string;
  description?: string;
  socialLinks: {
    telephone?: string;
    website?: string;
    facebook?: string;
  };
}
