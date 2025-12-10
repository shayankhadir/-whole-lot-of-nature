'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, Lock, ShieldCheck, Truck } from 'lucide-react';
import Script from 'next/script';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { items, totalPrice: total, removeItem, updateQuantity, applyCoupon, removeCoupon, coupons, discount, shipping, subtotal } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  useEffect(() => {
    // Initialize Cashfree SDK once script is loaded
    if (window.Cashfree) {
      setCashfree(new window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox'
      }));
    }
  }, []);

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

  const validateForm = () => {
    const newErrors: Partial<CheckoutForm> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone number required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // 1. Create Order
      const response = await fetch('/api/payments/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          billing: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            address_1: formData.address,
            city: formData.city,
            state: formData.state,
            postcode: formData.pincode,
            country: 'IN',
            email: formData.email,
            phone: formData.phone
          },
          shipping: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            address_1: formData.address,
            city: formData.city,
            state: formData.state,
            postcode: formData.pincode,
            country: 'IN'
          },
          items: items.map(item => ({
            product_id: Number(item.id),
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // 2. Initialize Payment
      if (cashfree) {
        const checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: '_self',
        };
        cashfree.checkout(checkoutOptions);
      } else {
        console.error('Cashfree SDK not initialized');
        alert('Payment system loading. Please try again in a moment.');
      }

    } catch (error: any) {
      console.error('Payment Error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A1F12] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-display text-white mb-4">Your cart is empty</h1>
          <p className="text-emerald-100/60 mb-8">Add some green friends to your cart first!</p>
          <button 
            onClick={() => router.push('/shop')}
            className="px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1F12] py-12 px-4 sm:px-6 lg:px-8">
      <Script 
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        onLoad={() => {
          setCashfree(new window.Cashfree({
            mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox'
          }));
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display text-white mb-8 text-center">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Form */}
          <div className="space-y-8">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-emerald-100/60 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={`w-full bg-black/20 border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/60 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-emerald-100/60 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-black/20 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-emerald-100/60 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="9876543210"
                  className={`w-full bg-black/20 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                Shipping Address
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm text-emerald-100/60 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className={`w-full bg-black/20 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-emerald-100/60 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/60 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    className={`w-full bg-black/20 border ${errors.pincode ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              {/* Free Shipping Progress */}
              {subtotal < 999 && (
                <div className="mb-6 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-100 text-sm mb-2">
                    Add <span className="font-bold text-emerald-400">₹{999 - subtotal}</span> more for <span className="font-bold text-emerald-400">Free Shipping</span>!
                  </p>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(subtotal / 999) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-black/20 p-3 rounded-xl">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-emerald-400 text-sm">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} className="text-white/60 hover:text-white">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/60 hover:text-white">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
                {/* Coupon Section */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                  
                  {/* Applied Coupons List */}
                  {coupons && coupons.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {coupons.map((coupon) => (
                        <div key={coupon.code} className="flex justify-between items-center bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-3 py-2">
                          <span className="text-emerald-400 text-sm font-medium">{coupon.code}</span>
                          <button 
                            onClick={() => handleRemoveCoupon(coupon.code)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-emerald-100/60">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-100/60">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-400" : ""}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10 mt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{total}
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-emerald-100/40 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Secured by Cashfree Payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Cashfree: any;
  }
}
