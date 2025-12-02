'use client';

import Link from 'next/link';
import { useState } from 'react';

interface AgentStatus {
  name: string;
  running: boolean;
  lastRun: string | null;
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
}

export default function AdminDashboard() {
  const [agents, setAgents] = useState<Record<string, AgentStatus>>({
    growth: { name: 'Growth Agent', running: false, lastRun: null, status: 'idle' },
    seo: { name: 'SEO Agent', running: false, lastRun: null, status: 'idle' },
    performance: { name: 'Performance Agent', running: false, lastRun: null, status: 'idle' },
    woo: { name: 'WooCommerce Sync', running: false, lastRun: null, status: 'idle' },
    content: { name: 'Content Agent', running: false, lastRun: null, status: 'idle' },
  });
  const [runningAll, setRunningAll] = useState(false);

  const runAgent = async (agentKey: string, endpoint: string, body?: Record<string, unknown>) => {
    setAgents(prev => ({
      ...prev,
      [agentKey]: { ...prev[agentKey], running: true, status: 'running' }
    }));

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      
      setAgents(prev => ({
        ...prev,
        [agentKey]: {
          ...prev[agentKey],
          running: false,
          lastRun: new Date().toISOString(),
          status: data.success ? 'success' : 'error',
          message: data.message || data.error,
        }
      }));
    } catch (error) {
      setAgents(prev => ({
        ...prev,
        [agentKey]: {
          ...prev[agentKey],
          running: false,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      }));
    }
  };

  const runAllAgents = async () => {
    setRunningAll(true);
    
    try {
      const response = await fetch('/api/agents/run-all', {
        method: 'POST',
      });

      const data = await response.json();
      
      // Update individual agent statuses from results
      if (data.results) {
        const agentKeyMap: Record<string, string> = {
          'Growth Agent': 'growth',
          'SEO Agent': 'seo',
          'Performance Agent': 'performance',
          'WooCommerce Sync': 'woo',
          'Content Agent': 'content',
        };

        data.results.forEach((result: { agent: string; success: boolean; message: string }) => {
          const key = agentKeyMap[result.agent];
          if (key) {
            setAgents(prev => ({
              ...prev,
              [key]: {
                ...prev[key],
                lastRun: new Date().toISOString(),
                status: result.success ? 'success' : 'error',
                message: result.message,
              }
            }));
          }
        });
      }
    } catch (error) {
      console.error('Failed to run all agents:', error);
    } finally {
      setRunningAll(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'success': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 antialiased">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your business automation agents and analytics</p>
        </div>

        {/* Agent Control Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 antialiased">Agent Control Panel</h2>
            <button
              onClick={runAllAgents}
              disabled={runningAll}
              className="px-6 py-3 bg-[#66BB6A] text-white font-medium rounded-lg hover:bg-[#5CAA60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {runningAll ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running All Agents...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run All Agents
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Growth Agent */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[#66BB6A]/10 rounded-lg text-[#66BB6A]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(agents.growth.status)}`}>
                  {agents.growth.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 antialiased">Growth Agent</h3>
              <p className="text-xs text-gray-500 mb-3">Lead generation & outreach</p>
              <button
                onClick={() => runAgent('growth', '/api/agents/growth/run')}
                disabled={agents.growth.running}
                className="w-full px-3 py-2 text-sm bg-[#66BB6A] text-white rounded-md hover:bg-[#5CAA60] transition-colors disabled:opacity-50"
              >
                {agents.growth.running ? 'Running...' : 'Run Agent'}
              </button>
              {agents.growth.lastRun && (
                <p className="text-xs text-gray-400 mt-2">
                  Last run: {new Date(agents.growth.lastRun).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* SEO Agent */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(agents.seo.status)}`}>
                  {agents.seo.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 antialiased">SEO Agent</h3>
              <p className="text-xs text-gray-500 mb-3">SEO analysis & optimization</p>
              <button
                onClick={() => runAgent('seo', '/api/agents/seo/run')}
                disabled={agents.seo.running}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {agents.seo.running ? 'Running...' : 'Run Agent'}
              </button>
              {agents.seo.lastRun && (
                <p className="text-xs text-gray-400 mt-2">
                  Last run: {new Date(agents.seo.lastRun).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Performance Agent */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(agents.performance.status)}`}>
                  {agents.performance.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 antialiased">Performance</h3>
              <p className="text-xs text-gray-500 mb-3">Speed & optimization</p>
              <button
                onClick={() => runAgent('performance', '/api/agents/performance/run')}
                disabled={agents.performance.running}
                className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {agents.performance.running ? 'Running...' : 'Run Agent'}
              </button>
              {agents.performance.lastRun && (
                <p className="text-xs text-gray-400 mt-2">
                  Last run: {new Date(agents.performance.lastRun).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* WooCommerce Agent */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(agents.woo.status)}`}>
                  {agents.woo.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 antialiased">WooCommerce</h3>
              <p className="text-xs text-gray-500 mb-3">Product sync & validation</p>
              <button
                onClick={() => runAgent('woo', '/api/agents/woo/run', { action: 'sync' })}
                disabled={agents.woo.running}
                className="w-full px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {agents.woo.running ? 'Running...' : 'Run Agent'}
              </button>
              {agents.woo.lastRun && (
                <p className="text-xs text-gray-400 mt-2">
                  Last run: {new Date(agents.woo.lastRun).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Content Agent */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(agents.content.status)}`}>
                  {agents.content.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 antialiased">Content</h3>
              <p className="text-xs text-gray-500 mb-3">Blog & content generation</p>
              <button
                onClick={() => runAgent('content', '/api/agents/content/run', { type: 'blog' })}
                disabled={agents.content.running}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {agents.content.running ? 'Running...' : 'Run Agent'}
              </button>
              {agents.content.lastRun && (
                <p className="text-xs text-gray-400 mt-2">
                  Last run: {new Date(agents.content.lastRun).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4 antialiased">Detailed Dashboards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Growth Agent Card */}
          <Link href="/admin/growth" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#66BB6A]/10 rounded-lg text-[#66BB6A]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs font-medium bg-[#66BB6A]/10 text-[#66BB6A] px-2 py-1 rounded-full">Active</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#66BB6A] transition-colors antialiased">Business Growth Agent</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Autonomous lead generation, sales scoring, and outreach management.
              </p>
            </div>
          </Link>

          {/* SEO Agent Card */}
          <Link href="/admin/seo" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Active</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors antialiased">SEO Optimization</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Automated SEO analysis, meta tag generation, and optimization recommendations.
              </p>
            </div>
          </Link>

          {/* Inventory Card */}
          <Link href="/admin/inventory" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors antialiased">Inventory Management</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Manage products, stock levels, and categories.
              </p>
            </div>
          </Link>

          {/* Trends Card */}
          <Link href="/admin/trends" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors antialiased">Market Trends</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Analyze competitor pricing and market opportunities.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
