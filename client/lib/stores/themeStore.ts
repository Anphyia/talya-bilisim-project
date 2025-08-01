import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RestaurantTheme, RestaurantBranding } from '../../types/theme-types';
import { defaultRestaurantTheme } from '../theme/presets';

interface ThemeState {
  currentTheme: RestaurantTheme;
  branding: RestaurantBranding;
  isCustomizing: boolean;
  setTheme: (theme: RestaurantTheme) => void;
  setBranding: (branding: Partial<RestaurantBranding>) => void;
  updateThemeColors: (colors: Partial<RestaurantTheme['colors']>) => void;
  updateThemeLayout: (layout: Partial<RestaurantTheme['layout']>) => void;
  updateSingleColor: (colorKey: keyof RestaurantTheme['colors'], color: string) => void;
  toggleCustomizing: () => void;
  resetTheme: () => void;
  applyThemeToDOM: () => void;
}

const defaultBranding: RestaurantBranding = {
  name: 'Restaurant Name',
  logo: '/vercel.svg',
  description: 'Delicious food for everyone',
  socialLinks: {
    instagram: 'https://instagram.com/restaurant',
    website: 'https://restaurant-website.com',
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultRestaurantTheme,
      branding: defaultBranding,
      isCustomizing: false,

      setTheme: (theme) => set({ currentTheme: theme }),

      setBranding: (branding) =>
        set((state) => ({
          branding: { ...state.branding, ...branding },
        })),

      updateThemeColors: (colors) =>
        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colors: { ...state.currentTheme.colors, ...colors },
          },
        })),

      updateThemeLayout: (layout) =>
        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            layout: { ...state.currentTheme.layout, ...layout },
          },
        })),

      updateSingleColor: (colorKey, color) =>
        set((state) => {
          const newTheme = {
            ...state.currentTheme,
            colors: { ...state.currentTheme.colors, [colorKey]: color },
          };
          // Apply to DOM immediately
          themeManager.applyTheme(newTheme);
          return { currentTheme: newTheme };
        }),

      toggleCustomizing: () =>
        set((state) => ({ isCustomizing: !state.isCustomizing })),

      resetTheme: () => set({ currentTheme: defaultRestaurantTheme }),

      applyThemeToDOM: () => {
        const { currentTheme } = get();
        themeManager.applyTheme(currentTheme);
      },
    }),
    {
      name: 'restaurant-theme',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        branding: state.branding,
      }),
    }
  )
);

// Enhanced Theme Manager for dynamic CSS updates
class ThemeManager {
  private static instance: ThemeManager;
  private styleElement: HTMLStyleElement | null = null;

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private ensureStyleElement(): void {
    if (typeof document === 'undefined') return;

    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.id = 'restaurant-theme-variables';
      document.head.appendChild(this.styleElement);
    }
  }

  applyTheme(theme: RestaurantTheme): void {
    if (typeof document === 'undefined') return;

    // Apply via CSS variables for immediate effect
    const root = document.documentElement;

    // Apply color variables
    root.style.setProperty('--restaurant-primary', theme.colors.primary);
    root.style.setProperty('--restaurant-secondary', theme.colors.secondary);
    root.style.setProperty('--restaurant-accent', theme.colors.accent);
    root.style.setProperty('--restaurant-background', theme.colors.background);
    root.style.setProperty('--restaurant-foreground', theme.colors.foreground);
    root.style.setProperty('--restaurant-muted', theme.colors.muted);
    root.style.setProperty('--restaurant-border', theme.colors.border);

    // Apply layout variables
    root.style.setProperty('--restaurant-container-spacing', theme.layout.spacing.container);
    root.style.setProperty('--restaurant-section-spacing', theme.layout.spacing.section);
    root.style.setProperty('--restaurant-element-spacing', theme.layout.spacing.element);

    // Apply typography variables
    root.style.setProperty('--restaurant-font-heading', theme.typography.fontFamily.heading);
    root.style.setProperty('--restaurant-font-body', theme.typography.fontFamily.body);

    // Apply border radius
    root.style.setProperty('--restaurant-radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--restaurant-radius-md', theme.borderRadius.md);
    root.style.setProperty('--restaurant-radius-lg', theme.borderRadius.lg);
    root.style.setProperty('--restaurant-radius-xl', theme.borderRadius.xl);

    // Also inject CSS for persistence
    this.ensureStyleElement();
    if (this.styleElement) {
      this.styleElement.textContent = this.generateThemeCSS(theme);
    }
  }

  generateThemeCSS(theme: RestaurantTheme): string {
    return `
      :root {
        --restaurant-primary: ${theme.colors.primary};
        --restaurant-secondary: ${theme.colors.secondary};
        --restaurant-accent: ${theme.colors.accent};
        --restaurant-background: ${theme.colors.background};
        --restaurant-foreground: ${theme.colors.foreground};
        --restaurant-muted: ${theme.colors.muted};
        --restaurant-border: ${theme.colors.border};
        
        --restaurant-container-spacing: ${theme.layout.spacing.container};
        --restaurant-section-spacing: ${theme.layout.spacing.section};
        --restaurant-element-spacing: ${theme.layout.spacing.element};
        
        --restaurant-font-heading: ${theme.typography.fontFamily.heading};
        --restaurant-font-body: ${theme.typography.fontFamily.body};
        
        --restaurant-radius-sm: ${theme.borderRadius.sm};
        --restaurant-radius-md: ${theme.borderRadius.md};
        --restaurant-radius-lg: ${theme.borderRadius.lg};
        --restaurant-radius-xl: ${theme.borderRadius.xl};
      }
    `;
  }
}

export const themeManager = ThemeManager.getInstance();
