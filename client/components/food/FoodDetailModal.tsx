'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Separator } from '../ui/separator';
import { useCartStore } from '@/lib/stores/cartStore';
import { Minus, Plus } from 'lucide-react';

interface Food {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  allergens: string[];
  category: string;
  isNew?: boolean;
}

interface FoodDetailModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FoodDetailModal({ food, isOpen, onClose }: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { addItem } = useCartStore();

  if (!food) return null;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = (food.price * quantity).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto restaurant-bg-background">
        <DialogHeader>
          <DialogTitle className="restaurant-text-foreground restaurant-font-heading text-xl font-bold">
            {food.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Food Image */}
          <div className="aspect-[3/2] relative restaurant-rounded-lg overflow-hidden">
            <Image
              src={food.image}
              alt={food.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            {/* New Badge */}
            {food.isNew && (
              <Badge className="absolute top-3 left-3 restaurant-bg-primary text-white z-10">
                New
              </Badge>
            )}
          </div>

          {/* Price and Category */}
          <div className="flex items-center justify-between">
            <span className="restaurant-text-primary restaurant-font-heading text-2xl font-bold">
              ₺{food.price.toFixed(2)}
            </span>
            <Badge
              variant="secondary"
              className="restaurant-bg-secondary/10 restaurant-text-secondary capitalize"
            >
              {food.category.replace('-', ' ')}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className="restaurant-text-foreground restaurant-font-heading text-base font-semibold mb-2">
              Description
            </h4>
            <p className="restaurant-text-muted restaurant-font-body text-sm leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Allergens */}
          <div>
            <h4 className="restaurant-text-foreground restaurant-font-heading text-base font-semibold mb-2">
              Allergens
            </h4>
            <div className="flex flex-wrap gap-1">
              {food.allergens.map((allergen, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="restaurant-border restaurant-text-foreground text-xs"
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <h4 className="restaurant-text-foreground restaurant-font-heading text-base font-semibold mb-2">
              Quantity
            </h4>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 p-0 restaurant-border restaurant-bg-secondary hover:restaurant-bg-primary/10"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="restaurant-text-foreground restaurant-font-heading text-lg font-semibold min-w-[1.5rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="w-8 h-8 p-0 restaurant-border restaurant-bg-secondary hover:restaurant-bg-primary/10"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

        </div>

        {/* Footer with only Add to Cart button */}
        <div className="pt-4">
          <Button
            onClick={() => {
              // Add to cart using Zustand store
              addItem(food, quantity, notes);
              onClose();
              // Reset form
              setQuantity(1);
              setNotes('');
            }}
            className="w-full restaurant-bg-primary hover:restaurant-bg-primary/90 text-white font-semibold py-3"
          >
            Add to Cart - ₺{totalPrice}
          </Button>

          <Separator className="my-4" />


          {/* Notes */}
          <div>
            <h4 className="restaurant-text-foreground restaurant-font-heading text-base font-semibold mb-2">
              Special Instructions
            </h4>
            <Textarea
              placeholder="Write your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="restaurant-border restaurant-rounded-md text-sm"
              rows={3}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FoodDetailModal;
