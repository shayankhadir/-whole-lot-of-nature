'use client';

/**
 * TierBadge Component
 * Displays user's loyalty tier as a badge
 */

import React from 'react';
import { LoyaltyTier } from '@/lib/types/loyalty';

interface TierBadgeProps {
  tier: LoyaltyTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md', showLabel = true, animated = true }) => {
  const tierConfig = {
    bronze: {
      label: 'Bronze',
      bg: 'bg-yellow-50',
      border: 'border-yellow-800',
      text: 'text-yellow-900',
    },
    silver: {
      label: 'Silver',
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      text: 'text-gray-800',
    },
    gold: {
      label: 'Gold',
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
    },
    platinum: {
      label: 'Platinum',
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-900',
    },
  };

  const config = tierConfig[tier];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <div
      className={`${config.bg} border-2 ${config.border} rounded-full flex items-center gap-2 ${sizeClasses[size]} ${animationClass}`}
    >
      {showLabel && <span className={`font-bold ${config.text}`}>{config.label}</span>}
    </div>
  );
};

export default TierBadge;
