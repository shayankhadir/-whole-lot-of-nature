'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Star,
  Gift,
  Trophy,
  ArrowRight,
  Copy,
  Check,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  Loader2,
  Share2
} from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  slug: string;
  minPoints: number;
  pointsMultiplier: number;
  discountPercent: number;
  freeShipping: boolean;
  earlyAccess: boolean;
  birthdayBonus: number;
  color: string;
}

interface Account {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  pointsBalance: number;
  lifetimePoints: number;
  tier: Tier | null;
  referralCode: string;
  referralCount: number;
  lastActivityAt: string;
  createdAt: string;
}

interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  type: string;
  value?: number;
  minOrderValue?: number;
  imageUrl?: string;
}

interface Transaction {
  id: string;
  type: string;
  points: number;
  description: string;
  createdAt: string;
}

interface Redemption {
  id: string;
  pointsSpent: number;
  status: string;
  couponCode?: string;
  expiresAt: string;
  createdAt: string;
  reward: { name: string };
}

interface Settings {
  pointsPerDollar: number;
  signupBonus: number;
  referralBonusReferrer: number;
  referralBonusReferred: number;
  reviewBonus: number;
  birthdayBonus: number;
}

const typeLabels: Record<string, string> = {
  PURCHASE: 'Purchase',
  SIGNUP: 'Welcome Bonus',
  REFERRAL_MADE: 'Referral Bonus',
  REFERRAL_BONUS: 'Referral Welcome',
  REVIEW: 'Product Review',
  BIRTHDAY: 'Birthday Bonus',
  BONUS: 'Bonus Points',
  REDEMPTION: 'Redeemed',
  EXPIRED: 'Expired',
  ADJUSTMENT: 'Adjustment',
  TIER_BONUS: 'Tier Upgrade'
};

export default function LoyaltyPage() {
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState<Account | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history' | 'tiers'>('overview');
  const [copied, setCopied] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const fetchPublicData = useCallback(async () => {
    try {
      const [rewardsRes, tiersRes, settingsRes] = await Promise.all([
        fetch('/api/loyalty?type=rewards'),
        fetch('/api/loyalty?type=tiers'),
        fetch('/api/loyalty?type=settings')
      ]);
      
      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewards(data.data || []);
      }
      if (tiersRes.ok) {
        const data = await tiersRes.json();
        setTiers(data.data || []);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch public data:', error);
    }
  }, []);

  useEffect(() => {
    fetchPublicData();
    // Check for saved email
    const savedEmail = localStorage.getItem('loyalty_email');
    if (savedEmail) {
      setEmail(savedEmail);
      fetchAccount(savedEmail);
    }
  }, [fetchPublicData]);

  const fetchAccount = async (userEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty?type=account&email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setAccount(data.data);
        localStorage.setItem('loyalty_email', userEmail);
        // Fetch history
        fetchHistory(userEmail);
      }
    } catch (error) {
      console.error('Failed to fetch account:', error);
    }
    setLoading(false);
  };

  const fetchHistory = async (userEmail: string) => {
    try {
      const [txRes, redemRes] = await Promise.all([
        fetch(`/api/loyalty?type=transactions&email=${encodeURIComponent(userEmail)}`),
        fetch(`/api/loyalty?type=redemptions&email=${encodeURIComponent(userEmail)}`)
      ]);
      
      if (txRes.ok) {
        const data = await txRes.json();
        setTransactions(data.data || []);
      }
      if (redemRes.ok) {
        const data = await redemRes.json();
        setRedemptions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const joinProgram = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', email })
      });
      const data = await res.json();
      if (data.success) {
        setAccount(data.data);
        localStorage.setItem('loyalty_email', email);
        fetchHistory(email);
      }
    } catch (error) {
      console.error('Failed to join program:', error);
    }
    setLoading(false);
  };

  const redeemReward = async (rewardId: string) => {
    if (!account) return;
    setRedeemingId(rewardId);
    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'redeem', email: account.email, rewardId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🎉 Reward redeemed! Your coupon code is: ${data.data.couponCode}`);
        fetchAccount(account.email);
      } else {
        alert(data.error || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Failed to redeem:', error);
    }
    setRedeemingId(null);
  };

  const copyReferralCode = () => {
    if (account?.referralCode) {
      navigator.clipboard.writeText(account.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNextTier = () => {
    if (!account || !tiers.length) return null;
    const currentTierIndex = tiers.findIndex(t => t.id === account.tier?.id);
    if (currentTierIndex < tiers.length - 1) {
      return tiers[currentTierIndex + 1];
    }
    return null;
  };

  const getProgressToNextTier = () => {
    if (!account) return 0;
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    const currentMin = account.tier?.minPoints || 0;
    const nextMin = nextTier.minPoints;
    const progress = ((account.lifetimePoints - currentMin) / (nextMin - currentMin)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Not logged in - show join form
  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-white to-[#E8F5E9]">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white py-20 px-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-yellow-300 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Plant Points Rewards</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Your Rewards With Every Purchase
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join our loyalty program and earn points on every order. 
              Unlock exclusive discounts, free shipping, and special perks!
            </p>
            
            {/* Join Form */}
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Join Now & Get {settings?.signupBonus || 100} Bonus Points!</h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  onClick={joinProgram}
                  disabled={loading || !email}
                  className="px-6 py-3 bg-white text-[#2E7D32] font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Free'}
                </button>
              </div>
              <p className="text-sm text-white/60 mt-3">
                Already a member? Enter your email to view your account.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
              <p className="text-gray-600">
                Earn {settings?.pointsPerDollar || 10} points for every ₹1 spent. 
                Plus bonus points for reviews and referrals!
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Level Up</h3>
              <p className="text-gray-600">
                Unlock higher tiers for better perks: bonus points, 
                exclusive discounts, and free shipping!
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-gray-600">
                Use your points for discounts, free shipping, 
                and exclusive products!
              </p>
            </div>
          </div>
        </div>

        {/* Tiers Preview */}
        {tiers.length > 0 && (
          <div className="bg-gray-50 py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Membership Tiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {tiers.map((tier) => (
                  <div 
                    key={tier.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border-2 hover:shadow-md transition-shadow"
                    style={{ borderColor: tier.color }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: tier.color + '20' }}
                    >
                      <Trophy className="w-6 h-6" style={{ color: tier.color }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{tier.minPoints.toLocaleString()}+ points</p>
                    <ul className="space-y-2 text-sm">
                      {tier.pointsMultiplier > 1 && (
                        <li className="flex items-center gap-2 text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {((tier.pointsMultiplier - 1) * 100).toFixed(0)}% bonus points
                        </li>
                      )}
                      {tier.discountPercent > 0 && (
                        <li className="flex items-center gap-2 text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {tier.discountPercent}% member discount
                        </li>
                      )}
                      {tier.freeShipping && (
                        <li className="flex items-center gap-2 text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          Free shipping
                        </li>
                      )}
                      {tier.earlyAccess && (
                        <li className="flex items-center gap-2 text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          Early sale access
                        </li>
                      )}
                      {tier.birthdayBonus > 0 && (
                        <li className="flex items-center gap-2 text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {tier.birthdayBonus} birthday bonus
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Logged in - show dashboard
  const nextTier = getNextTier();
  const progress = getProgressToNextTier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-white to-[#E8F5E9] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div 
          className="rounded-3xl p-8 text-white mb-8 relative overflow-hidden"
          style={{ backgroundColor: account.tier?.color || '#2E7D32' }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-white/80 mb-1">Welcome back,</p>
                <h1 className="text-3xl font-bold mb-2">
                  {account.firstName || account.email.split('@')[0]}!
                </h1>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">{account.tier?.name || 'Seedling'} Member</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-white/80 mb-1">Your Points</p>
                <p className="text-5xl font-bold">{account.pointsBalance.toLocaleString()}</p>
                <p className="text-white/60 text-sm mt-1">
                  Lifetime: {account.lifetimePoints.toLocaleString()} pts
                </p>
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{account.tier?.name || 'Seedling'}</span>
                  <span>{nextTier.name}</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-white/80 mt-2">
                  {(nextTier.minPoints - account.lifetimePoints).toLocaleString()} points to {nextTier.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Refer Friends, Earn Points!</h3>
                <p className="text-gray-500 text-sm">
                  Get {settings?.referralBonusReferrer || 500} points when friends join
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gray-100 rounded-lg font-mono text-lg">
                {account.referralCode}
              </div>
              <button
                onClick={copyReferralCode}
                className="p-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {account.referralCount > 0 && (
            <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              You&apos;ve referred {account.referralCount} friend{account.referralCount !== 1 ? 's' : ''}!
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['overview', 'rewards', 'history', 'tiers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Ways to Earn</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">Every ₹1 spent</span>
                  </div>
                  <span className="font-semibold text-[#2E7D32]">+{settings?.pointsPerDollar || 10} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Refer a friend</span>
                  </div>
                  <span className="font-semibold text-[#2E7D32]">+{settings?.referralBonusReferrer || 500} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-gray-700">Write a review</span>
                  </div>
                  <span className="font-semibold text-[#2E7D32]">+{settings?.reviewBonus || 50} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="text-gray-700">Birthday bonus</span>
                  </div>
                  <span className="font-semibold text-[#2E7D32]">+{settings?.birthdayBonus || 100} pts</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-sm text-[#2E7D32] hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activity yet. Start shopping to earn points!</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`font-semibold ${tx.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.points >= 0 ? '+' : ''}{tx.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canAfford = account.pointsBalance >= reward.pointsCost;
              return (
                <div key={reward.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <span className="text-lg font-bold text-[#2E7D32]">{reward.pointsCost.toLocaleString()} pts</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{reward.name}</h3>
                  {reward.description && (
                    <p className="text-sm text-gray-500 mb-4">{reward.description}</p>
                  )}
                  <button
                    onClick={() => redeemReward(reward.id)}
                    disabled={!canAfford || redeemingId === reward.id}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      canAfford
                        ? 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {redeemingId === reward.id ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : canAfford ? (
                      'Redeem'
                    ) : (
                      `Need ${(reward.pointsCost - account.pointsBalance).toLocaleString()} more pts`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Points History</h3>
            </div>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No transactions yet</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.points >= 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.points >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold text-lg ${tx.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.points >= 0 ? '+' : ''}{tx.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const isCurrentTier = tier.id === account.tier?.id;
              const isReached = account.lifetimePoints >= tier.minPoints;
              return (
                <div 
                  key={tier.id}
                  className={`rounded-2xl p-6 border-2 transition-all ${
                    isCurrentTier 
                      ? 'ring-2 ring-offset-2' 
                      : isReached 
                        ? 'bg-white' 
                        : 'bg-gray-50 opacity-70'
                  }`}
                  style={{ 
                    borderColor: tier.color,
                    ...(isCurrentTier && { ringColor: tier.color })
                  }}
                >
                  {isCurrentTier && (
                    <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full mb-4">
                      Your Tier
                    </span>
                  )}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: tier.color + '20' }}
                  >
                    <Trophy className="w-6 h-6" style={{ color: tier.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{tier.minPoints.toLocaleString()}+ lifetime points</p>
                  <ul className="space-y-2 text-sm">
                    {tier.pointsMultiplier > 1 && (
                      <li className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        {((tier.pointsMultiplier - 1) * 100).toFixed(0)}% bonus points
                      </li>
                    )}
                    {tier.discountPercent > 0 && (
                      <li className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        {tier.discountPercent}% member discount
                      </li>
                    )}
                    {tier.freeShipping && (
                      <li className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        Free shipping
                      </li>
                    )}
                    {tier.earlyAccess && (
                      <li className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        Early sale access
                      </li>
                    )}
                    {tier.birthdayBonus > 0 && (
                      <li className="flex items-center gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        +{tier.birthdayBonus} birthday points
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E7D32] text-white font-semibold rounded-xl hover:bg-[#1B5E20] transition-colors"
          >
            Shop Now & Earn Points
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
