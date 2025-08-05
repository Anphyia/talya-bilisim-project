'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { ProcessedRestaurant } from '@/types/service-types';
import { useThemeStore } from '@/lib/stores/themeStore';

interface RestaurantDataContextType {
  restaurantData: ProcessedRestaurant | null;
}

const RestaurantDataContext = createContext<RestaurantDataContextType>({
  restaurantData: null,
});

interface RestaurantDataProviderProps {
  children: React.ReactNode;
  restaurantData: ProcessedRestaurant | null;
}

export function RestaurantDataProvider({ children, restaurantData }: RestaurantDataProviderProps) {
  const { setBranding } = useThemeStore();

  useEffect(() => {
    if (restaurantData) {
      // Update theme store with real restaurant data
      setBranding({
        name: restaurantData.name,
        logo: restaurantData.logo,
        description: `Delicious food from ${restaurantData.name}`,
        socialLinks: {
          instagram: restaurantData.phone ? `tel:${restaurantData.phone}` : undefined,
          website: undefined, // We'll keep this as undefined since we don't have website data
        },
      });
    }
  }, [restaurantData, setBranding]);

  return (
    <RestaurantDataContext.Provider value={{ restaurantData }}>
      {children}
    </RestaurantDataContext.Provider>
  );
}

export function useRestaurantData() {
  const context = useContext(RestaurantDataContext);
  if (!context) {
    throw new Error('useRestaurantData must be used within a RestaurantDataProvider');
  }
  return context;
}
