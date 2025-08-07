import {
  ProcessedMenuGroup,
  ProcessedMenuItem,
  ProcessedRestaurant,
  BasketMenuCategory
} from '@/types/service-types';
import { Food, Subcategory, CategoryData } from '../../types/food-types';

/**
 * Map API menu item to Food interface
 */
export const mapMenuItemToFood = (item: ProcessedMenuItem): Food => {
  return {
    id: item.id.toString(),
    name: item.name,
    price: item.price,
    image: item.photoUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop',
    description: item.description || '',
    allergens: item.allergens,
    category: item.groupName.toLowerCase().replace(/\s+/g, '-'),
    subcategory: item.groupId.toString(),
    isNew: false,
  };
};

/**
 * Map API menu group to category slug 
 * This replaces Turkish characters with their English equivalents and formats the name
 */
export const mapMenuGroupToSlug = (group: ProcessedMenuGroup): string => {
  let name = group.name.toLowerCase();
  name = name.replace(/ğ/g, 'g');
  name = name.replace(/ü/g, 'u');
  name = name.replace(/ş/g, 's');
  name = name.replace(/ı/g, 'i');
  name = name.replace(/ö/g, 'o');
  name = name.replace(/ç/g, 'c');
  return name.replace(/\s+/g, '-');
};

/**
 * Create category navigation item from menu group
 */
export const mapMenuGroupToCategoryNav = (group: ProcessedMenuGroup) => {
  return {
    id: group.id.toString(),
    name: group.name,
    image: group.photoUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop',
    href: `/category/${mapMenuGroupToSlug(group)}`,
    description: `Explore our ${group.name.toLowerCase()} selection`,
  };
};

/**
 * Create category navigation item from basket menu category
 */
export const mapBasketMenuToCategoryNav = (basketCategory: BasketMenuCategory) => {
  return {
    id: basketCategory.id.toString(),
    name: basketCategory.name,
    image: basketCategory.photoUrl || 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=400&fit=crop',
    href: `/category/${basketCategory.slug}`,
    description: `Explore our ${basketCategory.name.toLowerCase()} selection`,
  };
};

/**
 * Group menu items by their group and create CategoryData structure
 */
export const createCategoryDataFromAPI = (
  menuGroups: ProcessedMenuGroup[],
  menuItems: ProcessedMenuItem[]
): Record<string, CategoryData> => {
  const categoryData: Record<string, CategoryData> = {};

  // Create a map of group ID to group info
  const groupMap = new Map<number, ProcessedMenuGroup>();

  // Flatten all groups (including subgroups)
  const flattenGroups = (groups: ProcessedMenuGroup[]) => {
    groups.forEach(group => {
      groupMap.set(group.id, group);
      if (group.subGroups && group.subGroups.length > 0) {
        flattenGroups(group.subGroups);
      }
    });
  };

  flattenGroups(menuGroups);

  // Group items by their parent group
  const itemsByGroup = new Map<number, ProcessedMenuItem[]>();
  menuItems.forEach(item => {
    if (!itemsByGroup.has(item.groupId)) {
      itemsByGroup.set(item.groupId, []);
    }
    itemsByGroup.get(item.groupId)!.push(item);
  });

  // Create category structure
  menuGroups.forEach(rootGroup => {
    const categorySlug = mapMenuGroupToSlug(rootGroup);
    const subcategories: Record<string, Subcategory> = {};

    // If this group has subgroups, use them as subcategories
    if (rootGroup.subGroups && rootGroup.subGroups.length > 0) {
      rootGroup.subGroups.forEach((subGroup: ProcessedMenuGroup) => {
        const subGroupItems = itemsByGroup.get(subGroup.id) || [];
        subcategories[subGroup.id.toString()] = {
          id: subGroup.id.toString(),
          name: subGroup.name,
          items: subGroupItems.map(mapMenuItemToFood),
        };
      });
    } else {
      // If no subgroups, create a single subcategory with all items
      const groupItems = itemsByGroup.get(rootGroup.id) || [];
      if (groupItems.length > 0) {
        subcategories[rootGroup.id.toString()] = {
          id: rootGroup.id.toString(),
          name: rootGroup.name,
          items: groupItems.map(mapMenuItemToFood),
        };
      }
    }

    // Only add category if it has subcategories with items
    if (Object.keys(subcategories).length > 0) {
      categoryData[categorySlug] = {
        name: rootGroup.name,
        subcategories,
      };
    }
  });

  return categoryData;
};

/**
 * Create subcategory navigation items from a category's subcategories
 */
export const createSubcategoryNavigation = (categoryData: CategoryData) => {
  return Object.values(categoryData.subcategories).map(sub => ({
    id: sub.id,
    name: sub.name,
  }));
};

/**
 * Get restaurant name for header/branding
 */
export const getRestaurantDisplayName = (restaurant: ProcessedRestaurant | null): string => {
  return restaurant?.name || 'Restaurant';
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currencyCode?: string): string => {
  if (currencyCode) {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
      }).format(price);
    } catch {
      // Fallback if currency code is invalid
      return `${price.toFixed(2)} ${currencyCode}`;
    }
  }
  return `₺${price.toFixed(2)}`;
};

/**
 * Check if category exists in the data
 */
export const categoryExists = (
  categoryData: Record<string, CategoryData>,
  slug: string
): boolean => {
  return slug in categoryData;
};

/**
 * Get category data by slug
 */
export const getCategoryBySlug = (
  categoryData: Record<string, CategoryData>,
  slug: string
): CategoryData | null => {
  return categoryData[slug] || null;
};

/**
 * Create CategoryData structure from basket menu category
 * This converts a BasketMenuCategory to the format expected by the UI components
 */
export const createCategoryDataFromBasketMenu = (
  basketCategory: BasketMenuCategory,
  menuItems: ProcessedMenuItem[]
): CategoryData => {
  const subcategories: Record<string, Subcategory> = {};

  // Group items by their group ID
  const itemsByGroup = new Map<number, ProcessedMenuItem[]>();
  menuItems.forEach(item => {
    if (basketCategory.menuGroupIds.includes(item.groupId)) {
      if (!itemsByGroup.has(item.groupId)) {
        itemsByGroup.set(item.groupId, []);
      }
      itemsByGroup.get(item.groupId)!.push(item);
    }
  });

  // Create subcategories from menu groups
  basketCategory.menuGroups.forEach(menuGroup => {
    const groupItems = itemsByGroup.get(menuGroup.id) || [];
    if (groupItems.length > 0) {
      subcategories[menuGroup.id.toString()] = {
        id: menuGroup.id.toString(),
        name: menuGroup.name,
        items: groupItems.map(mapMenuItemToFood),
      };
    }
  });

  return {
    name: basketCategory.name,
    subcategories,
  };
};
