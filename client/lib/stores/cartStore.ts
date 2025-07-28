import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Food {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  allergens: string[];
  category: string;
  isNew?: boolean;
}

interface CartItem {
  id: string; // Unique cart item ID (food.id + hash of notes)
  food: Food;
  quantity: number;
  productNotes: string;
  addedAt: Date;
}

interface CartState {
  items: CartItem[];
  orderNotes: string;
  isDrawerOpen: boolean;
  isCartOpen: boolean;
  
  // Cart actions
  addItem: (food: Food, quantity: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateProductNotes: (itemId: string, notes: string) => void;
  updateOrderNotes: (notes: string) => void;
  clearCart: () => void;
  
  // UI state management
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Helper functions
  getItemById: (itemId: string) => CartItem | undefined;
  generateItemId: (food: Food, notes: string) => string;
}

// Helper function to generate unique cart item ID
const generateCartItemId = (food: Food, notes: string): string => {
  const notesHash = notes.trim().toLowerCase().replace(/\s+/g, '-') || 'no-notes';
  return `${food.id}-${notesHash}`;
};

// Computed selectors (not persisted)
interface CartSelectors {
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (foodId: string, notes?: string) => number;
}

export const useCartStore = create<CartState & CartSelectors>()(
  persist(
    (set, get) => ({
      items: [],
      orderNotes: '',
      isDrawerOpen: false,
      isCartOpen: false,

      // Cart Actions
      addItem: (food, quantity, notes = '') => {
        const itemId = generateCartItemId(food, notes);
        const existingItem = get().items.find(item => item.id === itemId);
        
        set((state) => {
          if (existingItem) {
            // Update existing item quantity
            return {
              items: state.items.map(item =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isDrawerOpen: true, // Auto-open drawer when adding items
            };
          } else {
            // Add new item
            const newItem: CartItem = {
              id: itemId,
              food,
              quantity,
              productNotes: notes.trim(),
              addedAt: new Date(),
            };
            return {
              items: [...state.items, newItem],
              isDrawerOpen: true, // Auto-open drawer when adding items
            };
          }
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, 10) } // Max 10 items
              : item
          ),
        }));
      },

      updateProductNotes: (itemId, notes) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, productNotes: notes.trim() }
              : item
          ),
        }));
      },

      updateOrderNotes: (notes) => {
        set({ orderNotes: notes.trim() });
      },

      clearCart: () => {
        set({
          items: [],
          orderNotes: '',
          isDrawerOpen: false,
          isCartOpen: false,
        });
      },

      // UI State Management
      toggleDrawer: () => {
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
      },

      openDrawer: () => {
        set({ isDrawerOpen: true });
      },

      closeDrawer: () => {
        set({ isDrawerOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      openCart: () => {
        set({ isCartOpen: true, isDrawerOpen: false }); // Close drawer when opening cart
      },

      closeCart: () => {
        set({ isCartOpen: false });
      },

      // Helper Functions
      getItemById: (itemId) => {
        return get().items.find(item => item.id === itemId);
      },

      generateItemId: generateCartItemId,

      // Computed Selectors
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.food.price * item.quantity), 0);
      },

      getItemCount: (foodId, notes = '') => {
        const itemId = generateCartItemId({ id: foodId } as Food, notes);
        const item = get().items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'restaurant-cart',
      partialize: (state) => ({
        items: state.items,
        orderNotes: state.orderNotes,
      }),
    }
  )
);

// Auto-close drawer after 4 seconds when opened
let drawerTimeout: NodeJS.Timeout;

useCartStore.subscribe((state) => {
  if (state.isDrawerOpen) {
    clearTimeout(drawerTimeout);
    drawerTimeout = setTimeout(() => {
      useCartStore.getState().closeDrawer();
    }, 4000);
  }
});
