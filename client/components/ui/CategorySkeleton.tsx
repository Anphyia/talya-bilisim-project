import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface CategorySkeletonProps {
  className?: string;
}

export function CategorySkeleton({ className = '' }: CategorySkeletonProps) {
  return (
    <Card className={`
      restaurant-rounded-lg overflow-hidden
      relative border-0 p-0
      ${className}
    `}>
      {/* Image skeleton */}
      <Skeleton className="aspect-[5/3] w-full restaurant-rounded-lg bg-gray-300" />
      
      {/* Content overlay skeleton */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
        {/* Title skeleton */}
        <Skeleton className="h-6 md:h-8 w-3/4 mb-2 restaurant-rounded-md bg-gray-100/80" />
        
        {/* Description skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-full restaurant-rounded-md bg-gray-100/70" />
          <Skeleton className="h-4 w-2/3 restaurant-rounded-md bg-gray-100/70" />
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
