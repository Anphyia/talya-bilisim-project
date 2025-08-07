import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { CategoryBreadcrumb } from '@/components/layout/Navigation/CategoryBreadcrumb';
import { SubcategoryNavigation } from '@/components/layout/Navigation/SubcategoryNavigation';
import { CategoryPageClient } from '@/components/category/CategoryPageClient';
import { SubcategoryPageSkeleton } from '@/components/ui/SubcategorySkeleton';
import { createCategoryDataFromBasketMenu } from '@/lib/data/dataMapper';
import { basketMenuService, menuItemsService, restaurantService } from '@/lib/services';
import { RestaurantDataProvider } from '@/components/providers/RestaurantDataProvider';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const resolvedParams = await params;

    const [basketCategoryResponse, menuItemsResponse, restaurantResponse] = await Promise.all([
      basketMenuService.getBasketMenuCategoryBySlug(resolvedParams.slug),
      menuItemsService.getProcessedMenuItems(),
      restaurantService.getRestaurantInfo()
    ]);

    if (!basketCategoryResponse.success || !basketCategoryResponse.data) {
      if (basketCategoryResponse.error?.status === 404) {
        notFound();
      }
      throw new Error(basketCategoryResponse.error?.message || 'Failed to load category');
    }

    if (!menuItemsResponse.success || !menuItemsResponse.data) {
      throw new Error(menuItemsResponse.error?.message || 'Failed to load menu items');
    }

    // Convert basket menu category to CategoryData format
    const categoryData = createCategoryDataFromBasketMenu(
      basketCategoryResponse.data,
      menuItemsResponse.data
    );

    const subcategoriesArray = Object.values(categoryData.subcategories);
    const subcategoriesForNav = subcategoriesArray.map(sub => ({
      id: sub.id,
      name: sub.name
    }));

    const restaurantData = restaurantResponse.success ? restaurantResponse.data : null;

    return (
      <ErrorBoundary>
        <RestaurantDataProvider restaurantData={restaurantData}>
          <div className="min-h-screen restaurant-bg-background">
            <Header />

            <CategoryBreadcrumb
              categoryName={categoryData.name}
            />

            <SubcategoryNavigation subcategories={subcategoriesForNav} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <CategoryPageClient categoryData={categoryData} />
            </main>
          </div>
        </RestaurantDataProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error loading category data:', error);
    return (
      <ErrorBoundary>
        <RestaurantDataProvider restaurantData={null}>
          <div className="min-h-screen restaurant-bg-background">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <ErrorMessage
                title="Failed to Load Category"
                message="We couldn't load this category. Please try again."
                className="py-12"
              />
            </main>
          </div>
        </RestaurantDataProvider>
      </ErrorBoundary>
    );
  }
}

// Optional: Add loading UI for better UX
export function Loading() {
  return (
    <ErrorBoundary>
      <RestaurantDataProvider restaurantData={null}>
        <div className="min-h-screen restaurant-bg-background">
          <Header />
          <SubcategoryPageSkeleton sectionCount={4} />
        </div>
      </RestaurantDataProvider>
    </ErrorBoundary>
  );
}
