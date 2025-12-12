'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils/pricing';
import FreeShippingProgress from '@/components/cart/FreeShippingProgress';
import CouponCode from '@/components/cart/CouponCode';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Shopping Cart | Whole Lot of Nature',
  description: 'Review your selected plants and gardening supplies. Fast checkout and secure payment for premium plants delivered to your doorstep in Bangalore.',
  openGraph: {
    title: 'Shopping Cart | Whole Lot of Nature',
    description: 'Review your selected plants and gardening supplies. Fast checkout and secure payment for premium plants delivered to your doorstep in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/cart',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopping Cart | Whole Lot of Nature',
    description: 'Review your selected plants and gardening supplies. Fast checkout and secure payment for premium plants delivered to your doorstep in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/cart',
  },
};


import {
  TrashIcon, 
  MinusIcon, 
  PlusIcon, 
  ShoppingBagIcon,
  HeartIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    discount,
    shipping,
    tax,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const isEmpty = items.length === 0;

  const handleApplyCoupon = async (code: string) => {
    if (!code) {
      // Remove coupon
      setAppliedCoupon('');
      setCouponDiscount(0);
      return { success: true, message: 'Coupon removed' };
    }

    // Simulate API call to validate coupon
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const coupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
      'SAVE06': { discount: 6, type: 'percentage' },
      'WELCOME10': { discount: 10, type: 'percentage' },
      'FLAT50': { discount: 50, type: 'fixed' },
    };

    const coupon = coupons[code.toUpperCase()];
    
    if (coupon) {
      const discountAmount = coupon.type === 'percentage' 
        ? (subtotal * coupon.discount) / 100 
        : coupon.discount;
      
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(discountAmount);
      
      return {
        success: true,
        message: `Coupon applied! ${coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`} discount`,
        discount: discountAmount,
      };
    }
    
    return {
      success: false,
      message: 'Invalid coupon code. Try SAVE06 or WELCOME10',
    };
  };

  const handleMoveToWishlist = (itemId: string) => {
    removeItem(itemId);
    alert('Item moved to wishlist!');
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12"
            >
              <ShoppingBagIcon className="mx-auto h-24 w-24 text-emerald-400 mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4 antialiased">Your Cart is Empty</h1>
              <p className="text-lg text-gray-300 mb-8 antialiased">
                Looks like you haven&apos;t added any plants to your cart yet.  
                Start shopping to build your perfect plant collection!
              </p>
              <div className="space-y-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center space-x-2 bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition-colors shadow-lg"
                >
                  <span>Continue Shopping</span>
                </Link>
                <div className="text-center">
                  <Link
                    href="/combos"
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Or check out our combo deals →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-3xl font-bold text-white antialiased">
            Shopping Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white antialiased">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-white mb-1 antialiased">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2 capitalize">
                          {item.type} {item.category && `• ${item.category}`}
                        </p>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-lg font-bold text-white antialiased">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-400">Quantity:</span>
                            <div className="flex items-center border border-white/20 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-white/10 rounded-l-lg text-white"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium bg-white/5 text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-white/10 rounded-r-lg text-white"
                                disabled={item.quantity >= (item.maxQuantity || 10)}
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleMoveToWishlist(item.id)}
                              className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                              title="Move to Wishlist"
                            >
                              <HeartIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              title="Remove Item"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-white antialiased">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6 antialiased">Order Summary</h2>

              {/* Free Shipping Progress */}
              <div className="mb-6">
                <FreeShippingProgress cartTotal={subtotal} freeShippingThreshold={150} />
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <CouponCode
                  onApplyCoupon={handleApplyCoupon}
                  appliedCoupon={appliedCoupon}
                  discount={couponDiscount}
                />
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                </div>
                
                {(discount > 0 || couponDiscount > 0) && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount + couponDiscount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium text-white">
                    {subtotal >= 150 ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (GST 18%)</span>
                  <span className="font-medium text-white">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold antialiased">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatPrice(totalPrice - couponDiscount)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  href="/checkout"
                  className="w-full bg-emerald-500 text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-emerald-400 transition-colors shadow-lg block"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="text-center text-sm text-gray-400">
                  <p>Secure checkout with SSL encryption</p>
                  <p>Cash on Delivery available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}