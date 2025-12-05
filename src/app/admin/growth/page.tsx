'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, Loader2, TrendingUp, Users, Mail, Target, AlertCircle } from 'lucide-react';

import type { Metadata } from 'next';

/*
export const metadata: Metadata = {
  title: 'Admin | Whole Lot of Nature',
  description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
  openGraph: {
    title: 'Admin | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/admin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admin | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/admin',
  },
};
*/



interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  status: string;
  score: number;
  source: string;
  niche?: string;
}

interface Activity {
  timestamp: string;
  type: string;
  message: string;
}

interface GrowthData {
  agentStatus: string;
  seoScore: number;
  lastRun: string;
  leads: Lead[];
  activities: Activity[];
}

export default function GrowthDashboard() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/growth-agent/stats');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async () => {
    setRunning(true);
    try {
      await fetch('/api/growth-agent/stats');
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#66BB6A] mx-auto" />
          <p className="mt-4 text-white/70">Loading Agent Data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="mt-4 text-red-400">Failed to load data.</p>
        </div>
      </div>
    );
  }

  const hotLeads = data.leads.filter(l => l.status === 'HOT' || l.status === 'CONTACTED');
  const newLeads = data.leads.filter(l => l.status === 'NEW');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white antialiased flex items-center gap-3">
                <TrendingUp className="text-[#66BB6A]" />
                Business Growth Agent
              </h1>
              <p className="text-white/70">Autonomous Growth & Sales Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              data.agentStatus === 'RUNNING' 
                ? 'bg-[#66BB6A]/20 text-[#66BB6A] animate-pulse' 
                : 'bg-white/10 text-white/70'
            }`}>
              Status: {data.agentStatus}
            </div>
            <button
              onClick={runAgent}
              disabled={running}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 text-white font-medium rounded-lg transition"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {running ? 'Running...' : 'Run Agent'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* SEO Score Card */}
          <div className="bg-white/5 border border-[#2E7D32]/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-[#66BB6A]" />
              <h3 className="text-sm font-medium text-white/70">SEO Health Score</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white antialiased">{data.seoScore}</span>
              <span className="text-white/50 mb-1">/ 100</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  data.seoScore > 80 ? 'bg-[#66BB6A]' : data.seoScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${data.seoScore}%` }}
              />
            </div>
          </div>

          {/* Total Leads */}
          <div className="bg-white/5 border border-[#2E7D32]/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-white/70">Total Leads</h3>
            </div>
            <div className="text-4xl font-bold text-white antialiased">{data.leads.length}</div>
            <p className="text-white/50 text-sm mt-2">Pipeline value</p>
          </div>

          {/* Hot Leads */}
          <div className="bg-white/5 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-medium text-white/70">Hot/Active</h3>
            </div>
            <div className="text-4xl font-bold text-orange-400 antialiased">{hotLeads.length}</div>
            <p className="text-white/50 text-sm mt-2">Ready to convert</p>
          </div>

          {/* Outreach */}
          <div className="bg-white/5 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-white/70">Outreach</h3>
            </div>
            <div className="text-4xl font-bold text-purple-400 antialiased">
              {data.leads.filter(l => l.status === 'CONTACTED').length}
            </div>
            <p className="text-white/50 text-sm mt-2">Emails sent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lead List */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white antialiased">High Priority Leads</h2>
            </div>
            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {hotLeads.length === 0 ? (
                <div className="p-6 text-center text-white/50">No hot leads yet. Run the agent to discover leads...</div>
              ) : (
                hotLeads.map(lead => (
                  <div key={lead.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{lead.name}</h4>
                        <p className="text-sm text-white/60">{lead.role} at {lead.company}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md">{lead.source}</span>
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md">{lead.niche}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#66BB6A] antialiased">{lead.score}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          lead.status === 'CONTACTED' ? 'bg-[#66BB6A]/20 text-[#66BB6A]' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white antialiased">Agent Activity Log</h2>
            </div>
            <div className="bg-[#0A0A0A] p-4 max-h-[400px] overflow-y-auto font-mono text-sm">
              {data.activities.length === 0 ? (
                <div className="text-white/50 text-center py-8">No activities yet. Run the agent to see logs...</div>
              ) : (
                data.activities.map((log, i) => (
                  <div key={i} className="mb-2">
                    <span className="text-white/40">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                    <span className={
                      log.type === 'SUCCESS' ? 'text-[#66BB6A]' :
                      log.type === 'ERROR' ? 'text-red-400' :
                      log.type === 'WARNING' ? 'text-yellow-400' : 'text-blue-300'
                    }>
                      {log.type}
                    </span>{' '}
                    <span className="text-white/70">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Last Run Info */}
        <div className="mt-6 text-center text-white/40 text-sm">
          Last Run: {data.lastRun ? new Date(data.lastRun).toLocaleString() : 'Never'}
        </div>
      </div>
    </div>
  );
}
