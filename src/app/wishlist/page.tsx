"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/pricing';

export default function WishlistPage() {
  const { items, remove, clear } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (item: { id: string; name: string; price: number; image: string }) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: 'product',
      inStock: true,
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#030a06] text-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Your Collection</p>
            <h1 className="mt-2 text-3xl font-bold text-white antialiased">Wishlist</h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm font-medium text-white/60 hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
              <ShoppingCart className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-xl font-semibold text-white mb-2 antialiased">Your wishlist is empty</p>
            <p className="text-white/60 max-w-md mx-auto">Save your favorite plants and accessories here to keep track of what you love.</p>
            <Link href="/shop" className="inline-block mt-8">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg shadow-emerald-900/20">
                Explore the Shop
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-sm">
                <Link href={`/shop/${item.slug}`}>
                  <div className="relative aspect-[4/3] bg-black/20 overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="text-lg font-semibold text-white line-clamp-2 hover:text-emerald-400 transition-colors antialiased">{item.name}</h3>
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold text-lg">{formatPrice(item.price)}</span>
                    <button
                      onClick={() => remove(item.id)}
                      className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button
                      className="flex-1 bg-white text-[#030a06] hover:bg-emerald-50 border-none font-semibold"
                      onClick={() => handleAddToCart(item)}
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </span>
                    </Button>
                    <Link href={`/shop/${item.slug}`} className="flex-1">
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30">View</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
