import { Table } from '@/types/api-response-types';
import { ProcessedTable, ServiceResponse } from '../../types/service-types';
import { apiService } from './api.service';

class TablesService {
    /**
     * Fetch raw tables data
     */
    async getTables(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<Table[]>> {
        const response = await apiService.fetchRestaurantData({
            revalidate: cacheConfig?.revalidate || 600, // 10 minutes cache for tables
            tags: ['tables'],
        });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        return {
            data: response.data.tables,
            error: null,
            success: true,
        };
    }

    /**
     * Get processed tables with clean structure
     */
    async getProcessedTables(cacheConfig?: { revalidate?: number }): Promise<ServiceResponse<ProcessedTable[]>> {
        const response = await this.getTables(cacheConfig);

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const tables = response.data;

        // Process tables
        const processedTables: ProcessedTable[] = tables
            .map(table => ({
                id: table.ID,
                uid: table.UID,
                tableNo: table.TABLENO,
                maxCapacity: table.PAXCOUNT,
                bookingFee: table.BOOKINGFEE,
                tableGroup: table.TABLEGROUP,
            }))
            .sort((a, b) => {
                // Sort by table group first, then by table number
                if (a.tableGroup !== b.tableGroup) {
                    return a.tableGroup.localeCompare(b.tableGroup);
                }
                return a.tableNo.localeCompare(b.tableNo);
            });

        return {
            data: processedTables,
            error: null,
            success: true,
        };
    }

    /**
     * Get table by ID
     */
    async getTableById(tableId: number): Promise<ServiceResponse<ProcessedTable>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const foundTable = response.data.find(table => table.id === tableId);

        if (!foundTable) {
            return {
                data: null,
                error: { message: `Table with ID ${tableId} not found` },
                success: false,
            };
        }

        return {
            data: foundTable,
            error: null,
            success: true,
        };
    }

    /**
     * Get table by UID
     */
    async getTableByUid(uid: string): Promise<ServiceResponse<ProcessedTable>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const foundTable = response.data.find(table => table.uid === uid);

        if (!foundTable) {
            return {
                data: null,
                error: { message: `Table with UID ${uid} not found` },
                success: false,
            };
        }

        return {
            data: foundTable,
            error: null,
            success: true,
        };
    }

    /**
     * Get table by table number
     */
    async getTableByNumber(tableNo: string): Promise<ServiceResponse<ProcessedTable>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const foundTable = response.data.find(table => table.tableNo === tableNo);

        if (!foundTable) {
            return {
                data: null,
                error: { message: `Table ${tableNo} not found` },
                success: false,
            };
        }

        return {
            data: foundTable,
            error: null,
            success: true,
        };
    }

    /**
     * Get tables by group
     */
    async getTablesByGroup(groupName: string): Promise<ServiceResponse<ProcessedTable[]>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const filteredTables = response.data.filter(table =>
            table.tableGroup.toLowerCase() === groupName.toLowerCase()
        );

        return {
            data: filteredTables,
            error: null,
            success: true,
        };
    }

    /**
     * Get tables by capacity range
     */
    async getTablesByCapacity(minCapacity: number, maxCapacity?: number): Promise<ServiceResponse<ProcessedTable[]>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const filteredTables = response.data.filter(table => {
            if (maxCapacity !== undefined) {
                return table.maxCapacity >= minCapacity && table.maxCapacity <= maxCapacity;
            }
            return table.maxCapacity >= minCapacity;
        });

        return {
            data: filteredTables,
            error: null,
            success: true,
        };
    }

    /**
     * Get available table groups
     */
    async getTableGroups(): Promise<ServiceResponse<string[]>> {
        const response = await this.getProcessedTables({ revalidate: 1800 }); // 30 minutes cache

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const groups = [...new Set(response.data.map(table => table.tableGroup))].sort();

        return {
            data: groups,
            error: null,
            success: true,
        };
    }

    /**
     * Get tables with booking fee
     */
    async getTablesWithBookingFee(): Promise<ServiceResponse<ProcessedTable[]>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const tablesWithFee = response.data.filter(table => table.bookingFee > 0);

        return {
            data: tablesWithFee,
            error: null,
            success: true,
        };
    }

    /**
     * Get tables without booking fee
     */
    async getTablesWithoutBookingFee(): Promise<ServiceResponse<ProcessedTable[]>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const tablesWithoutFee = response.data.filter(table => table.bookingFee === 0);

        return {
            data: tablesWithoutFee,
            error: null,
            success: true,
        };
    }

    /**
     * Get tables statistics
     */
    async getTablesStats(): Promise<ServiceResponse<{
        total: number;
        groups: number;
        totalCapacity: number;
        averageCapacity: number;
        capacityRange: { min: number; max: number };
        tablesWithBookingFee: number;
        averageBookingFee: number;
        groupStats: Record<string, { count: number; totalCapacity: number }>;
    }>> {
        const response = await this.getProcessedTables({ revalidate: 1800 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const tables = response.data;
        const total = tables.length;
        const groups = new Set(tables.map(table => table.tableGroup)).size;
        const totalCapacity = tables.reduce((sum, table) => sum + table.maxCapacity, 0);
        const averageCapacity = Math.round((totalCapacity / total) * 100) / 100;

        const capacities = tables.map(table => table.maxCapacity);
        const minCapacity = Math.min(...capacities);
        const maxCapacity = Math.max(...capacities);

        const tablesWithBookingFee = tables.filter(table => table.bookingFee > 0).length;
        const bookingFees = tables.filter(table => table.bookingFee > 0).map(table => table.bookingFee);
        const averageBookingFee = bookingFees.length > 0
            ? Math.round((bookingFees.reduce((sum, fee) => sum + fee, 0) / bookingFees.length) * 100) / 100
            : 0;

        // Group statistics
        const groupStats: Record<string, { count: number; totalCapacity: number }> = {};
        tables.forEach(table => {
            if (!groupStats[table.tableGroup]) {
                groupStats[table.tableGroup] = { count: 0, totalCapacity: 0 };
            }
            groupStats[table.tableGroup].count++;
            groupStats[table.tableGroup].totalCapacity += table.maxCapacity;
        });

        return {
            data: {
                total,
                groups,
                totalCapacity,
                averageCapacity,
                capacityRange: { min: minCapacity, max: maxCapacity },
                tablesWithBookingFee,
                averageBookingFee,
                groupStats,
            },
            error: null,
            success: true,
        };
    }

    /**
     * Search tables by table number or group
     */
    async searchTables(searchTerm: string): Promise<ServiceResponse<ProcessedTable[]>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const searchLower = searchTerm.toLowerCase();
        const searchResults = response.data.filter(table =>
            table.tableNo.toLowerCase().includes(searchLower) ||
            table.tableGroup.toLowerCase().includes(searchLower)
        );

        return {
            data: searchResults,
            error: null,
            success: true,
        };
    }

    /**
     * Get tables grouped by table group
     */
    async getGroupedTables(): Promise<ServiceResponse<Record<string, ProcessedTable[]>>> {
        const response = await this.getProcessedTables({ revalidate: 600 });

        if (!response.success || !response.data) {
            return {
                data: null,
                error: response.error,
                success: false,
            };
        }

        const grouped: Record<string, ProcessedTable[]> = {};

        response.data.forEach(table => {
            const groupName = table.tableGroup;
            if (!grouped[groupName]) {
                grouped[groupName] = [];
            }
            grouped[groupName].push(table);
        });

        // Sort tables within each group by table number
        Object.keys(grouped).forEach(groupName => {
            grouped[groupName].sort((a, b) => a.tableNo.localeCompare(b.tableNo));
        });

        return {
            data: grouped,
            error: null,
            success: true,
        };
    }
}

// Export singleton instance
export const tablesService = new TablesService();

// Export class for testing
export { TablesService };
