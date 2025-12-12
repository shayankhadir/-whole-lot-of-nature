'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils/pricing';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface ComboProduct {
  id: string;
  name: string;
  description: string;
  items: {
    id: string;
    name: string;
    image: string;
    originalPrice: number;
    quantity: number;
  }[];
  comboPrice: number;
  originalTotalPrice: number;
  savings: number;
  image: string;
  category: string;
  inStock: boolean;
  popularCombo: boolean;
}

interface ComboProductCardProps {
  combo: ComboProduct;
  onAddToCart?: (combo: ComboProduct) => void;
  onAddToWishlist?: (combo: ComboProduct) => void;
  onQuickView?: (combo: ComboProduct) => void;
}

export default function ComboProductCard({ 
  combo, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView 
}: ComboProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const discountPercentage = calculateDiscount(combo.originalTotalPrice, combo.comboPrice);

  const handleAddToCart = () => {
    addItem({
      id: combo.id,
      name: combo.name,
      price: combo.comboPrice,
      originalPrice: combo.originalTotalPrice,
      image: combo.image,
      quantity: 1,
      type: 'combo',
      inStock: combo.inStock,
      category: combo.category,
      items: combo.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity
      }))
    });
    onAddToCart?.(combo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 hover:shadow-[#2E7D32]/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {combo.popularCombo && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg antialiased">
            POPULAR
          </span>
        </div>
      )}

      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-gradient-to-r from-[#2E7D32] to-[#0d9f6e] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg antialiased">
          {discountPercentage}% OFF
        </span>
      </div>

      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0F1E11]">
        <Image
          src={combo.image}
          alt={combo.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-3 backdrop-blur-md"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onQuickView?.(combo)}
            className="bg-[#daf2d0]/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-[#daf2d0] transition-colors"
          >
            <Eye className="h-5 w-5 text-[#0d3512]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToWishlist?.(combo)}
            className="bg-[#daf2d0]/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-[#daf2d0] transition-colors"
          >
            <Heart className="h-5 w-5 text-[#2E7D32]" />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        <span className="text-xs font-semibold text-[#66BB6A] uppercase tracking-wide">
          {combo.category}
        </span>

        {/* Title */}
        <h3 className="mt-2 font-sans text-[clamp(0.95rem,2vw,1.1rem)] leading-[1.25] font-semibold text-white line-clamp-2 group-hover:text-[#66BB6A] transition-colors antialiased">
          {combo.name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-[#86efac] line-clamp-2">
          {combo.description}
        </p>

        {/* Included Items */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-[#86efbe] mb-2">
            Includes {combo.items.length} items:
          </p>
          <div className="flex flex-wrap gap-1">
            {combo.items.slice(0, 3).map((item, index) => (
              <span
                key={item.id}
                className="text-xs bg-[#2E7D32]/30 text-[#86efbe] px-2 py-1 rounded-full border border-[#2E7D32]/50"
              >
                {item.quantity}x {item.name}
              </span>
            ))}
            {combo.items.length > 3 && (
              <span className="text-xs bg-[#2E7D32]/30 text-[#86efbe] px-2 py-1 rounded-full border border-[#2E7D32]/50">
                +{combo.items.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#66BB6A] antialiased">
              ₹{combo.comboPrice.toFixed(2)}
            </span>
            {combo.originalTotalPrice && (
              <span className="ml-2 text-sm text-[#daf2d0]/50 line-through antialiased">
                ₹{combo.originalTotalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={!combo.inStock}
            className={
              combo.inStock
                ? 'bg-gradient-to-r from-[#14532d] to-[#0f3c24] text-white px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition-all shadow-md border border-emerald-900/50'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }
          >
            {combo.inStock ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>

        {/* Stock Status */}
        <div className="mt-4">
          {combo.inStock ? (
            <span className="inline-flex items-center text-xs text-[#66BB6A]">
              <div className="w-2 h-2 bg-[#66BB6A] rounded-full mr-2" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center text-xs text-[#daf2d0]">
              <div className="w-2 h-2 bg-[#daf2d0] rounded-full mr-2" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={!combo.inStock}
          className={`mt-4 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            combo.inStock
              ? 'bg-[#66BB6A] text-[#0d3512] border border-[#66BB6A] hover:bg-[#86efbe]'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{combo.inStock ? 'Add Combo to Cart' : 'Out of Stock'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
