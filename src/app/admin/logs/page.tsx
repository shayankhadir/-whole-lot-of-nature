'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Activity, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
  Trash2,
  ChevronDown,
  BarChart3,
  Loader2
} from 'lucide-react';

interface LogEntry {
  id: string;
  agent: string;
  action: string;
  status: string;
  message: string | null;
  metadata: unknown;
  duration: number | null;
  createdAt: string;
}

interface AgentStats {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  byAgent: Record<string, { total: number; success: number; error: number }>;
  last24Hours: number;
  last7Days: number;
}

const agentColors: Record<string, string> = {
  growth: 'bg-green-500',
  trends: 'bg-purple-500',
  content: 'bg-pink-500',
  email: 'bg-cyan-500',
  seo: 'bg-orange-500',
  inventory: 'bg-blue-500',
  'design-audit': 'bg-indigo-500',
  'design-fix': 'bg-indigo-400',
  plantsy: 'bg-emerald-500',
  backlink: 'bg-yellow-500',
  social: 'bg-red-500',
  competitor: 'bg-teal-500',
  'landing-page': 'bg-rose-500',
  marketing: 'bg-violet-500'
};

const widthClassMap: Record<number, string> = {
  0: 'w-0',
  10: 'w-[10%]',
  20: 'w-[20%]',
  30: 'w-[30%]',
  40: 'w-[40%]',
  50: 'w-[50%]',
  60: 'w-[60%]',
  70: 'w-[70%]',
  80: 'w-[80%]',
  90: 'w-[90%]',
  100: 'w-full'
};

const getWidthClass = (percentage: number) => {
  const bucket = Math.min(100, Math.max(0, Math.round(percentage / 10) * 10));
  return widthClassMap[bucket] || 'w-0';
};

const formatDuration = (ms: number | null): string => {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function LogsDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!adminKey) return;
    
    try {
      const agentParam = selectedAgent !== 'all' ? `&agent=${selectedAgent}` : '';
      const response = await fetch(`/api/admin/logs?limit=100${agentParam}`, {
        headers: { 'x-admin-key': adminKey }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.data.logs || []);
        setStats(data.data.stats || null);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }, [adminKey, selectedAgent]);

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
      fetchLogs();
      if (autoRefresh) {
        const interval = setInterval(fetchLogs, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [adminKey, autoRefresh, fetchLogs]);

  const handleLogin = () => {
    localStorage.setItem('admin_key', adminKey);
    fetchLogs();
  };

  const clearOldLogs = async () => {
    if (!confirm('Delete logs older than 30 days?')) return;
    
    try {
      const response = await fetch('/api/admin/logs', {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      
      if (response.ok) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  };

  if (!adminKey || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] p-6">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#66BB6A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-[#66BB6A]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
              <p className="text-white/60 mt-2">Enter admin key to access</p>
            </div>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Key"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent placeholder:text-white/40"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full mt-4 px-4 py-3 bg-[#66BB6A] text-white rounded-xl font-semibold hover:bg-[#4CAF50] transition-colors"
            >
              Access Logs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const agents = Object.keys(stats?.byAgent || {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
              <p className="text-white/60">Monitor agent activity and performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-white/60 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-white/20"
              />
              Auto-refresh
            </label>
            <button
              onClick={fetchLogs}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/80"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-white/60 text-sm">Total Actions</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.totalRuns || 0}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-white/60 text-sm">Successful</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats?.successfulRuns || 0}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-white/60 text-sm">Errors</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats?.failedRuns || 0}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-white/60 text-sm">Last 24h</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats?.last24Hours || 0}</p>
          </div>
        </div>

        {/* Agent Stats */}
        {agents.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Agent Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {agents.map(agent => {
                const agentStat = stats?.byAgent[agent];
                const successRate = agentStat?.total 
                  ? Math.round((agentStat.success / agentStat.total) * 100) 
                  : 0;
                
                return (
                  <div 
                    key={agent}
                    className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${agentColors[agent] || 'bg-gray-500'}`} />
                      <span className="text-white/80 text-sm capitalize">{agent}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-white">{agentStat?.total || 0}</span>
                      <span className="text-xs text-white/40">runs</span>
                    </div>
                    <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-green-500 rounded-full ${getWidthClass(successRate)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters & Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/80"
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {selectedAgent !== 'all' && (
              <button
                onClick={() => setSelectedAgent('all')}
                className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-white/80 text-sm"
              >
                <span className={`w-2 h-2 rounded-full ${agentColors[selectedAgent] || 'bg-gray-500'}`} />
                {selectedAgent}
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={clearOldLogs}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear Old
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <p className="text-white/60 text-sm mb-3">Filter by Agent:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedAgent('all')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedAgent === 'all' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {agents.map(agent => (
                <button
                  key={agent}
                  onClick={() => setSelectedAgent(agent)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedAgent === agent 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${agentColors[agent] || 'bg-gray-500'}`} />
                  {agent}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Agent</th>
                  <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Action</th>
                  <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Status</th>
                  <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Message</th>
                  <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Duration</th>
                  <th className="text-left text-white/60 text-sm font-medium px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-white/40 py-12">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading logs...
                        </div>
                      ) : (
                        'No logs found'
                      )}
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${agentColors[log.agent] || 'bg-gray-500'}`} />
                          <span className="text-white capitalize">{log.agent}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white/80 text-sm">{log.action.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          log.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' :
                          log.status === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                          log.status === 'RUNNING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {log.status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                          {log.status === 'ERROR' && <XCircle className="w-3 h-3" />}
                          {log.status === 'RUNNING' && <Loader2 className="w-3 h-3 animate-spin" />}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white/60 text-sm truncate max-w-xs block">
                          {log.message || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white/60 text-sm">{formatDuration(log.duration)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-white/40 text-sm">
                          <Clock className="w-3 h-3" />
                          {formatTime(log.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
