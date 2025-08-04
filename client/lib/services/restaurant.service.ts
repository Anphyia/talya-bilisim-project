import { HotelParam } from '@/types/api-response-types';
import { ProcessedRestaurant, ServiceResponse } from '../../types/service-types';
import { apiService } from './api.service';

class RestaurantService {
    /**
     * Fetch raw restaurant configuration data
     */
    async getRestaurantConfig(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<HotelParam>> {
        const response = await apiService.fetchRestaurantData({
            revalidate: cacheConfig?.revalidate || 600, // 10 minutes cache for config
            tags: ['restaurant-config'],
        });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        return {
            data: response.data.hotelParam,
            error: null,
            success: true,
        };
    }

    /**
     * Get processed restaurant information with clean structure
     */
    async getRestaurantInfo(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<ProcessedRestaurant>> {
        const response = await this.getRestaurantConfig(cacheConfig);

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const hotel = response.data;

        // Parse allergens if available
        let allergens: unknown[] = [];
        try {
            if (hotel.ALLERGENSTBL) {
                allergens = JSON.parse(hotel.ALLERGENSTBL);
            }
        } catch (error) {
            console.warn('Failed to parse allergens data:', error);
        }

        const processedData: ProcessedRestaurant = {
            id: hotel.ID,
            name: hotel.NAME,
            logo: hotel.LOGO,
            phone: hotel.PHONE,
            address: hotel.ADDRESS || undefined,
            currency: {
                id: hotel.POSCURRENCYID,
                code: hotel.POSCURRENCYCODE,
            },
            allergens,
            rules: hotel.POSBOOKING_RULES,
            settings: {
                orderButtonActive: hotel.POSBOOKING_ORDERBUTTONACTIVE,
                askForTableNo: hotel.POSBOOKING_ASKFORTABLENO || undefined,
                tableSelectionActive: hotel.POSBOOKING_TABLESELECTIONACTIVE,
                hideEndTimes: hotel.POSBOOKING_DONOTSHOW_ENDTIMES_INTHERESERVATION,
            },
        };

        return {
            data: processedData,
            error: null,
            success: true,
        };
    }

    /**
     * Get restaurant name only (lightweight request)
     */
    async getRestaurantName(): Promise<string> {
        const response = await this.getRestaurantConfig({ revalidate: 3600 }); // 1 hour cache
        return response.data?.NAME || 'Restaurant';
    }

    /**
     * Get restaurant currency information
     */
    async getCurrencyInfo(): Promise<ServiceResponse<{ id: number; code: string; symbol?: string }>> {
        const response = await this.getRestaurantConfig({ revalidate: 3600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        return {
            data: {
                id: response.data.POSCURRENCYID,
                code: response.data.POSCURRENCYCODE,
            },
            error: null,
            success: true,
        };
    }

    /**
     * Check if restaurant allows table selection
     */
    async isTableSelectionEnabled(): Promise<boolean> {
        const response = await this.getRestaurantConfig({ revalidate: 1800 }); // 30 minutes cache
        return response.data?.POSBOOKING_TABLESELECTIONACTIVE || false;
    }

    /**
     * Check if order button is active
     */
    async isOrderButtonActive(): Promise<boolean> {
        const response = await this.getRestaurantConfig({ revalidate: 1800 });
        return response.data?.POSBOOKING_ORDERBUTTONACTIVE || false;
    }

    /**
     * Get restaurant allergens data
     */
    async getAllergens(): Promise<ServiceResponse<unknown[]>> {
        const response = await this.getRestaurantConfig({ revalidate: 3600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        let allergens: unknown[] = [];
        try {
            if (response.data.ALLERGENSTBL) {
                allergens = JSON.parse(response.data.ALLERGENSTBL);
            }
        } catch (error) {
            console.warn('Failed to parse allergens:', error);
            return {
                data: [],
                error: { message: 'Failed to parse allergens data' },
                success: false,
            };
        }

        return {
            data: allergens,
            error: null,
            success: true,
        };
    }
}

// Export singleton instance
export const restaurantService = new RestaurantService();

// Export class for testing
export { RestaurantService };
