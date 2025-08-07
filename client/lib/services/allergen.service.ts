import { Allergen } from '@/types/api-response-types';
import { ServiceResponse } from '@/types/service-types';
import { restaurantService } from './restaurant.service';

class AllergenService {
    private allergenCache: Map<number, string> = new Map();
    private cacheExpiry: number = 0;
    private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds

    /**
     * Get allergen mapping from ID to name
     */
    private async getAllergenMapping(): Promise<Map<number, string>> {
        const now = Date.now();
        
        // Return cached data if still valid
        if (this.allergenCache.size > 0 && now < this.cacheExpiry) {
            return this.allergenCache;
        }

        // Fetch fresh data
        const response = await restaurantService.getAllergens();
        
        if (!response.success || !response.data) {
            console.warn('Failed to fetch allergens, using empty mapping');
            return new Map();
        }

        // Clear existing cache
        this.allergenCache.clear();

        // Parse allergen data
        try {
            const allergens = response.data as Allergen[];
            allergens.forEach((allergen: Allergen) => {
                if (allergen.ID && allergen.NAME) {
                    this.allergenCache.set(allergen.ID, allergen.NAME);
                }
            });
            
            // Set cache expiry
            this.cacheExpiry = now + this.CACHE_DURATION;
        } catch (error) {
            console.error('Error parsing allergen data:', error);
        }

        return this.allergenCache;
    }

    /**
     * Convert allergen IDs to names
     */
    async convertAllergenIdsToNames(allergenIds: string[]): Promise<string[]> {
        if (!allergenIds || allergenIds.length === 0) {
            return [];
        }

        const mapping = await this.getAllergenMapping();
        const allergenNames: string[] = [];

        for (const idStr of allergenIds) {
            const id = parseInt(idStr.trim());
            if (!isNaN(id)) {
                const name = mapping.get(id);
                if (name) {
                    allergenNames.push(name);
                } else {
                    // Fallback: use the ID if name not found
                    allergenNames.push(`Allergen ${id}`);
                }
            }
        }

        return allergenNames;
    }

    /**
     * Convert single allergen ID to name
     */
    async convertAllergenIdToName(allergenId: string | number): Promise<string | null> {
        const mapping = await this.getAllergenMapping();
        const id = typeof allergenId === 'string' ? parseInt(allergenId.trim()) : allergenId;
        
        if (isNaN(id)) {
            return null;
        }

        return mapping.get(id) || `Allergen ${id}`;
    }

    /**
     * Get all available allergens
     */
    async getAllAllergens(): Promise<ServiceResponse<Allergen[]>> {
        const response = await restaurantService.getAllergens();
        
        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error || { message: 'Failed to fetch allergens' },
                success: false,
            };
        }

        try {
            const allergens = response.data as Allergen[];
            return {
                data: allergens,
                error: null,
                success: true,
            };
        } catch {
            return {
                data: null,
                error: { message: 'Failed to parse allergen data' },
                success: false,
            };
        }
    }

    /**
     * Check if a menu item contains specific allergens
     */
    async hasAllergen(allergenIds: string[], checkAllergenId: number): Promise<boolean> {
        return allergenIds.some(id => {
            const numId = parseInt(id.trim());
            return !isNaN(numId) && numId === checkAllergenId;
        });
    }

    /**
     * Filter items by allergen presence/absence
     */
    async filterByAllergens(
        allergenIds: string[], 
        excludeAllergenIds: number[]
    ): Promise<boolean> {
        for (const excludeId of excludeAllergenIds) {
            const hasAllergen = await this.hasAllergen(allergenIds, excludeId);
            if (hasAllergen) {
                return false; // Item contains excluded allergen
            }
        }
        return true; // Item is safe
    }

    /**
     * Clear the allergen cache (useful for testing or forcing refresh)
     */
    clearCache(): void {
        this.allergenCache.clear();
        this.cacheExpiry = 0;
    }
}

// Export singleton instance
export const allergenService = new AllergenService();

// Export class for testing
export { AllergenService };
