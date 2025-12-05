'use client';

/**
 * LoyaltyCard Component
 * Displays user loyalty status, points balance, and tier information
 * Primary dashboard for loyalty program
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLoyal } from '@/lib/hooks/useLoyal';
import TierBadge from './TierBadge';

interface LoyaltyCardProps {
  compact?: boolean;
  onRedeemClick?: () => void;
  onHistoryClick?: () => void;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ compact = false, onRedeemClick, onHistoryClick }) => {
  const { pointsBalance, currentTier, pointsToNextTier, tierProgress, tierBenefits, isLoading } = useLoyal();

  if (isLoading) {
    return (
      <div className="bg-white border border-black rounded-lg p-6 w-full">
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const tierEmoji = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🏅',
    platinum: '💎',
  }[currentTier];

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-black border-l-4 border-l-green-600 rounded-lg p-4 w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl antialiased">{tierEmoji}</span>
            <div>
              <p className="text-sm text-black font-medium capitalize">{currentTier} Member</p>
              <p className="text-2xl font-bold text-[#2E7D32] antialiased">{pointsBalance.toLocaleString()} pts</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRedeemClick}
            className="bg-[#2E7D32] text-white px-4 py-2 rounded font-medium hover:bg-[#2E7D32] transition-colors"
          >
            Redeem
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border-2 border-black rounded-lg overflow-hidden"
    >
      {/* Header with tier badge */}
      <div className="bg-gradient-to-r from-green-50 to-white border-b-2 border-black p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black antialiased">Your Loyalty</h2>
          <TierBadge tier={currentTier} size="lg" />
        </div>
        <p className="text-black text-sm">{tierBenefits.exclusivePerks[0]}</p>
      </div>

      {/* Points Display */}
      <div className="p-6 border-b-2 border-black">
        <div className="text-center mb-6">
          <p className="text-black text-sm font-medium mb-2">AVAILABLE POINTS</p>
          <motion.p
            key={pointsBalance}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-[#2E7D32] antialiased"
          >
            {pointsBalance.toLocaleString()}
          </motion.p>
          <p className="text-black text-xs mt-2">Earn more with every purchase!</p>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="p-6 border-b-2 border-black">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-black text-sm font-medium">PROGRESS TO NEXT TIER</p>
          <p className="text-black text-sm font-bold antialiased">{tierProgress}%</p>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-200 border border-black rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${tierProgress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#2E7D32] rounded-full"
          />
        </div>

        {currentTier !== 'platinum' && (
          <p className="text-black text-xs mt-2">
            {pointsToNextTier.toLocaleString()} points to next tier
          </p>
        )}

        {currentTier === 'platinum' && <p className="text-black text-xs mt-2 font-bold antialiased">🎉 You&apos;re at max tier!</p>}
      </div>

      {/* Benefits */}
      <div className="p-6 border-b-2 border-black">
        <p className="text-black font-bold text-sm mb-3 antialiased">MEMBER BENEFITS</p>
        <div className="space-y-2">
          {tierBenefits.exclusivePerks.slice(0, 3).map((perk, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-[#2E7D32] mt-1">✓</span>
              <p className="text-black text-sm">{perk}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-6 bg-gray-50 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRedeemClick}
          className="flex-1 bg-[#2E7D32] text-white font-bold py-3 rounded border-2 border-[#2E7D32] hover:bg-[#2E7D32] transition-colors antialiased"
        >
          Redeem Points
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onHistoryClick}
          className="flex-1 bg-white text-black font-bold py-3 rounded border-2 border-black hover:bg-gray-100 transition-colors antialiased"
        >
          View History
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LoyaltyCard;
