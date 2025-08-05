'use client';

import { useThemeStore } from '@/lib/stores/themeStore';
import { Logo } from './Logo';
import { HeaderActions } from './HeaderActions';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const { branding } = useThemeStore();

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        restaurant-bg-primary
        border-b restaurant-border
        transition-all duration-200
        ${className}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Layout */}
          <div className="flex sm:hidden items-center flex-1">
            <Logo
              name={branding.departmentname}
              logo={branding.logo}
              className="h-8"
            />
          </div>
          <div className="flex sm:hidden">
            <HeaderActions position="mobile" />
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex flex-1">
            {/* Keep empty for logo positioning */}
          </div>

          {/* Center - Logo */}
          <div className="hidden sm:flex items-center justify-center flex-1">
            <Logo
              name={branding.departmentname}
              logo={branding.logo}
              className="h-8 md:h-10"
            />
          </div>

          {/* Right side - Social icons */}
          <div className="hidden sm:flex items-center space-x-4 flex-1 justify-end">
            <HeaderActions position="right" />
          </div>
        </div>
      </div>
    </header>
  );
}
