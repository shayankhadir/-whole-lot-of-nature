'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils/pricing';
import { 
  ArrowLeftIcon, 
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal, tax, totalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [billing, setBilling] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'IN',
  });

  // Hydration fix and pre-fill user data
  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || ['', ''];
      setBilling(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user?.email || '',
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBilling(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!billing.firstName || !billing.lastName) {
      setError('Please enter your full name');
      return false;
    }
    if (!billing.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!billing.phone || billing.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!billing.address1 || !billing.city || !billing.state || !billing.postcode) {
      setError('Please complete your shipping address');
      return false;
    }
    if (billing.postcode.length !== 6 || !/^\d+$/.test(billing.postcode)) {
      setError('Please enter a valid 6-digit PIN code');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          billing: {
            firstName: billing.firstName,
            lastName: billing.lastName,
            email: billing.email,
            phone: billing.phone,
            address1: billing.address1,
            address2: billing.address2,
            city: billing.city,
            state: billing.state,
            postcode: billing.postcode,
            country: billing.country,
          },
          shipping: {
            firstName: billing.firstName,
            lastName: billing.lastName,
            address1: billing.address1,
            address2: billing.address2,
            city: billing.city,
            state: billing.state,
            postcode: billing.postcode,
            country: billing.country,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create order');
      }

      // Clear local cart after successful order creation
      clearCart();

      // Redirect to WooCommerce payment page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback redirect to WordPress checkout
        window.location.href = `https://admin.wholelotofnature.com/checkout/order-pay/${data.orderId}/?pay_for_order=true&key=${data.orderKey}`;
      }

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  // Show loading state during hydration or auth loading
  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  // Require authentication - show login/signup prompt
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/cart"
              className="inline-flex items-center space-x-2 text-[#2E7D32] hover:text-[#66BB6A] mb-6"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Cart</span>
            </Link>
            
            <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-8 border border-[#2E7D32]/20">
              <div className="text-center mb-8">
                <UserIcon className="mx-auto h-16 w-16 text-[#2E7D32] mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Sign in to Continue</h1>
                <p className="text-gray-400">
                  Please sign in or create an account to complete your purchase.
                </p>
              </div>

              {/* Cart Summary */}
              <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6 border border-[#333]">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Your Cart ({items.length} items)</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {items.slice(0, 3).map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white truncate">{item.name} × {item.quantity}</span>
                      <span className="text-[#2E7D32]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-gray-500">+{items.length - 3} more items</p>
                  )}
                </div>
                <div className="border-t border-[#333] mt-3 pt-3 flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-[#2E7D32]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Auth Options */}
              <div className="space-y-4">
                <Link
                  href="/auth/signin?callbackUrl=/checkout"
                  className="w-full bg-[#2E7D32] text-white py-4 px-6 rounded-xl font-semibold text-center hover:bg-[#66BB6A] transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <LockClosedIcon className="h-5 w-5" />
                  Sign In to Checkout
                </Link>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#333]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#1a1a1a] text-gray-500">or</span>
                  </div>
                </div>

                <Link
                  href="/auth/signup?callbackUrl=/checkout"
                  className="w-full bg-transparent border-2 border-[#2E7D32] text-[#2E7D32] py-4 px-6 rounded-xl font-semibold text-center hover:bg-[#2E7D32]/10 transition-colors flex items-center justify-center gap-2"
                >
                  <UserIcon className="h-5 w-5" />
                  Create Account
                </Link>
              </div>

              {/* Benefits */}
              <div className="mt-8 pt-6 border-t border-[#333]">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Why create an account?</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-[#2E7D32]" />
                    Track your orders anytime
                  </li>
                  <li className="flex items-center gap-2">
                    <TruckIcon className="h-4 w-4 text-[#2E7D32]" />
                    Save addresses for faster checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4 text-[#2E7D32]" />
                    Access exclusive offers & rewards
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-12 border border-[#2E7D32]/20">
              <CreditCardIcon className="mx-auto h-24 w-24 text-[#2E7D32] mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
              <p className="text-lg text-gray-400 mb-8">
                Add some plants to your cart before checking out.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 bg-[#2E7D32] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#66BB6A] transition-colors shadow-lg"
              >
                <span>Browse Plants</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center space-x-2 text-[#2E7D32] hover:text-[#66BB6A] mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2E7D32]/20">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-[#2E7D32]" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={billing.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={billing.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={billing.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={billing.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2E7D32]/20">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-[#2E7D32]" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={billing.address1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                    placeholder="House/Flat No., Street Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={billing.address2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                    placeholder="Apartment, Landmark (optional)"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={billing.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      value={billing.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={billing.postcode}
                      onChange={handleInputChange}
                      maxLength={6}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#2E7D32] transition-colors"
                      placeholder="6-digit PIN code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value="India"
                      disabled
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2E7D32]/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5 text-[#2E7D32]" />
                Payment
              </h2>
              <p className="text-gray-400 mb-4">
                You'll be redirected to our secure payment gateway (PayU) to complete your purchase.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2E7D32]/20 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0a0a0a] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-[#2E7D32]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#333] pt-4 space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-[#2E7D32]">Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (GST 18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-[#333] pt-3 flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span className="text-[#2E7D32]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-6 bg-[#2E7D32] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#66BB6A] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-5 w-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-[#333]">
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                  <span>🔒 Secure Checkout</span>
                  <span>🚚 Free Shipping</span>
                  <span>🌱 Eco-Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
