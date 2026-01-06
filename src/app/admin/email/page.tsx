'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  ShoppingCart, 
  Package, 
  Star, 
  RefreshCw,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';

interface EmailStats {
  totalSent: number;
  byType: Record<string, number>;
  last24Hours: number;
  last7Days: number;
}

interface CampaignResult {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
}

export default function EmailDashboard() {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CampaignResult | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchStats = useCallback(async () => {
    if (!adminKey) return;
    
    try {
      const response = await fetch('/api/email/marketing', {
        headers: { 'x-admin-key': adminKey }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    // Load admin key from localStorage
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      fetchStats();
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [adminKey, fetchStats]);

  const handleLogin = () => {
    localStorage.setItem('admin_key', adminKey);
    fetchStats();
  };

  const runAbandonedCartCron = async () => {
    setRunning('abandoned_cart');
    setLastResult(null);
    
    try {
      const response = await fetch('/api/cron/abandoned-cart', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey }
      });
      
      const data = await response.json();
      if (data.results) {
        setLastResult(data.results);
      }
    } catch (error) {
      console.error('Failed to run abandoned cart cron:', error);
    } finally {
      setRunning(null);
    }
  };

  const sendTestEmail = async (type: string) => {
    if (!testEmail) {
      setTestResult({ success: false, message: 'Please enter a test email' });
      return;
    }
    
    setRunning(`test_${type}`);
    setTestResult(null);
    
    try {
      const testData: Record<string, unknown> = {
        type,
        email: testEmail,
        customerName: 'Test User'
      };
      
      // Add type-specific test data
      if (type === 'abandoned_cart') {
        testData.items = [
          { productId: 1, name: 'Peace Lily', price: 599, quantity: 1, image: 'https://via.placeholder.com/80' },
          { productId: 2, name: 'Snake Plant', price: 449, quantity: 2, image: 'https://via.placeholder.com/80' }
        ];
        testData.discountCode = 'CART10';
        testData.discountPercent = 10;
      } else if (type === 'order_confirmation') {
        testData.orderId = 'TEST-12345';
        testData.total = 1497;
        testData.items = [
          { name: 'Peace Lily', price: 599, quantity: 1 },
          { name: 'Snake Plant', price: 449, quantity: 2 }
        ];
      } else if (type === 'shipping') {
        testData.orderId = 'TEST-12345';
        testData.trackingUrl = 'https://track.example.com/12345';
      } else if (type === 'review_request') {
        testData.orderId = 'TEST-12345';
      }
      
      const response = await fetch('/api/email/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(testData)
      });
      
      const data = await response.json();
      setTestResult({
        success: data.success,
        message: data.success 
          ? `${type} email sent successfully!`
          : data.error || 'Failed to send email'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to send test email'
      });
    } finally {
      setRunning(null);
    }
  };

  if (!adminKey || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Email Marketing Dashboard</h1>
              <p className="text-gray-500 mt-2">Enter admin key to access</p>
            </div>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Key"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
              <p className="text-gray-500">Manage automated email campaigns</p>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-500">Total Sent</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalSent || 0}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-500">Last 24h</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.last24Hours || 0}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-500">Last 7 Days</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.last7Days || 0}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-500">Subscribers</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.byType?.SUBSCRIBED || 0}</p>
          </div>
        </div>

        {/* Email Types Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emails by Type</h2>
            <div className="space-y-4">
              {Object.entries(stats?.byType || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{type.toLowerCase().replace('_', ' ')}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
              {Object.keys(stats?.byType || {}).length === 0 && (
                <p className="text-gray-400 text-center py-4">No emails sent yet</p>
              )}
            </div>
          </div>

          {/* Automation Controls */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Automation Controls</h2>
            <div className="space-y-3">
              <button
                onClick={runAbandonedCartCron}
                disabled={running === 'abandoned_cart'}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Run Abandoned Cart Recovery</span>
                </div>
                {running === 'abandoned_cart' ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <Play className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {lastResult && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Completed</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Processed</p>
                      <p className="font-semibold">{lastResult.processed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sent</p>
                      <p className="font-semibold text-green-600">{lastResult.sent}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Skipped</p>
                      <p className="font-semibold text-yellow-600">{lastResult.skipped}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Failed</p>
                      <p className="font-semibold text-red-600">{lastResult.failed}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Emails Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Emails</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Email Address</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full md:w-96 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {testResult && (
            <div className={`mb-4 p-4 rounded-xl flex items-center gap-2 ${
              testResult.success 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {testResult.message}
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { type: 'welcome', label: 'Welcome', icon: Mail, color: 'blue' },
              { type: 'abandoned_cart', label: 'Abandoned Cart', icon: ShoppingCart, color: 'orange' },
              { type: 'order_confirmation', label: 'Order Confirm', icon: Package, color: 'green' },
              { type: 'shipping', label: 'Shipping', icon: Package, color: 'purple' },
              { type: 'review_request', label: 'Review Request', icon: Star, color: 'yellow' },
              { type: 'reengagement', label: 'Re-engage', icon: RefreshCw, color: 'pink' }
            ].map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                onClick={() => sendTestEmail(type)}
                disabled={running === `test_${type}` || !testEmail}
                className={`p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-${color}-300 hover:bg-${color}-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 text-${color}-500`} />
                <p className="text-sm font-medium text-gray-700">{label}</p>
                {running === `test_${type}` && (
                  <RefreshCw className="w-4 h-4 mx-auto mt-2 animate-spin text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
