'use client';

/**
 * Trust Signals Component
 * Display credibility indicators, certifications, awards, media mentions
 */

import React from 'react';
import { motion } from 'framer-motion';

interface TrustSignal {
  icon: string;
  title: string;
  description: string;
  details?: string[];
}

interface TrustSignalsProps {
  signals: TrustSignal[];
  variant?: 'grid' | 'horizontal' | 'featured';
  compact?: boolean;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ signals, variant = 'grid', compact = false }) => {
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-green-50 to-green-100 border-4 border-[#2E7D32] rounded-lg p-8 md:p-12"
      >
        <h2 className="text-3xl font-bold text-black mb-8 text-center antialiased">Why Trust Whole Lot of Nature</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {signals.map((signal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4"
            >
              <div className="text-4xl flex-shrink-0 antialiased">{signal.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-black mb-2 antialiased">{signal.title}</h3>
                <p className="text-gray-700 mb-2">{signal.description}</p>
                {signal.details && (
                  <ul className="space-y-1">
                    {signal.details.map((detail, didx) => (
                      <li key={didx} className="text-sm text-gray-100">
                        • {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-4 justify-center md:justify-between"
      >
        {signals.map((signal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="text-center"
          >
            <div className="text-5xl mb-2 antialiased">{signal.icon}</div>
            <p className="font-bold text-black antialiased">{signal.title}</p>
            <p className="text-sm text-gray-100">{signal.description}</p>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Default grid variant
  return (
    <div className={`grid ${compact ? 'grid-cols-2 md:grid-cols-3 gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
      {signals.map((signal, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white border-2 border-black rounded-lg p-4 text-center hover:shadow-lg transition-all"
        >
          <p className={`${compact ? 'text-3xl' : 'text-5xl'} mb-3`}>{signal.icon}</p>
          <h3 className="font-bold text-black mb-2 text-sm md:text-base antialiased">{signal.title}</h3>
          <p className="text-gray-700 text-xs md:text-sm">{signal.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default TrustSignals;

/**
 * Common trust signals for Whole Lot of Nature
 */
export const trustSignals: TrustSignal[] = [
  {
    icon: 'OK',
    title: 'Certified Organic',
    description: 'All products certified organic by authorized bodies',
    details: ['100% pesticide-free', 'Laboratory tested', 'Safe for families'],
  },
  {
    icon: 'Top',
    title: 'Award Winning',
    description: 'Recognized for excellence in organic agriculture',
    details: ['Multiple industry awards', 'Media recognition', 'Customer choice'],
  },
  {
    icon: '95%',
    title: '95% Satisfaction',
    description: '10,000+ happy customers nationwide',
    details: ['Positive reviews', 'High repeat rate', 'Customer testimonials'],
  },
  {
    icon: 'OK',
    title: 'Expert Team',
    description: 'Led by horticulturists with 50+ years experience',
    details: ['Continuous training', 'Research backed', 'Industry leaders'],
  },
  {
    icon: 'OK',
    title: 'Safe Packaging',
    description: 'Eco-friendly, protective packaging',
    details: ['100% recyclable', 'Seeds arrive fresh', 'Sustainable materials'],
  },
  {
    icon: 'OK',
    title: 'Fast Delivery',
    description: 'Nationwide shipping in 5-7 days',
    details: ['Live tracking', 'Free shipping on orders', 'Money-back guarantee'],
  },
  {
    icon: 'OK',
    title: 'Free Guidance',
    description: 'Expert tips and gardening support',
    details: ['Growing guides', 'Community forum', 'Email support'],
  },
  {
    icon: 'OK',
    title: 'Eco-Conscious',
    description: 'Carbon-neutral operations and sustainable practices',
    details: ['Zero waste goal', 'Community programs', 'Environmental stewardship'],
  },
];
