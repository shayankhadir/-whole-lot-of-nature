import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  dateAdded: number;
}

interface WishlistState {
  items: WishlistItem[];
}

interface WishlistActions {
  add: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  remove: (id: string) => void;
  toggle: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  clear: () => void;
  isWishlisted: (id: string) => boolean;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const exists = get().items.some(i => i.id === item.id);
        if (exists) return;
        set((state) => ({ items: [{ ...item, dateAdded: Date.now() }, ...state.items] }));
      },

      remove: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),

      toggle: (item) => {
        const { items } = get();
        const exists = items.some(i => i.id === item.id);
        if (exists) {
          set({ items: items.filter(i => i.id !== item.id) });
        } else {
          set({ items: [{ ...item, dateAdded: Date.now() }, ...items] });
        }
      },

      clear: () => set({ items: [] }),

      isWishlisted: (id) => get().items.some(i => i.id === id),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
