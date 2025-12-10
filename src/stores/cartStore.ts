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
  coupons: Array<{ code: string; discount: string }>;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
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
  coupons: Array<{ code: string; totals: { total_discount: string } }>;
  totals: {
    total_items: string;
    total_price: string;
    total_tax: string;
    total_shipping: string;
    total_discount: string;
    currency_minor_unit?: number;
  };
}

// Helper to map WC cart response to our store state
const mapWCCartToState = (wcCart: WCCart) => {
  const minorUnit = wcCart.totals.currency_minor_unit ?? 2;
  const divisor = Math.pow(10, minorUnit);

  const items: CartItem[] = wcCart.items.map((item) => ({
    id: item.id.toString(),
    key: item.key,
    name: item.name,
    price: parseFloat(item.prices.price) / divisor,
    originalPrice: parseFloat(item.prices.regular_price) / divisor,
    image: item.images[0]?.src || '',
    quantity: item.quantity,
    type: 'product',
    inStock: true,
    category: item.categories?.[0]?.name,
  }));

  const totals = {
    subtotal: parseFloat(wcCart.totals.total_items) / divisor,
    totalPrice: parseFloat(wcCart.totals.total_price) / divisor,
    tax: parseFloat(wcCart.totals.total_tax) / divisor,
    shipping: wcCart.totals.total_shipping ? parseFloat(wcCart.totals.total_shipping) / divisor : 0,
    discount: parseFloat(wcCart.totals.total_discount) / divisor,
    totalItems: wcCart.items_count,
    coupons: wcCart.coupons?.map(c => ({ 
      code: c.code, 
      discount: (parseFloat(c.totals.total_discount) / divisor).toString() 
    })) || [],
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
      coupons: [],

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

      applyCoupon: async (code: string) => {
        set({ isLoading: true });
        try {
          const wcCart = await cartService.applyCoupon(code);
          set({ ...mapWCCartToState(wcCart), isLoading: false });
        } catch (error) {
          console.error('Failed to apply coupon:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      removeCoupon: async (code: string) => {
        set({ isLoading: true });
        try {
          const wcCart = await cartService.removeCoupon(code);
          set({ ...mapWCCartToState(wcCart), isLoading: false });
        } catch (error) {
          console.error('Failed to remove coupon:', error);
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0, subtotal: 0, coupons: [] });
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