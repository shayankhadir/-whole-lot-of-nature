import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartService } from '@/lib/services/cartService';

export interface CartItem {
  id: string;
  key?: string; // WooCommerce cart item key
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  type: 'product' | 'combo';
  category?: string;
  inStock: boolean;
  maxQuantity?: number;
  // For combo items
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  isLoading: boolean;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (discountAmount: number) => void;
  calculateTotals: () => void;
}

type CartStore = CartState & CartActions;

interface WCCartItem {
  id: number;
  key: string;
  name: string;
  prices: {
    price: string;
    regular_price: string;
  };
  images: Array<{ src: string }>;
  categories?: Array<{ name: string }>;
  quantity: number;
  totals: {
    line_total: string;
  };
}

interface WCCart {
  items: WCCartItem[];
  items_count: number;
  totals: {
    total_items: string;
    total_price: string;
    total_tax: string;
    total_shipping: string;
    total_discount: string;
  };
}

// Helper to map WC cart response to our store state
const mapWCCartToState = (wcCart: WCCart) => {
  const items: CartItem[] = wcCart.items.map((item) => ({
    id: item.id.toString(),
    key: item.key,
    name: item.name,
    price: parseFloat(item.prices.price) / 100, // WC Store API returns prices in minor units
    originalPrice: parseFloat(item.prices.regular_price) / 100,
    image: item.images[0]?.src || '',
    quantity: item.quantity,
    type: 'product',
    inStock: true,
    category: item.categories?.[0]?.name,
  }));

  const totals = {
    subtotal: parseFloat(wcCart.totals.total_items) / 100,
    totalPrice: parseFloat(wcCart.totals.total_price) / 100,
    tax: parseFloat(wcCart.totals.total_tax) / 100,
    shipping: parseFloat(wcCart.totals.total_shipping) / 100,
    discount: parseFloat(wcCart.totals.total_discount) / 100,
    totalItems: wcCart.items_count,
  };

  return { items, ...totals };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      isLoading: false,

      // Actions
      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const wcCart = await cartService.getCart();
          set({ ...mapWCCartToState(wcCart), isLoading: false });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ isLoading: false });
        }
      },

      addItem: async (newItem) => {
        set({ isLoading: true });
        try {
          const productId = parseInt(newItem.id);
          if (isNaN(productId)) {
             console.error("Invalid product ID for WooCommerce:", newItem.id);
             set({ isLoading: false });
             return;
          }

          const wcCart = await cartService.addItem(productId, newItem.quantity || 1);
          set({ ...mapWCCartToState(wcCart), isOpen: true, isLoading: false });
        } catch (error) {
          console.error('Failed to add item:', error);
          set({ isLoading: false });
        }
      },

      removeItem: async (id) => {
        set({ isLoading: true });
        try {
          const { items } = get();
          const item = items.find(i => i.id === id);
          if (!item?.key) {
             await get().fetchCart();
             return;
          }
          
          const wcCart = await cartService.removeItem(item.key);
          set({ ...mapWCCartToState(wcCart), isLoading: false });
        } catch (error) {
          console.error('Failed to remove item:', error);
          set({ isLoading: false });
        }
      },

      updateQuantity: async (id, quantity) => {
        set({ isLoading: true });
        try {
          const { items } = get();
          const item = items.find(i => i.id === id);
          if (!item?.key) {
            set({ isLoading: false });
            return;
          }

          const wcCart = await cartService.updateItem(item.key, quantity);
          set({ ...mapWCCartToState(wcCart), isLoading: false });
        } catch (error) {
          console.error('Failed to update quantity:', error);
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0, subtotal: 0 });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      applyDiscount: (amount) => set({ discount: amount }), 
      calculateTotals: () => {},
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items, 
        totalItems: state.totalItems, 
        totalPrice: state.totalPrice 
      }),
    }
  )
);