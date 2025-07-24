import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItemSkeletonProps {
  className?: string;
}

export function MenuItemSkeleton({ className = '' }: MenuItemSkeletonProps) {
  return (
    <Card className={`restaurant-rounded-lg overflow-hidden p-0 ${className}`}>
      {/* Desktop Layout (md and up) */}
      <div className="hidden md:block pb-4">
        <div className="aspect-[4/3] relative">
          <Skeleton className="absolute inset-0 bg-gray-300" />
        </div>

        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-6 w-3/5 restaurant-rounded-md bg-gray-300" />
            <Skeleton className="h-6 w-16 restaurant-rounded-md bg-gray-300 ml-2" />
          </div>

          {/* Description skeleton */}
          <div className="mb-4 min-h-[3rem] space-y-2">
            <Skeleton className="h-4 w-full restaurant-rounded-md bg-gray-200" />
            <Skeleton className="h-4 w-2/3 restaurant-rounded-md bg-gray-200" />
          </div>

          {/* Allergens skeleton */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-16 restaurant-rounded-md bg-gray-200" />
              <Skeleton className="h-5 w-12 restaurant-rounded-md bg-gray-200" />
              <Skeleton className="h-5 w-20 restaurant-rounded-md bg-gray-200" />
            </div>
          </div>

          <Skeleton className="h-10 w-full restaurant-rounded-md bg-gray-300" />
        </CardContent>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="block md:hidden">
        <div className="flex min-h-[120px]">
          {/* Left: Image Wrapper */}
          <div className="relative w-28 flex-shrink-0">
            <div className="absolute inset-0">
              <Skeleton className="w-full h-full rounded-l-lg bg-gray-300" />
              {/* New Badge skeleton for mobile */}
              <div className="absolute top-1 left-1">
                <Skeleton className="h-4 w-8 restaurant-rounded-sm bg-gray-400" />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 flex flex-col justify-between px-3 py-3">
            <div className="flex-1">
              <Skeleton className="h-4 w-4/5 restaurant-rounded-md bg-gray-300 mb-1" />
              <div className="min-h-[2.5rem] flex items-start mb-2">
                <div className="space-y-1 w-full">
                  <Skeleton className="h-3 w-full restaurant-rounded-md bg-gray-200" />
                  <Skeleton className="h-3 w-3/4 restaurant-rounded-md bg-gray-200" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <Skeleton className="h-4 w-12 restaurant-rounded-md bg-gray-300" />
              <Skeleton className="h-7 w-12 restaurant-rounded-md bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
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
