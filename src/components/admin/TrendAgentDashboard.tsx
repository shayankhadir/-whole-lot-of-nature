'use client';

/**
 * Trend Agent Admin Dashboard
 * Monitor and control the automated content generation system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Loader, TrendingUp, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface Stats {
  totalRuns: number;
  successfulRuns: number;
  totalTrends: number;
  totalPosts: number;
  totalPublished: number;
  averagePostsPerRun: number;
  successRate: number;
}

interface Run {
  id: string;
  timestamp: Date;
  trendsCollected: number;
  postsGenerated: number;
  postsPublished: number;
  errors: string[];
  status: 'running' | 'completed' | 'failed';
}

export default function TrendAgentDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [latestRun, setLatestRun] = useState<Run | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Fetch stats and runs on mount
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/agent/run?action=stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch latest run
      const latestRes = await fetch('/api/agent/run?action=latest');
      const latestData = await latestRes.json();
      if (latestData.success) {
        setLatestRun(latestData.run);
      }

      // Fetch run history
      const historyRes = await fetch('/api/agent/run?action=history&limit=5');
      const historyData = await historyRes.json();
      if (historyData.success) {
        setRuns(historyData.runs);
      }

      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(`Failed to fetch data: ${error.message}`);
    }
  };

  const executeRun = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch('/api/agent/run?action=execute', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setLatestRun(data.run);
        await fetchData();
      } else {
        setError(data.error || 'Failed to execute agent run');
      }
    } catch (err) {
      const error = err as Error;
      setError(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B0F] to-[#1e3a28] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <TrendingUp className="text-[#66BB6A]" size={32} />
              Trend Agent Dashboard
            </h1>
            <p className="text-white/60">Monitor and manage automated content generation</p>
          </div>
          <a
            href="/admin/inventory"
            className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg font-semibold transition flex items-center gap-2"
          >
            📦 Inventory
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6">
              <p className="text-white/60 text-sm">Total Runs</p>
              <p className="text-3xl font-bold text-[#66BB6A]">{stats.totalRuns}</p>
            </div>

            <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6">
              <p className="text-white/60 text-sm">Success Rate</p>
              <p className="text-3xl font-bold text-[#66BB6A]">{stats.successRate}%</p>
            </div>

            <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6">
              <p className="text-white/60 text-sm">Total Posts</p>
              <p className="text-3xl font-bold text-[#66BB6A]">{stats.totalPosts}</p>
            </div>

            <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6">
              <p className="text-white/60 text-sm">Published</p>
              <p className="text-3xl font-bold text-[#A8D5BA]">{stats.totalPublished}</p>
            </div>

            <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6">
              <p className="text-white/60 text-sm">Trends Collected</p>
              <p className="text-3xl font-bold text-[#66BB6A]">{stats.totalTrends}</p>
            </div>

            <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6">
              <p className="text-white/60 text-sm">Avg Posts/Run</p>
              <p className="text-3xl font-bold text-[#66BB6A]">{stats.averagePostsPerRun}</p>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <div className="mb-8">
          <button
            onClick={executeRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-[#66BB6A] hover:bg-[#5aa85f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {isRunning ? (
              <>
                <Loader className="animate-spin" size={20} />
                Running...
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Execute Agent Run
              </>
            )}
          </button>
        </div>

        {/* Latest Run */}
        {latestRun && (
          <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {latestRun.status === 'completed' ? (
                <CheckCircle className="text-[#66BB6A]" size={24} />
              ) : latestRun.status === 'failed' ? (
                <AlertCircle className="text-red-500" size={24} />
              ) : (
                <Loader className="text-yellow-500 animate-spin" size={24} />
              )}
              Latest Run: {latestRun.id}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-white/60 text-sm">Status</p>
                <p className="text-lg font-semibold text-[#66BB6A] capitalize">{latestRun.status}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Trends</p>
                <p className="text-lg font-semibold text-[#66BB6A]">{latestRun.trendsCollected}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Generated</p>
                <p className="text-lg font-semibold text-[#66BB6A]">{latestRun.postsGenerated}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Published</p>
                <p className="text-lg font-semibold text-[#A8D5BA]">{latestRun.postsPublished}</p>
              </div>
            </div>

            {latestRun.errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-200 text-sm">
                <p className="font-semibold mb-2">Errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {latestRun.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Recent Runs */}
        {runs.length > 0 && (
          <div className="bg-[#1e3a28]/50 border border-[#2E7D32]/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="text-[#66BB6A]" size={24} />
              Recent Runs
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#2E7D32]/30 text-white/60 text-xs uppercase">
                  <tr>
                    <th className="pb-3 px-2">Run ID</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Trends</th>
                    <th className="pb-3 px-2">Posts</th>
                    <th className="pb-3 px-2">Published</th>
                    <th className="pb-3 px-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.id} className="border-b border-[#2E7D32]/20 hover:bg-[#2E7D32]/10 transition-colors">
                      <td className="py-3 px-2 text-white/80 font-mono text-xs">{run.id.substring(0, 12)}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            run.status === 'completed'
                              ? 'bg-green-500/20 text-green-300'
                              : run.status === 'failed'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {run.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-white/80">{run.trendsCollected}</td>
                      <td className="py-3 px-2 text-white/80">{run.postsGenerated}</td>
                      <td className="py-3 px-2 text-white/80">{run.postsPublished}</td>
                      <td className="py-3 px-2 text-white/60 text-xs">
                        {new Date(run.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
