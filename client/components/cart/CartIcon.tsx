'use client';

import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

interface CartIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CartIcon({ className = '', size = 'md' }: CartIconProps) {
  const { getTotalItems, openCart } = useCartStore();

  const totalItems = getTotalItems();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const buttonSizeClasses = {
    sm: 'h-8 w-8 p-1',
    md: 'h-10 w-10 p-2',
    lg: 'h-12 w-12 p-3',
  };

  const handleCartClick = () => {
    openCart();
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        onClick={handleCartClick}
        className={`
          ${buttonSizeClasses[size]}
          rounded-full
          restaurant-bg-primary
          restaurant-text-background
          hover:restaurant-bg-primary/80
        `}
        aria-label={`Shopping cart with ${totalItems} items`}
      >
        <ShoppingBag
          className={`${sizeClasses[size]} restaurant-text-background`}
        />
      </Button>

      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="
            absolute -top-2 -right-2
            restaurant-bg-background restaurant-text-primary
            text-xs font-bold
            min-w-[1.25rem] h-5
            flex items-center justify-center
            rounded-full
            animate-bounce
            transition-all duration-300
            shadow-sm
          "
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </div>
  );
}

export default CartIcon;
