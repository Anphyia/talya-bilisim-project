'use client';

import { useEffect } from 'react';
import { useThemeStore, themeManager } from '../stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    themeManager.applyTheme(currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
}
