'use client';

import { FoodCard } from '@/components/food/FoodCard';
import { Separator } from '@/components/ui/separator';
import { Food } from '@/lib/data/mockData';

interface CategorySectionProps {
  subcategory: {
    id: string;
    name: string;
    items: Food[];
  };
  onFoodClick: (food: Food) => void;
  className?: string;
}

export function CategorySection({ subcategory, onFoodClick, className = '' }: CategorySectionProps) {
  return (
    <section
      id={`section-${subcategory.id}`}
      className={`scroll-mt-[158px] ${className}`}
      aria-labelledby={`heading-${subcategory.id}`}
    >
      <div className="space-y-2">
        {/* Section Header */}
        <div className="text-left">
          <h2
            id={`heading-${subcategory.id}`}
            className="restaurant-text-foreground restaurant-font-heading text-2xl md:text-3xl font-bold"
          >
            {subcategory.name}
          </h2>
        </div>

        {/* Items Grid */}
        <div className="restaurant-grid-menu-items">
          {subcategory.items.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onClick={() => onFoodClick(food)}
            />
          ))}
        </div>

        <div className="flex justify-center py-2 md:py-4 lg:py-8">
          <Separator className="w-24 restaurant-bg-border" />
        </div>
      </div>
    </section>
  );
}
