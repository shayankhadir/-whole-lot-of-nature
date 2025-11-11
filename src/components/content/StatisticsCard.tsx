'use client';

/**
 * Statistics Cards Component
 * Display key business metrics and impact numbers
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Statistic {
  icon: string;
  number: string;
  label: string;
  description?: string;
  color?: 'green' | 'black' | 'white';
}

interface StatisticsProps {
  statistics: Statistic[];
  variant?: 'row' | 'grid' | 'large';
  title?: string;
  subtitle?: string;
}

const StatisticsCard: React.FC<StatisticsProps> = ({
  statistics,
  variant = 'grid',
  title,
  subtitle,
}) => {
  const containerClass = {
    row: 'flex flex-wrap gap-4 md:gap-6 justify-center',
    grid: 'grid md:grid-cols-2 lg:grid-cols-4 gap-6',
    large: 'grid md:grid-cols-2 gap-8',
  };

  const cardClass = {
    row: 'flex-1 min-w-40 bg-white border-2 border-black rounded-lg p-4 text-center',
    grid: 'bg-white border-2 border-black rounded-lg p-6 text-center hover:shadow-xl transition-all',
    large: 'bg-gradient-to-br from-white to-green-50 border-4 border-green-600 rounded-lg p-8 text-center',
  };

  const numberClass = {
    row: 'text-3xl md:text-4xl font-bold text-green-600 mb-2',
    grid: 'text-4xl md:text-5xl font-bold text-green-600 mb-3',
    large: 'text-6xl md:text-7xl font-bold text-green-600 mb-4',
  };

  const labelClass = {
    row: 'font-bold text-black text-sm md:text-base',
    grid: 'font-bold text-black text-sm md:text-base',
    large: 'font-bold text-black text-lg md:text-xl mb-2',
  };

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

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="w-full"
    >
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">{title}</h2>}
          {subtitle && <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}

      <motion.div variants={container} className={containerClass[variant]}>
        {statistics.map((stat, idx) => (
          <motion.div key={idx} variants={item} className={cardClass[variant]}>
            <p className="text-3xl md:text-4xl mb-3">{stat.icon}</p>
            <p className={numberClass[variant]}>{stat.number}</p>
            <p className={labelClass[variant]}>{stat.label}</p>
            {stat.description && (
              <p className="text-xs md:text-sm text-gray-600 mt-2">{stat.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default StatisticsCard;

/**
 * Pre-defined statistics for Whole Lot of Nature
 */
export const wholelotStats = {
  overview: [
    {
      icon: '👥',
      number: '10,000+',
      label: 'Happy Customers',
      description: 'Across India trusting our seeds',
    },
    {
      icon: '🌱',
      number: '500+',
      label: 'Plant Varieties',
      description: 'Seeds for every gardener',
    },
    {
      icon: '🌾',
      number: '50+',
      label: 'Farmer Partners',
      description: 'Supporting sustainable farming',
    },
    {
      icon: '⭐',
      number: '95%',
      label: 'Satisfaction Rate',
      description: 'Customer approval rating',
    },
  ],

  impact: [
    {
      icon: '🌍',
      number: '500+',
      label: 'Families Supported',
      description: 'Through fair trade farming',
    },
    {
      icon: '📚',
      number: '5,000+',
      label: 'Gardeners Trained',
      description: 'In sustainable practices',
    },
    {
      icon: '💚',
      number: '100%',
      label: 'Organic Certified',
      description: 'Zero pesticides, pure seeds',
    },
    {
      icon: '🏪',
      number: '100+',
      label: 'Retail Locations',
      description: 'Nationwide availability',
    },
  ],

  community: [
    {
      icon: '👨‍🌾',
      number: '50+',
      label: 'Farmer Partners',
      description: 'Direct partnerships for quality',
    },
    {
      icon: '🤝',
      number: '25+',
      label: 'Corporate Partners',
      description: 'Corporate wellness programs',
    },
    {
      icon: '🌳',
      number: '15',
      label: 'Community Gardens',
      description: 'Urban gardening initiatives',
    },
    {
      icon: '🎓',
      number: '50+',
      label: 'Years Experience',
      description: 'Expert team leadership',
    },
  ],
};
