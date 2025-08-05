// Service-specific error types
export type ApiError = {
  message: string;
  status?: number;
  code?: string;
};

// Service response wrapper
export type ServiceResponse<T> = {
  data: T | null;
  error: ApiError | null;
  success: boolean;
};

// Cache configuration
export type CacheConfig = {
  revalidate?: number;
  tags?: string[];
};

// API request configuration
export type ApiRequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  cache?: CacheConfig;
};

// Filtered/processed data types
export type ProcessedMenuGroup = {
  id: number;
  name: string;
  displayOrder: number;
  photoUrl: string;
  parentGroupId?: number;
  subGroups?: ProcessedMenuGroup[];
};

export type ProcessedMenuItem = {
  id: number;
  name: string;
  price: number;
  photoUrl: string;
  description?: string;
  groupId: number;
  groupName: string;
  allergens: string[];
  dietary: {
    vegetarian: boolean;
    alcohol: boolean;
    pork: boolean;
    gluten: boolean;
  };
  displayOrder: number;
};

export type ProcessedTable = {
  id: number;
  uid: string;
  tableNo: string;
  maxCapacity: number;
  bookingFee: number;
  tableGroup: string;
};

export type ProcessedRestaurant = {
  id: number;
  name: string;
  logo: string;
  phone: string;
  address?: string;
  currency: {
    id: number;
    code: string;
  };
  allergens: unknown[];
  rules: string;
  settings: {
    orderButtonActive: boolean;
    askForTableNo?: string;
    tableSelectionActive: boolean;
    hideEndTimes: boolean;
  };
};

// Basket menu types
export type ProcessedBasketMenu = {
  id: number;
  name: string;
  displayOrder: number;
  photoUrl: string;
  saleStartHour: string;
  saleEndHour: string;
  useDepartmentProducts: boolean;
  departmentIds: number[];
};

export type ProcessedBasketMenuDetail = {
  id: number;
  menuId: number;
  productGroupId: number;
  productId: number;
  displayOrder?: number;
};

// Enhanced category data structure for basket menu navigation
export type BasketMenuCategory = {
  id: number;
  name: string;
  slug: string;
  photoUrl: string;
  displayOrder: number;
  menuGroups: ProcessedMenuGroup[];
  menuGroupIds: number[];
};
