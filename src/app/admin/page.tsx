'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  PenTool,
  Search,
  Mail,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  Target,
  Bot,
  Sparkles,
  Clock,
  LayoutDashboard,
  Leaf
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'marketing' | 'operations' | 'ai';
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgColor: string;
  endpoint: string;
  method: 'POST' | 'GET';
  body?: Record<string, unknown>;
  dashboardLink?: string;
  dashboardLabel?: string;
  runLabel?: string;
  capabilities: string[];
}

interface AgentStatus {
  id: string;
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
  lastRun?: string;
  result?: unknown;
}

// ============================================================================
// AGENT CONFIGURATIONS - Consolidated & Organized
// ============================================================================

const AGENT_CONFIGS: AgentConfig[] = [
  // === CONTENT CREATION ===
  {
    id: 'blog-agent',
    name: 'Blog Agent',
    description: 'AI-powered blog creation with SEO optimization',
    category: 'content',
    icon: <PenTool className="w-6 h-6" />,
    color: 'text-pink-400',
    borderColor: 'border-pink-500/30 hover:border-pink-500/60',
    bgColor: 'bg-pink-500/20',
    endpoint: '/api/generate-blog-post',
    method: 'POST',
    body: { topic: 'Plant Care Tips', keyword: 'indoor plants' },
    dashboardLink: '/admin/content',
    dashboardLabel: 'Content Hub',
    runLabel: 'Generate Post',
    capabilities: ['Generate SEO blog posts', 'Auto-publish to WordPress', 'Keyword optimization', 'Meta tag generation']
  },
  {
    id: 'trend-agent',
    name: 'Trend Agent',
    description: 'Discover trending topics & auto-generate content',
    category: 'content',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    bgColor: 'bg-purple-500/20',
    endpoint: '/api/agent/run?action=execute',
    method: 'POST',
    dashboardLink: '/admin/trends',
    dashboardLabel: 'Trends Dashboard',
    runLabel: 'Find Trends',
    capabilities: ['Scrape trending topics', 'Analyze gardening trends', 'Generate content ideas', 'Schedule posts']
  },
  {
    id: 'seo-agent',
    name: 'SEO Agent',
    description: 'Optimize pages for search engines',
    category: 'content',
    icon: <Search className="w-6 h-6" />,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/30 hover:border-orange-500/60',
    bgColor: 'bg-orange-500/20',
    endpoint: '/api/admin/seo-scan',
    method: 'POST',
    dashboardLink: '/admin/seo',
    dashboardLabel: 'SEO Dashboard',
    runLabel: 'Run SEO Scan',
    capabilities: ['Meta tag optimization', 'Schema markup', 'Sitemap generation', 'Content analysis']
  },

  // === MARKETING & SALES ===
  {
    id: 'growth-agent',
    name: 'Growth Agent',
    description: 'Lead generation & sales automation',
    category: 'marketing',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    bgColor: 'bg-emerald-500/20',
    endpoint: '/api/growth-agent/run',
    method: 'POST',
    dashboardLink: '/admin/growth',
    dashboardLabel: 'Growth Dashboard',
    runLabel: 'Find Leads',
    capabilities: ['Find potential leads', 'Score & qualify leads', 'Automate outreach', 'Track conversions']
  },
  {
    id: 'email-agent',
    name: 'Email Marketing',
    description: 'Automated email campaigns & cart recovery',
    category: 'marketing',
    icon: <Mail className="w-6 h-6" />,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
    bgColor: 'bg-cyan-500/20',
    endpoint: '/api/cron/abandoned-cart',
    method: 'POST',
    dashboardLink: '/admin/email',
    dashboardLabel: 'Email Dashboard',
    runLabel: 'Send Campaigns',
    capabilities: ['Abandoned cart recovery', 'Welcome emails', 'Order confirmations', 'Review requests']
  },
  {
    id: 'marketing-automation',
    name: 'Marketing Automation',
    description: 'Workflows, campaigns & social scheduling',
    category: 'marketing',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/30 hover:border-violet-500/60',
    bgColor: 'bg-violet-500/20',
    endpoint: '/api/marketing',
    method: 'GET',
    dashboardLink: '/admin/marketing',
    dashboardLabel: 'Marketing Hub',
    runLabel: 'View Campaigns',
    capabilities: ['Campaign management', 'Social media scheduling', 'Discount workflows', 'Analytics tracking']
  },

  // === OPERATIONS ===
  {
    id: 'inventory-sync',
    name: 'Inventory Sync',
    description: 'WooCommerce stock management',
    category: 'operations',
    icon: <Package className="w-6 h-6" />,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    bgColor: 'bg-blue-500/20',
    endpoint: '/api/inventory/sync',
    method: 'POST',
    dashboardLink: '/admin/inventory',
    dashboardLabel: 'Inventory',
    runLabel: 'Sync Now',
    capabilities: ['Sync with WooCommerce', 'Track stock levels', 'Low stock alerts', 'Price updates']
  },

  // === AI ASSISTANTS ===
  {
    id: 'plantsy',
    name: 'Plantsy AI',
    description: 'AI plant care assistant for customers',
    category: 'ai',
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'text-green-400',
    borderColor: 'border-green-500/30 hover:border-green-500/60',
    bgColor: 'bg-green-500/20',
    endpoint: '/api/agents/plantsy',
    method: 'POST',
    body: { question: 'Health check - respond if online' },
    dashboardLink: '/plantsy',
    dashboardLabel: 'Open Chat',
    runLabel: 'Test Bot',
    capabilities: ['Plant care advice', 'Product recommendations', 'Troubleshooting help', 'Care schedules']
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getAgentsByCategory = (category: AgentConfig['category']) => 
  AGENT_CONFIGS.filter(agent => agent.category === category);

const getCategoryInfo = (category: AgentConfig['category']) => {
  const categories = {
    content: { label: 'Content Creation', icon: <FileText className="w-5 h-5" />, color: 'text-pink-400' },
    marketing: { label: 'Marketing & Sales', icon: <Target className="w-5 h-5" />, color: 'text-emerald-400' },
    operations: { label: 'Operations', icon: <Settings className="w-5 h-5" />, color: 'text-blue-400' },
    ai: { label: 'AI Assistants', icon: <Bot className="w-5 h-5" />, color: 'text-green-400' }
  };
  return categories[category];
};

// ============================================================================
// COMPONENTS
// ============================================================================

function AgentCard({ 
  config, 
  status, 
  onRun, 
  isAuthenticated 
}: { 
  config: AgentConfig; 
  status: AgentStatus; 
  onRun: () => void;
  isAuthenticated: boolean;
}) {
  const isRunning = status.status === 'running';
  const isSuccess = status.status === 'success';
  const isError = status.status === 'error';

  return (
    <div className={`group relative bg-white/[0.03] backdrop-blur-xl border ${config.borderColor} rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20`}>
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        {isRunning && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Running
          </span>
        )}
        {isSuccess && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Success
          </span>
        )}
        {isError && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        )}
        {status.status === 'idle' && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/50 text-xs font-medium">
            <Activity className="w-3 h-3" />
            Ready
          </span>
        )}
      </div>

      {/* Icon & Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 ${config.bgColor} rounded-xl ${config.color}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{config.name}</h3>
          <p className="text-white/60 text-sm mt-0.5">{config.description}</p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mb-5">
        <ul className="space-y-1.5">
          {config.capabilities.slice(0, 3).map((cap, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-white/50">
              <Sparkles className="w-3 h-3 text-green-400/60" />
              {cap}
            </li>
          ))}
        </ul>
      </div>

      {/* Status Message */}
      {status.message && (
        <div className={`mb-4 px-3 py-2 rounded-lg text-xs ${
          isError ? 'bg-red-500/10 text-red-300' : 
          isSuccess ? 'bg-green-500/10 text-green-300' : 
          'bg-white/5 text-white/60'
        }`}>
          {status.message}
        </div>
      )}

      {/* Last Run */}
      {status.lastRun && (
        <div className="flex items-center gap-1.5 mb-4 text-xs text-white/40">
          <Clock className="w-3 h-3" />
          Last run: {status.lastRun}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRun}
          disabled={isRunning || !isAuthenticated}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isRunning 
              ? 'bg-yellow-500/20 text-yellow-400' 
              : `bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-600/20`
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {config.runLabel || 'Run'}
            </>
          )}
        </button>
        
        {config.dashboardLink && (
          <Link
            href={config.dashboardLink}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white text-sm font-medium transition-all"
          >
            {config.dashboardLabel || 'Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon, label, external = false }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  const Component = external ? 'a' : Link;
  const props = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };

  return (
    <Component
      {...props}
      className="flex items-center gap-3 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-green-500/30 rounded-xl transition-all group"
    >
      <div className="text-white/50 group-hover:text-green-400 transition-colors">
        {icon}
      </div>
      <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors">
        {label}
      </span>
    </Component>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>(() => {
    const initial: Record<string, AgentStatus> = {};
    AGENT_CONFIGS.forEach(config => {
      initial[config.id] = { id: config.id, status: 'idle' };
    });
    return initial;
  });
  const [runAllProgress, setRunAllProgress] = useState<{ current: number; total: number } | null>(null);

  // Load saved admin key
  useEffect(() => {
    const savedKey = localStorage.getItem('wln_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Save admin key
  const handleLogin = useCallback(() => {
    if (adminKey.trim()) {
      localStorage.setItem('wln_admin_key', adminKey);
      setIsAuthenticated(true);
    }
  }, [adminKey]);

  // Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('wln_admin_key');
    setAdminKey('');
    setIsAuthenticated(false);
  }, []);

  // Run a single agent
  const runAgent = useCallback(async (agentId: string) => {
    const config = AGENT_CONFIGS.find(a => a.id === agentId);
    if (!config) return;

    setAgentStatuses(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId], status: 'running', message: 'Starting...' }
    }));

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      };

      const response = await fetch(config.endpoint, {
        method: config.method,
        headers,
        ...(config.method === 'POST' && config.body ? { body: JSON.stringify(config.body) } : {})
      });

      const data = await response.json();

      if (response.ok && (data.success !== false)) {
        setAgentStatuses(prev => ({
          ...prev,
          [agentId]: {
            ...prev[agentId],
            status: 'success',
            message: data.message || 'Completed successfully',
            lastRun: new Date().toLocaleTimeString(),
            result: data
          }
        }));
      } else {
        throw new Error(data.error || data.message || 'Agent failed');
      }
    } catch (error) {
      const err = error as Error;
      setAgentStatuses(prev => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          status: 'error',
          message: err.message,
          lastRun: new Date().toLocaleTimeString()
        }
      }));
    }
  }, [adminKey]);

  // Run all agents
  const runAllAgents = useCallback(async () => {
    setRunAllProgress({ current: 0, total: AGENT_CONFIGS.length });
    
    for (let i = 0; i < AGENT_CONFIGS.length; i++) {
      setRunAllProgress({ current: i + 1, total: AGENT_CONFIGS.length });
      await runAgent(AGENT_CONFIGS[i].id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between agents
    }
    
    setRunAllProgress(null);
  }, [runAgent]);

  // Stats
  const stats = {
    total: AGENT_CONFIGS.length,
    running: Object.values(agentStatuses).filter(s => s.status === 'running').length,
    success: Object.values(agentStatuses).filter(s => s.status === 'success').length,
    errors: Object.values(agentStatuses).filter(s => s.status === 'error').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030806] via-[#071410] to-[#0a1f15]">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/20">
                <LayoutDashboard className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Admin Control Center
                </h1>
                <p className="text-white/60 mt-1">
                  Manage agents, automate workflows, and grow your business
                </p>
              </div>
            </div>

            {/* Auth & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Authenticated</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white text-sm font-medium transition-all"
                  >
                    Logout
                  </button>
                  <button
                    onClick={runAllAgents}
                    disabled={runAllProgress !== null}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-600/25 transition-all disabled:opacity-50"
                  >
                    {runAllProgress ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {runAllProgress.current}/{runAllProgress.total}
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Run All Agents
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-1 bg-white/5 border border-white/10 rounded-xl">
                    <div className="relative flex items-center">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter Admin Key"
                        className="w-48 px-4 py-2 bg-transparent text-white placeholder:text-white/40 text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="p-2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={handleLogin}
                      className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg text-sm transition-colors"
                    >
                      Login
                    </button>
                  </div>
                  <p className="text-xs text-white/40 text-center">
                    Admin key is set in .env.local as ADMIN_SECRET_KEY
                  </p>
                  <button
                    onClick={() => {
                      setAdminKey('wln_admin_2026_secure_key');
                      localStorage.setItem('wln_admin_key', 'wln_admin_2026_secure_key');
                      setIsAuthenticated(true);
                    }}
                    className="text-xs text-green-400/60 hover:text-green-400 transition-colors underline"
                  >
                    Use Demo Key (for testing)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Agents', value: stats.total, icon: <Bot className="w-5 h-5" />, color: 'text-white' },
            { label: 'Running', value: stats.running, icon: <Loader2 className="w-5 h-5 animate-spin" />, color: 'text-yellow-400' },
            { label: 'Successful', value: stats.success, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400' },
            { label: 'Errors', value: stats.errors, icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/50 text-sm">{stat.label}</span>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Agent Categories */}
        {(['content', 'marketing', 'operations', 'ai'] as const).map(category => {
          const agents = getAgentsByCategory(category);
          const categoryInfo = getCategoryInfo(category);
          
          if (agents.length === 0) return null;

          return (
            <section key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className={categoryInfo.color}>{categoryInfo.icon}</div>
                <h2 className="text-xl font-semibold text-white">{categoryInfo.label}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    config={agent}
                    status={agentStatuses[agent.id]}
                    onRun={() => runAgent(agent.id)}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <QuickActionButton href="/admin/pages" icon={<FileText className="w-5 h-5" />} label="Site Map" />
            <QuickActionButton href="/admin/email" icon={<Mail className="w-5 h-5" />} label="Emails" />
            <QuickActionButton href="/admin/logs" icon={<BarChart3 className="w-5 h-5" />} label="Logs" />
            <QuickActionButton href="/admin/marketing" icon={<Zap className="w-5 h-5" />} label="Marketing" />
            <QuickActionButton href="/shop" icon={<Package className="w-5 h-5" />} label="Shop" />
            <QuickActionButton href="/blog" icon={<PenTool className="w-5 h-5" />} label="Blog" />
            <QuickActionButton 
              href="https://admin.wholelotofnature.com/wp-admin" 
              icon={<Settings className="w-5 h-5" />} 
              label="WP Admin" 
              external 
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-500" />
              <span>Whole Lot of Nature Admin</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-white transition-colors">Back to Website</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

