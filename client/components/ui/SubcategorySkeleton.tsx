import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItemSkeletonGrid } from '@/components/ui/MenuItemSkeleton';
import { Separator } from '@/components/ui/separator';

// Breadcrumb skeleton
export function BreadcrumbSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-12 restaurant-rounded-md bg-gray-300" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-24 restaurant-rounded-md bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

// Subcategory navigation skeleton
export function SubcategoryNavigationSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`sticky top-[73px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton 
                key={index} 
                className="h-8 w-20 restaurant-rounded-md bg-gray-300 flex-shrink-0" 
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// Individual section skeleton
export function CategorySectionSkeleton({ className = '' }: { className?: string }) {
  return (
    <section className={`scroll-mt-[158px] ${className}`}>
      <div className="space-y-6">
        {/* Section Header Skeleton */}
        <div className="text-left">
          <Skeleton className="h-8 w-32 restaurant-rounded-md bg-gray-300" />
        </div>

        {/* Items Grid Skeleton */}
        <MenuItemSkeletonGrid count={4} />

        {/* Visual Separator */}
        <div className="flex justify-center py-8">
          <Separator className="w-24 restaurant-bg-border" />
        </div>
      </div>
    </section>
  );
}

// Complete subcategory page skeleton
interface SubcategoryPageSkeletonProps {
  sectionCount?: number;
  className?: string;
}

export function SubcategoryPageSkeleton({ 
  sectionCount = 3, 
  className = '' 
}: SubcategoryPageSkeletonProps) {
  return (
    <div className={`min-h-screen restaurant-bg-background ${className}`}>
      {/* Breadcrumb Skeleton */}
      <BreadcrumbSkeleton />
      
      {/* Subcategory Navigation Skeleton */}
      <SubcategoryNavigationSkeleton />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Category Header Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-10 w-64 restaurant-rounded-md bg-gray-300" />
        </div>

        {/* Sections Skeleton */}
        <div className="space-y-16">
          {Array.from({ length: sectionCount }).map((_, index) => (
            <CategorySectionSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
