'use client';

import { Shield, Truck, RefreshCw, CreditCard, Leaf, Award } from 'lucide-react';

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Secure Payment',
    description: 'SSL encrypted checkout',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Free Shipping',
    description: 'On orders above ₹150',
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: '7-Day Returns',
    description: 'Hassle-free returns',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'COD Available',
    description: 'Cash on delivery option',
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: '100% Organic',
    description: 'Chemical-free plants',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Quality Assured',
    description: 'Healthy plant guarantee',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white/5 backdrop-blur-md border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="text-emerald-400 mb-3">
                {badge.icon}
              </div>
              <h3 className="text-cream-50 font-semibold text-sm mb-1">
                {badge.title}
              </h3>
              <p className="text-cream-200 text-xs">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
