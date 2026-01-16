'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { getDisplayPrice, isOnSale, getDiscountPercentage } from '@/lib/utils/pricing';
import { cleanProductDescription } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';

interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function ProductQuickView({ isOpen, onClose, product }: ProductQuickViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const addToCart = useCartStore((state) => state.addItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id.toString()));
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  
  const displayPrice = getDisplayPrice(product);
  const mainImage = product.images && product.images.length > 0 ? product.images[selectedImageIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.sale_price || product.price),
      originalPrice: parseFloat(product.regular_price || product.price),
      image: mainImage?.src || '/placeholder-image.jpg',
      quantity,
      type: 'product',
      inStock: product.in_stock,
      maxQuantity: product.stock_quantity
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id.toString(),
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.sale_price || product.price),
      image: mainImage?.src || '/placeholder-image.jpg'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 overflow-hidden backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Product quick view"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 z-10 text-neutral-400 hover:text-neutral-900 transition p-2 rounded-full hover:bg-neutral-100"
              aria-label="Close quick view"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    {mainImage ? (
                      <Image
                        src={mainImage.src}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-neutral-400">No image available</span>
                      </div>
                    )}
                    
                    {/* Badges */}
                    {isOnSale(product) && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg antialiased">
                          SAVE {getDiscountPercentage(product)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((img, idx) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          aria-label={`View image ${idx + 1}`}
                          className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                            idx === selectedImageIndex
                              ? 'border-emerald-700'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <Image
                            src={img.src}
                            alt={`${product.name} ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-2 antialiased">{product.name}</h2>
                    {product.categories && product.categories.length > 0 && (
                      <p className="text-sm text-neutral-500">
                        {product.categories.map((cat) => cat.name).join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-bold text-emerald-700 antialiased">{displayPrice}</p>
                    {isOnSale(product) && (
                      <p className="text-xl text-neutral-500 line-through antialiased">
                        ₹{product.regular_price}
                      </p>
                    )}
                  </div>

                  {/* Short Description */}
                  {product.short_description && (
                    <div className="text-neutral-600 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: cleanProductDescription(product.short_description) }} />
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-full border-2 border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        −
                      </button>
                      <span className="w-16 text-center font-semibold text-xl antialiased">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 rounded-full border-2 border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-emerald-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!product.in_stock || addedToCart}
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all ${
                        product.in_stock
                          ? addedToCart
                            ? 'bg-[#2E7D32]'
                            : 'bg-emerald-700 hover:bg-emerald-800 hover:scale-105'
                          : 'bg-neutral-300 cursor-not-allowed'
                      }`}
                    >
                      {addedToCart ? (
                        <>Added to Cart</>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition ${
                        isWishlisted
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-700'
                          : 'border-neutral-300 text-neutral-600 hover:border-emerald-600 hover:text-emerald-700'
                      }`}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Full Details Link */}
                  <Link
                    href={`/shop/${product.slug}`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full border-2 border-neutral-300 text-neutral-800 font-semibold hover:border-emerald-700 hover:text-emerald-800 transition"
                  >
                    View Full Details →
                  </Link>

                  {/* Stock Status */}
                  {product.in_stock ? (
                    <p className="text-sm text-emerald-600 font-medium">In Stock - Ships within 2-3 days</p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium">Out of Stock</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
