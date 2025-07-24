import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface CategorySkeletonProps {
  className?: string;
}

export function CategorySkeleton({ className = '' }: CategorySkeletonProps) {
  return (
    <Card className={`
      relative overflow-hidden border-0 p-0
      restaurant-rounded-lg
      ${className}
    `}>
      <div className="aspect-[3/2] relative">
        {/* Image skeleton */}
        <Skeleton className="absolute inset-0 restaurant-rounded-lg bg-gray-300" />

        {/* Gradient overlay skeleton */}
        <div className="
          absolute inset-0 
          bg-gradient-to-t from-black/70 via-black/20 to-transparent
        " />

        {/* Content skeleton - centered like real CategoryCard */}
        <CardContent className="
          absolute inset-0 flex items-center justify-center p-4 md:p-6
        ">
          {/* Title skeleton - matching responsive text sizes */}
          <Skeleton className="
            h-8 min-[425px]:h-9 md:h-9 lg:h-10 
            w-32 min-[425px]:w-40 md:w-40 lg:w-48
            restaurant-rounded-md bg-white/20
          " />
        </CardContent>

        {/* Hover indicator skeleton */}
        <div className="
          absolute top-4 right-4
          w-8 h-8 md:w-10 md:h-10
          restaurant-rounded-md
          opacity-0
        ">
          <Skeleton className="w-full h-full restaurant-rounded-md bg-white/30" />
        </div>
      </div>
    </Card>
  );
}

// Grid of category skeletons
interface CategorySkeletonGridProps {
  count?: number;
  className?: string;
}

export function CategorySkeletonGrid({ 
  count = 4, 
  className = '' 
}: CategorySkeletonGridProps) {
  return (
    <div className={`
      restaurant-grid-categories
      ${className}
    `}>
      {Array.from({ length: count }).map((_, index) => (
        <CategorySkeleton key={index} />
      ))}
    </div>
  );
}
