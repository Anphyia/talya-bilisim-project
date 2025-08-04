'use client';

import { Header } from '@/components/layout/Header';
import { FoodDetailModal } from '@/components/food/FoodDetailModal';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { CategoryBreadcrumb } from '@/components/layout/Navigation/CategoryBreadcrumb';
import { SubcategoryNavigation } from '@/components/layout/Navigation/SubcategoryNavigation';
import { CategorySection } from '@/components/category/CategorySection';
import { SubcategoryPageSkeleton } from '@/components/ui/SubcategorySkeleton';
import { mockFoodData, Food } from '@/lib/data/mockData';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const categoryData = resolvedParams ? mockFoodData[resolvedParams.slug] : null;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Add smooth scroll behavior to the document
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    // Handle hash navigation on page load
    if (!isLoading && categoryData) {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const timer = setTimeout(() => {
          const element = document.getElementById(`section-${hash}`);
          if (element) {
            const breadcrumbHeight = 73;
            const subcategoryNavHeight = 65;
            const sectionHeaderOffset = 20;
            const totalOffset = breadcrumbHeight + subcategoryNavHeight + sectionHeaderOffset;
            
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, categoryData]);

  if (!categoryData && !isLoading) {
    notFound();
  }

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen restaurant-bg-background">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <ErrorMessage
              title="Failed to Load Category"
              message="We couldn't load this category. Please try again."
              onRetry={() => {
                setError(null);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1200);
              }}
              showRetry
              className="py-12"
            />
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen restaurant-bg-background">
          <Header />
          <SubcategoryPageSkeleton sectionCount={4} />
        </div>
      </ErrorBoundary>
    );
  }

  if (!categoryData) {
    notFound();
  }

  const subcategoriesArray = Object.values(categoryData.subcategories);
  const subcategoriesForNav = subcategoriesArray.map(sub => ({
    id: sub.id,
    name: sub.name
  }));

  return (
    <ErrorBoundary>
      <div className="min-h-screen restaurant-bg-background">
        <Header />

        <CategoryBreadcrumb
          categoryName={categoryData.name}
        />

        <SubcategoryNavigation subcategories={subcategoriesForNav} />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Category Header */}
          <div className="mb-12">
            <h1 className="restaurant-text-foreground restaurant-font-heading text-3xl md:text-4xl font-bold">
              {categoryData.name}
            </h1>
          </div>

          {/* Subcategory Sections */}
          <div className="space-y-1">
            {subcategoriesArray.map((subcategory, index) => (
              <CategorySection
                key={subcategory.id}
                subcategory={subcategory}
                onFoodClick={handleFoodClick}
                className={index === subcategoriesArray.length - 1 ? 'pb-8' : ''}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 py-12 border-t restaurant-border">
            <h3 className="restaurant-text-foreground restaurant-font-heading text-2xl md:text-3xl font-bold mb-4">
              Explore More Categories
            </h3>
            <p className="restaurant-text-muted restaurant-font-body text-lg mb-6 max-w-2xl mx-auto">
              Discover more delicious options from our other menu categories.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 restaurant-bg-primary restaurant-text-primary-foreground restaurant-rounded-md hover:restaurant-bg-primary/90 transition-colors duration-200 restaurant-font-body font-medium"
            >
              Browse All Categories
            </Link>
          </div>
        </main>

        {/* Food Detail Modal */}
        <FoodDetailModal
          food={selectedFood}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </ErrorBoundary>
  );
}
