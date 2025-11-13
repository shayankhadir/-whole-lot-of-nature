'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils/pricing';

export default function CartSidebar() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    subtotal,
    discount,
    shipping,
    tax,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const isEmpty = items.length === 0;
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const applyCoupon = async () => {
    setCouponStatus(null);
    setIsApplying(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponStatus(`Coupon applied: -₹${(data.discount).toFixed(0)}`);
        useCartStore.getState().applyDiscount(data.discount);
      } else {
        setCouponStatus(data.message || 'Invalid coupon');
        useCartStore.getState().applyDiscount(0);
      }
    } catch (e) {
      setCouponStatus('Error applying coupon');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[90]" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 antialiased">
                          Shopping Cart ({totalItems})
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={closeCart}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-8">
                        <div className="flow-root">
                          {isEmpty ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center py-12"
                            >
                              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                              <p className="mt-1 text-sm text-gray-500">Start adding some plants to get started!</p>
                              <div className="mt-6">
                                <Link
                                  href="/shop"
                                  onClick={closeCart}
                                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                                >
                                  Continue Shopping
                                </Link>
                              </div>
                            </motion.div>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              <AnimatePresence>
                                {items.map((item, index) => (
                                  <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex py-6"
                                  >
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={96}
                                        height={96}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900 antialiased">
                                          <h3>
                                            <span className="line-clamp-2">{item.name}</span>
                                          </h3>
                                          <p className="ml-4">{formatPrice(item.price)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500 capitalize">
                                          {item.type} {item.category && `• ${item.category}`}
                                        </p>
                                        {item.originalPrice && item.originalPrice > item.price && (
                                          <p className="text-sm text-gray-400 line-through">
                                            {formatPrice(item.originalPrice)}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-gray-500">Qty:</span>
                                          <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                              className="p-1 hover:bg-gray-100 rounded-l-md"
                                              disabled={item.quantity <= 1}
                                            >
                                              <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-3 py-1 text-sm font-medium">
                                              {item.quantity}
                                            </span>
                                            <button
                                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                              className="p-1 hover:bg-gray-100 rounded-r-md"
                                              disabled={item.quantity >= (item.maxQuantity || 10)}
                                            >
                                              <Plus className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>

                                        <div className="flex">
                                          <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="font-medium text-primary-600 hover:text-primary-700 p-1"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.li>
                                ))}
                              </AnimatePresence>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    {!isEmpty && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {/* Coupon */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                          <div className="flex gap-2">
                            <input
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="Enter code (e.g., WELCOME10)"
                              className="flex-1 rounded-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                            <button
                              onClick={applyCoupon}
                              disabled={!couponCode || isApplying}
                              className="px-4 py-2 bg-primary-700 text-white rounded-none border border-primary-700 hover:bg-white hover:text-primary-700 transition-colors disabled:opacity-50"
                            >
                              {isApplying ? 'Applying...' : 'Apply'}
                            </button>
                          </div>
                          {couponStatus && (
                            <p className="mt-1 text-sm text-gray-600">{couponStatus}</p>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-[#2E7D32]">
                              <span>Discount</span>
                              <span>-{formatPrice(discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                              {shipping > 0 ? formatPrice(shipping) : 'Free'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax (GST 18%)</span>
                            <span className="font-medium">{formatPrice(tax)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between text-base font-medium antialiased">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 space-y-3">
                          <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full flex justify-center items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 transition-colors antialiased"
                          >
                            Checkout
                          </Link>
                          <div className="flex space-x-3">
                            <Link
                              href="/cart"
                              onClick={closeCart}
                              className="flex-1 flex justify-center items-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                            >
                              View Cart
                            </Link>
                            <button
                              onClick={clearCart}
                              className="flex-1 flex justify-center items-center rounded-md border border-primary-300 bg-white px-6 py-2 text-sm font-medium text-primary-700 shadow-sm hover:bg-primary-50 transition-colors"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>

                        <p className="mt-6 flex justify-center text-sm text-gray-500">
                          or{' '}
                          <Link
                            href="/shop"
                            onClick={closeCart}
                            className="font-medium text-primary-600 hover:text-primary-500 ml-1"
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
