'use client';

import Link from 'next/link';
import { Instagram, Globe } from 'lucide-react';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Button } from '@/components/ui/button';

interface HeaderActionsProps {
  position: 'left' | 'right' | 'mobile';
}

export function HeaderActions({ position }: HeaderActionsProps) {
  const { branding } = useThemeStore();
  const { socialLinks } = branding;

  const iconSize = position === 'mobile' ? 20 : 24;
  const buttonSize = position === 'mobile' ? 'sm' : 'default';

  const socialIcons = [];

  if (socialLinks.instagram) {
    socialIcons.push(
      <Button
        key="instagram"
        variant="ghost"
        size={buttonSize}
        asChild
        className="restaurant-text-foreground hover:restaurant-bg-secondary p-2 h-auto"
      >
        <Link
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Instagram"
        >
          <Instagram size={iconSize} />
        </Link>
      </Button>
    );
  }

  if (socialLinks.website) {
    socialIcons.push(
      <Button
        key="website"
        variant="ghost"
        size={buttonSize}
        asChild
        className="restaurant-text-foreground hover:restaurant-bg-secondary p-2 h-auto"
      >
        <Link
          href={socialLinks.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our website"
        >
          <Globe size={iconSize} />
        </Link>
      </Button>
    );
  }

  if (socialLinks.facebook) {
    socialIcons.push(
      <Button
        key="facebook"
        variant="ghost"
        size={buttonSize}
        asChild
        className="restaurant-text-foreground hover:restaurant-bg-secondary p-2 h-auto"
      >
        <Link
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Facebook"
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </Link>
      </Button>
    );
  }

  // Don't render if no social links
  if (socialIcons.length === 0) {
    return null;
  }

  return (
    <div className={`
      flex items-center
      ${position === 'mobile' ? 'space-x-1' : 'space-x-2'}
    `}>
      {socialIcons}
    </div>
  );
}
