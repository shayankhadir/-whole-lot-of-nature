'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, ChevronLeft } from 'lucide-react';

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  pincode: string;
  shippingMethod: 'standard' | 'express' | 'free';
}

interface CheckoutStep2Props {
  data: ShippingInfo;
  onUpdate: (data: ShippingInfo) => void;
  onContinue: () => void;
  onBack: () => void;
  cartTotal: number;
  errors?: Partial<ShippingInfo>;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

interface ShippingOption {
  id: 'free' | 'standard' | 'express';
  name: string;
  description: string;
  deliveryTime: string;
  price: number;
  available: boolean;
}

export default function CheckoutStep2({ 
  data, 
  onUpdate, 
  onContinue, 
  onBack, 
  cartTotal,
  errors = {} 
}: CheckoutStep2Props) {
  const widthClassMap: Record<number, string> = {
    0: 'w-0',
    10: 'w-[10%]',
    20: 'w-[20%]',
    30: 'w-[30%]',
    40: 'w-[40%]',
    50: 'w-[50%]',
    60: 'w-[60%]',
    70: 'w-[70%]',
    80: 'w-[80%]',
    90: 'w-[90%]',
    100: 'w-full'
  };
  const [localErrors, setLocalErrors] = useState<Partial<ShippingInfo>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Calculate if free shipping is available (over ₹999)
  const freeShippingThreshold = 999;
  const qualifiesForFreeShipping = cartTotal >= freeShippingThreshold;
  const amountToFreeShipping = freeShippingThreshold - cartTotal;
  const progressPercent = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const progressBucket = Math.min(100, Math.max(0, Math.round(progressPercent / 10) * 10));
  const progressWidthClass = widthClassMap[progressBucket] || 'w-0';

  const shippingOptions: ShippingOption[] = [
    {
      id: 'free',
      name: 'Free Shipping',
      description: qualifiesForFreeShipping 
        ? 'You qualify for free shipping!' 
        : `Add ₹${amountToFreeShipping} more to unlock`,
      deliveryTime: '5-7 business days',
      price: 0,
      available: qualifiesForFreeShipping,
    },
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Reliable and affordable',
      deliveryTime: '3-4 business days',
      price: 99,
      available: true,
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Fast shipping, priority handling',
      deliveryTime: '1-2 business days',
      price: 199,
      available: true,
    },
  ];

  // Set default shipping method based on eligibility
  useEffect(() => {
    if (qualifiesForFreeShipping && data.shippingMethod !== 'free') {
      onUpdate({ ...data, shippingMethod: 'free' });
    } else if (!qualifiesForFreeShipping && data.shippingMethod === 'free') {
      onUpdate({ ...data, shippingMethod: 'standard' });
    }
  }, [qualifiesForFreeShipping]);

  const validateField = (field: keyof ShippingInfo, value: string) => {
    const newErrors = { ...localErrors };

    switch (field) {
      case 'address':
        if (!value.trim()) {
          newErrors.address = 'Address is required';
        } else if (value.length < 10) {
          newErrors.address = 'Please enter a complete address';
        } else {
          delete newErrors.address;
        }
        break;
      case 'city':
        if (!value.trim()) {
          newErrors.city = 'City is required';
        } else {
          delete newErrors.city;
        }
        break;
      case 'state':
        if (!value.trim()) {
          newErrors.state = 'State is required';
        } else {
          delete newErrors.state;
        }
        break;
      case 'pincode':
        if (!value.trim()) {
          newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(value)) {
          newErrors.pincode = 'Please enter a valid 6-digit pincode';
        } else {
          delete newErrors.pincode;
        }
        break;
    }

    setLocalErrors(newErrors);
  };

  const handleBlur = (field: keyof ShippingInfo) => {
    setTouched(prev => new Set([...prev, field]));
    if (field !== 'shippingMethod') {
      validateField(field, data[field] as string);
    }
  };

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    // For pincode, only allow numbers
    if (field === 'pincode') {
      value = value.replace(/\D/g, '').slice(0, 6);
    }
    
    onUpdate({ ...data, [field]: value });
    
    if (localErrors[field as keyof typeof localErrors]) {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof typeof newErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fieldsToValidate: (keyof ShippingInfo)[] = ['address', 'city', 'state', 'pincode'];
    fieldsToValidate.forEach(field => validateField(field, data[field] as string));
    setTouched(new Set(fieldsToValidate));

    const isValid = !localErrors.address && !localErrors.city && !localErrors.state && !localErrors.pincode &&
                    data.address && data.city && data.state && data.pincode;

    if (isValid) {
      onContinue();
    }
  };

  const allErrors = { ...localErrors, ...errors };

  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Shipping Address</h2>
            <p className="text-sm text-white/60">Where should we deliver your plants?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm text-emerald-100/80 mb-2 font-medium">
              Street Address <span className="text-red-400">*</span>
            </label>
            <textarea
              id="address"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="House/Flat No., Building, Street, Landmark"
              rows={3}
              className={`w-full bg-black/20 border ${
                touched.has('address') && allErrors.address 
                  ? 'border-red-500' 
                  : 'border-white/10 focus:border-emerald-500'
              } rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none`}
              aria-describedby={allErrors.address ? 'address-error' : undefined}
            />
            {touched.has('address') && allErrors.address && (
              <p id="address-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {allErrors.address}
              </p>
            )}
          </div>

          {/* City and Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-emerald-100/80 mb-2 font-medium">
                City <span className="text-red-400">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                placeholder="Bangalore"
                className={`w-full bg-black/20 border ${
                  touched.has('city') && allErrors.city 
                    ? 'border-red-500' 
                    : 'border-white/10 focus:border-emerald-500'
                } rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                aria-describedby={allErrors.city ? 'city-error' : undefined}
              />
              {touched.has('city') && allErrors.city && (
                <p id="city-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {allErrors.city}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm text-emerald-100/80 mb-2 font-medium">
                Pincode <span className="text-red-400">*</span>
              </label>
              <input
                id="pincode"
                type="text"
                value={data.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                onBlur={() => handleBlur('pincode')}
                placeholder="560001"
                className={`w-full bg-black/20 border ${
                  touched.has('pincode') && allErrors.pincode 
                    ? 'border-red-500' 
                    : 'border-white/10 focus:border-emerald-500'
                } rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                aria-describedby={allErrors.pincode ? 'pincode-error' : undefined}
              />
              {touched.has('pincode') && allErrors.pincode && (
                <p id="pincode-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {allErrors.pincode}
                </p>
              )}
            </div>
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm text-emerald-100/80 mb-2 font-medium">
              State <span className="text-red-400">*</span>
            </label>
            <select
              id="state"
              value={data.state}
              onChange={(e) => handleChange('state', e.target.value)}
              onBlur={() => handleBlur('state')}
              className={`w-full bg-black/20 border ${
                touched.has('state') && allErrors.state 
                  ? 'border-red-500' 
                  : 'border-white/10 focus:border-emerald-500'
              } rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer`}
              aria-describedby={allErrors.state ? 'state-error' : undefined}
            >
              <option value="" className="bg-[#0A1F12]">Select State</option>
              {indianStates.map(state => (
                <option key={state} value={state} className="bg-[#0A1F12]">{state}</option>
              ))}
            </select>
            {touched.has('state') && allErrors.state && (
              <p id="state-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {allErrors.state}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Shipping Method Selection */}
      <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Shipping Method</h3>
        
        {/* Free Shipping Progress */}
        {!qualifiesForFreeShipping && (
          <div className="mb-6 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-emerald-100 text-sm mb-2">
              Add <span className="font-bold text-emerald-400">₹{amountToFreeShipping}</span> more for{' '}
              <span className="font-bold text-emerald-400">Free Shipping</span>!
            </p>
            <div className="w-full bg-black/40 rounded-full h-2">
              <div 
                className={`bg-emerald-500 h-2 rounded-full transition-all duration-500 ${progressWidthClass}`}
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                data.shippingMethod === option.id
                  ? 'bg-emerald-500/10 border-emerald-500'
                  : option.available
                    ? 'bg-black/20 border-white/10 hover:border-white/30'
                    : 'bg-black/10 border-white/5 opacity-50 cursor-not-allowed'
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={option.id}
                checked={data.shippingMethod === option.id}
                onChange={() => option.available && handleChange('shippingMethod', option.id)}
                disabled={!option.available}
                className="mt-1 w-4 h-4 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 border-white/30 bg-transparent"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{option.name}</span>
                  <span className={`font-semibold ${option.price === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {option.price === 0 ? 'FREE' : `₹${option.price}`}
                  </span>
                </div>
                <p className="text-sm text-white/60 mt-0.5">{option.description}</p>
                <p className="text-xs text-white/40 mt-1">Estimated: {option.deliveryTime}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/25"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
