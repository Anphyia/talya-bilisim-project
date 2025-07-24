'use client';

import { Header } from '@/components/layout/Header';
import { CategoryCard } from '@/components/layout/Navigation/CategoryCard';
import { CategorySkeletonGrid } from '@/components/ui/CategorySkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { useState, useEffect } from 'react';

const menuCategories = [
  {
    id: '1',
    name: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&h=400&fit=crop',
    href: '/category/appetizers',
    description: 'Start your meal with our delicious appetizers and small plates',
  },
  {
    id: '2',
    name: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop',
    href: '/category/main-courses',
    description: 'Hearty and satisfying main dishes prepared with fresh ingredients',
  },
  {
    id: '3',
    name: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=400&fit=crop',
    href: '/category/desserts',
    description: 'Sweet treats and decadent desserts to end your meal perfectly',
  },
  {
    id: '4',
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
    href: '/category/beverages',
    description: 'Refreshing drinks, hot beverages, and specialty cocktails',
  },
  {
    id: '5',
    name: 'Salads',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
    href: '/category/salads',
    description: 'Fresh, healthy salads with seasonal ingredients and homemade dressings',
  },
  {
    id: '6',
    name: 'Soups',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
    href: '/category/soups',
    description: 'Warm, comforting soups made daily with the finest ingredients',
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen restaurant-bg-background">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <ErrorMessage
              title="Failed to Load Menu"
              message="We couldn't load the menu categories. Please check your connection and try again."
              onRetry={() => {
                setError(null);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1500);
              }}
              showRetry
              className="py-12"
            />
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen restaurant-bg-background">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

          {/* Loading State */}
          {isLoading && (
            <div>
              {/* Section header skeleton */}
                <div className="mb-8 text-center">
                <Skeleton className="h-8 md:h-10 w-48 md:w-64 mb-4 bg-gray-300 mx-auto" />
                <Skeleton className="h-5 md:h-6 w-72 md:w-96 bg-gray-200 mx-auto" />
                </div>

              {/* Category cards skeleton */}
              <CategorySkeletonGrid count={6} />
            </div>
          )}

          {/* Menu Categories */}
          {!isLoading && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="restaurant-text-foreground restaurant-font-heading text-2xl md:text-3xl font-bold mb-4">
                  Menu Categories
                </h2>
                <p className="restaurant-text-muted restaurant-font-body text-base md:text-lg">
                  Browse our delicious categories and find your perfect meal
                </p>
              </div>

              <div className="restaurant-grid-categories">
                {menuCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    image={category.image}
                    href={category.href}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          {!isLoading && (
            <div className="text-center mt-16 md:mt-20 py-12 md:py-16 border-t restaurant-border">
              <h3 className="restaurant-text-foreground restaurant-font-heading text-2xl md:text-3xl font-bold mb-4">
                Ready to Order?
              </h3>
              <p className="restaurant-text-muted restaurant-font-body text-lg mb-6 max-w-2xl mx-auto">
                Browse our categories above to explore our full menu and start building your perfect meal.
              </p>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
