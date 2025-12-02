'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SEOReport {
  timestamp: string;
  filesScanned: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  seoScore: number;
}

export default function SEODashboard() {
  const [report, setReport] = useState<SEOReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/agents/seo/run');  // GET request
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/agents/seo/run', {
        method: 'POST',
      });
      const result = await res.json();
      console.log('SEO Agent result:', result);
      
      // Refresh data after running
      setTimeout(fetchReport, 2000);
    } catch (error) {
      console.error('Failed to run SEO agent:', error);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Loading SEO Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 antialiased">SEO Agent Dashboard</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 antialiased">SEO Health Monitor</h2>
              <p className="text-gray-500 text-sm">Automated SEO analysis and optimization</p>
            </div>
            <button
              onClick={runAgent}
              disabled={running}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {running ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running SEO Scan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Run SEO Scan
                </>
              )}
            </button>
          </div>

          {report ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">SEO Score</div>
                  <div className="text-3xl font-bold text-blue-900 antialiased">{report.seoScore ?? 0}</div>
                  <div className="text-xs text-blue-600 mt-1">/ 100</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Pages Scanned</div>
                  <div className="text-3xl font-bold text-gray-900 antialiased">{report.filesScanned ?? 0}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 mb-1">Critical Issues</div>
                  <div className="text-3xl font-bold text-red-900 antialiased">{report.criticalIssues ?? 0}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-600 mb-1">Total Issues</div>
                  <div className="text-3xl font-bold text-orange-900 antialiased">{report.totalIssues ?? 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">High Priority</span>
                    <span className="text-lg font-bold text-orange-600">{report.highIssues ?? 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${Math.min(100, ((report.highIssues ?? 0) / (report.totalIssues || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Medium Priority</span>
                    <span className="text-lg font-bold text-yellow-600">{report.mediumIssues ?? 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${Math.min(100, ((report.mediumIssues ?? 0) / (report.totalIssues || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Low Priority</span>
                    <span className="text-lg font-bold text-blue-600">{report.lowIssues ?? 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, ((report.lowIssues ?? 0) / (report.totalIssues || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900">Quick Actions</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Run <code className="px-2 py-1 bg-blue-100 rounded text-xs">npm run seo:fix</code> to automatically fix common issues.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500 mb-4">No SEO report available yet</p>
              <button
                onClick={runAgent}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Run First Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
