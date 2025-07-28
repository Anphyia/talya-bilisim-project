'use client';

import { useCartStore } from '@/lib/stores/cartStore';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, X, Eye } from 'lucide-react';

export function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    openCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleViewCart = () => {
    closeDrawer();
    openCart();
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DrawerContent className="restaurant-bg-background border-restaurant-border">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center justify-center w-12 h-12 restaurant-bg-primary/10 rounded-full">
                <ShoppingBag className="h-6 w-6 restaurant-text-primary" />
              </div>
            </div>
            
            <DrawerTitle className="restaurant-text-foreground restaurant-font-heading text-lg font-bold">
              Added to Cart!
            </DrawerTitle>
            
            <DrawerDescription className="restaurant-text-muted restaurant-font-body text-sm">
              {totalItems === 1 
                ? `${totalItems} item in your cart` 
                : `${totalItems} items in your cart`
              }
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6 space-y-4">
            {/* Cart Summary */}
            <div className="flex items-center justify-between p-4 restaurant-bg-secondary/5 rounded-lg restaurant-border">
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="secondary" 
                  className="restaurant-bg-primary restaurant-text-white text-sm font-semibold"
                >
                  {totalItems}
                </Badge>
                <span className="restaurant-text-foreground restaurant-font-body text-sm">
                  {totalItems === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              
              <span className="restaurant-text-primary restaurant-font-heading text-lg font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleViewCart}
                className="flex-1 restaurant-bg-primary hover:restaurant-bg-primary/90 text-white restaurant-font-heading font-semibold"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Cart
              </Button>
              
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="px-3 restaurant-border hover:restaurant-bg-secondary/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CartDrawer;
