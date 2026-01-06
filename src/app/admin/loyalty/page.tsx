'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Star,
  Gift,
  Trophy,
  Users,
  TrendingUp,
  Settings,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  RefreshCw,
  Award,
  Loader2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Check,
  AlertCircle
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
  _count?: { accounts: number };
}

interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  type: string;
  value?: number;
  minOrderValue?: number;
  isActive: boolean;
  _count?: { redemptions: number };
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

interface Stats {
  totalAccounts: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalRedemptions: number;
  accountsByTier: Record<string, number>;
}

interface ProgramSettings {
  [key: string]: unknown;
  id?: string;
  pointsPerDollar: number;
  signupBonus: number;
  referralBonusReferrer: number;
  referralBonusReferred: number;
  reviewBonus: number;
  birthdayBonus: number;
  pointsExpirationMonths: number;
  programActive: boolean;
}

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin-secret';

export default function AdminLoyaltyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'rewards' | 'tiers' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [settings, setSettings] = useState<ProgramSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [showNewReward, setShowNewReward] = useState(false);
  const [showNewTier, setShowNewTier] = useState(false);
  const [awardingPoints, setAwardingPoints] = useState<string | null>(null);
  const [awardAmount, setAwardAmount] = useState(0);
  const [awardReason, setAwardReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const apiCall = async (type: string, action?: string, body?: Record<string, unknown>) => {
    const method = action ? 'POST' : 'GET';
    const url = action 
      ? '/api/loyalty/admin' 
      : `/api/loyalty/admin?type=${type}&adminKey=${ADMIN_KEY}`;
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'POST' ? JSON.stringify({ ...body, action, adminKey: ADMIN_KEY }) : undefined
    });
    return res.json();
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, accountsRes, rewardsRes, tiersRes, settingsRes] = await Promise.all([
        apiCall('stats'),
        apiCall('accounts'),
        apiCall('rewards'),
        apiCall('tiers'),
        apiCall('settings')
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (accountsRes.success) setAccounts(accountsRes.data);
      if (rewardsRes.success) setRewards(rewardsRes.data);
      if (tiersRes.success) setTiers(tiersRes.data);
      if (settingsRes.success) setSettings(settingsRes.data);
      
      // Check if initialized
      if (tiersRes.data?.length > 0 || rewardsRes.data?.length > 0) {
        setInitialized(true);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const initializeProgram = async () => {
    setSaving(true);
    try {
      const res = await apiCall('', 'initialize');
      if (res.success) {
        setInitialized(true);
        fetchAll();
      }
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
    setSaving(false);
  };

  const awardPoints = async (accountId: string) => {
    if (!awardAmount || !awardReason) return;
    setSaving(true);
    try {
      const account = accounts.find(a => a.id === accountId);
      if (!account) return;
      
      const res = await apiCall('', 'award-points', {
        email: account.email,
        points: awardAmount,
        reason: awardReason
      });
      
      if (res.success) {
        setAwardingPoints(null);
        setAwardAmount(0);
        setAwardReason('');
        fetchAll();
      }
    } catch (error) {
      console.error('Failed to award points:', error);
    }
    setSaving(false);
  };

  const saveReward = async (reward: Partial<Reward>, isNew = false) => {
    setSaving(true);
    try {
      const action = isNew ? 'create-reward' : 'update-reward';
      const res = await apiCall('', action, reward);
      if (res.success) {
        setEditingReward(null);
        setShowNewReward(false);
        fetchAll();
      }
    } catch (error) {
      console.error('Failed to save reward:', error);
    }
    setSaving(false);
  };

  const deleteReward = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;
    try {
      await fetch('/api/loyalty/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'reward', id, adminKey: ADMIN_KEY })
      });
      fetchAll();
    } catch (error) {
      console.error('Failed to delete reward:', error);
    }
  };

  const saveTier = async (tier: Partial<Tier>, isNew = false) => {
    setSaving(true);
    try {
      const action = isNew ? 'create-tier' : 'update-tier';
      const res = await apiCall('', action, tier);
      if (res.success) {
        setEditingTier(null);
        setShowNewTier(false);
        fetchAll();
      }
    } catch (error) {
      console.error('Failed to save tier:', error);
    }
    setSaving(false);
  };

  const deleteTier = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tier?')) return;
    try {
      await fetch('/api/loyalty/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tier', id, adminKey: ADMIN_KEY })
      });
      fetchAll();
    } catch (error) {
      console.error('Failed to delete tier:', error);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await apiCall('', 'update-settings', settings);
      if (res.success) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
    setSaving(false);
  };

  const filteredAccounts = accounts.filter(a => 
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  // Not initialized
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Loyalty Program</h1>
            <p className="text-gray-400 mb-6">
              Initialize the loyalty program to create default tiers and rewards.
            </p>
            <button
              onClick={initializeProgram}
              disabled={saving}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              Initialize Program
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Loyalty Program</h1>
                <p className="text-gray-400 text-sm">Manage points, rewards, and tiers</p>
              </div>
            </div>
            <button
              onClick={fetchAll}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {(['overview', 'accounts', 'rewards', 'tiers', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-green-400 border-green-400'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalAccounts.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Total Members</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalPointsIssued.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Points Issued</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-purple-400" />
                  </div>
                  <ArrowDownRight className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalPointsRedeemed.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Points Redeemed</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalRedemptions.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Total Redemptions</p>
              </div>
            </div>

            {/* Tier Distribution */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Members by Tier</h3>
              <div className="space-y-3">
                {tiers.map((tier) => {
                  const count = tier._count?.accounts || 0;
                  const percentage = stats.totalAccounts > 0 ? (count / stats.totalAccounts) * 100 : 0;
                  return (
                    <div key={tier.id} className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tier.color }}
                      />
                      <span className="text-gray-300 w-32">{tier.name}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${percentage}%`, backgroundColor: tier.color }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-20 text-right">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Accounts */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Members</h3>
              <div className="space-y-3">
                {accounts.slice(0, 5).map((account) => (
                  <div key={account.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-medium">
                        {account.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white">{account.firstName || account.email.split('@')[0]}</p>
                        <p className="text-gray-500 text-sm">{account.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{account.pointsBalance.toLocaleString()} pts</p>
                      <p className="text-gray-500 text-sm">{account.tier?.name || 'Seedling'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email or name..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>

            {/* Accounts Table */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Member</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tier</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Balance</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Lifetime</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Referrals</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-medium">
                            {account.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white">
                              {account.firstName} {account.lastName}
                            </p>
                            <p className="text-gray-500 text-sm">{account.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: (account.tier?.color || '#666') + '20',
                            color: account.tier?.color || '#666'
                          }}
                        >
                          {account.tier?.name || 'Seedling'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-semibold">
                        {account.pointsBalance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400">
                        {account.lifetimePoints.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400">
                        {account.referralCount}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {awardingPoints === account.id ? (
                          <div className="flex items-center gap-2 justify-end">
                            <input
                              type="number"
                              value={awardAmount}
                              onChange={(e) => setAwardAmount(parseInt(e.target.value) || 0)}
                              placeholder="Pts"
                              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                            />
                            <input
                              type="text"
                              value={awardReason}
                              onChange={(e) => setAwardReason(e.target.value)}
                              placeholder="Reason"
                              className="w-32 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                            />
                            <button
                              onClick={() => awardPoints(account.id)}
                              disabled={saving || !awardAmount || !awardReason}
                              className="p-1 bg-green-600 rounded hover:bg-green-500 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => setAwardingPoints(null)}
                              className="p-1 bg-gray-600 rounded hover:bg-gray-500"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAwardingPoints(account.id)}
                            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                            title="Award Points"
                          >
                            <Award className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAccounts.length === 0 && (
                <p className="text-center text-gray-500 py-12">No members found</p>
              )}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Rewards</h2>
              <button
                onClick={() => setShowNewReward(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Reward
              </button>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div 
                  key={reward.id} 
                  className={`bg-gray-800/50 rounded-xl p-6 border transition-all ${
                    reward.isActive ? 'border-gray-700' : 'border-red-500/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingReward(reward)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-300" />
                      </button>
                      <button
                        onClick={() => deleteReward(reward.id)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{reward.name}</h3>
                  {reward.description && (
                    <p className="text-gray-400 text-sm mb-3">{reward.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400 font-semibold">{reward.pointsCost.toLocaleString()} pts</span>
                    <span className="text-gray-500">
                      {reward._count?.redemptions || 0} redeemed
                    </span>
                  </div>
                  {!reward.isActive && (
                    <div className="mt-3 flex items-center gap-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Inactive
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New/Edit Reward Modal */}
            {(showNewReward || editingReward) && (
              <RewardModal
                reward={editingReward}
                onSave={(r) => saveReward(r, !editingReward)}
                onClose={() => { setEditingReward(null); setShowNewReward(false); }}
                saving={saving}
              />
            )}
          </div>
        )}

        {/* Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Tiers</h2>
              <button
                onClick={() => setShowNewTier(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Tier
              </button>
            </div>

            {/* Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => (
                <div 
                  key={tier.id} 
                  className="bg-gray-800/50 rounded-xl p-6 border-2"
                  style={{ borderColor: tier.color }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: tier.color + '30' }}
                    >
                      <Trophy className="w-6 h-6" style={{ color: tier.color }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTier(tier)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-300" />
                      </button>
                      {tier._count?.accounts === 0 && (
                        <button
                          onClick={() => deleteTier(tier.id)}
                          className="p-2 bg-gray-700 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-300" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{tier.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{tier.minPoints.toLocaleString()}+ points</p>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>{tier.pointsMultiplier}x points multiplier</li>
                    {tier.discountPercent > 0 && <li>{tier.discountPercent}% discount</li>}
                    {tier.freeShipping && <li>Free shipping</li>}
                    {tier.earlyAccess && <li>Early access</li>}
                    {tier.birthdayBonus > 0 && <li>{tier.birthdayBonus} birthday pts</li>}
                  </ul>
                  <p className="mt-3 text-xs text-gray-500">
                    {tier._count?.accounts || 0} members
                  </p>
                </div>
              ))}
            </div>

            {/* New/Edit Tier Modal */}
            {(showNewTier || editingTier) && (
              <TierModal
                tier={editingTier}
                onSave={(t) => saveTier(t, !editingTier)}
                onClose={() => { setEditingTier(null); setShowNewTier(false); }}
                saving={saving}
              />
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Program Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Program Active</p>
                    <p className="text-gray-500 text-sm">Enable or disable the loyalty program</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.programActive}
                      onChange={(e) => setSettings({ ...settings, programActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-green-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <label className="block text-white mb-2">Points per ₹1 spent</label>
                  <input
                    type="number"
                    value={settings.pointsPerDollar}
                    onChange={(e) => setSettings({ ...settings, pointsPerDollar: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Signup Bonus</label>
                  <input
                    type="number"
                    value={settings.signupBonus}
                    onChange={(e) => setSettings({ ...settings, signupBonus: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Referrer Bonus</label>
                    <input
                      type="number"
                      value={settings.referralBonusReferrer}
                      onChange={(e) => setSettings({ ...settings, referralBonusReferrer: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Referred Bonus</label>
                    <input
                      type="number"
                      value={settings.referralBonusReferred}
                      onChange={(e) => setSettings({ ...settings, referralBonusReferred: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Review Bonus</label>
                    <input
                      type="number"
                      value={settings.reviewBonus}
                      onChange={(e) => setSettings({ ...settings, reviewBonus: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Birthday Bonus</label>
                    <input
                      type="number"
                      value={settings.birthdayBonus}
                      onChange={(e) => setSettings({ ...settings, birthdayBonus: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Points Expiration (months)</label>
                  <input
                    type="number"
                    value={settings.pointsExpirationMonths}
                    onChange={(e) => setSettings({ ...settings, pointsExpirationMonths: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                  <p className="text-gray-500 text-sm mt-1">Set to 0 for no expiration</p>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reward Modal Component
function RewardModal({ 
  reward, 
  onSave, 
  onClose, 
  saving 
}: { 
  reward: Reward | null; 
  onSave: (r: Partial<Reward>) => void; 
  onClose: () => void; 
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: reward?.id || '',
    name: reward?.name || '',
    description: reward?.description || '',
    pointsCost: reward?.pointsCost || 500,
    type: reward?.type || 'FIXED_DISCOUNT',
    value: reward?.value || 100,
    minOrderValue: reward?.minOrderValue || 0,
    isActive: reward?.isActive ?? true
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {reward ? 'Edit Reward' : 'New Reward'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Points Cost</label>
              <input
                type="number"
                value={form.pointsCost}
                onChange={(e) => setForm({ ...form, pointsCost: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="FIXED_DISCOUNT">Fixed Discount (₹)</option>
                <option value="PERCENT_DISCOUNT">Percent Discount (%)</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
                <option value="FREE_PRODUCT">Free Product</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Min Order (₹)</label>
              <input
                type="number"
                value={form.minOrderValue}
                onChange={(e) => setForm({ ...form, minOrderValue: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="isActive" className="text-white">Active</label>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Tier Modal Component
function TierModal({ 
  tier, 
  onSave, 
  onClose, 
  saving 
}: { 
  tier: Tier | null; 
  onSave: (t: Partial<Tier>) => void; 
  onClose: () => void; 
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: tier?.id || '',
    name: tier?.name || '',
    slug: tier?.slug || '',
    minPoints: tier?.minPoints || 0,
    pointsMultiplier: tier?.pointsMultiplier || 1,
    discountPercent: tier?.discountPercent || 0,
    freeShipping: tier?.freeShipping || false,
    earlyAccess: tier?.earlyAccess || false,
    birthdayBonus: tier?.birthdayBonus || 0,
    color: tier?.color || '#2E7D32'
  });

  const handleNameChange = (name: string) => {
    setForm({ 
      ...form, 
      name, 
      slug: form.id ? form.slug : name.toLowerCase().replace(/\s+/g, '-') 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {tier ? 'Edit Tier' : 'New Tier'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Min Points</label>
              <input
                type="number"
                value={form.minPoints}
                onChange={(e) => setForm({ ...form, minPoints: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Points Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={form.pointsMultiplier}
                onChange={(e) => setForm({ ...form, pointsMultiplier: parseFloat(e.target.value) || 1 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Discount %</label>
              <input
                type="number"
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Birthday Bonus</label>
              <input
                type="number"
                value={form.birthdayBonus}
                onChange={(e) => setForm({ ...form, birthdayBonus: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="freeShipping"
                checked={form.freeShipping}
                onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="freeShipping" className="text-white">Free Shipping</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="earlyAccess"
                checked={form.earlyAccess}
                onChange={(e) => setForm({ ...form, earlyAccess: e.target.checked })}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="earlyAccess" className="text-white">Early Access</label>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
