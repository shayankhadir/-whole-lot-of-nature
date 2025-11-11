'use client';

/**
 * LoyaltyHistory Component
 * Displays transaction history for loyalty points
 */

import React from 'react';
import { motion } from 'framer-motion';
import { LoyaltyTransaction } from '@/lib/types/loyalty';

interface LoyaltyHistoryProps {
  transactions?: LoyaltyTransaction[];
  isLoading?: boolean;
  compact?: boolean;
}

const LoyaltyHistory: React.FC<LoyaltyHistoryProps> = ({ 
  transactions = [], 
  isLoading = false, 
  compact = false 
}) => {
  // Mock transactions for demo (in production, fetch from store)
  const mockTransactions: LoyaltyTransaction[] = [
    {
      id: 'txn_1',
      userId: '123',
      type: 'earn',
      points: 120,
      reason: 'Purchase - Order #1001',
      orderId: '1001',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: 'txn_2',
      userId: '123',
      type: 'redeem',
      points: -500,
      reason: 'Redeemed: ₹10 Off Coupon',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: 'txn_3',
      userId: '123',
      type: 'earn',
      points: 250,
      reason: 'Purchase - Order #1000',
      orderId: '1000',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    {
      id: 'txn_4',
      userId: '123',
      type: 'tier-upgrade',
      points: 0,
      reason: 'Upgraded to Silver Tier',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    },
    {
      id: 'txn_5',
      userId: '123',
      type: 'earn',
      points: 150,
      reason: 'Purchase - Order #999',
      orderId: '999',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    },
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;
  const visibleTransactions = compact ? displayTransactions.slice(0, 5) : displayTransactions;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return '⬆️';
      case 'redeem':
        return '⬇️';
      case 'tier-upgrade':
        return '🎉';
      case 'adjustment':
        return '🔧';
      case 'expiry':
        return '⏰';
      default:
        return '•';
    }
  };

  const getTransactionColor = (type: string, points: number) => {
    if (type === 'tier-upgrade') return 'text-green-600';
    if (points > 0) return 'text-green-600';
    if (points < 0) return 'text-red-600';
    return 'text-black';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${!compact ? 'border-2 border-black rounded-lg overflow-hidden' : ''}`}
    >
      {!compact && (
        <div className="bg-gradient-to-r from-green-50 to-white border-b-2 border-black px-6 py-4">
          <h3 className="text-xl font-bold text-black">Transaction History</h3>
        </div>
      )}

      <div className={`${compact ? '' : 'p-6'} space-y-3 max-h-96 overflow-y-auto`}>
        {visibleTransactions.length > 0 ? (
          visibleTransactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black truncate">{transaction.reason}</p>
                  <p className="text-sm text-gray-600">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>

              <div className={`text-right whitespace-nowrap ml-4 font-bold text-lg ${getTransactionColor(transaction.type, transaction.points)}`}>
                {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-black text-lg font-medium mb-2">No transactions yet</p>
            <p className="text-gray-700 text-sm">Make your first purchase to start earning points!</p>
          </div>
        )}
      </div>

      {compact && visibleTransactions.length > 0 && (
        <div className="text-center pt-4">
          <button className="text-green-600 font-bold hover:text-green-700 transition-colors">
            View All →
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LoyaltyHistory;
