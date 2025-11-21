/**
 * Marketing & Content Dashboard
 * Manage blog generation, view posts, and run marketing automation
 */

'use client';

import { useState, useEffect } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  status: string;
  date: string;
  link: string;
  featured_image_url?: string | null;
  author?: string | null;
}

export default function MarketingDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState<'blog' | 'marketing' | 'social' | 'design'>('blog');
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [marketingResult, setMarketingResult] = useState<any>(null);
  const [marketingError, setMarketingError] = useState<string | null>(null);
  const [automationLoading, setAutomationLoading] = useState(false);
  const [automationResult, setAutomationResult] = useState<any>(null);
  const [automationSummary, setAutomationSummary] = useState<any>(null);
  const [designAuditLoading, setDesignAuditLoading] = useState(false);
  const [designAuditResult, setDesignAuditResult] = useState<any>(null);
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialResult, setSocialResult] = useState<any>(null);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'facebook', 'twitter']);
  const [bufferStatus, setBufferStatus] = useState<any>(null);
  const [bufferLoading, setBufferLoading] = useState(false);
  const [automationProgress, setAutomationProgress] = useState<any[]>([]);
  const [backlinkLoading, setBacklinkLoading] = useState(false);
  const [backlinkBuildLoading, setBacklinkBuildLoading] = useState(false);
  const [backlinkReport, setBacklinkReport] = useState<any>(null);
  const [backlinkAutomationResult, setBacklinkAutomationResult] = useState<any>(null);
  const [backlinkError, setBacklinkError] = useState<string | null>(null);

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch('/api/blog/list');
      const data = await response.json();
      if (data.success) {
        setBlogPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const generateBlogs = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/agent/run?action=execute', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.run);
        fetchBlogPosts(); // Refresh posts
      } else {
        setError(data.error || 'Failed to generate blogs');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const publishNow = async () => {
    setPublishing(true);
    setPublishResult(null);

    try {
      const response = await fetch('/api/publisher/schedule?action=publish-now', {
        method: 'POST',
      });
      const data = await response.json();
      setPublishResult(data);
      if (data.success) {
        fetchBlogPosts(); // Refresh posts
      }
    } catch (err: any) {
      setPublishResult({ success: false, error: err.message });
    } finally {
      setPublishing(false);
    }
  };

  const runCompetitorAnalysis = async () => {
    setMarketingLoading(true);
    setMarketingError(null);
    setMarketingResult(null);

    try {
      const response = await fetch('/api/marketing/analyze?action=analyze-competitors', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setMarketingResult(data);
      } else {
        setMarketingError(data.error || 'Analysis failed');
      }
    } catch (err: any) {
      setMarketingError(err.message || 'An error occurred');
    } finally {
      setMarketingLoading(false);
    }
  };

  const runFullAutomation = async () => {
    setAutomationLoading(true);
    setMarketingError(null);
    setAutomationResult(null);
    setAutomationSummary(null);

    try {
      const response = await fetch('/api/marketing/automate?action=full-automation', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setAutomationResult(data.results);
        setAutomationSummary(data.summary);
        if (data.results?.step1?.data?.competitors) {
          setMarketingResult({
            competitorsAnalyzed: data.results.step1.data.competitors.length,
            results: data.results.step1.data.competitors,
            insights: data.results.step1.data.insights,
          });
        }
      } else {
        setMarketingError(data.error || 'Automation failed');
      }
    } catch (err: any) {
      setMarketingError(err.message || 'An error occurred');
    } finally {
      setAutomationLoading(false);
    }
  };

  const runDesignAudit = async () => {
    setDesignAuditLoading(true);
    setDesignAuditResult(null);

    try {
      const response = await fetch('/api/design-audit?action=audit', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setDesignAuditResult(data);
      }
    } catch (err: any) {
      console.error('Design audit error:', err);
    } finally {
      setDesignAuditLoading(false);
    }
  };

  const autoFixDesign = async () => {
    setDesignAuditLoading(true);

    try {
      const response = await fetch('/api/design-audit?action=auto-fix', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setDesignAuditResult(data);
        // Run audit again to see remaining issues
        setTimeout(() => runDesignAudit(), 1000);
      }
    } catch (err: any) {
      console.error('Auto-fix error:', err);
    } finally {
      setDesignAuditLoading(false);
    }
  };

  const runSocialAutomation = async () => {
    setSocialLoading(true);
    setSocialError(null);
    setSocialResult(null);

    try {
      const response = await fetch('/api/marketing/social?action=full-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSocialResult(data);
      } else {
        setSocialError(data.error || 'Social automation failed');
      }
    } catch (err: any) {
      setSocialError(err.message || 'An error occurred');
    } finally {
      setSocialLoading(false);
    }
  };

  const generateSocialPosts = async (postCount: number = 10) => {
    setSocialLoading(true);
    setSocialError(null);

    try {
      const response = await fetch('/api/marketing/social?action=generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          postCount,
          keywords: ['indoor plants', 'plant care', 'houseplants', 'gardening'],
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSocialResult(data);
      } else {
        setSocialError(data.error || 'Failed to generate posts');
      }
    } catch (err: any) {
      setSocialError(err.message || 'An error occurred');
    } finally {
      setSocialLoading(false);
    }
  };

  const createContentCalendar = async () => {
    setSocialLoading(true);
    setSocialError(null);

    try {
      const response = await fetch('/api/marketing/social?action=create-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          days: 30,
          keywords: ['indoor plants', 'plant care', 'houseplants', 'gardening'],
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSocialResult(data);
      } else {
        setSocialError(data.error || 'Failed to create calendar');
      }
    } catch (err: any) {
      setSocialError(err.message || 'An error occurred');
    } finally {
      setSocialLoading(false);
    }
  };

  const runBacklinkAnalysis = async () => {
    setBacklinkLoading(true);
    setBacklinkError(null);
    setBacklinkReport(null);
    setBacklinkAutomationResult(null);

    try {
      const response = await fetch('/api/backlinks/run?action=analyze', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setBacklinkReport(data.report);
      } else {
        setBacklinkError(data.error || 'Backlink analysis failed');
      }
    } catch (err: any) {
      setBacklinkError(err.message || 'An error occurred');
    } finally {
      setBacklinkLoading(false);
    }
  };

  const buildBacklinks = async () => {
    setBacklinkBuildLoading(true);
    setBacklinkError(null);

    try {
      const response = await fetch('/api/backlinks/run?action=build', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setBacklinkReport(data.report);
        setBacklinkAutomationResult({ summary: data.summary, operations: data.operations });
        fetchBlogPosts();
      } else {
        setBacklinkError(data.error || 'Unable to add backlinks');
      }
    } catch (err: any) {
      setBacklinkError(err.message || 'An error occurred');
    } finally {
      setBacklinkBuildLoading(false);
    }
  };

  // Check Instagram API connection status
  const checkInstagramStatus = async () => {
    setBufferLoading(true);
    try {
      const response = await fetch('/api/instagram/instagram-test');
      const data = await response.json();
      setBufferStatus(data);
    } catch (err: any) {
      setBufferStatus({ success: false, error: err.message });
    } finally {
      setBufferLoading(false);
    }
  };

  // Send test post to Instagram
  const testInstagramPost = async () => {
    setBufferLoading(true);
    setSocialError(null);
    
    try {
      const response = await fetch('/api/instagram/instagram-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-post' }),
      });
      const data = await response.json();
      if (data.success) {
        setSocialResult(data);
        setBufferStatus({ ...bufferStatus, testComplete: true });
      } else {
        setSocialError(data.error || 'Test failed');
      }
    } catch (err: any) {
      setSocialError(err.message || 'An error occurred');
    } finally {
      setBufferLoading(false);
    }
  };

  // Run full Instagram automation (generate + schedule)
  const runInstagramAutomation = async () => {
    setSocialLoading(true);
    setSocialError(null);
    setSocialResult(null);
    setAutomationProgress([]);

    try {
      // Step 1: Generate posts
      setAutomationProgress([{ step: 1, status: 'running', message: 'Generating Instagram content...' }]);
      
      const generateResponse = await fetch('/api/marketing/social?action=generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['instagram'],
          postCount: 30,
          keywords: ['indoor plants', 'plant care', 'houseplants', 'succulents', 'gardening'],
        }),
      });
      const generateData = await generateResponse.json();

      if (!generateData.success) {
        throw new Error('Failed to generate posts');
      }

      setAutomationProgress(prev => [
        ...prev,
        { step: 1, status: 'complete', message: `✅ Generated ${generateData.posts.length} posts` }
      ]);

      // Step 2: Create calendar with scheduling
      setAutomationProgress(prev => [
        ...prev,
        { step: 2, status: 'running', message: 'Creating 30-day content calendar...' }
      ]);

      const calendarResponse = await fetch('/api/marketing/social?action=create-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['instagram'],
          days: 30,
          keywords: ['indoor plants', 'plant care', 'houseplants', 'gardening'],
        }),
      });
      const calendarData = await calendarResponse.json();

      if (!calendarData.success) {
        throw new Error('Failed to create calendar');
      }

      setAutomationProgress(prev => [
        ...prev,
        { step: 2, status: 'complete', message: `✅ Created ${calendarData.summary.totalDays}-day calendar` }
      ]);

      // Step 3: Schedule to Instagram
      setAutomationProgress(prev => [
        ...prev,
        { step: 3, status: 'running', message: 'Scheduling posts to Instagram...' }
      ]);

      // Extract posts from calendar with scheduled times
      const postsToSchedule = calendarData.calendar.flatMap((day: any) => 
        day.posts.map((post: any) => ({
          content: post.content,
          caption: post.content,
          hashtags: post.hashtags,
          imageUrl: post.imagePrompt,
          scheduledTime: post.scheduledTime,
        }))
      );

      const scheduleResponse = await fetch('/api/instagram/automate?action=schedule-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: postsToSchedule }),
      });
      const scheduleData = await scheduleResponse.json();

      if (!scheduleData.success) {
        throw new Error(scheduleData.error || 'Failed to schedule to Instagram');
      }

      setAutomationProgress(prev => [
        ...prev,
        { step: 3, status: 'complete', message: `✅ Scheduled ${scheduleData.scheduled}/${scheduleData.total} posts to Instagram` }
      ]);

      setSocialResult({
        success: true,
        instagramScheduled: true,
        postsScheduled: scheduleData.scheduled,
        totalPosts: scheduleData.total,
        calendar: calendarData.calendar,
        summary: calendarData.summary,
      });

    } catch (err: any) {
      setSocialError(err.message || 'Automation failed');
      setAutomationProgress(prev => [
        ...prev,
        { step: 0, status: 'error', message: `❌ Error: ${err.message}` }
      ]);
    } finally {
      setSocialLoading(false);
    }
  };

  const step1Data = automationResult?.step1?.data || automationResult?.step1 || null;
  const step2Data = automationResult?.step2?.data || automationResult?.step2 || null;
  const step3Data = automationResult?.step3?.data || automationResult?.step3 || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-[#2E7D32] mb-2 antialiased">
            🌿 Marketing & Content Dashboard
          </h1>
          <p className="text-gray-100">
            Manage automated content generation, view blog posts, and run marketing automation
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'blog'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-white text-gray-100 hover:bg-gray-50'
              }`}
            >
              🌿 Blog Studio ({blogPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'marketing'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-white text-gray-100 hover:bg-gray-50'
              }`}
            >
              🚀 Marketing
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'social'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-white text-gray-100 hover:bg-gray-50'
              }`}
            >
              📱 Social Media
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'design'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-white text-gray-100 hover:bg-gray-50'
              }`}
            >
              🎨 Design Audit
            </button>
          </div>
        </div>

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <button
                    onClick={generateBlogs}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 antialiased"
                  >
                    {loading ? '⏳ Generating...' : '🚀 Generate New Blog Posts from Trends'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Scrapes trending topics and generates 5 comprehensive blog posts
                  </p>
                </div>

                <div>
                  <button
                    onClick={publishNow}
                    disabled={publishing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 antialiased"
                  >
                    {publishing ? '⏳ Publishing...' : '📤 Publish Draft Posts Now'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">Publishes one draft post from WordPress</p>
                </div>
              </div>
            </div>

            {publishResult && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 antialiased">📤 Publishing Results</h3>
                <div
                  className={`p-4 rounded-lg ${
                    publishResult.success
                      ? 'bg-[#2E7D32] border border-[#2E7D32]'
                      : 'bg-red-100 border border-red-300'
                  }`}
                >
                  {publishResult.success ? (
                    <p className="text-[#2E7D32] font-semibold">
                      ✅ Published {publishResult.result?.postsPublished || 0} post(s)!
                    </p>
                  ) : (
                    <p className="text-red-800 font-semibold">❌ {publishResult.error}</p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-300 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-red-800 mb-2 antialiased">❌ Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-[#2E7D32] mb-6 antialiased">✅ Generation Complete!</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-blue-600 antialiased">{result.trendsCollected}</p>
                    <p className="text-sm text-blue-700 font-semibold">Trends Found</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-[#2E7D32] antialiased">{result.postsGenerated}</p>
                    <p className="text-sm text-[#2E7D32] font-semibold">Posts Generated</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-purple-600 antialiased">{result.postsPublished}</p>
                    <p className="text-sm text-purple-700 font-semibold">Posts Saved</p>
                  </div>
                </div>
              </div>
            )}

            {/* WordPress Posts */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400 font-semibold">WordPress Feed</p>
                  <h2 className="text-2xl font-bold text-gray-800 antialiased">📝 Blog Posts</h2>
                </div>
                <button
                  onClick={fetchBlogPosts}
                  disabled={loadingPosts}
                  className="bg-[#2E7D32] hover:bg-[#2E7D32] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingPosts ? '⏳ Loading...' : '🔄 Refresh'}
                </button>
              </div>

              {loadingPosts ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading posts...</p>
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-lg antialiased">No posts found. Generate some blogs to get started!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-[#1B5E20] text-xl flex-1 antialiased">
                          {post.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 ${
                            post.status === 'publish'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {post.status === 'publish' ? '✅ Published' : '📝 Draft'}
                        </span>
                      </div>
                      <div
                        className="text-gray-600 text-sm mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.excerpt || '<p>No excerpt available.</p>' }}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          View Post →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blog Posts Tab merged above */}

        {/* Marketing Agent Tab */}
        {activeTab === 'marketing' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 antialiased">🚀 Marketing Automation Agent</h2>
              
              {/* Full Automation */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-3 antialiased">⚡ Full Marketing Automation</h3>
                <p className="text-gray-700 mb-4">
                  Complete end-to-end automation: Analyze competitors → Extract keywords → Generate SEO content → Create landing pages automatically!
                </p>
                <button 
                  onClick={runFullAutomation}
                  disabled={automationLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg antialiased"
                >
                  {automationLoading ? '⏳ Running Full Automation (2-5 min)...' : '⚡ Run Full Automation'}
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-purple-800 mb-3 antialiased">🎯 Competitor Analysis Only</h3>
                <p className="text-gray-700 mb-4">
                  Scan competitor websites (Urvann, Nurserylive, Plantopiaa), analyze their SEO strategies, extract keywords and products.
                </p>
                <button 
                  onClick={runCompetitorAnalysis}
                  disabled={marketingLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed antialiased"
                >
                  {marketingLoading ? '⏳ Analyzing Competitors...' : '🔍 Start Competitor Analysis'}
                </button>
              </div>

              {/* Analysis Results */}
              {marketingError && (
                <div className="bg-red-100 border border-red-300 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-red-800 mb-2 antialiased">❌ Error</h3>
                  <p className="text-red-700">{marketingError}</p>
                </div>
              )}

              {/* Full Automation Results */}
              {automationResult && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-6 border-2 border-indigo-300">
                  <h3 className="text-2xl font-bold text-indigo-800 mb-6 antialiased">✅ Full Automation Complete!</h3>
                  
                  {/* Step-by-Step Results */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-800 mb-2 antialiased">📊 Step 1: Competitor Analysis</h4>
                      <p className="text-gray-700">
                        Analyzed <span className="font-bold text-blue-600 antialiased">{step1Data?.competitorsAnalyzed || 0}</span> competitors
                        {step1Data?.topKeywords && ` • Found ${step1Data.topKeywords.length} keywords`}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-l-4 border-[#2E7D32]">
                      <h4 className="font-bold text-[#2E7D32] mb-2 antialiased">✍️ Step 2: Content Generation</h4>
                      <p className="text-gray-700">
                        Generated <span className="font-bold text-[#2E7D32] antialiased">{step2Data?.contentGenerated || 0}</span> SEO-optimized articles
                        (avg. {step2Data?.avgWordCount || '1200+'} words each)
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-800 mb-2 antialiased">🚀 Step 3: Landing Pages Created</h4>
                      <p className="text-gray-700">
                        Created <span className="font-bold text-purple-600 antialiased">{step3Data?.pagesCreated || 0}</span> landing pages
                      </p>
                      {step3Data?.pages && step3Data.pages.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {step3Data.pages.map((page: any, i: number) => (
                            <a 
                              key={i} 
                              href={`/seo-pages/${page?.slug || ''}`}
                              target="_blank"
                              className="block bg-purple-50 hover:bg-purple-100 rounded-lg p-3 transition-colors border border-purple-200"
                            >
                              <p className="font-semibold text-purple-800">{page?.title || 'Untitled'}</p>
                              <p className="text-sm text-purple-600">/seo-pages/{page?.slug || ''}</p>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center border-2 border-blue-200">
                      <p className="text-2xl font-bold text-blue-600 antialiased">{automationSummary?.competitorsAnalyzed ?? step1Data?.competitorsAnalyzed ?? 0}</p>
                      <p className="text-xs text-blue-700 font-semibold">Competitors</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border-2 border-[#2E7D32]">
                      <p className="text-2xl font-bold text-[#2E7D32] antialiased">{automationSummary?.contentGenerated ?? step2Data?.contentGenerated ?? 0}</p>
                      <p className="text-xs text-[#2E7D32] font-semibold">Articles</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border-2 border-purple-200">
                      <p className="text-2xl font-bold text-purple-600 antialiased">{automationSummary?.pagesCreated ?? step3Data?.pagesCreated ?? 0}</p>
                      <p className="text-xs text-purple-700 font-semibold">Pages</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {marketingResult && (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-blue-600 antialiased">{marketingResult.competitorsAnalyzed}</p>
                      <p className="text-sm text-blue-700 font-semibold">Competitors Analyzed</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-[#2E7D32] antialiased">
                        {marketingResult.results?.reduce((sum: number, r: any) => sum + r.products.length, 0) || 0}
                      </p>
                      <p className="text-sm text-[#2E7D32] font-semibold">Products Scraped</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-purple-600 antialiased">
                        {marketingResult.insights?.topKeywords?.length || 0}
                      </p>
                      <p className="text-sm text-purple-700 font-semibold">Keywords Found</p>
                    </div>
                  </div>

                  {/* Insights */}
                  {marketingResult.insights && (
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-[#2E7D32] mb-4 antialiased">💡 Key Insights</h3>
                      
                      {/* Top Keywords */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">🔑 Top Keywords to Target:</h4>
                        <div className="flex flex-wrap gap-2">
                          {marketingResult.insights.topKeywords.slice(0, 15).map((keyword: string, i: number) => (
                            <span key={i} className="bg-[#2E7D32] text-[#2E7D32] px-3 py-1 rounded-full text-sm font-semibold">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">🎯 Actionable Recommendations:</h4>
                        <ul className="space-y-2">
                          {marketingResult.insights.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-[#2E7D32] mr-2">✓</span>
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price Range */}
                      {marketingResult.insights.priceRange && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2">💰 Competitor Price Range:</h4>
                          <p className="text-gray-700">
                            ₹{marketingResult.insights.priceRange.min} - ₹{marketingResult.insights.priceRange.max}
                          </p>
                        </div>
                      )}

                      {/* Common Categories */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">📦 Popular Categories:</h4>
                        <div className="flex flex-wrap gap-2">
                          {marketingResult.insights.commonCategories?.map((cat: string, i: number) => (
                            <span key={i} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Results */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 antialiased">📊 Detailed Competitor Analysis</h3>
                    {marketingResult.results?.map((comp: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 antialiased">{comp.name}</h4>
                            <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                              {comp.url}
                            </a>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#2E7D32] antialiased">{comp.seoScore}/100</div>
                            <div className="text-xs text-gray-100">SEO Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-600 antialiased">{comp.products.length}</p>
                            <p className="text-xs text-gray-100">Products</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600 antialiased">{comp.keywords.length}</p>
                            <p className="text-xs text-gray-100">Keywords</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-[#2E7D32] antialiased">{comp.pages.length}</p>
                            <p className="text-xs text-gray-100">Pages</p>
                          </div>
                        </div>

                        {/* Top Products */}
                        {comp.products.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-semibold text-gray-700 mb-2">🛍️ Sample Products:</h5>
                            <div className="space-y-2">
                              {comp.products.slice(0, 3).map((product: any, i: number) => (
                                <div key={i} className="bg-gray-50 rounded p-3">
                                  <p className="font-semibold text-sm">{product.name}</p>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-[#2E7D32] font-bold antialiased">{product.price}</span>
                                    <span className="text-xs text-gray-500">{product.category}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Cards */}
              {!marketingResult && !marketingLoading && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 antialiased">📊 Keyword Research</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    Discover high-ranking keywords your competitors are using and generate content around them.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Generate Keywords
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#2E7D32] mb-3 antialiased">🏆 Ranking Pages</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    Create SEO-optimized pages designed to outrank your competition on search engines.
                  </p>
                  <button className="bg-[#2E7D32] hover:bg-[#2E7D32] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Create SEO Pages
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-orange-800 mb-3 antialiased">🔗 Backlink Analysis</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    Analyze competitor backlinks and discover link-building opportunities for your site.
                  </p>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Analyze Backlinks
                  </button>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-red-800 mb-3 antialiased">📱 Social Media</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    Monitor competitor social media and automate your content calendar.
                  </p>
                  <button 
                    onClick={() => setActiveTab('social')}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Go to Social Media →
                  </button>
                </div>
              </div>
              )}

              <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-2 antialiased">⚡ Coming Soon</h3>
                <p className="text-gray-700">
                  The marketing automation agent is currently in development. It will automatically:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
                  <li>Scrape and analyze competitor websites (Urvann, Nurserylive, etc.)</li>
                  <li>Identify their top-performing pages and keywords</li>
                  <li>Generate better, more comprehensive content automatically</li>
                  <li>Create optimized landing pages for high-value keywords</li>
                  <li>Monitor rankings and adjust strategy automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 antialiased">📱 Social Media Automation</h2>
              
              {/* Platform Selector */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-3 antialiased">🎯 Select Platforms</h3>
                <div className="flex flex-wrap gap-3">
                  {['instagram', 'facebook', 'twitter', 'linkedin', 'pinterest'].map(platform => (
                    <button
                      key={platform}
                      onClick={() => {
                        if (selectedPlatforms.includes(platform)) {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, platform]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        selectedPlatforms.includes(platform)
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {platform === 'instagram' && '📸'} 
                      {platform === 'facebook' && '📘'} 
                      {platform === 'twitter' && '🐦'} 
                      {platform === 'linkedin' && '💼'} 
                      {platform === 'pinterest' && '📌'} {' '}
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Selected: <strong className="text-blue-700">{selectedPlatforms.length}</strong> platform{selectedPlatforms.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Full Automation */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-3 antialiased">⚡ Full Social Media Automation</h3>
                <p className="text-gray-700 mb-4">
                  Analyze competitors → Generate 30 posts → Create 30-day content calendar with optimal posting times!
                </p>
                <button 
                  onClick={runSocialAutomation}
                  disabled={socialLoading || selectedPlatforms.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg antialiased"
                >
                  {socialLoading ? '⏳ Running Automation...' : '⚡ Run Full Automation'}
                </button>
              </div>

              {/* Instagram API Integration Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-purple-300">
                <h3 className="text-xl font-bold text-purple-800 mb-3 antialiased">� Instagram Native Automation (FREE)</h3>
                <p className="text-gray-700 mb-4">
                  Connect Instagram's official API to automatically schedule all generated posts directly to Instagram - completely FREE!
                </p>
                
                <div className="space-y-4">
                  {/* Instagram Status */}
                  {bufferStatus && (
                    <div className={`p-4 rounded-lg border-2 ${
                      bufferStatus.success 
                        ? 'bg-[#2E7D32] border-[#2E7D32]' 
                        : 'bg-yellow-50 border-yellow-300'
                    }`}>
                      {bufferStatus.success ? (
                        <div>
                          <p className="font-bold text-[#2E7D32] mb-2 antialiased">✅ Instagram Connected!</p>
                          {bufferStatus.account && (
                            <>
                              <p className="text-sm text-[#2E7D32]">
                                @{bufferStatus.account.username}
                              </p>
                              <div className="mt-2 text-xs text-[#2E7D32] space-y-1">
                                <div>👥 {bufferStatus.account.followers?.toLocaleString()} followers</div>
                                <div>📸 {bufferStatus.account.posts} posts</div>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-yellow-800 mb-2 antialiased">⚠️ Instagram Not Connected</p>
                          <p className="text-sm text-yellow-700 mb-2">
                            {bufferStatus.error || 'Set up Instagram API to enable auto-scheduling'}
                          </p>
                          <div className="text-xs text-yellow-600 mt-2 space-y-1">
                            {bufferStatus.instructions && bufferStatus.instructions.map((instruction: string, i: number) => (
                              <div key={i}>• {instruction}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button 
                      onClick={checkInstagramStatus}
                      disabled={bufferLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {bufferLoading ? '⏳ Checking...' : '🔍 Check Instagram Connection'}
                    </button>

                    {bufferStatus?.success && (
                      <>
                        <button 
                          onClick={testInstagramPost}
                          disabled={bufferLoading}
                          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {bufferLoading ? '⏳ Testing...' : '🧪 Send Test Post'}
                        </button>

                        <button 
                          onClick={runInstagramAutomation}
                          disabled={socialLoading}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg antialiased"
                        >
                          {socialLoading ? '⏳ Automating...' : '🚀 Generate & Auto-Schedule to Instagram'}
                        </button>
                      </>
                    )}

                    <a 
                      href="/BUFFER_SETUP.md" 
                      target="_blank"
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      📖 Setup Instructions
                    </a>
                  </div>

                  {/* Progress Tracker */}
                  {automationProgress.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                      <h4 className="font-bold text-indigo-800 mb-3 antialiased">📊 Automation Progress</h4>
                      <div className="space-y-2">
                        {automationProgress.map((progress, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-2xl antialiased">
                              {progress.status === 'running' && '⏳'}
                              {progress.status === 'complete' && '✅'}
                              {progress.status === 'error' && '❌'}
                            </span>
                            <span className={`text-sm ${
                              progress.status === 'complete' ? 'text-[#2E7D32]' :
                              progress.status === 'error' ? 'text-red-700' :
                              'text-gray-700'
                            }`}>
                              {progress.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#2E7D32] mb-3 antialiased">✍️ Generate Posts Only</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    Create 10 ready-to-post social media posts for selected platforms
                  </p>
                  <button 
                    onClick={() => generateSocialPosts(10)}
                    disabled={socialLoading || selectedPlatforms.length === 0}
                    className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate 10 Posts
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-orange-800 mb-3 antialiased">📅 Create Calendar</h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    Build a 30-day content calendar with scheduling
                  </p>
                  <button 
                    onClick={createContentCalendar}
                    disabled={socialLoading || selectedPlatforms.length === 0}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Calendar
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {socialError && (
                <div className="bg-red-100 border border-red-300 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-red-800 mb-2 antialiased">❌ Error</h3>
                  <p className="text-red-700">{socialError}</p>
                </div>
              )}

              {/* Results Display */}
              {socialResult && (
                <div className="space-y-6">
                  {/* Instagram Automation Success */}
                  {socialResult.instagramScheduled && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-400">
                      <h3 className="text-3xl font-bold text-purple-800 mb-6 antialiased">🎉 Instagram Automation Complete!</h3>
                      
                      <div className="bg-white rounded-xl p-6 mb-6 border-2 border-purple-200">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-5xl antialiased">✅</span>
                          <div>
                            <h4 className="text-2xl font-bold text-purple-800 antialiased">
                              {socialResult.postsScheduled} Posts Scheduled to Instagram!
                            </h4>
                            <p className="text-gray-600">
                              Your content is scheduled directly to Instagram using their official API
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-purple-600 antialiased">{socialResult.postsScheduled}</p>
                            <p className="text-sm text-purple-700 font-semibold">Posts Scheduled</p>
                          </div>
                          <div className="bg-pink-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-pink-600 antialiased">{socialResult.summary?.totalDays || 30}</p>
                            <p className="text-sm text-pink-700 font-semibold">Days Covered</p>
                          </div>
                          <div className="bg-rose-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-rose-600 antialiased">{socialResult.summary?.postsPerDay || '2+'}</p>
                            <p className="text-sm text-rose-700 font-semibold">Posts Per Day</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#2E7D32] border-2 border-[#2E7D32] rounded-xl p-6">
                        <h4 className="font-bold text-[#2E7D32] mb-3 text-lg antialiased">✅ What Happens Next?</h4>
                        <ul className="space-y-2 text-[#2E7D32]">
                          <li className="flex items-start gap-2">
                            <span className="text-[#2E7D32] font-bold antialiased">1.</span>
                            <span>Open the Instagram app and go to your profile</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#2E7D32] font-bold antialiased">2.</span>
                            <span>View your scheduled posts by tapping the menu → "Scheduled Content"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#2E7D32] font-bold antialiased">3.</span>
                            <span>Review and edit any posts if needed before they go live</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#2E7D32] font-bold antialiased">4.</span>
                            <span>Instagram will automatically publish at the scheduled times</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#2E7D32] font-bold antialiased">5.</span>
                            <span>Monitor engagement and run automation again anytime for fresh content!</span>
                          </li>
                        </ul>
                      </div>

                      {/* Calendar Preview */}
                      {socialResult.calendar && socialResult.calendar.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-bold text-indigo-800 mb-4 antialiased">📅 Your Content Calendar (Next 7 Days)</h4>
                          <div className="space-y-3">
                            {socialResult.calendar.slice(0, 7).map((day: any, i: number) => (
                              <div key={i} className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                                <h5 className="font-bold text-gray-800 mb-2 antialiased">
                                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">{day.posts?.length || 0} posts scheduled</p>
                                <div className="flex gap-2">
                                  {day.posts?.slice(0, 3).map((post: any, j: number) => (
                                    <div key={j} className="flex items-center gap-1 text-xs bg-indigo-50 px-2 py-1 rounded">
                                      <span>📸</span>
                                      <span className="text-indigo-700">
                                        {post.scheduledTime && new Date(post.scheduledTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full Automation Results */}
                  {socialResult.results && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300">
                      <h3 className="text-2xl font-bold text-purple-800 mb-6 antialiased">✅ Social Automation Complete!</h3>
                      
                      {/* Steps */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                          <h4 className="font-bold text-blue-800 mb-2 antialiased">📊 Step 1: Competitor Analysis</h4>
                          <p className="text-gray-700">
                            Analyzed <span className="font-bold text-blue-600 antialiased">{socialResult.results.step1?.data?.competitorsAnalyzed || 0}</span> competitors
                            {socialResult.results.step1?.data?.trendingTopics && ` • Found ${socialResult.results.step1.data.trendingTopics.length} trending topics`}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-l-4 border-[#2E7D32]">
                          <h4 className="font-bold text-[#2E7D32] mb-2 antialiased">📱 Step 2: Posts Generated</h4>
                          <p className="text-gray-700">
                            Created <span className="font-bold text-[#2E7D32] antialiased">{socialResult.results.step2?.data?.postsGenerated || 0}</span> social media posts
                            {socialResult.results.step2?.data?.platforms && ` across ${socialResult.results.step2.data.platforms.length} platforms`}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                          <h4 className="font-bold text-purple-800 mb-2 antialiased">📅 Step 3: Content Calendar</h4>
                          <p className="text-gray-700">
                            Built <span className="font-bold text-purple-600 antialiased">{socialResult.results.step3?.data?.totalDays || 0}</span>-day calendar
                            {socialResult.results.step3?.data?.postsPerDay && ` with ${socialResult.results.step3.data.postsPerDay} posts/day`}
                          </p>
                        </div>
                      </div>

                      {/* Sample Posts */}
                      {socialResult.results.step2?.data?.posts && socialResult.results.step2.data.posts.length > 0 && (
                        <div className="bg-white rounded-xl p-6">
                          <h4 className="font-bold text-gray-800 mb-4 antialiased">📝 Sample Posts (First 3)</h4>
                          <div className="space-y-4">
                            {socialResult.results.step2.data.posts.slice(0, 3).map((post: any, i: number) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl antialiased">
                                    {post.platform === 'instagram' && '📸'}
                                    {post.platform === 'facebook' && '📘'}
                                    {post.platform === 'twitter' && '🐦'}
                                    {post.platform === 'linkedin' && '💼'}
                                    {post.platform === 'pinterest' && '📌'}
                                  </span>
                                  <span className="font-semibold text-gray-800 capitalize">{post.platform}</span>
                                </div>
                                <p className="text-gray-700 mb-2">{post.content}</p>
                                <div className="flex flex-wrap gap-2">
                                  {post.hashtags?.slice(0, 5).map((tag: string, j: number) => (
                                    <span key={j} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Posts Only Results */}
                  {socialResult.posts && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-[#2E7D32]">
                      <h3 className="text-2xl font-bold text-[#2E7D32] mb-6 antialiased">✅ Posts Generated!</h3>
                      <p className="text-gray-700 mb-6">
                        Created <strong>{socialResult.posts.length}</strong> posts across <strong>{socialResult.summary?.platforms?.length || 0}</strong> platforms
                      </p>

                      <div className="space-y-4">
                        {socialResult.posts.slice(0, 5).map((post: any, i: number) => (
                          <div key={i} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl antialiased">
                                {post.platform === 'instagram' && '📸'}
                                {post.platform === 'facebook' && '📘'}
                                {post.platform === 'twitter' && '🐦'}
                                {post.platform === 'linkedin' && '💼'}
                                {post.platform === 'pinterest' && '📌'}
                              </span>
                              <span className="font-semibold text-gray-800 capitalize">{post.platform}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{post.content}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {post.hashtags?.slice(0, 8).map((tag: string, j: number) => (
                                <span key={j} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {post.cta && (
                              <p className="text-sm text-purple-600 font-semibold">CTA: {post.cta}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calendar Results */}
                  {socialResult.calendar && (
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-300">
                      <h3 className="text-2xl font-bold text-orange-800 mb-6 antialiased">📅 30-Day Content Calendar</h3>
                      
                      {/* Summary Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-orange-600 antialiased">{socialResult.summary?.totalDays || 0}</p>
                          <p className="text-xs text-orange-700 font-semibold">Days</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-orange-600 antialiased">{socialResult.summary?.totalPosts || 0}</p>
                          <p className="text-xs text-orange-700 font-semibold">Total Posts</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-orange-600 antialiased">{socialResult.summary?.postsPerDay || 0}</p>
                          <p className="text-xs text-orange-700 font-semibold">Posts/Day</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-orange-600 antialiased">
                            {socialResult.summary?.platformBreakdown ? Object.keys(socialResult.summary.platformBreakdown).length : 0}
                          </p>
                          <p className="text-xs text-orange-700 font-semibold">Platforms</p>
                        </div>
                      </div>

                      {/* First Week Preview */}
                      {socialResult.calendar.slice(0, 7).map((day: any, i: number) => (
                        <div key={i} className="bg-white rounded-lg p-4 mb-3 border-2 border-orange-200">
                          <h4 className="font-bold text-gray-800 mb-2 antialiased">
                            📅 {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">Theme: {day.theme}</p>
                          <div className="space-y-2">
                            {day.posts.map((post: any, j: number) => (
                              <div key={j} className="flex items-start gap-2 text-sm">
                                <span>
                                  {post.platform === 'instagram' && '📸'}
                                  {post.platform === 'facebook' && '📘'}
                                  {post.platform === 'twitter' && '🐦'}
                                  {post.platform === 'linkedin' && '💼'}
                                  {post.platform === 'pinterest' && '📌'}
                                </span>
                                <div>
                                  <span className="font-semibold capitalize">{post.platform}</span>
                                  {post.scheduledTime && (
                                    <span className="text-gray-600 ml-2">
                                      @ {new Date(post.scheduledTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                  )}
                                  <p className="text-gray-700 line-clamp-2">{post.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Info Panel */}
              {!socialResult && !socialLoading && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2 antialiased">ℹ️ What Can This Do?</h3>
                  <p className="text-gray-700 mb-3">
                    The Social Media Agent creates content for your selected platforms:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Platform-Optimized:</strong> Character limits, hashtags, and CTAs customized per platform</li>
                    <li><strong>Content Variety:</strong> Tips, tutorials, motivation, product features, community posts</li>
                    <li><strong>Smart Scheduling:</strong> Optimal posting times based on platform best practices</li>
                    <li><strong>Hashtag Strategy:</strong> Relevant, trending hashtags for maximum reach</li>
                    <li><strong>30-Day Calendar:</strong> Complete content calendar with daily themes and schedules</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    Select your platforms above and click <strong>Run Full Automation</strong> to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Design Audit Tab */}
        {activeTab === 'design' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 antialiased">🎨 Design Audit Agent</h2>
            
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 mb-6 border-2 border-pink-200">
              <h3 className="text-xl font-bold text-pink-800 mb-3 antialiased">🔍 Scan Frontend for Design Issues</h3>
              <p className="text-gray-700 mb-4">
                Automatically scan all components and pages for contrast issues, hard-to-read fonts, accessibility problems, and color issues.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={runDesignAudit}
                  disabled={designAuditLoading}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg antialiased"
                >
                  {designAuditLoading ? '⏳ Scanning...' : '🔍 Run Design Audit'}
                </button>
                <button 
                  onClick={autoFixDesign}
                  disabled={designAuditLoading || !designAuditResult}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg antialiased"
                >
                  {designAuditLoading ? '⏳ Fixing...' : '🔧 Auto-Fix Issues'}
                </button>
              </div>
            </div>

            {/* Design Audit Results */}
            {designAuditResult && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-blue-600 antialiased">{designAuditResult.totalIssues || designAuditResult.issuesFound || 0}</p>
                    <p className="text-sm text-blue-700 font-semibold">Total Issues</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-red-600 antialiased">{designAuditResult.criticalIssues || 0}</p>
                    <p className="text-sm text-red-700 font-semibold">Critical</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-[#2E7D32] antialiased">{designAuditResult.issuesFixed || 0}</p>
                    <p className="text-sm text-[#2E7D32] font-semibold">Fixed</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-purple-600 antialiased">{designAuditResult.filesScanned || 0}</p>
                    <p className="text-sm text-purple-700 font-semibold">Files Scanned</p>
                  </div>
                </div>

                {/* Issues by Category */}
                {designAuditResult.issuesByCategory && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-indigo-800 mb-4 antialiased">📊 Issues by Category</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(designAuditResult.issuesByCategory).map(([category, count]: [string, any]) => (
                        <div key={category} className="bg-white rounded-lg p-4 border border-indigo-200">
                          <p className="text-sm font-semibold text-indigo-700 uppercase">{category}</p>
                          <p className="text-2xl font-bold text-indigo-600 antialiased">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {designAuditResult.summary && (
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 antialiased">📋 Summary</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                      {designAuditResult.summary}
                    </pre>
                  </div>
                )}

                {/* Success Message */}
                {designAuditResult.issuesFixed > 0 && (
                  <div className="bg-[#2E7D32] border-2 border-[#2E7D32] rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#2E7D32] mb-2 antialiased">✅ Auto-Fix Complete!</h3>
                    <p className="text-[#2E7D32]">
                      Successfully fixed <span className="font-bold antialiased">{designAuditResult.issuesFixed}</span> high-priority design issues across your frontend.
                      All text contrast and readability problems have been improved!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Info Panel */}
            {!designAuditResult && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2 antialiased">ℹ️ What Does This Do?</h3>
                <p className="text-gray-700 mb-3">
                  The Design Audit Agent scans your entire frontend codebase for common design issues:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Contrast Issues:</strong> Dark gray text on dark backgrounds (text-gray-400/500/600)</li>
                  <li><strong>Low Opacity Text:</strong> White text with opacity below 80% (text-white/60-70)</li>
                  <li><strong>Accessibility:</strong> WCAG compliance issues and readability problems</li>
                  <li><strong>Typography:</strong> Font sizes too small with low contrast</li>
                  <li><strong>Color Conflicts:</strong> Green on green, poor color combinations</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Click <strong>Run Design Audit</strong> to scan, then <strong>Auto-Fix Issues</strong> to automatically correct all high-priority problems!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
