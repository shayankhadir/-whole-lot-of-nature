'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CreditCard, ChevronLeft, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import type { CustomerInfo } from './CheckoutStep1';
import type { ShippingInfo } from './CheckoutStep2';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutStep3Props {
  customerInfo: CustomerInfo;
  shippingInfo: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  onBack: () => void;
  onPayment: () => Promise<void>;
  isProcessing: boolean;
  paymentError: string | null;
}

export default function CheckoutStep3({
  customerInfo,
  shippingInfo,
  items,
  subtotal,
  discount,
  shippingCost,
  total,
  onBack,
  onPayment,
  isProcessing,
  paymentError,
}: CheckoutStep3Props) {
  const [agreed, setAgreed] = useState(false);

  const getShippingMethodLabel = (method: string) => {
    switch (method) {
      case 'free': return 'Free Shipping (5-7 days)';
      case 'express': return 'Express Delivery (1-2 days)';
      default: return 'Standard Delivery (3-4 days)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Review */}
      <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Review & Pay</h2>
            <p className="text-sm text-white/60">Please review your order before payment</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">Order Items</h3>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center bg-black/20 p-3 rounded-xl">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                  <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                </div>
                <div className="text-emerald-400 font-medium">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 rounded-xl p-4">
            <h4 className="text-xs font-medium text-white/60 uppercase mb-2">Contact</h4>
            <p className="text-white text-sm">{customerInfo.firstName} {customerInfo.lastName}</p>
            <p className="text-white/60 text-sm">{customerInfo.email}</p>
            <p className="text-white/60 text-sm">+91 {customerInfo.phone}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4">
            <h4 className="text-xs font-medium text-white/60 uppercase mb-2">Ship to</h4>
            <p className="text-white text-sm">{shippingInfo.address}</p>
            <p className="text-white/60 text-sm">
              {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
            </p>
            <p className="text-emerald-400 text-xs mt-1">
              {getShippingMethodLabel(shippingInfo.shippingMethod)}
            </p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between text-white/60 text-sm">
            <span>Subtotal ({items.length} items)</span>
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
              {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
            </span>
          </div>
          <div className="flex justify-between text-white font-bold text-xl pt-3 border-t border-white/10 mt-3">
            <span>Total</span>
            <span className="text-emerald-400">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Info */}
      <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
        
        <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-medium">Cashfree Secure Payment</p>
              <p className="text-white/60 text-sm">
                Credit/Debit Card, UPI, Net Banking, Wallets
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {['Visa', 'Mastercard', 'UPI', 'Google Pay', 'PhonePe', 'Paytm'].map(method => (
              <span 
                key={method}
                className="px-2 py-1 bg-white/10 rounded text-xs text-white/80"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex items-center gap-4 mt-4 text-white/60 text-xs">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 border-white/30 bg-transparent rounded"
        />
        <span className="text-sm text-white/60">
          I agree to the{' '}
          <a href="/terms" className="text-emerald-400 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/refund-policy" className="text-emerald-400 hover:underline">Refund Policy</a>
        </span>
      </label>

      {/* Error Display */}
      {paymentError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm">{paymentError}</p>
            <p className="text-red-300/60 text-xs mt-1">
              Please try again or contact support if the issue persists.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          type="button"
          onClick={onPayment}
          disabled={!agreed || isProcessing}
          className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Pay ₹{total}
            </>
          )}
        </button>
      </div>

      {/* Trust Footer */}
      <p className="text-center text-xs text-white/40 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3 h-3" />
        Secured by Cashfree Payments • 100% Safe & Secure
      </p>
    </div>
  );
}
