'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RefreshCw, Headphones, Leaf, Award } from 'lucide-react';

interface TrustBadge {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}

const badges: TrustBadge[] = [
  {
    icon: ShieldCheck,
    title: '100% Secure',
    description: 'SSL encrypted payments'
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ₹499'
  },
  {
    icon: RefreshCw,
    title: '7-Day Returns',
    description: 'Hassle-free returns'
  },
  {
    icon: Leaf,
    title: 'Fresh Plants',
    description: 'Healthy guarantee'
  }
];

interface TrustBadgesProps {
  variant?: 'horizontal' | 'grid' | 'compact';
  className?: string;
}

export default function TrustBadges({ variant = 'horizontal', className = '' }: TrustBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        {badges.slice(0, 3).map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-white/60"
            >
              <Icon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs">{badge.title}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{badge.title}</p>
                <p className="text-white/50 text-xs">{badge.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Default horizontal layout
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 py-4 ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
              <Icon className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-white text-sm font-medium">{badge.title}</p>
            <p className="text-white/50 text-xs">{badge.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// Payment provider logos
export function PaymentLogos({ className = '' }: { className?: string }) {
  const providers = [
    { name: 'Visa', svg: 'visa' },
    { name: 'Mastercard', svg: 'mastercard' },
    { name: 'UPI', svg: 'upi' },
    { name: 'Google Pay', svg: 'gpay' },
    { name: 'PhonePe', svg: 'phonepe' }
  ];

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="text-xs text-white/40">We accept:</span>
      <div className="flex items-center gap-2">
        {/* Visa */}
        <div className="w-10 h-6 bg-white rounded flex items-center justify-center px-1">
          <span className="text-[10px] font-bold text-blue-900">VISA</span>
        </div>
        {/* Mastercard */}
        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
          <div className="flex">
            <div className="w-3 h-3 rounded-full bg-red-500 -mr-1" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
          </div>
        </div>
        {/* UPI */}
        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
          <span className="text-[8px] font-bold text-green-700">UPI</span>
        </div>
        {/* GPay */}
        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
          <span className="text-[8px] font-bold bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">GPay</span>
        </div>
      </div>
    </div>
  );
}

// Security badges
export function SecurityBadge() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-500/10 rounded-full border border-emerald-500/20"
    >
      <ShieldCheck className="w-4 h-4 text-emerald-400" />
      <span className="text-xs text-emerald-400 font-medium">256-bit SSL Secured</span>
    </motion.div>
  );
}
