'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { 
  CheckoutProgress, 
  CheckoutStep1, 
  CheckoutStep2, 
  CheckoutStep3,
  type CustomerInfo,
  type ShippingInfo 
} from '@/components/checkout';
import { 
  logCheckoutEvent, 
  logCheckoutSuccess, 
  logCheckoutError, 
  getErrorMessage 
} from '@/lib/utils/checkoutLogger';

declare global {
  interface Window {
    Cashfree: any;
  }
}

const CHECKOUT_STEPS = [
  { title: 'Contact', description: 'Your details' },
  { title: 'Shipping', description: 'Delivery address' },
  { title: 'Payment', description: 'Complete order' },
];

export default function MultiStepCheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    totalPrice: total, 
    removeItem, 
    updateQuantity, 
    applyCoupon, 
    removeCoupon, 
    coupons, 
    discount, 
    shipping, 
    subtotal,
    clearCart 
  } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [cashfree, setCashfree] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form data for all steps
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: '',
    city: '',
    state: '',
    pincode: '',
    shippingMethod: 'standard',
  });

  // Calculate shipping cost based on method
  const getShippingCost = () => {
    if (subtotal >= 999) return 0; // Free shipping over ₹999
    switch (shippingInfo.shippingMethod) {
      case 'free': return 0;
      case 'express': return 199;
      default: return 99;
    }
  };

  const shippingCost = getShippingCost();
  const finalTotal = subtotal - discount + shippingCost;

  // Initialize Cashfree SDK
  useEffect(() => {
    if (window.Cashfree) {
      setCashfree(new window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox'
      }));
    }
  }, []);

  // Log page view
  useEffect(() => {
    if (items.length > 0) {
      logCheckoutEvent('CART_VIEWED', true, { itemCount: items.length, total: subtotal });
    }
  }, []);

  // Coupon handlers
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMessage(null);
    try {
      await applyCoupon(couponCode);
      setCouponMessage({ type: 'success', text: 'Coupon applied successfully!' });
      setCouponCode('');
    } catch (error: any) {
      setCouponMessage({ type: 'error', text: error.message || 'Failed to apply coupon' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async (code: string) => {
    setCouponLoading(true);
    try {
      await removeCoupon(code);
      setCouponMessage({ type: 'success', text: 'Coupon removed' });
    } catch (error: any) {
      setCouponMessage({ type: 'error', text: 'Failed to remove coupon' });
    } finally {
      setCouponLoading(false);
    }
  };

  // Step navigation
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
      setPaymentError(null);
    }
  };

  // Payment handler
  const handlePayment = async () => {
    logCheckoutEvent('CHECKOUT_STARTED', true, { step: 3, total: finalTotal });
    
    setLoading(true);
    setPaymentError(null);
    const startTime = Date.now();

    try {
      logCheckoutEvent('ORDER_CREATION', true, { itemCount: items.length });

      const response = await fetch('/api/payments/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email,
          billing: {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            address_1: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postcode: shippingInfo.pincode,
            country: 'IN',
            email: customerInfo.email,
            phone: customerInfo.phone
          },
          shipping: {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            address_1: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postcode: shippingInfo.pincode,
            country: 'IN'
          },
          items: items.map(item => ({
            product_id: Number(item.id),
            quantity: item.quantity
          })),
          shippingMethod: shippingInfo.shippingMethod,
          shippingCost: shippingCost,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        logCheckoutError('ORDER_CREATION', data.message || 'Order creation failed', { response: data });
        throw new Error(data.message || 'Failed to create order');
      }

      logCheckoutSuccess('ORDER_CREATION', { orderId: data.order_id }, startTime);
      logCheckoutEvent('PAYMENT_INITIATED', true, { orderId: data.order_id });

      if (cashfree) {
        const checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: '_self',
        };
        cashfree.checkout(checkoutOptions);
      } else {
        logCheckoutError('PAYMENT_INITIATED', 'Cashfree SDK not loaded');
        setPaymentError('Payment system is loading. Please wait a moment and try again.');
      }

    } catch (error: any) {
      logCheckoutError('PAYMENT_INITIATED', error, { total: finalTotal, itemCount: items.length });
      const userMessage = getErrorMessage(error?.code, error.message);
      setPaymentError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A1F12] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-display text-white mb-4">Your cart is empty</h1>
          <p className="text-emerald-100/60 mb-8">Add some green friends to your cart first!</p>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1F12] py-8 px-4 sm:px-6 lg:px-8">
      <Script 
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        onLoad={() => {
          setCashfree(new window.Cashfree({
            mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox'
          }));
        }}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/cart" 
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Cart</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-display text-white">Checkout</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <CheckoutProgress currentStep={currentStep} steps={CHECKOUT_STEPS} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Steps */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <CheckoutStep1
                data={customerInfo}
                onUpdate={setCustomerInfo}
                onContinue={() => goToStep(2)}
              />
            )}

            {currentStep === 2 && (
              <CheckoutStep2
                data={shippingInfo}
                onUpdate={setShippingInfo}
                onContinue={() => goToStep(3)}
                onBack={() => goToStep(1)}
                cartTotal={subtotal}
              />
            )}

            {currentStep === 3 && (
              <CheckoutStep3
                customerInfo={customerInfo}
                shippingInfo={shippingInfo}
                items={items.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image || '/images/placeholder.jpg',
                }))}
                subtotal={subtotal}
                discount={discount}
                shippingCost={shippingCost}
                total={finalTotal}
                onBack={() => goToStep(2)}
                onPayment={handlePayment}
                isProcessing={loading}
                paymentError={paymentError}
              />
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center bg-black/20 p-2 rounded-xl">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image || '/images/placeholder.jpg'} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm truncate">{item.name}</h3>
                      <p className="text-emerald-400 text-xs">₹{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="text-white/40 hover:text-white p-1"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-white/40 hover:text-white p-1"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 p-1 ml-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponMessage.text}
                  </p>
                )}
                {coupons && coupons.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {coupons.map((coupon) => (
                      <div key={coupon.code} className="flex justify-between items-center bg-emerald-900/20 rounded-lg px-2 py-1">
                        <span className="text-emerald-400 text-xs">{coupon.code}</span>
                        <button 
                          onClick={() => handleRemoveCoupon(coupon.code)}
                          className="text-white/40 hover:text-white"
                          aria-label="Remove coupon"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 text-sm">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-emerald-400' : ''}>
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10 mt-2">
                  <span>Total</span>
                  <span className="text-emerald-400">₹{finalTotal}</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 999 && (
                <div className="mt-4 bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-emerald-100 text-xs">
                    Add <span className="font-bold text-emerald-400">₹{999 - subtotal}</span> more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
