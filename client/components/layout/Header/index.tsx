'use client';

import { useThemeStore } from '@/lib/stores/themeStore';
import { Logo } from './Logo';
import { HeaderActions } from './HeaderActions';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const { currentTheme, branding } = useThemeStore();
  const layout = currentTheme.layout ?? {};
  const { logoPosition = 'left' } = layout;

  const logoPositionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

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
          {/* Left side - Empty space for layout balance */}
          <div className={`
            flex items-center space-x-4
            ${logoPosition === 'center' ? 'hidden sm:flex' : 'flex'}
            ${logoPosition === 'left' ? 'order-2' : ''}
          `}>
            {/* Keep empty for logo positioning */}
          </div>

          {/* Center - Logo */}
          <div className={`
            flex items-center
            ${logoPositionClasses[logoPosition]}
            ${logoPosition === 'center' ? 'flex-1' : ''}
          `}>
            <Logo
              name={branding.name}
              logo={branding.logo}
              className="h-8 md:h-10"
            />
          </div>

          {/* Right side - Social icons */}
          <div className={`
            flex items-center space-x-4
            ${logoPosition === 'center' ? 'hidden sm:flex' : 'flex'}
            ${logoPosition === 'right' ? 'order-1' : ''}
          `}>
            {logoPosition !== 'right' && <HeaderActions position="right" />}
          </div>

          {/* Mobile menu for centered logo */}
          {logoPosition === 'center' && (
            <div className="flex sm:hidden">
              <HeaderActions position="mobile" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
