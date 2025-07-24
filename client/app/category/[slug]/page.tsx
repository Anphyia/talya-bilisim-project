'use client';

import { Header } from '@/components/layout/Header';
import { FoodCard } from '@/components/food/FoodCard';
import { FoodDetailModal } from '@/components/food/FoodDetailModal';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { MenuItemSkeletonGrid } from '@/components/ui/MenuItemSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';

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

// Mock data for different categories
const mockFoodData: Record<string, { name: string; items: Food[] }> = {
  'appetizers': {
    name: 'Appetizers',
    items: [
      {
        id: '1',
        name: 'Bruschetta al Pomodoro',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&h=400&fit=crop',
        description: 'Fresh tomatoes, basil, and garlic on toasted bread Fresh tomatoes, basil, and garlic on toasted bread Fresh tomatoes, basil, and garlic on toasted bread Fresh tomatoes, basil, and garlic on toasted bread',
        allergens: ['Gluten', 'None'],
        category: 'appetizers',
        isNew: true
      },
      {
        id: '2',
        name: 'Calamari Rings',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1734771219838-61863137b117?q=80&w=2070&auto=format&fit=crop',
        description: 'Crispy fried squid rings with marinara sauce',
        allergens: ['Gluten', 'Eggs', 'Seafood'],
        category: 'appetizers'
      },
      {
        id: '3',
        name: 'Buffalo Wings',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500&h=400&fit=crop',
        description: 'Spicy chicken wings with blue cheese dressing',
        allergens: ['Dairy'],
        category: 'appetizers'
      },
      {
        id: '4',
        name: 'Spinach & Artichoke Dip',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&h=400&fit=crop',
        description: 'Creamy dip with spinach and artichokes, served with tortilla chips',
        allergens: ['Dairy', 'Gluten'],
        category: 'appetizers'
      }
    ]
  },
  'main-courses': {
    name: 'Main Courses',
    items: [
      {
        id: '5',
        name: 'Grilled Salmon',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop',
        description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
        allergens: ['Fish', 'Dairy'],
        category: 'main-courses',
        isNew: true
      },
      {
        id: '6',
        name: 'Ribeye Steak',
        price: 32.99,
        image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1470&auto=format&fit=crop',
        description: '12oz prime ribeye with garlic mashed potatoes, 12oz prime ribeye with garlic mashed potatoes, 12oz prime ribeye with garlic mashed potatoes,12oz prime ribeye with garlic mashed potatoes, 12oz prime ribeye with garlic mashed potatoes, 12oz prime ribeye with garlic mashed potatoes',
        allergens: ['Dairy'],
        category: 'main-courses'
      },
      {
        id: '7',
        name: 'Chicken Parmesan',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=2070&auto=format&fit=crop',
        description: 'Breaded chicken breast with marinara and mozzarella',
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        category: 'main-courses'
      },
      {
        id: '8',
        name: 'Vegetarian Pasta',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop',
        description: 'Penne pasta with roasted vegetables and pesto',
        allergens: ['Gluten', 'Dairy', 'Nuts'],
        category: 'main-courses'
      }
    ]
  },
  'desserts': {
    name: 'Desserts',
    items: [
      {
        id: '9',
        name: 'Tiramisu',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop',
        description: 'Classic Italian dessert with coffee and mascarpone',
        allergens: ['Dairy', 'Eggs', 'Gluten'],
        category: 'desserts'
      },
      {
        id: '10',
        name: 'Chocolate Lava Cake',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=400&fit=crop',
        description: 'Warm chocolate cake with molten center and vanilla ice cream',
        allergens: ['Dairy', 'Eggs', 'Gluten'],
        category: 'desserts',
        isNew: true
      }
    ]
  },
  'beverages': {
    name: 'Beverages',
    items: [
      {
        id: '11',
        name: 'Fresh Orange Juice',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
        description: 'Freshly squeezed orange juice',
        allergens: ['None'],
        category: 'beverages'
      },
      {
        id: '12',
        name: 'Craft Coffee',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop',
        description: 'Single origin coffee beans, expertly brewed',
        allergens: ['None'],
        category: 'beverages'
      }
    ]
  },
  'salads': {
    name: 'Salads',
    items: [
      {
        id: '13',
        name: 'Caesar Salad',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
        description: 'Crisp romaine lettuce with parmesan and croutons',
        allergens: ['Dairy', 'Gluten', 'Eggs'],
        category: 'salads'
      }
    ]
  },
  'soups': {
    name: 'Soups',
    items: [
      {
        id: '14',
        name: 'Tomato Basil Soup',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
        description: 'Creamy tomato soup with fresh basil',
        allergens: ['Dairy'],
        category: 'soups'
      }
    ]
  }
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryData = mockFoodData[params.slug];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
                setTimeout(() => setIsLoading(false), 1000);
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
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Loading State */}
          {isLoading && (
            <div>
              <div className="mb-8 text-center">
                <Skeleton className="h-8 w-48 mx-auto mb-4 restaurant-rounded-md bg-gray-300" />
                <Skeleton className="h-6 w-96 mx-auto restaurant-rounded-md bg-gray-200" />
              </div>
              <MenuItemSkeletonGrid count={6} />
            </div>
          )}

          {/* Category Content */}
          {!isLoading && categoryData && (
            <div>
              {/* Category Header */}
              <div className="mb-8 text-center">
                <h1 className="restaurant-text-foreground restaurant-font-heading text-3xl md:text-4xl font-bold mb-4">
                  {categoryData.name}
                </h1>
                <p className="restaurant-text-muted restaurant-font-body text-lg">
                  Discover our delicious {categoryData.name.toLowerCase()} selection
                </p>
              </div>

              {/* Food Items Grid */}
              <div className="restaurant-grid-menu-items">
                {categoryData.items.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onClick={() => handleFoodClick(food)}
                  />
                ))}
              </div>
            </div>
          )}
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
