'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Zap,
  Target,
  Calendar,
  Send,
  RefreshCw,
  Play,
  Pause,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  BarChart3,
  ChevronRight,
  Tag,
  Megaphone,
  Settings
} from 'lucide-react';

interface WorkflowSummary {
  id: string;
  name: string;
  trigger: string;
  status: string;
  _count: { executions: number };
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  discountCode?: string;
  discountPercent?: number;
  startDate: string;
  endDate: string;
  usedCount: number;
  maxUses?: number;
}

interface ScheduledPost {
  id: string;
  platform: string;
  content: string;
  scheduledAt: string;
  status: string;
  publishedAt?: string;
  error?: string;
}

interface Overview {
  workflows: { byStatus: Record<string, number> };
  campaigns: { byStatus: Record<string, number> };
  social: {
    scheduled: number;
    published: number;
    failed: number;
  };
  recentExecutions: Array<{
    id: string;
    workflowName: string;
    status: string;
    startedAt: string;
  }>;
}

const platformIcons: Record<string, React.ReactNode> = {
  INSTAGRAM: <Instagram className="w-4 h-4" />,
  FACEBOOK: <Facebook className="w-4 h-4" />,
  TWITTER: <Twitter className="w-4 h-4" />
};

const platformColors: Record<string, string> = {
  INSTAGRAM: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  FACEBOOK: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  TWITTER: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400',
  SCHEDULED: 'bg-blue-500/20 text-blue-400',
  DRAFT: 'bg-gray-500/20 text-gray-400',
  PAUSED: 'bg-yellow-500/20 text-yellow-400',
  COMPLETED: 'bg-purple-500/20 text-purple-400',
  PUBLISHED: 'bg-green-500/20 text-green-400',
  FAILED: 'bg-red-500/20 text-red-400',
  RUNNING: 'bg-yellow-500/20 text-yellow-400',
  SUCCESS: 'bg-green-500/20 text-green-400',
  ERROR: 'bg-red-500/20 text-red-400'
};

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'campaigns' | 'social'>('overview');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSchedulePost, setShowSchedulePost] = useState(false);

  const fetchData = useCallback(async (type: string) => {
    if (!adminKey) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/marketing?type=${type}`, {
        headers: { 'x-admin-key': adminKey }
      });
      
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || `Failed to load ${type}`);
      }
      return result.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to fetch ${type}`;
      console.error(`Failed to fetch ${type}:`, error);
      setError(message);
    }
    return null;
  }, [adminKey]);

  const loadData = useCallback(async () => {
    setLoading(true);
    
    switch (activeTab) {
      case 'overview':
        const overviewData = await fetchData('overview');
        if (overviewData) setOverview(overviewData);
        break;
      case 'workflows':
        const workflowData = await fetchData('workflows');
        if (workflowData) setWorkflows(workflowData);
        break;
      case 'campaigns':
        const campaignData = await fetchData('campaigns');
        if (campaignData) setCampaigns(campaignData);
        break;
      case 'social':
        const postData = await fetchData('posts');
        if (postData) setPosts(postData.posts);
        break;
    }
    
    setLoading(false);
  }, [activeTab, fetchData]);

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      loadData();
    }
  }, [adminKey, loadData]);

  const handleLogin = () => {
    localStorage.setItem('admin_key', adminKey);
    setError(null);
    loadData();
  };

  const runScheduler = async () => {
    try {
      setError(null);
      await fetch('/api/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ action: 'run-scheduler' })
      });
      loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to run scheduler.';
      console.error('Failed to run scheduler:', error);
      setError(message);
    }
  };

  const generateCalendar = async () => {
    try {
      setError(null);
      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ action: 'generate-calendar' })
      });
      
      if (response.ok) {
        setActiveTab('social');
        loadData();
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to generate calendar');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate calendar.';
      console.error('Failed to generate calendar:', error);
      setError(message);
    }
  };

  const activateCampaign = async (campaignId: string) => {
    try {
      setError(null);
      await fetch('/api/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ action: 'activate-campaign', campaignId })
      });
      loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to activate campaign.';
      console.error('Failed to activate campaign:', error);
      setError(message);
    }
  };

  const pauseCampaign = async (campaignId: string) => {
    try {
      setError(null);
      await fetch('/api/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ action: 'pause-campaign', campaignId })
      });
      loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to pause campaign.';
      console.error('Failed to pause campaign:', error);
      setError(message);
    }
  };

  if (!adminKey || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] p-6">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Marketing Automation</h1>
              <p className="text-white/60 mt-2">Enter admin key to access</p>
            </div>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Key"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-white/40"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full mt-4 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-400" />
                Marketing Automation
              </h1>
              <p className="text-white/60">Manage workflows, campaigns & social posts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runScheduler}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Run Scheduler
            </button>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/80"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl w-fit">
          {(['overview', 'workflows', 'campaigns', 'social'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'social' ? 'Social Media' : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white/60 text-sm">Active Workflows</span>
                </div>
                <p className="text-2xl font-bold text-white">{overview.workflows.byStatus.ACTIVE || 0}</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Target className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white/60 text-sm">Active Campaigns</span>
                </div>
                <p className="text-2xl font-bold text-white">{overview.campaigns.byStatus.ACTIVE || 0}</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Calendar className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-white/60 text-sm">Scheduled Posts</span>
                </div>
                <p className="text-2xl font-bold text-white">{overview.social.scheduled}</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Send className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white/60 text-sm">Published Posts</span>
                </div>
                <p className="text-2xl font-bold text-white">{overview.social.published}</p>
              </div>
            </div>

            {/* Recent Executions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Workflow Executions</h2>
              {overview.recentExecutions.length === 0 ? (
                <p className="text-white/40 text-center py-8">No recent executions</p>
              ) : (
                <div className="space-y-3">
                  {overview.recentExecutions.map((exec) => (
                    <div key={exec.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[exec.status] || 'bg-gray-500/20 text-gray-400'}`}>
                          {exec.status}
                        </span>
                        <span className="text-white">{exec.workflowName}</span>
                      </div>
                      <span className="text-white/40 text-sm">
                        {new Date(exec.startedAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('campaigns')}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Megaphone className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Create Campaign</p>
                    <p className="text-white/50 text-sm">Launch a promotional campaign</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
              </button>

              <button
                onClick={generateCalendar}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <Calendar className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Generate Calendar</p>
                    <p className="text-white/50 text-sm">Auto-schedule social posts</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
              </button>

              <button
                onClick={() => setActiveTab('workflows')}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Settings className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Manage Workflows</p>
                    <p className="text-white/50 text-sm">Configure automation rules</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Automation Workflows</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4" />
                Create Workflow
              </button>
            </div>

            {workflows.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Zap className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No workflows yet</p>
                <p className="text-white/40 text-sm">Create your first automation workflow to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{workflow.name}</h3>
                        <p className="text-white/50 text-sm">Trigger: {workflow.trigger.replace('_', ' ')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[workflow.status]}`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-sm">{workflow._count.executions} executions</span>
                      <div className="flex gap-2">
                        <button title="Run Workflow" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                          <Play className="w-4 h-4 text-white/60" />
                        </button>
                        <button title="Workflow Settings" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                          <Settings className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Promotional Campaigns</h2>
              <button
                onClick={() => setShowCreateCampaign(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Campaign
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Target className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No campaigns yet</p>
                <p className="text-white/40 text-sm">Create your first promotional campaign</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-medium">{campaign.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[campaign.status]}`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm mb-2">{campaign.type.replace('_', ' ')}</p>
                        <div className="flex items-center gap-4 text-sm">
                          {campaign.discountCode && (
                            <span className="flex items-center gap-1 text-white/60">
                              <Tag className="w-3 h-3" />
                              {campaign.discountCode}
                              {campaign.discountPercent && ` (${campaign.discountPercent}% off)`}
                            </span>
                          )}
                          <span className="text-white/40">
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </span>
                          {campaign.maxUses && (
                            <span className="text-white/40">
                              {campaign.usedCount}/{campaign.maxUses} uses
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'DRAFT' || campaign.status === 'PAUSED' ? (
                          <button
                            onClick={() => activateCampaign(campaign.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Play className="w-3 h-3" />
                            Activate
                          </button>
                        ) : campaign.status === 'ACTIVE' ? (
                          <button
                            onClick={() => pauseCampaign(campaign.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            <Pause className="w-3 h-3" />
                            Pause
                          </button>
                        ) : null}
                        <button title="View Analytics" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                          <BarChart3 className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Scheduled Posts</h2>
              <div className="flex gap-2">
                <button
                  onClick={generateCalendar}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Auto-Generate
                </button>
                <button
                  onClick={() => setShowSchedulePost(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Post
                </button>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No scheduled posts</p>
                <p className="text-white/40 text-sm">Schedule posts or generate a content calendar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl border ${platformColors[post.platform] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                        {platformIcons[post.platform] || <Send className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{post.platform}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[post.status]}`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm line-clamp-2 mb-2">
                          {post.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(post.scheduledAt).toLocaleString()}
                          </span>
                          {post.publishedAt && (
                            <span className="flex items-center gap-1 text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              Published {new Date(post.publishedAt).toLocaleString()}
                            </span>
                          )}
                          {post.error && (
                            <span className="flex items-center gap-1 text-red-400">
                              <XCircle className="w-3 h-3" />
                              {post.error.substring(0, 50)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
