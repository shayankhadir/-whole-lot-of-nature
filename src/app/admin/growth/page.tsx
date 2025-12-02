'use client';

import { useEffect, useState } from 'react';

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
      const res = await fetch('/api/agents/growth/run', {
        method: 'POST',
      });
      const result = await res.json();
      console.log('Agent run result:', result);
      
      // Refresh data after running
      setTimeout(fetchData, 2000);
    } catch (error) {
      console.error('Failed to run agent:', error);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Loading Agent Data...</div>;
  if (!data) return <div className="p-8 text-red-500">Failed to load data.</div>;

  const hotLeads = data.leads.filter(l => l.status === 'HOT' || l.status === 'CONTACTED');
  const newLeads = data.leads.filter(l => l.status === 'NEW');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 antialiased">Business Growth Agent</h1>
            <p className="text-gray-500">Autonomous Growth & Sales Engine</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={runAgent}
              disabled={running || (data?.agentStatus === 'RUNNING')}
              className="px-6 py-3 bg-[#66BB6A] text-white font-medium rounded-lg hover:bg-[#5CAA60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {running || data?.agentStatus === 'RUNNING' ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running Agent...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Growth Agent
                </>
              )}
            </button>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              data.agentStatus === 'RUNNING' ? 'bg-[#66BB6A]/10 text-[#66BB6A] animate-pulse' : 'bg-gray-200 text-gray-700'
            }`}>
              Status: {data.agentStatus}
            </div>
            <div className="text-sm text-gray-500">
              Last Run: {data.lastRun ? new Date(data.lastRun).toLocaleString() : 'Never'}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* SEO Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">SEO Health Score</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-900 antialiased">{data.seoScore}</span>
              <span className="text-white/60 mb-1">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className={`h-full rounded-full ${data.seoScore > 80 ? 'bg-[#66BB6A]' : data.seoScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${data.seoScore}%` }}
              />
            </div>
          </div>

          {/* Pipeline Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Lead Pipeline</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 antialiased">{data.leads.length}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 antialiased">{newLeads.length}</div>
                <div className="text-xs text-gray-500">New</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500 antialiased">{hotLeads.length}</div>
                <div className="text-xs text-gray-500">Hot/Active</div>
              </div>
            </div>
          </div>

          {/* Outreach Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Outreach Activity</h3>
            <div className="text-4xl font-bold text-gray-900 antialiased">
              {data.leads.filter(l => l.status === 'CONTACTED').length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Emails Drafted/Sent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lead List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 antialiased">High Priority Leads</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {hotLeads.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No hot leads yet. Waiting for agent...</div>
              ) : (
                hotLeads.map(lead => (
                  <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <p className="text-sm text-gray-500">{lead.role} at {lead.company}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{lead.source}</span>
                          <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-md">{lead.niche}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#66BB6A] antialiased">{lead.score}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          lead.status === 'CONTACTED' ? 'bg-[#66BB6A]/10 text-[#66BB6A]' : 'bg-orange-100 text-orange-800'
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 antialiased">Agent Activity Log</h2>
            </div>
            <div className="bg-gray-900 p-4 max-h-[400px] overflow-y-auto font-mono text-sm">
              {data.activities.map((log, i) => (
                <div key={i} className="mb-2">
                  <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                  <span className={
                    log.type === 'SUCCESS' ? 'text-[#66BB6A]' :
                    log.type === 'ERROR' ? 'text-red-400' :
                    log.type === 'WARNING' ? 'text-yellow-400' : 'text-blue-300'
                  }>
                    {log.type}
                  </span>{' '}
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
