'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils/pricing';
import FreeShippingProgress from '@/components/cart/FreeShippingProgress';
import CouponCode from '@/components/cart/CouponCode';
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-12"
            >
              <ShoppingBagIcon className="mx-auto h-24 w-24 text-primary-600 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4 antialiased">Your Cart is Empty</h1>
              <p className="text-lg text-gray-600 mb-8 antialiased">
                Looks like you haven't added any plants to your cart yet. 
                Start shopping to build your perfect plant collection!
              </p>
              <div className="space-y-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <span>Continue Shopping</span>
                </Link>
                <div className="text-center">
                  <Link
                    href="/combos"
                    className="text-primary-600 hover:text-primary-700 font-medium"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 antialiased">
            Shopping Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 antialiased">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
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
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
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
                        <h3 className="text-lg font-medium text-gray-900 mb-1 antialiased">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 capitalize">
                          {item.type} {item.category && `• ${item.category}`}
                        </p>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-lg font-bold text-gray-900 antialiased">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-gray-100 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-100">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 rounded-l-lg"
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium bg-gray-50">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 rounded-r-lg"
                                disabled={item.quantity >= (item.maxQuantity || 10)}
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleMoveToWishlist(item.id)}
                              className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
                              title="Move to Wishlist"
                            >
                              <HeartIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
                              title="Remove Item"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-gray-900 antialiased">
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
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 antialiased">Order Summary</h2>

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

              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {(discount > 0 || couponDiscount > 0) && (
                  <div className="flex justify-between text-[#2E7D32]">
                    <span>Discount</span>
                    <span>-{formatPrice(discount + couponDiscount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {subtotal >= 150 ? (
                      <span className="text-[#2E7D32] font-semibold">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold antialiased">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice - couponDiscount)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  href="/checkout"
                  className="w-full bg-[#2E7D32] text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-[#1B5E20] transition-colors shadow-lg block"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="text-center text-sm text-gray-500">
                  <p>🔒 Secure checkout with SSL encryption</p>
                  <p>✓ Cash on Delivery available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}