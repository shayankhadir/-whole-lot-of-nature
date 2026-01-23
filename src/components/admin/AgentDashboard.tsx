'use client';

/**
 * Agent Command Center - Dashboard for Managing All Marketing Agents
 * Whole Lot of Nature - Premium Plant Store
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Search,
  Mail,
  Share2,
  Link,
  BarChart3,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Flame,
  Calendar,
  FileText,
  Settings,
  Activity,
  Brain,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface AgentStatus {
  name: string;
  status: 'ready' | 'running' | 'error' | 'disabled';
  lastRun?: string;
  lastResult?: 'success' | 'partial' | 'failed';
  errorMessage?: string;
}

interface QuickStats {
  totalLeads: number;
  hotLeads: number;
  seoScore: number;
  activeCampaigns: number;
  pendingTasks: number;
}

interface DashboardData {
  systemStatus: 'healthy' | 'warning' | 'error';
  agentStatuses: AgentStatus[];
  quickStats: QuickStats;
  recentTasks: AgentTask[];
  recommendations: string[];
  aiServiceStatus: {
    configured: boolean;
    provider: string | null;
  };
}

interface AgentTask {
  id: string;
  agent: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

interface HotLead {
  id: string;
  email: string;
  firstName?: string;
  score: number;
  temperature: string;
  aiInsights?: {
    nextBestAction: string;
    purchaseProbability: number;
  };
}

// ============================================================================
// AGENT ICONS & CONFIG
// ============================================================================

const AGENT_CONFIG: Record<string, { icon: React.ElementType; color: string; description: string }> = {
  'SEO Research Agent': { icon: Search, color: 'text-blue-500', description: 'Keyword research & product optimization' },
  'Lead Intelligence Agent': { icon: Users, color: 'text-green-500', description: 'Lead scoring & nurturing' },
  'Growth Engine Agent': { icon: TrendingUp, color: 'text-purple-500', description: 'Marketing automation hub' },
  'Social Media Agent': { icon: Share2, color: 'text-pink-500', description: 'Social content generation' },
  'Backlink Agent': { icon: Link, color: 'text-orange-500', description: 'Link building opportunities' },
  'Competitor Analysis Agent': { icon: BarChart3, color: 'text-red-500', description: 'Competitor insights' },
  'Marketing Automation Agent': { icon: Zap, color: 'text-yellow-500', description: 'Campaign automation' },
  'Email Intelligence Agent': { icon: Mail, color: 'text-cyan-500', description: 'Email marketing & CRM' },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AgentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [hotLeads, setHotLeads] = useState<HotLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'leads' | 'tasks'>('overview');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchDashboardData = useCallback(async () => {
    try {
      const [dashboardRes, leadsRes] = await Promise.all([
        fetch('/api/agents/orchestrator?action=dashboard'),
        fetch('/api/agents/orchestrator?action=hot-leads'),
      ]);

      if (dashboardRes.ok) {
        const data = await dashboardRes.json();
        if (data.success) {
          setDashboardData(data.data);
        }
      }

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (data.success) {
          setHotLeads(data.data);
        }
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const runAgentAction = async (action: string, params?: Record<string, unknown>) => {
    setRunningAction(action);
    try {
      const response = await fetch('/api/agents/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh dashboard after action
        await fetchDashboardData();
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(`Action ${action} failed:`, error);
      throw error;
    } finally {
      setRunningAction(null);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disabled':
        return <PauseCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Agent Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Agent Command Center</h1>
                <p className="text-xs text-gray-400">Marketing Automation Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* System Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full">
                <div className={`w-2 h-2 rounded-full ${getSystemStatusColor(dashboardData?.systemStatus || 'healthy')} animate-pulse`} />
                <span className="text-sm text-gray-300 capitalize">
                  {dashboardData?.systemStatus || 'Unknown'}
                </span>
              </div>

              {/* AI Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full">
                <Brain className={`w-4 h-4 ${dashboardData?.aiServiceStatus?.configured ? 'text-green-500' : 'text-gray-500'}`} />
                <span className="text-sm text-gray-300">
                  {dashboardData?.aiServiceStatus?.configured ? 'AI Active' : 'AI Offline'}
                </span>
              </div>

              {/* Refresh */}
              <button
                onClick={() => fetchDashboardData()}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {(['overview', 'agents', 'leads', 'tasks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-green-500/20 text-green-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Total Leads"
            value={dashboardData?.quickStats?.totalLeads || 0}
            color="blue"
          />
          <StatCard
            icon={Flame}
            label="Hot Leads"
            value={dashboardData?.quickStats?.hotLeads || 0}
            color="red"
            highlight
          />
          <StatCard
            icon={Search}
            label="SEO Score"
            value={dashboardData?.quickStats?.seoScore || 0}
            suffix="%"
            color="green"
          />
          <StatCard
            icon={Target}
            label="Campaigns"
            value={dashboardData?.quickStats?.activeCampaigns || 0}
            color="purple"
          />
          <StatCard
            icon={Activity}
            label="Pending Tasks"
            value={dashboardData?.quickStats?.pendingTasks || 0}
            color="yellow"
          />
        </div>

        {/* Main Content by Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <ActionButton
                  label="Run Full Analysis"
                  description="Complete system diagnostic"
                  icon={BarChart3}
                  onClick={() => runAgentAction('full-analysis')}
                  loading={runningAction === 'full-analysis'}
                  color="purple"
                />
                <ActionButton
                  label="Sync WooCommerce"
                  description="Import latest customers"
                  icon={RefreshCw}
                  onClick={() => runAgentAction('sync-woocommerce')}
                  loading={runningAction === 'sync-woocommerce'}
                  color="blue"
                />
                <ActionButton
                  label="SEO Audit"
                  description="Analyze product pages"
                  icon={Search}
                  onClick={() => runAgentAction('seo-analyze')}
                  loading={runningAction === 'seo-analyze'}
                  color="green"
                />
                <ActionButton
                  label="Generate Content Plan"
                  description="4-week content calendar"
                  icon={Calendar}
                  onClick={() => runAgentAction('content-plan')}
                  loading={runningAction === 'content-plan'}
                  color="pink"
                />
                <ActionButton
                  label="Growth Report"
                  description="Full marketing analysis"
                  icon={TrendingUp}
                  onClick={() => runAgentAction('growth-report')}
                  loading={runningAction === 'growth-report'}
                  color="orange"
                />
                <ActionButton
                  label="Generate Social Posts"
                  description="Create social content"
                  icon={Share2}
                  onClick={() => runAgentAction('generate-social')}
                  loading={runningAction === 'generate-social'}
                  color="cyan"
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI Recommendations
              </h2>
              <div className="space-y-3">
                {(dashboardData?.recommendations || []).map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl"
                  >
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{rec}</p>
                  </div>
                ))}
                {(!dashboardData?.recommendations || dashboardData.recommendations.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Run full analysis to get recommendations
                  </p>
                )}
              </div>
            </div>

            {/* Hot Leads */}
            <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                Hot Leads Ready to Convert
              </h2>
              {hotLeads.length > 0 ? (
                <div className="space-y-3">
                  {hotLeads.slice(0, 5).map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {(lead.firstName || lead.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {lead.firstName || lead.email.split('@')[0]}
                          </p>
                          <p className="text-sm text-gray-400">{lead.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Score:</span>
                          <span className="font-bold text-green-400">{lead.score}</span>
                        </div>
                        {lead.aiInsights?.purchaseProbability && (
                          <p className="text-xs text-gray-500">
                            {lead.aiInsights.purchaseProbability}% likely to buy
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No hot leads at the moment. Run sync to import customers.
                </p>
              )}
            </div>

            {/* Recent Tasks */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                Recent Activity
              </h2>
              <div className="space-y-2">
                {(dashboardData?.recentTasks || []).slice(0, 6).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="text-sm text-gray-300">{task.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {(!dashboardData?.recentTasks || dashboardData.recentTasks.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(dashboardData?.agentStatuses || []).map((agent) => {
              const config = AGENT_CONFIG[agent.name] || { 
                icon: Bot, 
                color: 'text-gray-500', 
                description: 'Agent' 
              };
              const Icon = config.icon;

              return (
                <div
                  key={agent.name}
                  className={`bg-gray-900 rounded-2xl p-6 border transition-colors ${
                    agent.status === 'error' 
                      ? 'border-red-500/50' 
                      : agent.status === 'running'
                      ? 'border-blue-500/50'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gray-800 ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {getStatusIcon(agent.status)}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{config.description}</p>
                  {agent.lastRun && (
                    <p className="text-xs text-gray-500">
                      Last run: {new Date(agent.lastRun).toLocaleString()}
                    </p>
                  )}
                  {agent.errorMessage && (
                    <p className="text-xs text-red-400 mt-2">{agent.errorMessage}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Lead Management
              </h2>
              <button
                onClick={() => runAgentAction('sync-woocommerce')}
                disabled={runningAction === 'sync-woocommerce'}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                {runningAction === 'sync-woocommerce' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync Customers
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Hot Leads</p>
                <p className="text-3xl font-bold text-red-400">{hotLeads.length}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-blue-400">
                  {dashboardData?.quickStats?.totalLeads || 0}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-green-400">--</p>
              </div>
            </div>

            {/* Lead List would go here */}
            <p className="text-center text-gray-500 py-8">
              Full lead management coming soon...
            </p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Task History
            </h2>
            <div className="space-y-3">
              {(dashboardData?.recentTasks || []).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="font-medium text-white">{task.action}</p>
                      <p className="text-sm text-gray-400">Agent: {task.agent}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 capitalize">{task.status}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!dashboardData?.recentTasks || dashboardData.recentTasks.length === 0) && (
                <p className="text-center text-gray-500 py-8">
                  No tasks executed yet. Run an action to see history.
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <p>Whole Lot of Nature - Agent Command Center</p>
          <p>Last refresh: {lastRefresh.toLocaleTimeString()}</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = '',
  color,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  highlight?: boolean;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-orange-500',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gray-900 rounded-2xl p-4 border ${highlight ? 'border-red-500/50' : 'border-gray-800'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">
        {value.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

function ActionButton({
  label,
  description,
  icon: Icon,
  onClick,
  loading = false,
  color,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  loading?: boolean;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
    green: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
    pink: 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20',
    orange: 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-3 p-4 rounded-xl transition-colors text-left ${colorClasses[color]} disabled:opacity-50`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs opacity-70">{description}</p>
      </div>
    </button>
  );
}
