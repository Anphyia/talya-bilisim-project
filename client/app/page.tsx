import { Header } from '@/components/layout/Header';
import { CategoryCard } from '@/components/layout/Navigation/CategoryCard';
import { ErrorMessage } from '@/components/error/ErrorMessage';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { basketMenuService } from '@/lib/services';
import { mapBasketMenuToCategoryNav } from '@/lib/data/dataMapper';

export default async function Home() {
  try {
    const response = await basketMenuService.getBasketMenuCategories();
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to load menu categories');
    }

    const menuCategories = response.data.map(mapBasketMenuToCategoryNav);

    return (
      <ErrorBoundary>
        <div className="min-h-screen restaurant-bg-background">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
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

            {/* Call to Action */}
            <div className="text-center mt-16 md:mt-20 py-12 md:py-16 border-t restaurant-border">
              <h3 className="restaurant-text-foreground restaurant-font-heading text-2xl md:text-3xl font-bold mb-4">
                Ready to Order?
              </h3>
              <p className="restaurant-text-muted restaurant-font-body text-lg mb-6 max-w-2xl mx-auto">
                Browse our categories above to explore our full menu and start building your perfect meal.
              </p>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error loading menu categories:', error);
    return (
      <ErrorBoundary>
        <div className="min-h-screen restaurant-bg-background">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <ErrorMessage
              title="Failed to Load Menu"
              message="We couldn't load the menu categories. Please check your connection and try again."
              className="py-12"
            />
          </main>
        </div>
      </ErrorBoundary>
    );
  }
}
