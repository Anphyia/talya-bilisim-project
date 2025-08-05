import { RestaurantApiResponse } from '@/types/api-response-types';
import { ApiError, ServiceResponse, ApiRequestConfig } from '../../types/service-types';

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (!this.baseUrl) {
      console.warn('NEXT_PUBLIC_API_URL environment variable is not set');
    }
  }

  /**
   * Main API request handler with built-in caching and error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ServiceResponse<T>> {
    try {
      const {
        method = 'POST',
        body,
        headers = {},
        cache = { revalidate: 300 } // 5 minutes default cache
      } = config;

      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

      const requestInit: RequestInit = {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        next: {
          revalidate: cache.revalidate,
          tags: cache.tags,
        },
      };

      // Add body for POST requests
      if (method === 'POST' && body) {
        requestInit.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestInit);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();

      return {
        data: data as T,
        error: null,
        success: true,
      };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: error instanceof Error && 'status' in error ? (error as unknown as { status: number }).status : undefined,
        code: error instanceof Error && 'code' in error ? (error as unknown as { code: string }).code : undefined,
      };

      console.error('API Request failed:', apiError);

      return {
        data: null,
        error: apiError,
        success: false,
      };
    }
  }

  /**
   * Fetch complete restaurant data from the main API endpoint
   */
  async fetchRestaurantData(cacheConfig?: { revalidate?: number; tags?: string[] }): Promise<ServiceResponse<RestaurantApiResponse>> {
    return this.makeRequest<RestaurantApiResponse>('', {
      method: 'POST',
      cache: {
        revalidate: cacheConfig?.revalidate || 300, // 5 minutes default
        tags: cacheConfig?.tags || ['restaurant-data'],
      },
    });
  }

  /**
   * Manually revalidate cache for specific tags
   */
  async revalidateCache(tags: string[]): Promise<void> {
    try {
      const { revalidateTag } = await import('next/cache');
      tags.forEach(tag => revalidateTag(tag));
    } catch (error) {
      console.warn('Cache revalidation failed:', error);
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ServiceResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest('/health', {
      method: 'GET',
      cache: { revalidate: 60 }, // 1 minute cache for health check
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing
export { ApiService };

// Utility functions for common error handling
export const handleApiError = (error: ApiError): string => {
  if (error.status === 404) return 'Data not found';
  if (error.status === 500) return 'Server error occurred';
  if (error.status === 403) return 'Access denied';
  return error.message || 'An unexpected error occurred';
};

export const isNetworkError = (error: ApiError): boolean => {
  return error.message.includes('fetch') || error.message.includes('network');
};
