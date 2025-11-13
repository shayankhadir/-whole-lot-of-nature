'use client';

/**
 * Feature Card Component
 * Display product/service features with consistent styling
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  icon: string;
  title: string;
  description: string;
  details?: string[];
  benefits?: string[];
}

interface FeatureCardProps {
  features: Feature[];
  variant?: 'grid' | 'row' | 'vertical-list' | 'carousel';
  columns?: 2 | 3 | 4;
  highlighted?: boolean;
  withBorder?: boolean;
  compact?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  features,
  variant = 'grid',
  columns = 3,
  highlighted = false,
  withBorder = true,
  compact = false,
}) => {
  const containerClasses = {
    grid: `grid grid-cols-1 md:grid-cols-${columns} gap-6`,
    row: 'flex flex-wrap gap-4 justify-center',
    vertical_list: 'space-y-4',
    carousel: 'flex overflow-x-auto gap-4 pb-4',
  };

  const cardBaseClass = withBorder
    ? 'border-2 border-black'
    : 'border-0';

  const highlightClass = highlighted
    ? 'bg-[#2E7D32] border-4 border-[#2E7D32] shadow-lg'
    : 'bg-white hover:shadow-lg transition-shadow';

  const cardClasses = `${cardBaseClass} ${highlightClass} rounded-lg p-${compact ? '4' : '6'} text-left`;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (variant === 'vertical-list') {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="space-y-4"
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={item} className={cardClasses}>
            <div className="flex gap-4">
              <span className="text-3xl md:text-4xl flex-shrink-0 antialiased">{feature.icon}</span>
              <div className="flex-grow">
                <h3 className="font-bold text-black text-lg mb-2 antialiased">{feature.title}</h3>
                <p className="text-gray-700 mb-3">{feature.description}</p>
                {feature.details && (
                  <ul className="space-y-1">
                    {feature.details.map((detail, didx) => (
                      <li key={didx} className="text-sm text-gray-600">
                        • {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (variant === 'row') {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="flex flex-wrap gap-4 justify-center"
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={item} className={`${cardClasses} flex-1 min-w-60 md:min-w-80`}>
            <div className="text-center">
              <p className="text-4xl mb-3 antialiased">{feature.icon}</p>
              <h3 className="font-bold text-black mb-2 antialiased">{feature.title}</h3>
              <p className="text-sm text-gray-700">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Default grid variant
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
      className={containerClasses.grid}
    >
      {features.map((feature, idx) => (
        <motion.div key={idx} variants={item} className={cardClasses}>
          <p className={`${compact ? 'text-3xl' : 'text-4xl'} mb-3`}>{feature.icon}</p>
          <h3 className={`font-bold text-black mb-2 ${compact ? 'text-base' : 'text-lg'}`}>
            {feature.title}
          </h3>
          <p className={`text-gray-700 mb-3 ${compact ? 'text-sm' : 'text-base'}`}>
            {feature.description}
          </p>
          {feature.benefits && !compact && (
            <ul className="space-y-1">
              {feature.benefits.map((benefit, bidx) => (
                <li key={bidx} className="text-sm text-gray-600">
                  ✓ {benefit}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureCard;

/**
 * Pre-defined feature sets for Whole Lot of Nature
 */
export const productFeatures = {
  organic: [
    {
      icon: '🌾',
      title: '100% Organic',
      description: 'All seeds certified organic, completely pesticide-free',
      benefits: ['Laboratory tested', 'Certified by authorities', 'Non-GMO'],
    },
    {
      icon: '📦',
      title: 'Quality Assured',
      description: 'Rigorous quality control from farm to doorstep',
      benefits: ['High germination rate', 'Freshness guaranteed', 'Protective packaging'],
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Seeds delivered fresh to your door in 5-7 days',
      benefits: ['Free shipping on orders', 'Live tracking', 'Express options'],
    },
  ],

  gardening: [
    {
      icon: '🌱',
      title: 'Plant Varieties',
      description: '500+ varieties for every gardening need and region',
      benefits: ['Vegetables', 'Medicinal plants', 'Herbs and spices'],
    },
    {
      icon: '📚',
      title: 'Expert Guidance',
      description: 'Free growing guides and gardening support',
      benefits: ['Growing tips', 'Seasonal recommendations', 'Community forum'],
    },
    {
      icon: '💚',
      title: 'Sustainability',
      description: 'Eco-friendly practices throughout our operations',
      benefits: ['Carbon-neutral shipping', 'Recyclable packaging', 'Green initiatives'],
    },
  ],

  community: [
    {
      icon: '👨‍🌾',
      title: 'Farmer Partnerships',
      description: 'Direct partnerships supporting 50+ organic farmers',
      details: ['Fair pricing guaranteed', 'Long-term contracts', 'Farmer training'],
    },
    {
      icon: '👥',
      title: 'Community Programs',
      description: 'Educational initiatives training 5,000+ gardeners',
      details: ['Free workshops', 'Online courses', 'Garden visits'],
    },
    {
      icon: '🤝',
      title: 'Corporate Partnerships',
      description: 'B2B programs for companies and organizations',
      details: ['Bulk discounts', 'Employee wellness', 'CSR programs'],
    },
  ],

  why_choose: [
    {
      icon: '⭐',
      title: '95% Customer Satisfaction',
      description: '10,000+ happy customers trusting our seeds',
      benefits: ['Positive reviews', 'High repeat rate', 'Customer support'],
    },
    {
      icon: '✓',
      title: 'Certified Organic',
      description: 'All products verified by authorized bodies',
      benefits: ['Third-party tested', 'Industry compliant', 'Transparent sourcing'],
    },
    {
      icon: '🏆',
      title: 'Award Winning',
      description: 'Recognized for excellence in organic agriculture',
      benefits: ['Industry awards', 'Media recognition', 'Expert endorsements'],
    },
    {
      icon: '💰',
      title: 'Best Value',
      description: 'Premium quality at competitive prices',
      benefits: ['No middlemen', 'Direct from farm', 'Affordable pricing'],
    },
  ],
};
