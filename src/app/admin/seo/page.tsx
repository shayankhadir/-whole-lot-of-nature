'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Play, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

interface SEOIssue {
  type: 'critical' | 'warning' | 'info';
  page: string;
  message: string;
  suggestion: string;
}

interface SEOScanResult {
  success: boolean;
  score: number;
  issues: SEOIssue[];
  summary: {
    pagesScanned: number;
    critical: number;
    warnings: number;
    passed: number;
  };
  timestamp: string;
}

export default function AdminSeoPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<SEOScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Load admin key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('wln_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
    }
  }, []);

  const runSEOScan = useCallback(async () => {
    if (!adminKey) {
      setError('Please login with admin key first');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/seo-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setScanResult(data);
      } else {
        throw new Error(data.error || 'Failed to run SEO scan');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsScanning(false);
    }
  }, [adminKey]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    return 'from-red-500/20 to-pink-500/20 border-red-500/30';
  };

  const getIssueIcon = (type: SEOIssue['type']) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getIssueBg = (type: SEOIssue['type']) => {
    switch (type) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030806] via-[#071410] to-[#0a1f15]">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Search className="w-8 h-8 text-orange-400" />
              SEO Dashboard
            </h1>
            <p className="text-white/60 mt-1">Analyze and optimize your website for search engines</p>
          </div>
        </div>

        {/* Scan Button */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Run SEO Analysis</h2>
              <p className="text-white/50 text-sm mt-1">Scan all pages for SEO issues and optimization opportunities</p>
            </div>
            <button
              onClick={runSEOScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-orange-600/25 transition-all"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run SEO Scan
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {scanResult && (
          <>
            {/* Score Card */}
            <div className={`bg-gradient-to-br ${getScoreBg(scanResult.score)} border rounded-2xl p-6 mb-6`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-white/60 text-sm uppercase tracking-wider mb-1">SEO Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-6xl font-bold ${getScoreColor(scanResult.score)}`}>
                      {scanResult.score}
                    </span>
                    <span className="text-2xl text-white/40">/100</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-3xl font-bold text-red-400">{scanResult.summary.critical}</p>
                    <p className="text-white/50 text-sm">Critical</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-yellow-400">{scanResult.summary.warnings}</p>
                    <p className="text-white/50 text-sm">Warnings</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-400">{scanResult.summary.passed}</p>
                    <p className="text-white/50 text-sm">Passed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-white/50">
                <span>{scanResult.summary.pagesScanned} pages scanned</span>
                <span>Last scan: {new Date(scanResult.timestamp).toLocaleString()}</span>
              </div>
            </div>

            {/* Issues List */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Issues Found ({scanResult.issues.length})
              </h3>

              {scanResult.issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-medium">All checks passed!</p>
                  <p className="text-white/50 text-sm">Your website is well optimized for search engines.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scanResult.issues.map((issue, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${getIssueBg(issue.type)}`}>
                      <div className="flex items-start gap-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{issue.message}</span>
                            <span className="text-white/40 text-sm">{issue.page}</span>
                          </div>
                          <p className="text-white/60 text-sm">{issue.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/pages"
            className="flex items-center gap-3 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-orange-500/30 rounded-xl transition-all group"
          >
            <TrendingUp className="w-5 h-5 text-white/50 group-hover:text-orange-400" />
            <span className="text-white/70 group-hover:text-white">Site Map</span>
          </Link>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-orange-500/30 rounded-xl transition-all group"
          >
            <ExternalLink className="w-5 h-5 text-white/50 group-hover:text-orange-400" />
            <span className="text-white/70 group-hover:text-white">Google Search Console</span>
          </a>
          <Link
            href="/sitemap.xml"
            className="flex items-center gap-3 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-orange-500/30 rounded-xl transition-all group"
          >
            <RefreshCw className="w-5 h-5 text-white/50 group-hover:text-orange-400" />
            <span className="text-white/70 group-hover:text-white">View Sitemap</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
