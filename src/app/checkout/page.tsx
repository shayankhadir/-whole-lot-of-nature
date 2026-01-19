'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, Lock, ShieldCheck, Truck, AlertCircle, RefreshCw, User, CheckCircle2 } from 'lucide-react';
import Script from 'next/script';
import TrustBadges, { PaymentLogos, SecurityBadge } from '@/components/checkout/TrustBadges';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  logCheckoutEvent, 
  logCheckoutSuccess, 
  logCheckoutError, 
  getErrorMessage 
} from '@/lib/utils/checkoutLogger';

interface CheckoutForm {
  contactEmail: string;
  contactPhone: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingCompany: string;
  shippingCountry: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  billingFirstName: string;
  billingLastName: string;
  billingCompany: string;
  billingCountry: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  billingEmail: string;
  billingPhone: string;
  orderNotes: string;
}

interface SavedAddress {
  id: string;
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { items, totalPrice: total, removeItem, updateQuantity, applyCoupon, removeCoupon, coupons, discount, shipping, subtotal } = useCartStore();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  
  const [formData, setFormData] = useState<CheckoutForm>({
    contactEmail: '',
    contactPhone: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingCompany: '',
    shippingCountry: 'IN',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingPincode: '',
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingCountry: 'IN',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingPincode: '',
    billingEmail: '',
    billingPhone: '',
    orderNotes: '',
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

  // Fetch user's saved addresses if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        setAddressLoading(true);
        try {
          // Pre-fill email from session
          setFormData(prev => ({
            ...prev,
            contactEmail: session.user?.email || '',
            billingEmail: session.user?.email || prev.billingEmail,
          }));

          // Fetch saved addresses
          const response = await fetch('/api/account/addresses');
          if (response.ok) {
            const data = await response.json();
            if (data.addresses && data.addresses.length > 0) {
              setSavedAddresses(data.addresses);
              // Auto-select default address
              const defaultAddress = data.addresses.find((addr: SavedAddress) => addr.isDefault) || data.addresses[0];
              if (defaultAddress) {
                selectAddress(defaultAddress);
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setAddressLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [session, status]);

  useEffect(() => {
    if (!billingSameAsShipping) return;

    setFormData((prev) => {
      const next = {
        ...prev,
        billingFirstName: prev.shippingFirstName,
        billingLastName: prev.shippingLastName,
        billingCompany: prev.shippingCompany,
        billingCountry: prev.shippingCountry,
        billingAddress1: prev.shippingAddress1,
        billingAddress2: prev.shippingAddress2,
        billingCity: prev.shippingCity,
        billingState: prev.shippingState,
        billingPincode: prev.shippingPincode,
        billingEmail: prev.contactEmail,
        billingPhone: prev.contactPhone,
      };

      if (
        prev.billingFirstName === next.billingFirstName &&
        prev.billingLastName === next.billingLastName &&
        prev.billingCompany === next.billingCompany &&
        prev.billingCountry === next.billingCountry &&
        prev.billingAddress1 === next.billingAddress1 &&
        prev.billingAddress2 === next.billingAddress2 &&
        prev.billingCity === next.billingCity &&
        prev.billingState === next.billingState &&
        prev.billingPincode === next.billingPincode &&
        prev.billingEmail === next.billingEmail &&
        prev.billingPhone === next.billingPhone
      ) {
        return prev;
      }

      return next;
    });
  }, [
    billingSameAsShipping,
    formData.shippingFirstName,
    formData.shippingLastName,
    formData.shippingCompany,
    formData.shippingCountry,
    formData.shippingAddress1,
    formData.shippingAddress2,
    formData.shippingCity,
    formData.shippingState,
    formData.shippingPincode,
    formData.contactEmail,
    formData.contactPhone,
  ]);

  const selectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    const nameParts = address.fullName.split(' ');
    setFormData(prev => ({
      ...prev,
      shippingFirstName: nameParts[0] || '',
      shippingLastName: nameParts.slice(1).join(' ') || '',
      shippingAddress1: address.addressLine,
      shippingCity: address.city,
      shippingState: address.state,
      shippingPincode: address.pincode,
      contactPhone: address.phone || prev.contactPhone,
    }));
    setErrors({});
  };

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

    const contactEmail = formData.contactEmail.trim();
    const contactPhone = formData.contactPhone.replace(/\D/g, '').trim();

    const shippingFirstName = formData.shippingFirstName.trim();
    const shippingLastName = formData.shippingLastName.trim();
    const shippingAddress1 = formData.shippingAddress1.trim();
    const shippingCity = formData.shippingCity.trim();
    const shippingState = formData.shippingState.trim();
    const shippingPincode = formData.shippingPincode.replace(/\D/g, '').trim();
    const shippingCountry = formData.shippingCountry.trim();

    if (!contactEmail || !/^\S+@\S+\.\S+$/.test(contactEmail)) newErrors.contactEmail = 'Valid email is required';
    if (!contactPhone || !/^[6-9]\d{9}$/.test(contactPhone)) newErrors.contactPhone = 'Valid 10-digit phone number required';

    if (!shippingFirstName) newErrors.shippingFirstName = 'First name is required';
    if (!shippingLastName) newErrors.shippingLastName = 'Last name is required';
    if (!shippingAddress1) newErrors.shippingAddress1 = 'Address is required';
    if (!shippingCity) newErrors.shippingCity = 'City is required';
    if (!shippingState) newErrors.shippingState = 'State is required';
    if (!shippingCountry) newErrors.shippingCountry = 'Country is required';
    if (!shippingPincode || !/^\d{6}$/.test(shippingPincode)) newErrors.shippingPincode = 'Valid 6-digit pincode required';

    if (!billingSameAsShipping) {
      const billingFirstName = formData.billingFirstName.trim();
      const billingLastName = formData.billingLastName.trim();
      const billingAddress1 = formData.billingAddress1.trim();
      const billingCity = formData.billingCity.trim();
      const billingState = formData.billingState.trim();
      const billingPincode = formData.billingPincode.replace(/\D/g, '').trim();
      const billingCountry = formData.billingCountry.trim();
      const billingEmail = formData.billingEmail.trim();
      const billingPhone = formData.billingPhone.replace(/\D/g, '').trim();

      if (!billingFirstName) newErrors.billingFirstName = 'First name is required';
      if (!billingLastName) newErrors.billingLastName = 'Last name is required';
      if (!billingAddress1) newErrors.billingAddress1 = 'Address is required';
      if (!billingCity) newErrors.billingCity = 'City is required';
      if (!billingState) newErrors.billingState = 'State is required';
      if (!billingCountry) newErrors.billingCountry = 'Country is required';
      if (!billingPincode || !/^\d{6}$/.test(billingPincode)) newErrors.billingPincode = 'Valid 6-digit pincode required';
      if (!billingEmail || !/^\S+@\S+\.\S+$/.test(billingEmail)) newErrors.billingEmail = 'Valid email is required';
      if (!billingPhone || !/^[6-9]\d{9}$/.test(billingPhone)) newErrors.billingPhone = 'Valid 10-digit phone number required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      logCheckoutError('FORM_VALIDATION', 'Validation failed', { fields: Object.keys(newErrors) });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    // Log checkout started
    logCheckoutEvent('CHECKOUT_STARTED', true, { itemCount: items.length, total });
    
    if (!validateForm()) {
      setPaymentError('Please fill in all required fields correctly.');
      return;
    }
    
    logCheckoutSuccess('FORM_VALIDATION', { email: formData.contactEmail });
    
    setLoading(true);
    setPaymentError(null);
    const startTime = Date.now();
    
    try {
      // Save address if user opted to save it
      if (saveAddress && status === 'authenticated' && !selectedAddressId) {
        try {
          await fetch('/api/account/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: `${formData.shippingFirstName} ${formData.shippingLastName}`.trim(),
              addressLine: formData.shippingAddress1,
              city: formData.shippingCity,
              state: formData.shippingState,
              pincode: formData.shippingPincode,
              phone: formData.contactPhone,
              isDefault: savedAddresses.length === 0, // Set as default if first address
              type: 'shipping'
            })
          });
        } catch (e) {
          // Don't block checkout if address save fails
          console.error('Failed to save address:', e);
        }
      }

      // 1. Create Order
      logCheckoutEvent('ORDER_CREATION', true, { itemCount: items.length });
      
      const billing = billingSameAsShipping
        ? {
            first_name: formData.shippingFirstName,
            last_name: formData.shippingLastName,
            address_1: formData.shippingAddress1,
            address_2: formData.shippingAddress2,
            city: formData.shippingCity,
            state: formData.shippingState,
            postcode: formData.shippingPincode,
            country: formData.shippingCountry || 'IN',
            email: formData.contactEmail,
            phone: formData.contactPhone,
          }
        : {
            first_name: formData.billingFirstName,
            last_name: formData.billingLastName,
            address_1: formData.billingAddress1,
            address_2: formData.billingAddress2,
            city: formData.billingCity,
            state: formData.billingState,
            postcode: formData.billingPincode,
            country: formData.billingCountry || 'IN',
            email: formData.billingEmail,
            phone: formData.billingPhone,
          };

      const shipping = {
        first_name: formData.shippingFirstName,
        last_name: formData.shippingLastName,
        address_1: formData.shippingAddress1,
        address_2: formData.shippingAddress2,
        city: formData.shippingCity,
        state: formData.shippingState,
        postcode: formData.shippingPincode,
        country: formData.shippingCountry || 'IN',
      };

      const response = await fetch('/api/payments/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerName: `${billing.first_name} ${billing.last_name}`,
          customerPhone: billing.phone,
          customerEmail: billing.email,
          billing,
          shipping,
          items: items.map(item => ({
            product_id: Number(item.id),
            quantity: item.quantity
          }))
        }),
      });

      const data = await response.json();

      if (!data.success) {
        logCheckoutError('ORDER_CREATION', data.message || 'Order creation failed', { response: data });
        throw new Error(data.message || 'Failed to create order');
      }
      
      logCheckoutSuccess('ORDER_CREATION', { orderId: data.order_id }, startTime);

      // 2. Initialize Payment
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
      logCheckoutError('PAYMENT_INITIATED', error, { total, itemCount: items.length });
      
      // User-friendly error message
      const userMessage = getErrorMessage(error?.code, error.message);
      setPaymentError(userMessage);
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
        <h1 className="text-3xl md:text-4xl font-display text-white mb-4 text-center">Secure Checkout</h1>
        
        {/* Trust Badges Row */}
        <div className="mb-8">
          <TrustBadges variant="compact" className="mb-4" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Form */}
          <div className="space-y-8">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm text-emerald-100/60 mb-1">Email</label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="you@example.com"
                    className={`w-full bg-black/20 border ${errors.contactEmail ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm text-emerald-100/60 mb-1">Phone Number</label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    placeholder="9876543210"
                    className={`w-full bg-black/20 border ${errors.contactPhone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                Shipping Address
              </h2>

              {/* Login prompt for guests */}
              {status === 'unauthenticated' && (
                <div className="mb-6 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-emerald-100 text-sm">
                        <Link href="/login?callbackUrl=/checkout" className="text-emerald-400 font-semibold hover:underline">
                          Sign in
                        </Link>
                        {' '}to use saved addresses and speed up checkout
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Addresses Selector */}
              {status === 'authenticated' && savedAddresses.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm text-emerald-100/60 mb-3">Saved Addresses</label>
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => selectAddress(address)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedAddressId === address.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-white/10 bg-black/20 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white font-medium">{address.fullName}</p>
                            <p className="text-emerald-100/60 text-sm mt-1">{address.addressLine}</p>
                            <p className="text-emerald-100/60 text-sm">{address.city}, {address.state} - {address.pincode}</p>
                            {address.phone && <p className="text-emerald-100/60 text-sm">Phone: {address.phone}</p>}
                          </div>
                          {selectedAddressId === address.id && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                        {address.isDefault && (
                          <span className="inline-block mt-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddressId(null);
                        setFormData(prev => ({
                          ...prev,
                          shippingFirstName: '',
                          shippingLastName: '',
                          shippingCompany: '',
                          shippingAddress1: '',
                          shippingAddress2: '',
                          shippingCity: '',
                          shippingState: '',
                          shippingPincode: '',
                          contactPhone: ''
                        }));
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedAddressId === null
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-white/10 bg-black/20 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-400" />
                        <span className="text-white">Use a new address</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {addressLoading && (
                <div className="mb-6 flex items-center justify-center py-4">
                  <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                  <span className="ml-2 text-emerald-100/60 text-sm">Loading saved addresses...</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="shippingFirstName" className="block text-sm text-emerald-100/60 mb-1">First Name</label>
                  <input
                    id="shippingFirstName"
                    type="text"
                    value={formData.shippingFirstName}
                    onChange={(e) => setFormData({...formData, shippingFirstName: e.target.value})}
                    placeholder="Enter first name"
                    className={`w-full bg-black/20 border ${errors.shippingFirstName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {errors.shippingFirstName && <p className="text-red-500 text-xs mt-1">{errors.shippingFirstName}</p>}
                </div>
                <div>
                  <label htmlFor="shippingLastName" className="block text-sm text-emerald-100/60 mb-1">Last Name</label>
                  <input
                    id="shippingLastName"
                    type="text"
                    value={formData.shippingLastName}
                    onChange={(e) => setFormData({...formData, shippingLastName: e.target.value})}
                    placeholder="Enter last name"
                    className={`w-full bg-black/20 border ${errors.shippingLastName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {errors.shippingLastName && <p className="text-red-500 text-xs mt-1">{errors.shippingLastName}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="shippingCompany" className="block text-sm text-emerald-100/60 mb-1">Company (optional)</label>
                <input
                  id="shippingCompany"
                  type="text"
                  value={formData.shippingCompany}
                  onChange={(e) => setFormData({...formData, shippingCompany: e.target.value})}
                  placeholder="Company name"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="shippingCountry" className="block text-sm text-emerald-100/60 mb-1">Country</label>
                <select
                  id="shippingCountry"
                  value={formData.shippingCountry}
                  onChange={(e) => setFormData({...formData, shippingCountry: e.target.value})}
                  className={`w-full bg-black/20 border ${errors.shippingCountry ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                >
                  <option value="IN" className="bg-[#0A1F12]">India</option>
                </select>
                {errors.shippingCountry && <p className="text-red-500 text-xs mt-1">{errors.shippingCountry}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="shippingAddress1" className="block text-sm text-emerald-100/60 mb-1">Address line 1</label>
                <input
                  id="shippingAddress1"
                  type="text"
                  value={formData.shippingAddress1}
                  onChange={(e) => setFormData({...formData, shippingAddress1: e.target.value})}
                  placeholder="Street address, house number"
                  className={`w-full bg-black/20 border ${errors.shippingAddress1 ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                />
                {errors.shippingAddress1 && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress1}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="shippingAddress2" className="block text-sm text-emerald-100/60 mb-1">Address line 2 (optional)</label>
                <input
                  id="shippingAddress2"
                  type="text"
                  value={formData.shippingAddress2}
                  onChange={(e) => setFormData({...formData, shippingAddress2: e.target.value})}
                  placeholder="Apartment, suite, landmark"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="shippingCity" className="block text-sm text-emerald-100/60 mb-1">City</label>
                  <input
                    id="shippingCity"
                    type="text"
                    value={formData.shippingCity}
                    onChange={(e) => setFormData({...formData, shippingCity: e.target.value})}
                    placeholder="Your city"
                    className={`w-full bg-black/20 border ${errors.shippingCity ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  />
                  {errors.shippingCity && <p className="text-red-500 text-xs mt-1">{errors.shippingCity}</p>}
                </div>
                <div>
                  <label htmlFor="shippingState" className="block text-sm text-emerald-100/60 mb-1">State</label>
                  <select
                    id="shippingState"
                    value={formData.shippingState}
                    onChange={(e) => setFormData({...formData, shippingState: e.target.value})}
                    className={`w-full bg-black/20 border ${errors.shippingState ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                  >
                    <option value="" className="bg-[#0A1F12]">Select State</option>
                    <option value="Andhra Pradesh" className="bg-[#0A1F12]">Andhra Pradesh</option>
                    <option value="Karnataka" className="bg-[#0A1F12]">Karnataka</option>
                    <option value="Kerala" className="bg-[#0A1F12]">Kerala</option>
                    <option value="Maharashtra" className="bg-[#0A1F12]">Maharashtra</option>
                    <option value="Tamil Nadu" className="bg-[#0A1F12]">Tamil Nadu</option>
                    <option value="Telangana" className="bg-[#0A1F12]">Telangana</option>
                    <option value="Delhi" className="bg-[#0A1F12]">Delhi</option>
                    <option value="Gujarat" className="bg-[#0A1F12]">Gujarat</option>
                    <option value="Rajasthan" className="bg-[#0A1F12]">Rajasthan</option>
                    <option value="Uttar Pradesh" className="bg-[#0A1F12]">Uttar Pradesh</option>
                    <option value="West Bengal" className="bg-[#0A1F12]">West Bengal</option>
                    <option value="Bihar" className="bg-[#0A1F12]">Bihar</option>
                    <option value="Punjab" className="bg-[#0A1F12]">Punjab</option>
                    <option value="Haryana" className="bg-[#0A1F12]">Haryana</option>
                    <option value="Madhya Pradesh" className="bg-[#0A1F12]">Madhya Pradesh</option>
                    <option value="Odisha" className="bg-[#0A1F12]">Odisha</option>
                    <option value="Jharkhand" className="bg-[#0A1F12]">Jharkhand</option>
                    <option value="Chhattisgarh" className="bg-[#0A1F12]">Chhattisgarh</option>
                    <option value="Assam" className="bg-[#0A1F12]">Assam</option>
                    <option value="Uttarakhand" className="bg-[#0A1F12]">Uttarakhand</option>
                    <option value="Goa" className="bg-[#0A1F12]">Goa</option>
                    <option value="Himachal Pradesh" className="bg-[#0A1F12]">Himachal Pradesh</option>
                    <option value="Jammu and Kashmir" className="bg-[#0A1F12]">Jammu and Kashmir</option>
                    <option value="Tripura" className="bg-[#0A1F12]">Tripura</option>
                    <option value="Meghalaya" className="bg-[#0A1F12]">Meghalaya</option>
                    <option value="Manipur" className="bg-[#0A1F12]">Manipur</option>
                    <option value="Nagaland" className="bg-[#0A1F12]">Nagaland</option>
                    <option value="Arunachal Pradesh" className="bg-[#0A1F12]">Arunachal Pradesh</option>
                    <option value="Mizoram" className="bg-[#0A1F12]">Mizoram</option>
                    <option value="Sikkim" className="bg-[#0A1F12]">Sikkim</option>
                    <option value="Puducherry" className="bg-[#0A1F12]">Puducherry</option>
                    <option value="Chandigarh" className="bg-[#0A1F12]">Chandigarh</option>
                    <option value="Ladakh" className="bg-[#0A1F12]">Ladakh</option>
                    <option value="Lakshadweep" className="bg-[#0A1F12]">Lakshadweep</option>
                    <option value="Andaman and Nicobar" className="bg-[#0A1F12]">Andaman and Nicobar</option>
                    <option value="Dadra Nagar Haveli" className="bg-[#0A1F12]">Dadra Nagar Haveli</option>
                  </select>
                  {errors.shippingState && <p className="text-red-500 text-xs mt-1">{errors.shippingState}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="shippingPincode" className="block text-sm text-emerald-100/60 mb-1">Pincode</label>
                <input
                  id="shippingPincode"
                  type="text"
                  value={formData.shippingPincode}
                  onChange={(e) => setFormData({...formData, shippingPincode: e.target.value})}
                  placeholder="560001"
                  className={`w-full bg-black/20 border ${errors.shippingPincode ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                />
                {errors.shippingPincode && <p className="text-red-500 text-xs mt-1">{errors.shippingPincode}</p>}
              </div>

              {/* Save Address Option for logged-in users */}
              {status === 'authenticated' && !selectedAddressId && (
                <div className="mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-sm text-emerald-100/80">Save this address for future orders</span>
                  </label>
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Billing Address
              </h2>

              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-sm text-emerald-100/80">Billing address is the same as shipping</span>
                </label>
              </div>

              {!billingSameAsShipping && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingFirstName" className="block text-sm text-emerald-100/60 mb-1">First Name</label>
                      <input
                        id="billingFirstName"
                        type="text"
                        value={formData.billingFirstName}
                        onChange={(e) => setFormData({...formData, billingFirstName: e.target.value})}
                        placeholder="Enter first name"
                        className={`w-full bg-black/20 border ${errors.billingFirstName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                      />
                      {errors.billingFirstName && <p className="text-red-500 text-xs mt-1">{errors.billingFirstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="billingLastName" className="block text-sm text-emerald-100/60 mb-1">Last Name</label>
                      <input
                        id="billingLastName"
                        type="text"
                        value={formData.billingLastName}
                        onChange={(e) => setFormData({...formData, billingLastName: e.target.value})}
                        placeholder="Enter last name"
                        className={`w-full bg-black/20 border ${errors.billingLastName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                      />
                      {errors.billingLastName && <p className="text-red-500 text-xs mt-1">{errors.billingLastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="billingCompany" className="block text-sm text-emerald-100/60 mb-1">Company (optional)</label>
                    <input
                      id="billingCompany"
                      type="text"
                      value={formData.billingCompany}
                      onChange={(e) => setFormData({...formData, billingCompany: e.target.value})}
                      placeholder="Company name"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="billingCountry" className="block text-sm text-emerald-100/60 mb-1">Country</label>
                    <select
                      id="billingCountry"
                      value={formData.billingCountry}
                      onChange={(e) => setFormData({...formData, billingCountry: e.target.value})}
                      className={`w-full bg-black/20 border ${errors.billingCountry ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                    >
                      <option value="IN" className="bg-[#0A1F12]">India</option>
                    </select>
                    {errors.billingCountry && <p className="text-red-500 text-xs mt-1">{errors.billingCountry}</p>}
                  </div>

                  <div>
                    <label htmlFor="billingAddress1" className="block text-sm text-emerald-100/60 mb-1">Address line 1</label>
                    <input
                      id="billingAddress1"
                      type="text"
                      value={formData.billingAddress1}
                      onChange={(e) => setFormData({...formData, billingAddress1: e.target.value})}
                      placeholder="Street address, house number"
                      className={`w-full bg-black/20 border ${errors.billingAddress1 ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                    />
                    {errors.billingAddress1 && <p className="text-red-500 text-xs mt-1">{errors.billingAddress1}</p>}
                  </div>

                  <div>
                    <label htmlFor="billingAddress2" className="block text-sm text-emerald-100/60 mb-1">Address line 2 (optional)</label>
                    <input
                      id="billingAddress2"
                      type="text"
                      value={formData.billingAddress2}
                      onChange={(e) => setFormData({...formData, billingAddress2: e.target.value})}
                      placeholder="Apartment, suite, landmark"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingCity" className="block text-sm text-emerald-100/60 mb-1">City</label>
                      <input
                        id="billingCity"
                        type="text"
                        value={formData.billingCity}
                        onChange={(e) => setFormData({...formData, billingCity: e.target.value})}
                        placeholder="Your city"
                        className={`w-full bg-black/20 border ${errors.billingCity ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                      />
                      {errors.billingCity && <p className="text-red-500 text-xs mt-1">{errors.billingCity}</p>}
                    </div>
                    <div>
                      <label htmlFor="billingState" className="block text-sm text-emerald-100/60 mb-1">State</label>
                      <select
                        id="billingState"
                        value={formData.billingState}
                        onChange={(e) => setFormData({...formData, billingState: e.target.value})}
                        className={`w-full bg-black/20 border ${errors.billingState ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                      >
                        <option value="" className="bg-[#0A1F12]">Select State</option>
                        <option value="Andhra Pradesh" className="bg-[#0A1F12]">Andhra Pradesh</option>
                        <option value="Karnataka" className="bg-[#0A1F12]">Karnataka</option>
                        <option value="Kerala" className="bg-[#0A1F12]">Kerala</option>
                        <option value="Maharashtra" className="bg-[#0A1F12]">Maharashtra</option>
                        <option value="Tamil Nadu" className="bg-[#0A1F12]">Tamil Nadu</option>
                        <option value="Telangana" className="bg-[#0A1F12]">Telangana</option>
                        <option value="Delhi" className="bg-[#0A1F12]">Delhi</option>
                        <option value="Gujarat" className="bg-[#0A1F12]">Gujarat</option>
                        <option value="Rajasthan" className="bg-[#0A1F12]">Rajasthan</option>
                        <option value="Uttar Pradesh" className="bg-[#0A1F12]">Uttar Pradesh</option>
                        <option value="West Bengal" className="bg-[#0A1F12]">West Bengal</option>
                        <option value="Bihar" className="bg-[#0A1F12]">Bihar</option>
                        <option value="Punjab" className="bg-[#0A1F12]">Punjab</option>
                        <option value="Haryana" className="bg-[#0A1F12]">Haryana</option>
                        <option value="Madhya Pradesh" className="bg-[#0A1F12]">Madhya Pradesh</option>
                        <option value="Odisha" className="bg-[#0A1F12]">Odisha</option>
                        <option value="Jharkhand" className="bg-[#0A1F12]">Jharkhand</option>
                        <option value="Chhattisgarh" className="bg-[#0A1F12]">Chhattisgarh</option>
                        <option value="Assam" className="bg-[#0A1F12]">Assam</option>
                        <option value="Uttarakhand" className="bg-[#0A1F12]">Uttarakhand</option>
                        <option value="Goa" className="bg-[#0A1F12]">Goa</option>
                        <option value="Himachal Pradesh" className="bg-[#0A1F12]">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir" className="bg-[#0A1F12]">Jammu and Kashmir</option>
                        <option value="Tripura" className="bg-[#0A1F12]">Tripura</option>
                        <option value="Meghalaya" className="bg-[#0A1F12]">Meghalaya</option>
                        <option value="Manipur" className="bg-[#0A1F12]">Manipur</option>
                        <option value="Nagaland" className="bg-[#0A1F12]">Nagaland</option>
                        <option value="Arunachal Pradesh" className="bg-[#0A1F12]">Arunachal Pradesh</option>
                        <option value="Mizoram" className="bg-[#0A1F12]">Mizoram</option>
                        <option value="Sikkim" className="bg-[#0A1F12]">Sikkim</option>
                        <option value="Puducherry" className="bg-[#0A1F12]">Puducherry</option>
                        <option value="Chandigarh" className="bg-[#0A1F12]">Chandigarh</option>
                        <option value="Ladakh" className="bg-[#0A1F12]">Ladakh</option>
                        <option value="Lakshadweep" className="bg-[#0A1F12]">Lakshadweep</option>
                        <option value="Andaman and Nicobar" className="bg-[#0A1F12]">Andaman and Nicobar</option>
                        <option value="Dadra Nagar Haveli" className="bg-[#0A1F12]">Dadra Nagar Haveli</option>
                      </select>
                      {errors.billingState && <p className="text-red-500 text-xs mt-1">{errors.billingState}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="billingPincode" className="block text-sm text-emerald-100/60 mb-1">Pincode</label>
                    <input
                      id="billingPincode"
                      type="text"
                      value={formData.billingPincode}
                      onChange={(e) => setFormData({...formData, billingPincode: e.target.value})}
                      placeholder="560001"
                      className={`w-full bg-black/20 border ${errors.billingPincode ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                    />
                    {errors.billingPincode && <p className="text-red-500 text-xs mt-1">{errors.billingPincode}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingEmail" className="block text-sm text-emerald-100/60 mb-1">Billing Email</label>
                      <input
                        id="billingEmail"
                        type="email"
                        value={formData.billingEmail}
                        onChange={(e) => setFormData({...formData, billingEmail: e.target.value})}
                        placeholder="billing@example.com"
                        className={`w-full bg-black/20 border ${errors.billingEmail ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                      />
                      {errors.billingEmail && <p className="text-red-500 text-xs mt-1">{errors.billingEmail}</p>}
                    </div>
                    <div>
                      <label htmlFor="billingPhone" className="block text-sm text-emerald-100/60 mb-1">Billing Phone</label>
                      <input
                        id="billingPhone"
                        type="tel"
                        value={formData.billingPhone}
                        onChange={(e) => setFormData({...formData, billingPhone: e.target.value})}
                        placeholder="9876543210"
                        className={`w-full bg-black/20 border ${errors.billingPhone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                      />
                      {errors.billingPhone && <p className="text-red-500 text-xs mt-1">{errors.billingPhone}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label htmlFor="orderNotes" className="block text-sm text-emerald-100/60 mb-1">Order Notes (optional)</label>
                <textarea
                  id="orderNotes"
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({...formData, orderNotes: e.target.value})}
                  rows={3}
                  placeholder="Delivery instructions, gift note, preferred time..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              {/* Free Shipping Progress */}
              {subtotal < 999 ? (
                <div className="mb-6 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-100 text-sm mb-2">
                    Add <span className="font-bold text-emerald-400">₹{999 - subtotal}</span> more for <span className="font-bold text-emerald-400">Free Shipping</span>!
                  </p>
                  <progress
                    value={Math.min(subtotal, 999)}
                    max={999}
                    className="h-2 w-full overflow-hidden rounded-full bg-black/40 [&::-webkit-progress-bar]:bg-black/40 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
                  />
                </div>
              ) : (
                <div className="mb-6 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-100 text-sm mb-2">
                    <span className="font-bold text-emerald-400">Free Shipping Unlocked!</span>
                  </p>
                  <progress
                    value={999}
                    max={999}
                    className="h-2 w-full overflow-hidden rounded-full bg-black/40 [&::-webkit-progress-bar]:bg-black/40 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
                  />
                </div>
              )}
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-black/20 p-3 rounded-xl">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-xs truncate">{item.name}</h3>
                      <p className="text-emerald-400 text-xs">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} className="min-w-[36px] min-h-[36px] flex items-center justify-center text-white/60 hover:text-white touch-manipulation rounded-md hover:bg-white/10 transition-colors" aria-label={`Decrease quantity of ${item.name}`}>
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white text-sm w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="min-w-[36px] min-h-[36px] flex items-center justify-center text-white/60 hover:text-white touch-manipulation rounded-md hover:bg-white/10 transition-colors" aria-label={`Increase quantity of ${item.name}`}>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="min-w-[36px] min-h-[36px] flex items-center justify-center text-red-400 hover:text-red-300 touch-manipulation rounded-md hover:bg-red-500/10 transition-colors" aria-label={`Remove ${item.name} from cart`}>
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
                            aria-label={`Remove coupon ${coupon.code}`}
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
                    {/* Only show shipping cost if address, city, state, and pincode are filled */}
                    {formData.shippingAddress1 && formData.shippingCity && formData.shippingState && formData.shippingPincode
                      ? (subtotal >= 999 ? 'Free' : `₹${shipping || 99}`)
                      : '--'}
                  </span>
                </div>
                
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10 mt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Payment Error Display */}
              {paymentError && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm">{paymentError}</p>
                    <button 
                      onClick={() => setPaymentError(null)}
                      className="text-red-300 text-xs mt-2 flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Dismiss and try again
                    </button>
                  </div>
                </div>
              )}

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
              
              <div className="mt-4 space-y-3">
                <p className="text-center text-xs text-emerald-100/40 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Secured by Cashfree Payments
                </p>
                <PaymentLogos />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Trust Badges */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <TrustBadges variant="grid" className="max-w-2xl mx-auto" />
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
