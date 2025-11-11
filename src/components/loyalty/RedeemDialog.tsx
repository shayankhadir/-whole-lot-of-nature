'use client';

/**
 * RedeemDialog Component
 * Modal for redeeming loyalty points for rewards
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoyal } from '@/lib/hooks/useLoyal';
import { LoyaltyService } from '@/lib/services/loyaltyService';
import { RedemptionOption } from '@/lib/types/loyalty';

interface RedeemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (redemption: { option: RedemptionOption; pointsRedeemed: number }) => void;
}

const RedeemDialog: React.FC<RedeemDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { pointsBalance, redeemPoints, isLoading, error, clearError } = useLoyal();
  const [selectedOption, setSelectedOption] = useState<RedemptionOption | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const redemptionOptions = LoyaltyService.getRedemptionOptions();
  const availableOptions = redemptionOptions.filter(opt => pointsBalance >= opt.pointsCost);

  const handleRedeem = async () => {
    if (!selectedOption) return;

    const result = await redeemPoints(selectedOption.pointsCost, selectedOption.id);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onSuccess?.({ option: selectedOption, pointsRedeemed: selectedOption.pointsCost });
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setSelectedOption(null);
    setSuccessMessage(null);
    clearError();
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discount':
        return '💰';
      case 'product':
        return '📦';
      case 'shipping':
        return '🚚';
      case 'experience':
        return '✨';
      default:
        return '🎁';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-auto px-4"
          >
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-50 to-white border-b-2 border-black px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">Redeem Points</h2>
                <button
                  onClick={handleClose}
                  className="text-black text-2xl font-bold hover:text-green-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {/* Success message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-2 border-green-600 rounded-lg p-4 mb-4 text-green-900 font-medium"
                  >
                    ✓ {successMessage}
                  </motion.div>
                )}

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-600 rounded-lg p-4 mb-4 text-red-900 font-medium"
                  >
                    ✕ {error}
                  </motion.div>
                )}

                {/* Points balance */}
                <div className="bg-gray-50 border-2 border-black rounded-lg p-4 mb-6">
                  <p className="text-black text-sm font-medium">YOUR BALANCE</p>
                  <p className="text-3xl font-bold text-green-600">
                    {pointsBalance.toLocaleString()} pts
                  </p>
                </div>

                {/* Redemption options */}
                {availableOptions.length > 0 ? (
                  <div className="space-y-3">
                    {availableOptions.map(option => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          selectedOption?.id === option.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-black bg-white hover:border-green-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getCategoryIcon(option.category)}</span>
                            <div>
                              <p className="font-bold text-black">{option.name}</p>
                              <p className="text-sm text-gray-700">{option.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{option.pointsCost}</p>
                            <p className="text-xs text-black">pts</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-black text-lg font-medium mb-2">No rewards available</p>
                    <p className="text-gray-700 text-sm">Earn more points to unlock rewards!</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t-2 border-black px-6 py-4 bg-gray-50 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 bg-white text-black font-bold py-3 rounded border-2 border-black hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRedeem}
                  disabled={!selectedOption || isLoading || !!successMessage}
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded border-2 border-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Redeem Now'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RedeemDialog;
