import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface MenuItemSkeletonProps {
  className?: string;
}

export function MenuItemSkeleton({ className = '' }: MenuItemSkeletonProps) {
  return (
    <Card className={`
      restaurant-rounded-lg overflow-hidden
      restaurant-bg-background border restaurant-border
      ${className}
    `}>
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full restaurant-rounded-lg bg-gray-300" />
      
      {/* Content skeleton */}
      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 restaurant-rounded-md bg-gray-300" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full restaurant-rounded-md bg-gray-200" />
          <Skeleton className="h-4 w-2/3 restaurant-rounded-md bg-gray-200" />
        </div>
      </CardContent>
      
      {/* Footer skeleton */}
      <CardFooter className="p-4 pt-2 flex items-center justify-between">
        <Skeleton className="h-6 w-20 restaurant-rounded-md bg-gray-300" />
        <Skeleton className="h-9 w-24 restaurant-rounded-md bg-gray-250" />
      </CardFooter>
    </Card>
  );
}

// Grid of menu item skeletons
interface MenuItemSkeletonGridProps {
  count?: number;
  className?: string;
}

export function MenuItemSkeletonGrid({ 
  count = 6, 
  className = '' 
}: MenuItemSkeletonGridProps) {
  return (
    <div className={`
      restaurant-grid-menu-items
      ${className}
    `}>
      {Array.from({ length: count }).map((_, index) => (
        <MenuItemSkeleton key={index} />
      ))}
    </div>
  );
}
