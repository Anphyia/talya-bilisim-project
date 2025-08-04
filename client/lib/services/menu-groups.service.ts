import { MenuGroup } from '@/types/api-response-types';
import { ProcessedMenuGroup, ServiceResponse } from '../../types/service-types';
import { apiService } from './api.service';

class MenuGroupsService {
    /**
     * Fetch raw menu groups data
     */
    async getMenuGroups(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<MenuGroup[]>> {
        const response = await apiService.fetchRestaurantData({
            revalidate: cacheConfig?.revalidate || 300, // 5 minutes cache
            tags: ['menu-groups'],
        });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        return {
            data: response.data.menuGroupArr,
            error: null,
            success: true,
        };
    }

    /**
     * Get processed menu groups with hierarchical structure
     */
    async getProcessedMenuGroups(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<ProcessedMenuGroup[]>> {
        const response = await this.getMenuGroups(cacheConfig);

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const menuGroups = response.data;

        // Process and organize menu groups
        const processedGroups: ProcessedMenuGroup[] = menuGroups
            .map(group => ({
                id: group.ID,
                name: group.NAME,
                displayOrder: group.DISPLAYORDER,
                photoUrl: group.PHOTOURL,
                parentGroupId: group.PARENTGROUPID || undefined,
                subGroups: [],
            }))
            .sort((a, b) => a.displayOrder - b.displayOrder);

        // Build hierarchical structure
        const rootGroups: ProcessedMenuGroup[] = [];
        const groupMap = new Map<number, ProcessedMenuGroup>();

        // Create a map for quick lookup
        processedGroups.forEach(group => {
            groupMap.set(group.id, group);
        });

        // Organize into hierarchy
        processedGroups.forEach(group => {
            if (group.parentGroupId) {
                const parent = groupMap.get(group.parentGroupId);
                if (parent) {
                    parent.subGroups = parent.subGroups || [];
                    parent.subGroups.push(group);
                    parent.subGroups.sort((a, b) => a.displayOrder - b.displayOrder);
                } else {
                    // Parent not found, treat as root group
                    rootGroups.push(group);
                }
            } else {
                rootGroups.push(group);
            }
        });

        return {
            data: rootGroups,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu group by ID
     */
    async getMenuGroupById(groupId: number): Promise<ServiceResponse<ProcessedMenuGroup>> {
        const response = await this.getProcessedMenuGroups({ revalidate: 300 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        // Search in all groups (including nested)
        const findGroupById = (groups: ProcessedMenuGroup[], id: number): ProcessedMenuGroup | null => {
            for (const group of groups) {
                if (group.id === id) {
                    return group;
                }
                if (group.subGroups && group.subGroups.length > 0) {
                    const found = findGroupById(group.subGroups, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const foundGroup = findGroupById(response.data, groupId);

        if (!foundGroup) {
            return {
                data: null,
                error: { message: `Menu group with ID ${groupId} not found` },
                success: false,
            };
        }

        return {
            data: foundGroup,
            error: null,
            success: true,
        };
    }

    /**
     * Get only root level menu groups (categories)
     */
    async getRootMenuGroups(): Promise<ServiceResponse<ProcessedMenuGroup[]>> {
        const response = await this.getProcessedMenuGroups({ revalidate: 600 }); // 10 minutes cache for categories

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        return {
            data: response.data,
            error: null,
            success: true,
        };
    }

    /**
     * Get subcategories for a specific parent group
     */
    async getSubGroups(parentGroupId: number): Promise<ServiceResponse<ProcessedMenuGroup[]>> {
        const response = await this.getMenuGroupById(parentGroupId);

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        return {
            data: response.data.subGroups || [],
            error: null,
            success: true,
        };
    }

    /**
     * Search menu groups by name
     */
    async searchMenuGroups(searchTerm: string): Promise<ServiceResponse<ProcessedMenuGroup[]>> {
        const response = await this.getProcessedMenuGroups({ revalidate: 300 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const searchResults: ProcessedMenuGroup[] = [];
        const searchLower = searchTerm.toLowerCase();

        // Search in all groups (including nested)
        const searchInGroups = (groups: ProcessedMenuGroup[]) => {
            groups.forEach(group => {
                if (group.name.toLowerCase().includes(searchLower)) {
                    searchResults.push(group);
                }
                if (group.subGroups && group.subGroups.length > 0) {
                    searchInGroups(group.subGroups);
                }
            });
        };

        searchInGroups(response.data);

        return {
            data: searchResults,
            error: null,
            success: true,
        };
    }

    /**
     * Get menu groups count
     */
    async getMenuGroupsCount(): Promise<ServiceResponse<{ total: number; rootGroups: number; subGroups: number }>> {
        const response = await this.getMenuGroups({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const total = response.data.length;
        const rootGroups = response.data.filter(group => !group.PARENTGROUPID).length;
        const subGroups = total - rootGroups;

        return {
            data: { total, rootGroups, subGroups },
            error: null,
            success: true,
        };
    }
}

// Export singleton instance
export const menuGroupsService = new MenuGroupsService();

// Export class for testing
export { MenuGroupsService };
