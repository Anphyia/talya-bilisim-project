'use client';

import { useEffect } from 'react';
import { useThemeStore, themeManager } from '../stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentTheme, applyThemeToDOM } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount and when theme changes
    themeManager.applyTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    // Ensure theme is applied on initial load
    applyThemeToDOM();
  }, [applyThemeToDOM]);

  return <>{children}</>;
}
