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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-primary-50 rounded-2xl border border-primary-200">
            <p className="text-gray-900 text-xl mb-2">No items in wishlist</p>
            <p className="text-gray-600">Browse the shop and add your favorites</p>
            <Link href="/shop" className="inline-block mt-6">
              <Button>Go to Shop</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/shop/${item.slug}`}>
                  <div className="relative aspect-[4/3] bg-gray-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-primary-600">{item.name}</h3>
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-primary-700 font-semibold">{formatPrice(item.price)}</span>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-primary-600 hover:text-primary-700"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </span>
                    </Button>
                    <Link href={`/shop/${item.slug}`} className="flex-1">
                      <Button variant="outline" className="w-full">View</Button>
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
