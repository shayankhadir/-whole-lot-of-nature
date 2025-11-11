import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
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
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (discountAmount: number) => void;
  calculateTotals: () => void;
}

type CartStore = CartState & CartActions;

const calculateCartTotals = (items: CartItem[], discount: number = 0, shipping: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST for India
  const totalPrice = subtotal - discount + shipping + tax;

  return {
    subtotal,
    totalItems,
    totalPrice,
    tax,
  };
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

      // Actions
      addItem: (newItem) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(item => item.id === newItem.id);
        
        if (existingItemIndex > -1) {
          // Item already exists, update quantity
          const updatedItems = [...items];
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = existingItem.quantity + (newItem.quantity || 1);
          const maxQty = existingItem.maxQuantity || 10;
          
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: Math.min(newQuantity, maxQty)
          };
          
          const totals = calculateCartTotals(updatedItems, get().discount, get().shipping);
          
          set({
            items: updatedItems,
            ...totals
          });
        } else {
          // New item
          const itemToAdd: CartItem = {
            ...newItem,
            quantity: newItem.quantity || 1
          };
          
          const updatedItems = [...items, itemToAdd];
          const totals = calculateCartTotals(updatedItems, get().discount, get().shipping);
          
          set({
            items: updatedItems,
            ...totals
          });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== id);
        const totals = calculateCartTotals(updatedItems, get().discount, get().shipping);
        
        set({
          items: updatedItems,
          ...totals
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        const { items } = get();
        const updatedItems = items.map(item => {
          if (item.id === id) {
            const maxQty = item.maxQuantity || 10;
            return {
              ...item,
              quantity: Math.min(quantity, maxQty)
            };
          }
          return item;
        });

        const totals = calculateCartTotals(updatedItems, get().discount, get().shipping);
        
        set({
          items: updatedItems,
          ...totals
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      applyDiscount: (discountAmount) => {
        const { items, shipping } = get();
        const totals = calculateCartTotals(items, discountAmount, shipping);
        
        set({
          discount: discountAmount,
          ...totals
        });
      },

      calculateTotals: () => {
        const { items, discount, shipping } = get();
        const totals = calculateCartTotals(items, discount, shipping);
        
        set(totals);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        discount: state.discount,
        shipping: state.shipping,
      }),
    }
  )
);