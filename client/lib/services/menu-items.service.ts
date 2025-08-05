import { MenuItem } from '@/types/api-response-types';
import { ProcessedMenuItem, ServiceResponse } from '../../types/service-types';
import { apiService } from './api.service';

class MenuItemsService {
    /**
     * Fetch raw menu items data
     */
    async getMenuItems(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<MenuItem[]>> {
        const response = await apiService.fetchRestaurantData({
            revalidate: cacheConfig?.revalidate || 300, // 5 minutes cache
            tags: ['menu-items'],
        });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        return {
            data: response.data.menuArr,
            error: null,
            success: true,
        };
    }

    /**
     * Get processed menu items with clean structure
     */
    async getProcessedMenuItems(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<ProcessedMenuItem[]>> {
        const response = await this.getMenuItems(cacheConfig);

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const menuItems = response.data;

        // Process menu items
        const processedItems: ProcessedMenuItem[] = menuItems
            .map(item => {
                // Parse allergens
                let allergens: string[] = [];
                if (item.ALLERGENS) {
                    try {
                        allergens = item.ALLERGENS.split(',').map(a => a.trim()).filter(Boolean);
                    } catch {
                        allergens = [item.ALLERGENS];
                    }
                }

                return {
                    id: item.ID,
                    name: item.NAME,
                    price: item.PRICE,
                    photoUrl: item.PHOTOURL,
                    description: item.DISPLAYINFO || undefined,
                    groupId: item.GROUPID,
                    groupName: item.GROUPNAME,
                    allergens,
                    dietary: {
                        vegetarian: item.VEGETARIAN,
                        alcohol: item.ALCOHOL,
                        pork: item.PORK,
                        gluten: item.GLUTEN,
                    },
                    displayOrder: item.DISPLAYORDER,
                };
            })
            .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
            data: processedItems,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu items by group ID
     */
    async getMenuItemsByGroup(groupId: number, cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<ProcessedMenuItem[]>> {
        const response = await this.getProcessedMenuItems(cacheConfig);

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const filteredItems = response.data.filter(item => item.groupId === groupId);

        return {
            data: filteredItems,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu item by ID
     */
    async getMenuItemById(itemId: number): Promise<ServiceResponse<ProcessedMenuItem>> {
        const response = await this.getProcessedMenuItems({ revalidate: 300 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const foundItem = response.data.find(item => item.id === itemId);

        if (!foundItem) {
            return {
                data: null,
                error: { message: `Menu item with ID ${itemId} not found` },
                success: false,
            };
        }

        return {
            data: foundItem,
            error: null,
            success: true,
        };
    }

    /**
     * Search menu items by name or description
     */
    async searchMenuItems(searchTerm: string): Promise<ServiceResponse<ProcessedMenuItem[]>> {
        const response = await this.getProcessedMenuItems({ revalidate: 300 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const searchLower = searchTerm.toLowerCase();
        const searchResults = response.data.filter(item =>
            item.name.toLowerCase().includes(searchLower) ||
            (item.description && item.description.toLowerCase().includes(searchLower))
        );

        return {
            data: searchResults,
            error: null,
            success: true,
        };
    }

    /**
     * Get vegetarian menu items
     */
    async getVegetarianItems(): Promise<ServiceResponse<ProcessedMenuItem[]>> {
        const response = await this.getProcessedMenuItems({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const vegetarianItems = response.data.filter(item => item.dietary.vegetarian);

        return {
            data: vegetarianItems,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu items without specific allergens
     */
    async getItemsWithoutAllergens(excludeAllergens: string[]): Promise<ServiceResponse<ProcessedMenuItem[]>> {
        const response = await this.getProcessedMenuItems({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const safeItems = response.data.filter(item => {
            const hasExcludedAllergen = excludeAllergens.some(allergen =>
                item.allergens.some(itemAllergen =>
                    itemAllergen.toLowerCase().includes(allergen.toLowerCase())
                )
            );
            return !hasExcludedAllergen;
        });

        return {
            data: safeItems,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu items in price range
     */
    async getItemsByPriceRange(minPrice: number, maxPrice: number): Promise<ServiceResponse<ProcessedMenuItem[]>> {
        const response = await this.getProcessedMenuItems({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const filteredItems = response.data.filter(item =>
            item.price >= minPrice && item.price <= maxPrice
        );

        return {
            data: filteredItems,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu items sorted by price
     */
    async getItemsSortedByPrice(ascending = true): Promise<ServiceResponse<ProcessedMenuItem[]>> {
        const response = await this.getProcessedMenuItems({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const sortedItems = [...response.data].sort((a, b) =>
            ascending ? a.price - b.price : b.price - a.price
        );

        return {
            data: sortedItems,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu items statistics
     */
    async getMenuItemsStats(): Promise<ServiceResponse<{
        total: number;
        vegetarian: number;
        withAlcohol: number;
        withPork: number;
        glutenFree: number;
        averagePrice: number;
        priceRange: { min: number; max: number };
    }>> {
        const response = await this.getProcessedMenuItems({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const items = response.data;
        const total = items.length;
        const vegetarian = items.filter(item => item.dietary.vegetarian).length;
        const withAlcohol = items.filter(item => item.dietary.alcohol).length;
        const withPork = items.filter(item => item.dietary.pork).length;
        const glutenFree = items.filter(item => !item.dietary.gluten).length;

        const prices = items.map(item => item.price);
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / total;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
            data: {
                total,
                vegetarian,
                withAlcohol,
                withPork,
                glutenFree,
                averagePrice: Math.round(averagePrice * 100) / 100,
                priceRange: { min: minPrice, max: maxPrice },
            },
            error: null,
            success: true,
        };
    }

    /**
     * Get grouped menu items by category
     */
    async getGroupedMenuItems(): Promise<ServiceResponse<Record<string, ProcessedMenuItem[]>>> {
        const response = await this.getProcessedMenuItems({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const grouped: Record<string, ProcessedMenuItem[]> = {};

        response.data.forEach(item => {
            const groupName = item.groupName;
            if (!grouped[groupName]) {
                grouped[groupName] = [];
            }
            grouped[groupName].push(item);
        });

        // Sort items within each group
        Object.keys(grouped).forEach(groupName => {
            grouped[groupName].sort((a, b) => a.displayOrder - b.displayOrder);
        });

        return {
            data: grouped,
            error: null,
            success: true,
        };
    }
}

// Export singleton instance
export const menuItemsService = new MenuItemsService();

// Export class for testing
export { MenuItemsService };
