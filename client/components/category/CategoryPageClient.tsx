'use client';

import { FoodDetailModal } from '@/components/food/FoodDetailModal';
import { CategorySection } from '@/components/category/CategorySection';
import { Food, CategoryData } from '@/lib/data/mockData';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CategoryPageClientProps {
  categoryData: CategoryData;
}

export function CategoryPageClient({ categoryData }: CategoryPageClientProps) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Add smooth scroll behavior to the document
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    // Handle hash navigation on page load
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
  }, [categoryData]);

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  const subcategoriesArray = Object.values(categoryData.subcategories);

  return (
    <>
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
        <Button
          asChild
          size="lg"
          className="inline-flex items-center px-6 py-3 restaurant-bg-primary restaurant-text-background restaurant-rounded-md hover:restaurant-bg-primary/90 transition-colors duration-200 restaurant-font-body font-medium"
        >
          <Link href="/">
            Browse All Categories
          </Link>
        </Button>
      </div>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
