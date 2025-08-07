import { create } from 'zustand';
import { toast } from 'sonner';
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
  tableNumber: string | null;
  isCartOpen: boolean;
  lastUpdated: number;
  expiresAt: number;

  // Cart actions
  addItem: (food: Food, quantity: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateProductNotes: (itemId: string, notes: string) => void;
  updateOrderNotes: (notes: string) => void;
  setTableNumber: (tableNumber: string) => void;
  clearCart: () => void;
  checkExpiration: () => void;

  // UI state management
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

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Helper function to update timestamps
const updateTimestamps = () => {
  const now = Date.now();
  return {
    lastUpdated: now,
    expiresAt: now + CACHE_DURATION,
  };
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
      tableNumber: null,
      isCartOpen: false,
      lastUpdated: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,

      checkExpiration: () => {
        const now = Date.now();
        const { expiresAt, items } = get();

        if (now > expiresAt && items.length > 0) {
          toast.info('Your cart has expired and been cleared', { position: "bottom-center" });
          set({
            items: [],
            orderNotes: '',
            tableNumber: null,
            isCartOpen: false,
            ...updateTimestamps(),
          });
        }
      },

      // Cart Actions
      addItem: (food, quantity, notes = '') => {
        // Check expiration before adding
        get().checkExpiration();

        const itemId = generateCartItemId(food, notes);
        const existingItem = get().items.find(item => item.id === itemId);

        set((state) => {
          if (existingItem) {
            // Update existing item quantity
            toast.success(`${food.name} (x${quantity}) added to cart!`, { position: "top-center" });
            return {
              items: state.items.map(item =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              ...updateTimestamps(),
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
            toast.success(`${food.name} (x${quantity}) added to cart!`, { position: "top-center" });
            return {
              items: [...state.items, newItem],
              ...updateTimestamps(),
            };
          }
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId),
          ...updateTimestamps(),
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
          ...updateTimestamps(),
        }));
      },

      updateProductNotes: (itemId, notes) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, productNotes: notes.trim() }
              : item
          ),
          ...updateTimestamps(),
        }));
      },

      updateOrderNotes: (notes) => {
        set({
          orderNotes: notes.trim(),
          ...updateTimestamps(),
        });
      },

      setTableNumber: (tableNumber) => {
        set({
          tableNumber,
          ...updateTimestamps(),
        });
        toast.success(`Table ${tableNumber} selected!`, { position: "top-center" });
      },

      clearCart: () => {
        set({
          items: [],
          orderNotes: '',
          tableNumber: null,
          ...updateTimestamps(),
        });
      },

      // UI State Management
      toggleCart: () => {
        get().checkExpiration();
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      openCart: () => {
        get().checkExpiration();
        set({ isCartOpen: true });
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
        tableNumber: state.tableNumber,
        lastUpdated: state.lastUpdated,
        expiresAt: state.expiresAt,
      }),
      // Custom hydration to check expiration on app load
      onRehydrateStorage: () => (state) => {
        if (state) {
          const now = Date.now();
          if (now > state.expiresAt && state.items.length > 0) {
            // Clear expired cart data
            state.items = [];
            state.orderNotes = '';
            state.tableNumber = null;
            state.isCartOpen = false;
            const timestamps = updateTimestamps();
            state.lastUpdated = timestamps.lastUpdated;
            state.expiresAt = timestamps.expiresAt;
          }
        }
      },
    }
  )
);
