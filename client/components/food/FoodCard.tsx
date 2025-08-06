'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface FoodCardProps {
  food: Food;
  onClick: () => void;
  className?: string;
}

export function FoodCard({ food, onClick, className = '' }: FoodCardProps) {
  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg restaurant-rounded-lg overflow-hidden p-0 ${className}`}>
      {/* Desktop Layout (md and up) */}
      <div className="hidden md:block pb-4">
        <div className="aspect-[4/3] relative">
          <Image
            src={food.image}
            alt={food.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* New Badge */}
          {food.isNew && (
            <Badge className="absolute top-3 left-3 restaurant-bg-primary text-white z-10">
              New
            </Badge>
          )}
        </div>

        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="restaurant-text-foreground restaurant-font-heading text-lg md:text-xl font-bold line-clamp-1">
              {food.name}
            </h3>
            <span className="restaurant-text-primary restaurant-font-heading text-lg md:text-xl font-bold ml-2">
              ₺{food.price.toFixed(2)}
            </span>
          </div>

          <p className="restaurant-text-muted restaurant-font-body text-sm md:text-base line-clamp-2 mb-4 min-h-[2.5rem] md:min-h-[3rem]">
            {food.description}
          </p>

          {/* Allergens on Desktop */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {food.allergens.map((allergen, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs restaurant-border restaurant-text-muted"
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={onClick}
            className="w-full restaurant-bg-primary restaurant-text-background hover:restaurant-bg-primary/90 transition-colors duration-300 restaurant-rounded-md"
          >
            View Details
          </Button>
        </CardContent>
      </div>

      {/* Mobile Layout (below md) - Entire card is clickable */}
      <div className="block md:hidden" onClick={onClick}>
        <div className="flex min-h-[120px] cursor-pointer">
          {/* Left: Image Wrapper (fills full height) */}
          <div className="relative w-28 flex-shrink-0">
            <div className="absolute inset-0">
              <Image
                src={food.image}
                alt={food.name}
                fill
                className="object-cover rounded-l-lg"
                sizes="112px"
              />
              {food.isNew && (
                <Badge className="absolute top-1 left-1 restaurant-bg-primary text-white text-xs px-1 py-0.5">
                  New
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 flex flex-col justify-between px-3 py-3">
            <div className="flex-1">
              <h3 className="restaurant-text-foreground restaurant-font-heading text-base font-bold line-clamp-1 mb-1">
                {food.name}
              </h3>
              <div className="min-h-[2.5rem] flex items-start mb-2">
                <p className="restaurant-text-muted restaurant-font-body text-sm line-clamp-2">
                  {food.description}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <span className="restaurant-text-primary restaurant-font-heading text-base font-bold">
                ₺{food.price.toFixed(2)}
              </span>
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double triggering
                  onClick();
                }}
                size="sm"
                className="restaurant-bg-primary hover:restaurant-bg-primary/90 text-white restaurant-rounded-md text-xs px-3 py-1"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FoodCard;
