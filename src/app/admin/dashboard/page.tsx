'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [blogTopic, setBlogTopic] = useState('');
  const [blogKeyword, setBlogKeyword] = useState('');

  const runBot = async (endpoint: string, body: any = {}) => {
    if (!adminKey) {
      setOutput('Please enter Admin Key');
      return;
    }
    setLoading(true);
    setOutput('Running...');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setOutput('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d3512] text-[#daf2d0] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#4CAF50]">Admin Bot Control Center</h1>

        <div className="mb-8 p-6 bg-[#0a1f10] rounded-xl border border-[#1b5e20]">
          <label className="block text-sm font-medium mb-2">Admin API Key</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full p-3 bg-[#0d3512] border border-[#1b5e20] rounded-lg text-white focus:border-[#4CAF50] outline-none"
            placeholder="Enter secret key..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Design Bot */}
          <div className="p-6 bg-[#0a1f10] rounded-xl border border-[#1b5e20]">
            <h2 className="text-xl font-semibold mb-4 text-[#4CAF50]">🎨 Design Bot</h2>
            <p className="text-sm text-[#daf2d0]/70 mb-4">Audits and fixes UI/UX issues.</p>
            <div className="flex gap-2">
              <button
                onClick={() => runBot('/api/design-audit?action=audit')}
                disabled={loading}
                className="flex-1 py-2 bg-[#1b5e20] hover:bg-[#2E7D32] rounded-lg font-medium transition disabled:opacity-50"
              >
                Audit
              </button>
              <button
                onClick={() => runBot('/api/design-audit?action=auto-fix')}
                disabled={loading}
                className="flex-1 py-2 bg-[#2E7D32] hover:bg-[#4CAF50] rounded-lg font-medium transition disabled:opacity-50"
              >
                Auto-Fix
              </button>
            </div>
          </div>

          {/* Blog Agent */}
          <div className="p-6 bg-[#0a1f10] rounded-xl border border-[#1b5e20]">
            <h2 className="text-xl font-semibold mb-4 text-[#4CAF50]">📝 Blog Agent</h2>
            <p className="text-sm text-[#daf2d0]/70 mb-4">Generates SEO-optimized content.</p>
            <input
              type="text"
              placeholder="Topic (e.g. Indoor Plants)"
              value={blogTopic}
              onChange={(e) => setBlogTopic(e.target.value)}
              className="w-full mb-2 p-2 bg-[#0d3512] border border-[#1b5e20] rounded text-sm"
            />
            <input
              type="text"
              placeholder="Keyword (e.g. best plants)"
              value={blogKeyword}
              onChange={(e) => setBlogKeyword(e.target.value)}
              className="w-full mb-4 p-2 bg-[#0d3512] border border-[#1b5e20] rounded text-sm"
            />
            <button
              onClick={() => runBot('/api/generate-blog-post', { topic: blogTopic, keyword: blogKeyword })}
              disabled={loading}
              className="w-full py-2 bg-[#2E7D32] hover:bg-[#4CAF50] rounded-lg font-medium transition disabled:opacity-50"
            >
              Generate Post
            </button>
          </div>

          {/* Lead Gen Bot */}
          <div className="p-6 bg-[#0a1f10] rounded-xl border border-[#1b5e20]">
            <h2 className="text-xl font-semibold mb-4 text-[#4CAF50]">🚀 Lead Gen Bot</h2>
            <p className="text-sm text-[#daf2d0]/70 mb-4">Finds potential leads in niche.</p>
            <button
              onClick={() => runBot('/api/growth-agent/run')}
              disabled={loading}
              className="w-full py-2 bg-[#2E7D32] hover:bg-[#4CAF50] rounded-lg font-medium transition disabled:opacity-50"
            >
              Run Lead Gen
            </button>
          </div>
        </div>

        {/* Output Console */}
        <div className="p-6 bg-[#000] rounded-xl border border-[#1b5e20] font-mono text-sm">
          <h3 className="text-[#4CAF50] mb-2">Console Output</h3>
          <pre className="whitespace-pre-wrap text-[#daf2d0] overflow-auto max-h-96">
            {output || 'Ready...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
