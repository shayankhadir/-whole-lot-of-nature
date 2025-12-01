'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/stores/cartStore';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = async () => {
    setAdding(true);
    
    // Get the product image
    const productImage = product.images?.[0]?.src || '/images/placeholder-plant.jpg';
    
    // Add item to cart store
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price) || parseFloat(product.regular_price) || 0,
      originalPrice: product.sale_price ? parseFloat(product.regular_price) : undefined,
      image: productImage,
      quantity: quantity,
      type: 'product',
      category: product.categories?.[0]?.name,
      inStock: product.in_stock,
      maxQuantity: product.stock_quantity || 99,
    });

    // Show success state
    setAdded(true);
    
    // Open cart sidebar
    setTimeout(() => {
      openCart();
      setAdding(false);
    }, 300);

    // Reset added state after 2 seconds
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 2000);
  };

  if (!product.in_stock) {
    return (
      <button
        disabled
        className="w-full px-8 py-4 bg-gray-600 text-white rounded-lg font-semibold cursor-not-allowed opacity-50"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex gap-4 items-start">
      <div className="flex items-center border border-[#2E7D32]/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 bg-[#2C2C2C] text-white hover:bg-[#2E7D32]/20 transition-colors backdrop-blur-md"
          disabled={adding || added}
        >
          −
        </button>
        <span className="px-6 py-3 bg-[#0F1E11] text-white font-semibold min-w-[60px] text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
          className="px-4 py-3 bg-[#2C2C2C] text-white hover:bg-[#2E7D32]/20 transition-colors backdrop-blur-md"
          disabled={adding || added}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={adding || added}
        className={`flex-1 px-8 py-4 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
          added 
            ? 'bg-green-600 shadow-green-600/50' 
            : 'bg-[#2E7D32] shadow-[#2E7D32]/50 hover:bg-[#66BB6A] hover:shadow-[#66BB6A]/50'
        } disabled:cursor-wait`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart!
          </>
        ) : adding ? (
          'Adding...'
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
