'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ 
  href, 
  label = 'Back', 
  className = '' 
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`
        restaurant-text-foreground hover:restaurant-bg-secondary
        flex items-center space-x-2 p-2 h-auto
        transition-colors duration-200
        ${className}
      `}
      aria-label={label}
    >
      <ArrowLeft size={20} />
      <span className="hidden sm:inline restaurant-font-body font-medium">
        {label}
      </span>
    </Button>
  );
}
