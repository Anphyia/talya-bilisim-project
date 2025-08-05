import { 
  ProcessedBasketMenu, 
  ProcessedBasketMenuDetail, 
  BasketMenuCategory,
  ProcessedMenuGroup,
  ServiceResponse, 
  CacheConfig 
} from '@/types/service-types';
import { 
  BasketMenu, 
  BasketMenuDetail
} from '@/types/api-response-types';
import { apiService } from './api.service';

/**
 * Service for handling basket menu operations
 * Basket menus are the main categories shown on the home page
 */
export class BasketMenuService {
  /**
   * Process raw basket menu data from API
   */
  private processBasketMenu(basketMenu: BasketMenu): ProcessedBasketMenu {
    return {
      id: basketMenu.ID,
      name: basketMenu.NAME,
      displayOrder: basketMenu.DISPLAYORDER,
      photoUrl: basketMenu.PHOTOURL || '',
      saleStartHour: basketMenu.SALESTARTHOUR,
      saleEndHour: basketMenu.SALEENDHOUR,
      useDepartmentProducts: basketMenu.USE_DEPARTMENT_PRODUCTS,
      departmentIds: basketMenu.DEPIDS 
        ? basketMenu.DEPIDS.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : [],
    };
  }

  /**
   * Process basket menu detail data
   */
  private processBasketMenuDetail(detail: BasketMenuDetail): ProcessedBasketMenuDetail {
    return {
      id: detail.ID,
      menuId: detail.MENUID,
      productGroupId: detail.PRODUCTGROUPID,
      productId: detail.PRODUCTID,
      displayOrder: detail.DISPLAYORDER || undefined,
    };
  }

  /**
   * Create URL-friendly slug from basket menu name
   */
  private createSlug(name: string): string {
    let slug = name.toLowerCase();
    
    // Replace Turkish characters
    slug = slug.replace(/ğ/g, 'g');
    slug = slug.replace(/ü/g, 'u');
    slug = slug.replace(/ş/g, 's');
    slug = slug.replace(/ı/g, 'i');
    slug = slug.replace(/ö/g, 'o');
    slug = slug.replace(/ç/g, 'c');
    
    // Replace spaces and special characters with hyphens
    slug = slug.replace(/[^\w\s-]/g, '');
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/-+/g, '-');
    slug = slug.replace(/^-+|-+$/g, '');
    
    return slug;
  }

  /**
   * Get all basket menus (main categories)
   */
  async getBasketMenus(cacheConfig?: CacheConfig): Promise<ServiceResponse<ProcessedBasketMenu[]>> {
    try {
      const response = await apiService.fetchRestaurantData(cacheConfig);
      
      if (!response.success || !response.data) {
        return {
          data: null,
          error: response.error || { message: 'Failed to fetch basket menus' },
          success: false,
        };
      }

      const processedBasketMenus = response.data.basketMenu
        .map(menu => this.processBasketMenu(menu))
        .sort((a, b) => a.displayOrder - b.displayOrder);

      return {
        data: processedBasketMenus,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        success: false,
      };
    }
  }

  /**
   * Get basket menu categories with their associated menu groups
   */
  async getBasketMenuCategories(cacheConfig?: CacheConfig): Promise<ServiceResponse<BasketMenuCategory[]>> {
    try {
      const response = await apiService.fetchRestaurantData(cacheConfig);
      
      if (!response.success || !response.data) {
        return {
          data: null,
          error: response.error || { message: 'Failed to fetch basket menu categories' },
          success: false,
        };
      }

      const { basketMenu, basketMenuDetail, menuGroupArr } = response.data;

      // Process basket menus
      const processedBasketMenus = basketMenu
        .map(menu => this.processBasketMenu(menu))
        .sort((a, b) => a.displayOrder - b.displayOrder);

      // Process basket menu details
      const processedDetails = basketMenuDetail.map(detail => this.processBasketMenuDetail(detail));

      // Process menu groups
      const processedMenuGroups: ProcessedMenuGroup[] = menuGroupArr.map(group => ({
        id: group.ID,
        name: group.NAME,
        displayOrder: group.DISPLAYORDER,
        photoUrl: group.PHOTOURL || '',
        parentGroupId: group.PARENTGROUPID || undefined,
      }));

      // Create map of menu groups by ID
      const menuGroupMap = new Map(processedMenuGroups.map(group => [group.id, group]));

      // Create basket menu categories
      const categories: BasketMenuCategory[] = processedBasketMenus.map(basketMenu => {
        // Find menu group IDs associated with this basket menu
        const associatedGroupIds = processedDetails
          .filter(detail => detail.menuId === basketMenu.id)
          .map(detail => detail.productGroupId)
          .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

        // Get the actual menu groups
        const menuGroups = associatedGroupIds
          .map(groupId => menuGroupMap.get(groupId))
          .filter((group): group is ProcessedMenuGroup => group !== undefined)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          id: basketMenu.id,
          name: basketMenu.name,
          slug: this.createSlug(basketMenu.name),
          photoUrl: basketMenu.photoUrl,
          displayOrder: basketMenu.displayOrder,
          menuGroups,
          menuGroupIds: associatedGroupIds,
        };
      });

      return {
        data: categories,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        success: false,
      };
    }
  }

  /**
   * Get a specific basket menu category by slug
   */
  async getBasketMenuCategoryBySlug(slug: string, cacheConfig?: CacheConfig): Promise<ServiceResponse<BasketMenuCategory>> {
    try {
      const response = await this.getBasketMenuCategories(cacheConfig);
      
      if (!response.success || !response.data) {
        return {
          data: null,
          error: response.error || { message: 'Failed to fetch basket menu categories' },
          success: false,
        };
      }

      const category = response.data.find(cat => cat.slug === slug);

      if (!category) {
        return {
          data: null,
          error: { message: 'Category not found', status: 404 },
          success: false,
        };
      }

      return {
        data: category,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        success: false,
      };
    }
  }

  /**
   * Get basket menu details
   */
  async getBasketMenuDetails(cacheConfig?: CacheConfig): Promise<ServiceResponse<ProcessedBasketMenuDetail[]>> {
    try {
      const response = await apiService.fetchRestaurantData(cacheConfig);
      
      if (!response.success || !response.data) {
        return {
          data: null,
          error: response.error || { message: 'Failed to fetch basket menu details' },
          success: false,
        };
      }

      const processedDetails = response.data.basketMenuDetail
        .map(detail => this.processBasketMenuDetail(detail))
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      return {
        data: processedDetails,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        success: false,
      };
    }
  }

  /**
   * Get menu groups for a specific basket menu
   */
  async getMenuGroupsForBasketMenu(basketMenuId: number, cacheConfig?: CacheConfig): Promise<ServiceResponse<ProcessedMenuGroup[]>> {
    try {
      const categoriesResponse = await this.getBasketMenuCategories(cacheConfig);
      
      if (!categoriesResponse.success || !categoriesResponse.data) {
        return {
          data: null,
          error: categoriesResponse.error || { message: 'Failed to fetch basket menu categories' },
          success: false,
        };
      }

      const category = categoriesResponse.data.find(cat => cat.id === basketMenuId);

      if (!category) {
        return {
          data: null,
          error: { message: 'Basket menu not found', status: 404 },
          success: false,
        };
      }

      return {
        data: category.menuGroups,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        success: false,
      };
    }
  }
}

// Export singleton instance
export const basketMenuService = new BasketMenuService();
