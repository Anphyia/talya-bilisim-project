interface Food {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  allergens: string[];
  category: string;
  subcategory: string;
  isNew?: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  items: Food[];
}

interface CategoryData {
  name: string;
  subcategories: Record<string, Subcategory>;
}

// Enhanced mock data with subcategories
export const mockFoodData: Record<string, CategoryData> = {
  'appetizers': {
    name: 'Appetizers',
    subcategories: {
      'dips-spreads': {
        id: 'dips-spreads',
        name: 'Dips & Spreads',
        items: [
          {
            id: '1',
            name: 'Bruschetta al Pomodoro',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&h=400&fit=crop',
            description: 'Fresh tomatoes, basil, and garlic on toasted bread',
            allergens: ['Gluten'],
            category: 'appetizers',
            subcategory: 'dips-spreads',
            isNew: true
          },
          {
            id: '4',
            name: 'Spinach & Artichoke Dip',
            price: 11.99,
            image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&h=400&fit=crop',
            description: 'Creamy dip with spinach and artichokes, served with tortilla chips',
            allergens: ['Dairy', 'Gluten'],
            category: 'appetizers',
            subcategory: 'dips-spreads'
          }
        ]
      },
      'fried-appetizers': {
        id: 'fried-appetizers',
        name: 'Fried Appetizers',
        items: [
          {
            id: '2',
            name: 'Calamari Rings',
            price: 15.99,
            image: 'https://images.unsplash.com/photo-1734771219838-61863137b117?q=80&w=2070&auto=format&fit=crop',
            description: 'Crispy fried squid rings with marinara sauce',
            allergens: ['Gluten', 'Eggs', 'Seafood'],
            category: 'appetizers',
            subcategory: 'fried-appetizers'
          },
          {
            id: '3',
            name: 'Buffalo Wings',
            price: 13.99,
            image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500&h=400&fit=crop',
            description: 'Spicy chicken wings with blue cheese dressing',
            allergens: ['Dairy'],
            category: 'appetizers',
            subcategory: 'fried-appetizers'
          }
        ]
      }
    }
  },
  'main-courses': {
    name: 'Main Courses',
    subcategories: {
      'seafood': {
        id: 'seafood',
        name: 'Seafood',
        items: [
          {
            id: '5',
            name: 'Grilled Salmon',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop',
            description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
            allergens: ['Fish', 'Dairy'],
            category: 'main-courses',
            subcategory: 'seafood',
            isNew: true
          }
        ]
      },
      'steaks': {
        id: 'steaks',
        name: 'Steaks',
        items: [
          {
            id: '6',
            name: 'Ribeye Steak',
            price: 32.99,
            image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1470&auto=format&fit=crop',
            description: '12oz prime ribeye with garlic mashed potatoes',
            allergens: ['Dairy'],
            category: 'main-courses',
            subcategory: 'steaks'
          }
        ]
      },
      'poultry': {
        id: 'poultry',
        name: 'Poultry',
        items: [
          {
            id: '7',
            name: 'Chicken Parmesan',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=2070&auto=format&fit=crop',
            description: 'Breaded chicken breast with marinara and mozzarella',
            allergens: ['Gluten', 'Dairy', 'Eggs'],
            category: 'main-courses',
            subcategory: 'poultry'
          }
        ]
      },
      'pasta': {
        id: 'pasta',
        name: 'Pasta',
        items: [
          {
            id: '8',
            name: 'Vegetarian Pasta',
            price: 16.99,
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop',
            description: 'Penne pasta with roasted vegetables and pesto',
            allergens: ['Gluten', 'Dairy', 'Nuts'],
            category: 'main-courses',
            subcategory: 'pasta'
          }
        ]
      }
    }
  },
  'desserts': {
    name: 'Desserts',
    subcategories: {
      'classic-desserts': {
        id: 'classic-desserts',
        name: 'Classic Desserts',
        items: [
          {
            id: '9',
            name: 'Tiramisu',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop',
            description: 'Classic Italian dessert with coffee and mascarpone',
            allergens: ['Dairy', 'Eggs', 'Gluten'],
            category: 'desserts',
            subcategory: 'classic-desserts'
          }
        ]
      },
      'chocolate-desserts': {
        id: 'chocolate-desserts',
        name: 'Chocolate Desserts',
        items: [
          {
            id: '10',
            name: 'Chocolate Lava Cake',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=400&fit=crop',
            description: 'Warm chocolate cake with molten center and vanilla ice cream',
            allergens: ['Dairy', 'Eggs', 'Gluten'],
            category: 'desserts',
            subcategory: 'chocolate-desserts',
            isNew: true
          }
        ]
      }
    }
  },
  'beverages': {
    name: 'Beverages',
    subcategories: {
      'fresh-juices': {
        id: 'fresh-juices',
        name: 'Fresh Juices',
        items: [
          {
            id: '11',
            name: 'Fresh Orange Juice',
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
            description: 'Freshly squeezed orange juice',
            allergens: [],
            category: 'beverages',
            subcategory: 'fresh-juices'
          }
        ]
      },
      'hot-beverages': {
        id: 'hot-beverages',
        name: 'Hot Beverages',
        items: [
          {
            id: '12',
            name: 'Craft Coffee',
            price: 3.99,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop',
            description: 'Single origin coffee beans, expertly brewed',
            allergens: [],
            category: 'beverages',
            subcategory: 'hot-beverages'
          }
        ]
      }
    }
  },
  'salads': {
    name: 'Salads',
    subcategories: {
      'classic-salads': {
        id: 'classic-salads',
        name: 'Classic Salads',
        items: [
          {
            id: '13',
            name: 'Caesar Salad',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
            description: 'Crisp romaine lettuce with parmesan and croutons',
            allergens: ['Dairy', 'Gluten', 'Eggs'],
            category: 'salads',
            subcategory: 'classic-salads'
          }
        ]
      }
    }
  },
  'soups': {
    name: 'Soups',
    subcategories: {
      'hot-soups': {
        id: 'hot-soups',
        name: 'Hot Soups',
        items: [
          {
            id: '14',
            name: 'Tomato Basil Soup',
            price: 7.99,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
            description: 'Creamy tomato soup with fresh basil',
            allergens: ['Dairy'],
            category: 'soups',
            subcategory: 'hot-soups'
          }
        ]
      }
    }
  }
};

export type { Food, Subcategory, CategoryData };
