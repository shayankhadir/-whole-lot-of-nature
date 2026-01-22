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
  contact?: string;
  insights?: {
    summary?: string;
  };
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
  nicheSummary?: string;
  emailConfigured?: boolean;
  emailWarning?: string;
}

const getContactLink = (contact?: string) => {
  if (!contact) return null;
  if (contact.startsWith('http://') || contact.startsWith('https://')) return contact;
  if (contact.startsWith('@')) return `https://instagram.com/${contact.replace('@', '')}`;
  if (contact.includes('@')) return `mailto:${contact}`;
  return null;
};

const getLeadType = (lead: Lead) => {
  const source = lead.source?.toLowerCase();
  if (source === 'customer') return 'customer';
  if (source === 'partner') return 'partner';
  if (source === 'instagram') return 'influencer';
  return 'b2b';
};

export default function GrowthDashboard() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sendingLeadId, setSendingLeadId] = useState<string | null>(null);
  const [sendMessage, setSendMessage] = useState<string | null>(null);
  const [processingFollowups, setProcessingFollowups] = useState(false);

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

  const fetchData = async () => {
    if (!adminKey) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const res = await fetch('/api/growth-agent/stats', {
        headers: { 'x-admin-key': adminKey }
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Failed to fetch growth stats');
      }
      setData(json);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load data.';
      console.error(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async () => {
    if (!adminKey) {
      setError('Enter your admin key to run the agent.');
      return;
    }
    setRunning(true);
    try {
      setError(null);
      const response = await fetch('/api/growth-agent/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        }
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to run growth agent');
      }
      await fetchData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to run agent.';
      console.error(error);
      setError(message);
    } finally {
      setRunning(false);
    }
  };

  const sendOutreach = async (lead: Lead) => {
    if (!lead.contact || !lead.contact.includes('@')) {
      setSendMessage('Lead has no email contact.');
      return;
    }
    if (!adminKey) {
      setSendMessage('Enter admin key to send outreach.');
      return;
    }

    setSendingLeadId(lead.id);
    setSendMessage(null);
    try {
      const response = await fetch('/api/email/outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          email: lead.contact,
          leadType: getLeadType(lead),
          lead: {
            name: lead.name,
            company: lead.company,
            niche: lead.niche,
            contact: lead.contact,
            source: lead.source,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send outreach');
      }

      setSendMessage(`Outreach sent to ${lead.name}`);
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : 'Failed to send outreach.';
      setSendMessage(message);
    } finally {
      setSendingLeadId(null);
    }
  };

  const processFollowups = async () => {
    if (!adminKey) {
      setSendMessage('Enter admin key to process follow-ups.');
      return;
    }

    setProcessingFollowups(true);
    setSendMessage(null);
    try {
      const response = await fetch('/api/growth-agent/followups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to process follow-ups');
      }

      setSendMessage(`Follow-ups processed. Sent ${result.sentCount || 0} emails.`);
    } catch (followupError) {
      const message = followupError instanceof Error ? followupError.message : 'Failed to process follow-ups.';
      setSendMessage(message);
    } finally {
      setProcessingFollowups(false);
    }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('wln_admin_key') || localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!adminKey) return;
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [adminKey]);

  const handleLogin = () => {
    localStorage.setItem('wln_admin_key', adminKey);
    localStorage.setItem('admin_key', adminKey);
    fetchData();
  };

  if (!adminKey || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-300" />
              </div>
              <h1 className="text-2xl font-bold text-white">Business Growth Agent</h1>
              <p className="text-white/60 mt-2">Enter admin key to access</p>
            </div>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Key"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-white/40"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full mt-4 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0D1B0F] to-[#1e3a28] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="mt-4 text-red-400">{error || 'Failed to load data.'}</p>
        </div>
      </div>
    );
  }

  const hotLeads = data.leads.filter(l => l.status === 'HOT' || l.status === 'CONTACTED');
  const newLeads = data.leads.filter(l => l.status === 'NEW');
  const seoBucket = Math.min(100, Math.max(0, Math.round(data.seoScore / 10) * 10));
  const seoWidthClass = widthClassMap[seoBucket] || 'w-0';

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
            <button
              onClick={processFollowups}
              disabled={processingFollowups || !data.emailConfigured}
              title={!data.emailConfigured ? 'Email not configured' : 'Send follow-up emails'}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white/80 font-medium rounded-lg transition"
            >
              {processingFollowups ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {processingFollowups ? 'Processing...' : 'Send Follow-ups'}
            </button>
          </div>
        </div>

        {/* Email Configuration Warning */}
        {data.emailWarning && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 font-medium">Email Service Not Configured</p>
              <p className="text-amber-200/70 text-sm mt-1">
                {data.emailWarning} Go to{' '}
                <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-100">
                  resend.com
                </a>
                {' '}to get an API key, then add it to your Vercel environment variables as RESEND_API_KEY.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
        {sendMessage && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {sendMessage}
          </div>
        )}
        {data.nicheSummary && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            <span className="text-white/90 font-medium">Niche focus:</span> {data.nicheSummary}
          </div>
        )}

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
                className={`h-full rounded-full transition-all duration-500 ${seoWidthClass} ${
                  data.seoScore > 80 ? 'bg-[#66BB6A]' : data.seoScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
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

        {/* 24-hour Sales Sprint */}
        <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">24-hour Sales Sprint</h2>
              <p className="text-sm text-white/70">Execute these steps to maximize organic reach today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-xs text-emerald-200 hover:text-white underline">Back to Admin</Link>
              <Link href="/shop" className="text-xs text-emerald-200 hover:text-white underline">View Shop</Link>
            </div>
          </div>
          <ul className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
              Run the Growth Agent and open every new partner lead for backlink outreach.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
              Publish one short, high-intent blog post (SEO Agent + Blog Agent).
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
              Share a single product on Instagram + WhatsApp with a direct checkout link.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
              Email your top customer leads with a 24-hour limited offer.
            </li>
          </ul>
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
                hotLeads.map(lead => {
                  const contactLink = getContactLink(lead.contact);
                  return (
                  <div key={lead.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{lead.name}</h4>
                        <p className="text-sm text-white/60">{lead.role} at {lead.company}</p>
                        {lead.insights?.summary && (
                          <p className="text-xs text-white/50 mt-1">{lead.insights.summary}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md">{lead.source}</span>
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md">{lead.niche}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          {contactLink && (
                            <a
                              href={contactLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-emerald-300 hover:text-emerald-200"
                            >
                              Contact lead
                            </a>
                          )}
                          {lead.contact?.includes('@') && (
                            <button
                              onClick={() => sendOutreach(lead)}
                              disabled={sendingLeadId === lead.id}
                              className="text-xs text-white/70 hover:text-white underline disabled:opacity-50"
                            >
                              {sendingLeadId === lead.id ? 'Sending…' : 'Send email'}
                            </button>
                          )}
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
                );})
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

        {/* New Leads */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white antialiased">New Leads to Nurture</h2>
            <span className="text-sm text-white/50">{newLeads.length} new</span>
          </div>
          <div className="divide-y divide-white/5">
            {newLeads.length === 0 ? (
              <div className="p-6 text-center text-white/50">No new leads yet. Run the agent to discover fresh contacts.</div>
            ) : (
              newLeads.slice(0, 8).map((lead) => {
                const contactLink = getContactLink(lead.contact);
                return (
                  <div key={lead.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="font-medium text-white">{lead.name}</h4>
                      <p className="text-sm text-white/60">{lead.role} · {lead.company}</p>
                      {lead.insights?.summary && (
                        <p className="text-xs text-white/50 mt-1">{lead.insights.summary}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md">{lead.source}</span>
                        <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">{lead.niche}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {contactLink && (
                        <a
                          href={contactLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-300 hover:text-emerald-200 whitespace-nowrap"
                        >
                          Open contact
                        </a>
                      )}
                      {lead.contact?.includes('@') && (
                        <button
                          onClick={() => sendOutreach(lead)}
                          disabled={sendingLeadId === lead.id}
                          className="text-xs text-white/70 hover:text-white underline disabled:opacity-50"
                        >
                          {sendingLeadId === lead.id ? 'Sending…' : 'Send email'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
