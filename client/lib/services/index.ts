// Main API service
export { apiService, ApiService, handleApiError, isNetworkError } from './api.service';

// Entity services
export { restaurantService, RestaurantService } from './restaurant.service';
export { menuGroupsService, MenuGroupsService } from './menu-groups.service';
export { menuItemsService, MenuItemsService } from './menu-items.service';
export { tablesService, TablesService } from './tables.service';
export { basketMenuService, BasketMenuService } from './basket-menu.service';
export { allergenService, AllergenService } from './allergen.service';

// Import services for utility functions
import { apiService } from './api.service';
import { restaurantService } from './restaurant.service';
import { menuGroupsService } from './menu-groups.service';
import { menuItemsService } from './menu-items.service';
import { tablesService } from './tables.service';
import { basketMenuService } from './basket-menu.service';

// Types
export type {
  ApiError,
  ServiceResponse,
  CacheConfig,
  ApiRequestConfig,
  ProcessedMenuGroup,
  ProcessedMenuItem,
  ProcessedTable,
  ProcessedRestaurant,
  ProcessedBasketMenu,
  ProcessedBasketMenuDetail,
  BasketMenuCategory,
} from '../../types/service-types';

// Re-export API response types for convenience
export type {
  RestaurantApiResponse,
  HotelParam,
  MenuGroup,
  MenuItem,
  Table,
  Allergen,
  BasketMenu,
  BasketMenuDetail,
} from '@/types/api-response-types';

/**
 * Utility function to revalidate all restaurant data caches
 */
export const revalidateAllData = async (): Promise<void> => {
  await apiService.revalidateCache([
    'restaurant-data',
    'restaurant-config',
    'menu-groups',
    'menu-items',
    'tables',
    'basket-menus',
  ]);
};

/**
 * Utility function to check if all services are healthy
 */
export const checkServicesHealth = async (): Promise<{
  api: boolean;
  restaurant: boolean;
  menuGroups: boolean;
  menuItems: boolean;
  tables: boolean;
  basketMenus: boolean;
}> => {
  const results = {
    api: false,
    restaurant: false,
    menuGroups: false,
    menuItems: false,
    tables: false,
    basketMenus: false,
  };

  try {
    // Check API service
    const apiHealth = await apiService.healthCheck();
    results.api = apiHealth.success;

    // Check restaurant service
    const restaurantData = await restaurantService.getRestaurantName();
    results.restaurant = !!restaurantData;

    // Check menu groups service
    const menuGroups = await menuGroupsService.getMenuGroupsCount();
    results.menuGroups = menuGroups.success;

    // Check menu items service
    const menuItems = await menuItemsService.getMenuItemsStats();
    results.menuItems = menuItems.success;

    // Check tables service
    const tables = await tablesService.getTablesStats();
    results.tables = tables.success;

    // Check basket menu service
    const basketMenus = await basketMenuService.getBasketMenus();
    results.basketMenus = basketMenus.success;
  } catch (error) {
    console.error('Health check failed:', error);
  }

  return results;
};

/**
 * Utility function to get all restaurant data in one call
 * Useful for server-side rendering or initial data loading
 */
export const getAllRestaurantData = async (cacheConfig?: { revalidate?: number }) => {
  const [
    restaurantInfo,
    menuGroups,
    menuItems,
    tables,
    basketMenus,
  ] = await Promise.allSettled([
    restaurantService.getRestaurantInfo(cacheConfig),
    menuGroupsService.getProcessedMenuGroups(cacheConfig),
    menuItemsService.getProcessedMenuItems(cacheConfig),
    tablesService.getProcessedTables(cacheConfig),
    basketMenuService.getBasketMenuCategories(cacheConfig),
  ]);

  return {
    restaurant: restaurantInfo.status === 'fulfilled' ? restaurantInfo.value : null,
    menuGroups: menuGroups.status === 'fulfilled' ? menuGroups.value : null,
    menuItems: menuItems.status === 'fulfilled' ? menuItems.value : null,
    tables: tables.status === 'fulfilled' ? tables.value : null,
    basketMenus: basketMenus.status === 'fulfilled' ? basketMenus.value : null,
  };
};

/**
 * Default cache configurations for different data types
 */
export const CACHE_CONFIGS = {
  // Restaurant config changes rarely
  RESTAURANT: { revalidate: 3600 }, // 1 hour
  
  // Menu groups/categories change occasionally
  MENU_GROUPS: { revalidate: 600 }, // 10 minutes
  
  // Menu items might change more frequently
  MENU_ITEMS: { revalidate: 300 }, // 5 minutes
  
  // Tables change rarely
  TABLES: { revalidate: 1800 }, // 30 minutes
  
  // Basket menus change occasionally
  BASKET_MENUS: { revalidate: 600 }, // 10 minutes
  
  // For real-time needs
  REALTIME: { revalidate: 60 }, // 1 minute
  
  // For static content
  STATIC: { revalidate: 86400 }, // 24 hours
} as const;
