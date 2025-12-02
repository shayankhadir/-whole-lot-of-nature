'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  BarChart3, 
  MessageCircle, 
  Zap, 
  Play, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  lastRun?: string;
  message?: string;
}

export default function AdminDashboard() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: 'growth', name: 'Business Growth Agent', status: 'idle' },
    { id: 'trends', name: 'Trend Agent', status: 'idle' },
    { id: 'inventory', name: 'Inventory Sync', status: 'idle' },
    { id: 'plantsy', name: 'Plantsy (Lead Gen Bot)', status: 'idle' },
  ]);

  const runAgent = async (agentId: string) => {
    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: 'running' as const, message: 'Starting...' } : a
    ));

    try {
      let endpoint = '';
      let method = 'POST';

      switch (agentId) {
        case 'growth':
          endpoint = '/api/growth-agent/stats';
          method = 'GET';
          break;
        case 'trends':
          endpoint = '/api/agent/run?action=execute';
          break;
        case 'inventory':
          endpoint = '/api/inventory/sync';
          break;
        case 'plantsy':
          endpoint = '/api/agents/plantsy';
          method = 'POST';
          break;
      }

      const res = await fetch(endpoint, { 
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' && agentId === 'plantsy' 
          ? JSON.stringify({ question: 'System health check - respond if online' })
          : undefined
      });
      
      const data = await res.json();
      
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { 
              ...a, 
              status: (data.success || data.answer || data.agentStatus) ? 'success' : 'error',
              lastRun: new Date().toLocaleTimeString(),
              message: data.success ? 'Completed successfully' : (data.error || 'Check logs')
            } 
          : a
      ));
    } catch (error) {
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, status: 'error', message: 'Failed to connect' } 
          : a
      ));
    }
  };

  const runAllAgents = async () => {
    for (const agent of agents) {
      await runAgent(agent.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'running': return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-[#66BB6A]" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full bg-white/20" />;
    }
  };

  const getStatusBadge = (status: AgentStatus['status']) => {
    const colors = {
      idle: 'bg-white/10 text-white/60',
      running: 'bg-yellow-500/20 text-yellow-400 animate-pulse',
      success: 'bg-[#66BB6A]/20 text-[#66BB6A]',
      error: 'bg-red-500/20 text-red-400'
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 antialiased flex items-center gap-3">
              <Settings className="text-[#66BB6A]" />
              Admin Control Center
            </h1>
            <p className="text-white/70">Manage agents, monitor performance, and drive sales</p>
          </div>
          <button
            onClick={runAllAgents}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:from-[#1B5E20] hover:to-[#4CAF50] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#2E7D32]/30"
          >
            <Zap className="w-5 h-5" />
            Run All Agents
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/60 text-sm">Total Agents</p>
            <p className="text-2xl font-bold text-white antialiased">{agents.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/60 text-sm">Active</p>
            <p className="text-2xl font-bold text-[#66BB6A] antialiased">
              {agents.filter(a => a.status === 'running').length}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/60 text-sm">Successful</p>
            <p className="text-2xl font-bold text-emerald-400 antialiased">
              {agents.filter(a => a.status === 'success').length}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/60 text-sm">Errors</p>
            <p className="text-2xl font-bold text-red-400 antialiased">
              {agents.filter(a => a.status === 'error').length}
            </p>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Growth Agent */}
          <div className="bg-white/5 border border-[#2E7D32]/30 rounded-2xl p-6 backdrop-blur-sm hover:border-[#66BB6A]/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#66BB6A]/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-[#66BB6A]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white antialiased">Business Growth Agent</h3>
                  <p className="text-white/60 text-sm">Lead generation & sales automation</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(agents.find(a => a.id === 'growth')?.status || 'idle')}`}>
                {agents.find(a => a.id === 'growth')?.status || 'idle'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-white/50">
                {getStatusIcon(agents.find(a => a.id === 'growth')?.status || 'idle')}
                <span>{agents.find(a => a.id === 'growth')?.message || 'Ready to run'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => runAgent('growth')}
                  disabled={agents.find(a => a.id === 'growth')?.status === 'running'}
                  className="flex items-center gap-1 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
                >
                  <Play className="w-4 h-4" /> Run
                </button>
                <Link
                  href="/admin/growth"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Trend Agent */}
          <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white antialiased">Trend Agent</h3>
                  <p className="text-white/60 text-sm">Auto content & blog generation</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(agents.find(a => a.id === 'trends')?.status || 'idle')}`}>
                {agents.find(a => a.id === 'trends')?.status || 'idle'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-white/50">
                {getStatusIcon(agents.find(a => a.id === 'trends')?.status || 'idle')}
                <span>{agents.find(a => a.id === 'trends')?.message || 'Ready to run'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => runAgent('trends')}
                  disabled={agents.find(a => a.id === 'trends')?.status === 'running'}
                  className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
                >
                  <Play className="w-4 h-4" /> Run
                </button>
                <Link
                  href="/admin/trends"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Inventory Agent */}
          <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white antialiased">Inventory Sync</h3>
                  <p className="text-white/60 text-sm">WooCommerce stock management</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(agents.find(a => a.id === 'inventory')?.status || 'idle')}`}>
                {agents.find(a => a.id === 'inventory')?.status || 'idle'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-white/50">
                {getStatusIcon(agents.find(a => a.id === 'inventory')?.status || 'idle')}
                <span>{agents.find(a => a.id === 'inventory')?.message || 'Ready to sync'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => runAgent('inventory')}
                  disabled={agents.find(a => a.id === 'inventory')?.status === 'running'}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
                >
                  <RefreshCw className="w-4 h-4" /> Sync
                </button>
                <Link
                  href="/admin/inventory"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition"
                >
                  Manage
                </Link>
              </div>
            </div>
          </div>

          {/* Plantsy Lead Gen Bot */}
          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white antialiased">Plantsy (Lead Gen Bot)</h3>
                  <p className="text-white/60 text-sm">AI plant care assistant & sales</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(agents.find(a => a.id === 'plantsy')?.status || 'idle')}`}>
                {agents.find(a => a.id === 'plantsy')?.status || 'idle'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-white/50">
                {getStatusIcon(agents.find(a => a.id === 'plantsy')?.status || 'idle')}
                <span>{agents.find(a => a.id === 'plantsy')?.message || 'Always active'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => runAgent('plantsy')}
                  disabled={agents.find(a => a.id === 'plantsy')?.status === 'running'}
                  className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
                >
                  <Play className="w-4 h-4" /> Test
                </button>
                <Link
                  href="/plantsy"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition"
                >
                  Chat
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4 antialiased flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#66BB6A]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/pages"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition group"
            >
              <FileText className="w-5 h-5 text-white/60 group-hover:text-[#66BB6A]" />
              <span className="text-white/80 group-hover:text-white">Site Map</span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition group"
            >
              <Package className="w-5 h-5 text-white/60 group-hover:text-[#66BB6A]" />
              <span className="text-white/80 group-hover:text-white">View Shop</span>
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition group"
            >
              <BarChart3 className="w-5 h-5 text-white/60 group-hover:text-[#66BB6A]" />
              <span className="text-white/80 group-hover:text-white">Blog Posts</span>
            </Link>
            <a
              href="https://admin.wholelotofnature.com/wp-admin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition group"
            >
              <Settings className="w-5 h-5 text-white/60 group-hover:text-[#66BB6A]" />
              <span className="text-white/80 group-hover:text-white">WP Admin</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
