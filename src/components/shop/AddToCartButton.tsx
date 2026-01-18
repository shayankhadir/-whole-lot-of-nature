'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/stores/cartStore';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      // Add item to cart store - properly structured
      await addItem({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price || product.sale_price || '0'),
        originalPrice: parseFloat(product.regular_price || product.price || '0'),
        image: product.images?.[0]?.src || '',
        quantity: quantity,
        type: 'product',
        inStock: true, // Products in shop are in stock
        maxQuantity: product.stock_quantity || 999,
        category: product.categories?.[0]?.name,
      });
      
      // Show success message
      console.log(`Added ${quantity} x ${product.name} to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (!product || product.in_stock === false) {
    // Only show out of stock if explicitly set to false
    // Don't block if in_stock is undefined (treat as in stock)
    if (product?.in_stock === false) {
      return (
        <button
          disabled
          className="w-full px-8 py-4 bg-gray-600 text-white rounded-lg font-semibold cursor-not-allowed opacity-50"
        >
          Out of Stock
        </button>
      );
    }
  }

  return (
    <div className="flex gap-4 items-start">
      <div className="flex items-center border border-[#2E7D32]/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 bg-[#2C2C2C] text-white hover:bg-[#2E7D32]/20 transition-colors backdrop-blur-md"
        >
          −
        </button>
        <span className="px-6 py-3 bg-[#0F1E11] text-white font-semibold min-w-[60px] text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
          className="px-4 py-3 bg-[#2C2C2C] text-white hover:bg-[#2E7D32]/20 transition-colors backdrop-blur-md"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="flex-1 px-8 py-4 bg-[#2E7D32] text-white rounded-lg font-semibold hover:bg-[#66BB6A] transition-all shadow-lg shadow-[#2E7D32]/50 hover:shadow-[#66BB6A]/50 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
