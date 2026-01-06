'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, AlertCircle } from 'lucide-react';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CheckoutStep1Props {
  data: CustomerInfo;
  onUpdate: (data: CustomerInfo) => void;
  onContinue: () => void;
  errors?: Partial<CustomerInfo>;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export default function CheckoutStep1({ data, onUpdate, onContinue, errors = {} }: CheckoutStep1Props) {
  const [localErrors, setLocalErrors] = useState<Partial<CustomerInfo>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Validate on blur
  const validateField = (field: keyof CustomerInfo, value: string) => {
    const newErrors = { ...localErrors };

    switch (field) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (value.length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
        } else {
          delete newErrors.phone;
        }
        break;
    }

    setLocalErrors(newErrors);
  };

  const handleBlur = (field: keyof CustomerInfo) => {
    setTouched(prev => new Set([...prev, field]));
    validateField(field, data[field]);
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    // For phone, only allow numbers
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    onUpdate({ ...data, [field]: value });
    
    // Clear error when user starts typing
    if (localErrors[field]) {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const allFields: (keyof CustomerInfo)[] = ['firstName', 'email', 'phone'];
    allFields.forEach(field => validateField(field, data[field]));
    setTouched(new Set(allFields));

    // Check if valid
    const isValid = !localErrors.firstName && !localErrors.email && !localErrors.phone &&
                    data.firstName && data.email && data.phone;

    if (isValid) {
      onContinue();
    }
  };

  const allErrors = { ...localErrors, ...errors };

  return (
    <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Contact Information</h2>
          <p className="text-sm text-white/60">We&apos;ll use this to send order updates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm text-emerald-100/80 mb-2 font-medium">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Rahul"
              className={`w-full bg-black/20 border ${
                touched.has('firstName') && allErrors.firstName 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-white/10 focus:border-emerald-500'
              } rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
              aria-describedby={allErrors.firstName ? 'firstName-error' : undefined}
            />
            {touched.has('firstName') && allErrors.firstName && (
              <p id="firstName-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {allErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm text-emerald-100/80 mb-2 font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Sharma"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-emerald-100/80 mb-2 font-medium">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="rahul@example.com"
              className={`w-full bg-black/20 border ${
                touched.has('email') && allErrors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-white/10 focus:border-emerald-500'
              } rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
              aria-describedby={allErrors.email ? 'email-error' : undefined}
            />
          </div>
          {touched.has('email') && allErrors.email && (
            <p id="email-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {allErrors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm text-emerald-100/80 mb-2 font-medium">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/50 text-sm">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="9876543210"
              className={`w-full bg-black/20 border ${
                touched.has('phone') && allErrors.phone 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-white/10 focus:border-emerald-500'
              } rounded-xl pl-20 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
              aria-describedby={allErrors.phone ? 'phone-error' : undefined}
            />
          </div>
          {touched.has('phone') && allErrors.phone && (
            <p id="phone-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {allErrors.phone}
            </p>
          )}
          <p className="text-xs text-white/40 mt-1.5">We&apos;ll send order updates via SMS</p>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 mt-6"
        >
          Continue to Shipping
        </button>
      </form>
    </div>
  );
}
