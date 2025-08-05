'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDebounce } from '@uidotdev/usehooks';
import { useCartStore } from '@/lib/stores/cartStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Check,
  X,
  ShoppingCart,
  QrCode,
  MapPin
} from 'lucide-react';
import { QRScanner } from './QRScanner';

export function CartSheet() {
  const {
    isCartOpen,
    closeCart,
    items,
    orderNotes,
    tableNumber,
    updateQuantity,
    updateProductNotes,
    updateOrderNotes,
    setTableNumber,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const [editingNotes, setEditingNotes] = useState<{ [key: string]: boolean }>({});
  const [tempNotes, setTempNotes] = useState<{ [key: string]: string }>({});
  const [localOrderNotes, setLocalOrderNotes] = useState(orderNotes);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const debouncedOrderNotes = useDebounce(localOrderNotes, 300);

  useEffect(() => {
    if (debouncedOrderNotes !== orderNotes) {
      updateOrderNotes(debouncedOrderNotes);
    }
  }, [debouncedOrderNotes, orderNotes, updateOrderNotes]);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();


  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + change);
    }
  };

  const handleEditNotes = (itemId: string, currentNotes: string) => {
    setTempNotes({ ...tempNotes, [itemId]: currentNotes });
    setEditingNotes({ ...editingNotes, [itemId]: true });
  };

  const handleSaveNotes = (itemId: string) => {
    updateProductNotes(itemId, tempNotes[itemId] || '');
    setEditingNotes({ ...editingNotes, [itemId]: false });
  };

  const handleCancelEditNotes = (itemId: string) => {
    setEditingNotes({ ...editingNotes, [itemId]: false });
  };

  const handleTableScanned = (scannedTableNumber: string) => {
    setTableNumber(scannedTableNumber);
    setShowQRScanner(false);
  };

  const handleProceedToCheckout = () => {
    if (!tableNumber) {
      setShowQRScanner(true);
    } else {
      // Proceed to checkout with existing table number
      // This is where you would navigate to checkout page or trigger checkout process
      console.log('Proceeding to checkout with table:', tableNumber);
    }
  };

  if (items.length === 0) {
    return (
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-lg restaurant-bg-background">
          <SheetHeader>
            <SheetTitle className="restaurant-text-foreground restaurant-font-heading text-xl font-bold flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2 restaurant-text-primary" />
              Your Cart
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center justify-center w-24 h-24 restaurant-bg-secondary/10 rounded-full">
              <ShoppingCart className="h-12 w-12 restaurant-text-muted" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="restaurant-text-foreground restaurant-font-heading text-lg font-semibold">
                Your cart is empty
              </h3>
              <p className="restaurant-text-muted restaurant-font-body text-sm">
                Add some delicious items to get started!
              </p>
            </div>

            <Button
              onClick={closeCart}
              className="restaurant-bg-primary hover:restaurant-bg-primary/90 text-white restaurant-font-heading font-semibold px-8"
            >
              Start Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg restaurant-bg-background flex flex-col">
        <SheetHeader className="space-y-3">
          <SheetTitle className="restaurant-text-foreground restaurant-font-heading text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-6 w-6 mr-2restaurant-text-primary" />
              <p>Your Cart</p>
              <Badge
                variant="secondary"
                className="restaurant-bg-secondary restaurant-text-white text-sm font-semibold ml-2 "
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            </div>

          </SheetTitle>

          <SheetDescription className="restaurant-text-muted restaurant-font-body text-sm">
            Review your items and add any special instructions
          </SheetDescription>
        </SheetHeader>

        {/* Make this container scrollable */}
        <div className="flex-1 flex flex-col overflow-y-auto max-h-[70vh] px-4">
          {/* Cart Items */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 p-4 restaurant-bg-secondary/5 rounded-lg restaurant-border"
                >
                  {/* Food Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 restaurant-rounded-md overflow-hidden">
                    <Image
                      src={item.food.image}
                      alt={item.food.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="restaurant-text-foreground restaurant-font-heading text-sm font-semibold line-clamp-1">
                          {item.food.name}
                        </h4>
                        <p className="restaurant-text-primary restaurant-font-heading text-sm font-bold">
                          ₺{item.food.price.toFixed(2)} each
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 p-0 restaurant-border restaurant-bg-secondary hover:restaurant-bg-primary/10"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="restaurant-text-foreground restaurant-font-heading text-sm font-semibold min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          disabled={item.quantity >= 10}
                          className="w-8 h-8 p-0 restaurant-border restaurant-bg-secondary hover:restaurant-bg-secondary/10"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <span className="restaurant-text-primary restaurant-font-heading text-sm font-bold">
                        ₺{(item.food.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Product Notes */}
                    <div className="space-y-2">
                      {editingNotes[item.id] ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add special instructions for this item..."
                            value={tempNotes[item.id] || ''}
                            onChange={(e) => setTempNotes({ ...tempNotes, [item.id]: e.target.value })}
                            className="text-xs restaurant-border restaurant-rounded-md"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveNotes(item.id)}
                              className="restaurant-bg-primary hover:restaurant-bg-primary/90 text-white text-xs px-3 py-1 h-auto"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelEditNotes(item.id)}
                              className="text-xs px-3 py-1 h-auto restaurant-border"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {item.productNotes ? (
                              <p className="restaurant-text-muted restaurant-font-body text-xs italic">
                                &ldquo;{item.productNotes}&rdquo;
                              </p>
                            ) : (
                              <p className="restaurant-text-muted restaurant-font-body text-xs">
                                No special instructions
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNotes(item.id, item.productNotes)}
                            className="text-xs px-2 py-1 h-auto restaurant-text-primary hover:restaurant-bg-primary/10"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-auto space-y-6 pt-6">
            <Separator className="restaurant-border" />

            {/* Order Notes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="restaurant-text-foreground restaurant-font-heading text-base font-semibold">
                  Order Notes
                </h4>
                <span className="text-xs restaurant-text-muted">
                  {localOrderNotes.length} / 100
                </span>
              </div>
              <Textarea
                placeholder="Add special instructions for your entire order..."
                value={localOrderNotes}
                onChange={(e) => setLocalOrderNotes(e.target.value)}
                className="restaurant-border restaurant-rounded-md text-sm h-20 resize-none"
                maxLength={100}
              />
            </div>

            <Separator className="restaurant-border" />

            {/* Table Number Display */}
            {tableNumber && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 restaurant-bg-primary/10 rounded-lg restaurant-border">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 restaurant-text-primary" />
                    <span className="restaurant-text-foreground restaurant-font-heading text-sm font-semibold">
                      Table {tableNumber}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQRScanner(true)}
                    className="text-xs restaurant-text-primary hover:restaurant-bg-primary/10"
                  >
                    <QrCode className="h-3 w-3 mr-1" />
                    Change
                  </Button>
                </div>
                <Separator className="restaurant-border" />
              </div>
            )}

            {/* Order Summary */}
            <div className="space-y-2 restaurant-font-body text-sm">
              <div className="flex justify-between restaurant-text-foreground restaurant-font-heading text-base font-bold">
                <span>Total:</span>
                <span className="restaurant-text-primary">₺{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 px-4">
          <Button
            onClick={handleProceedToCheckout}
            className="w-full restaurant-bg-primary hover:restaurant-bg-primary/90 text-white restaurant-font-heading font-semibold py-3"
            size="lg"
          >
            {tableNumber ? (
              `Confirm Order - ₺${totalPrice.toFixed(2)}`
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Proceed to Checkout - ₺{totalPrice.toFixed(2)}
              </>
            )}
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="lg"
              onClick={closeCart}
              className="flex-1 restaurant-bg-secondary hover:restaurant-bg-secondary/10 restaurant-font-body"
            >
              Continue Shopping
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={clearCart}
              className="restaurant-bg-secondary  hover:bg-red-50 text-red-600 hover:text-red-700 restaurant-font-body"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* QR Scanner */}
        <QRScanner
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onTableScanned={handleTableScanned}
        />
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
