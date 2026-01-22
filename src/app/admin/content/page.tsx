'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  PenTool, 
  Play, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Sparkles,
  Clock,
  Eye,
  ExternalLink,
  RefreshCw,
  Send
} from 'lucide-react';

interface GeneratedPost {
  title: string;
  slug: string;
  excerpt: string;
  wordCount: number;
  status: string;
}

interface GenerationResult {
  success: boolean;
  post?: GeneratedPost;
  error?: string;
}

interface TrendPublishResult {
  trend: string;
  published: boolean;
  url?: string;
  error?: string;
}

interface TrendsRunResult {
  success: boolean;
  results?: TrendPublishResult[];
  error?: string;
}

interface FixImageResult {
  id: number;
  updated: boolean;
  reason?: string;
}

interface FixImagesRunResult {
  success: boolean;
  results?: FixImageResult[];
  error?: string;
}

export default function AdminContentPage() {
  const [adminKey, setAdminKey] = useState('');
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [recentPosts, setRecentPosts] = useState<GeneratedPost[]>([]);
  const [trendsCount, setTrendsCount] = useState(3);
  const [fixImagesLimit, setFixImagesLimit] = useState(10);
  const [isRunningTrends, setIsRunningTrends] = useState(false);
  const [trendsResult, setTrendsResult] = useState<TrendsRunResult | null>(null);
  const [isFixingImages, setIsFixingImages] = useState(false);
  const [fixImagesResult, setFixImagesResult] = useState<FixImagesRunResult | null>(null);
  
  // Load admin key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('wln_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
    }
  }, []);

  const generateBlogPost = useCallback(async () => {
    if (!topic || !keyword) {
      setResult({ success: false, error: 'Please enter both topic and keyword' });
      return;
    }

    if (!adminKey) {
      setResult({ success: false, error: 'Please login with admin key first' });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-blog-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ topic, keyword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const post: GeneratedPost = {
          title: data.post?.title || topic,
          slug: data.post?.slug || topic.toLowerCase().replace(/\s+/g, '-'),
          excerpt: data.post?.excerpt || 'Blog post generated successfully',
          wordCount: data.post?.wordCount || 0,
          status: data.post?.status || 'draft',
        };
        setResult({ success: true, post });
        setRecentPosts(prev => [post, ...prev.slice(0, 4)]);
        setTopic('');
        setKeyword('');
      } else {
        throw new Error(data.error || 'Failed to generate blog post');
      }
    } catch (error) {
      const err = error as Error;
      setResult({ success: false, error: err.message });
    } finally {
      setIsGenerating(false);
    }
  }, [topic, keyword, adminKey]);

  const runTrendsGeneration = useCallback(async () => {
    if (!adminKey) {
      setTrendsResult({ success: false, error: 'Please login with admin key first' });
      return;
    }

    setIsRunningTrends(true);
    setTrendsResult(null);

    try {
      const response = await fetch('/api/trends/generate-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ count: trendsCount }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate trend posts');
      }

      setTrendsResult({ success: true, results: data.results || [] });
    } catch (error) {
      const err = error as Error;
      setTrendsResult({ success: false, error: err.message });
    } finally {
      setIsRunningTrends(false);
    }
  }, [adminKey, trendsCount]);

  const runFixImages = useCallback(async () => {
    if (!adminKey) {
      setFixImagesResult({ success: false, error: 'Please login with admin key first' });
      return;
    }

    setIsFixingImages(true);
    setFixImagesResult(null);

    try {
      const response = await fetch('/api/blog/fix-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ limit: fixImagesLimit }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fix blog images');
      }

      setFixImagesResult({ success: true, results: data.results || [] });
    } catch (error) {
      const err = error as Error;
      setFixImagesResult({ success: false, error: err.message });
    } finally {
      setIsFixingImages(false);
    }
  }, [adminKey, fixImagesLimit]);

  const quickTopics = [
    { topic: 'Indoor Plant Care Tips', keyword: 'indoor plants care' },
    { topic: 'Best Low Light Plants', keyword: 'low light plants' },
    { topic: 'Organic Soil Guide', keyword: 'organic soil mix' },
    { topic: 'Watering Schedule Guide', keyword: 'plant watering tips' },
    { topic: 'Monsoon Plant Care', keyword: 'monsoon gardening' },
    { topic: 'Air Purifying Plants', keyword: 'air purifying indoor plants' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030806] via-[#071410] to-[#0a1f15]">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
              <PenTool className="w-8 h-8 text-pink-400" />
              Content Hub
            </h1>
            <p className="text-white/60 mt-1">Generate AI-powered blog posts with SEO optimization</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blog Generator */}
          <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Generate New Blog Post
            </h2>

            {/* Quick Topics */}
            <div className="mb-6">
              <p className="text-sm text-white/50 mb-3">Quick Topics:</p>
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((qt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTopic(qt.topic);
                      setKeyword(qt.keyword);
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-all"
                  >
                    {qt.topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Topic / Title</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Complete Guide to Indoor Plant Care"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Target Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., indoor plant care tips"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateBlogPost}
              disabled={isGenerating || !topic || !keyword}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-pink-600/25 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Blog Post...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Generate Blog Post
                </>
              )}
            </button>

            {/* Result */}
            {result && (
              <div className={`mt-6 p-4 rounded-xl ${
                result.success 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                {result.success && result.post ? (
                  <div>
                    <div className="flex items-center gap-2 text-green-400 mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Blog Post Generated!</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{result.post.title}</h3>
                    <p className="text-white/60 text-sm mb-3">{result.post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span>{result.post.wordCount} words</span>
                      <span className="px-2 py-0.5 bg-white/10 rounded-full">{result.post.status}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>{result.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Automations */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Automations</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="trendsCount" className="block text-xs text-white/50">Trend posts to publish</label>
                  <input
                    id="trendsCount"
                    type="number"
                    min={1}
                    max={5}
                    value={trendsCount}
                    onChange={(e) => setTrendsCount(Math.min(5, Math.max(1, Number(e.target.value))))}
                    placeholder="3"
                    aria-label="Trend posts to publish"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                  <button
                    onClick={runTrendsGeneration}
                    disabled={isRunningTrends}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunningTrends ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing trends...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Publish from Google Trends
                      </>
                    )}
                  </button>
                  {trendsResult && (
                    <div className={`mt-2 rounded-lg p-3 text-xs ${
                      trendsResult.success ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'
                    }`}>
                      {trendsResult.success ? (
                        <div className="space-y-1">
                          <div className="font-medium">Published {trendsResult.results?.length ?? 0} posts</div>
                          {trendsResult.results?.slice(0, 3).map((item, idx) => (
                            <div key={`${item.trend}-${idx}`} className="flex items-center justify-between gap-2">
                              <span className="truncate">{item.trend}</span>
                              <span className={item.published ? 'text-green-300' : 'text-red-300'}>
                                {item.published ? 'OK' : 'Fail'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>{trendsResult.error}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="fixImagesLimit" className="block text-xs text-white/50">Fix images for last posts</label>
                  <input
                    id="fixImagesLimit"
                    type="number"
                    min={1}
                    max={30}
                    value={fixImagesLimit}
                    onChange={(e) => setFixImagesLimit(Math.min(30, Math.max(1, Number(e.target.value))))}
                    placeholder="10"
                    aria-label="Fix images for last posts"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                  <button
                    onClick={runFixImages}
                    disabled={isFixingImages}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFixingImages ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Fixing images...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Fix Blog Images
                      </>
                    )}
                  </button>
                  {fixImagesResult && (
                    <div className={`mt-2 rounded-lg p-3 text-xs ${
                      fixImagesResult.success ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'
                    }`}>
                      {fixImagesResult.success ? (
                        <div className="space-y-1">
                          <div className="font-medium">Updated {fixImagesResult.results?.filter(r => r.updated).length ?? 0} posts</div>
                          {fixImagesResult.results?.slice(0, 3).map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex items-center justify-between gap-2">
                              <span>Post #{item.id}</span>
                              <span className={item.updated ? 'text-green-300' : 'text-yellow-300'}>
                                {item.updated ? 'Updated' : item.reason || 'Skipped'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>{fixImagesResult.error}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/blog"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all group"
                >
                  <Eye className="w-4 h-4" />
                  <span className="flex-1">View Blog</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/admin/trends"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all group"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="flex-1">Trend Agent</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <a
                  href="https://admin.wholelotofnature.com/wp-admin/edit.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all group"
                >
                  <FileText className="w-4 h-4" />
                  <span className="flex-1">WordPress Posts</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Recent Generated Posts */}
            {recentPosts.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Posts
                </h3>
                <div className="space-y-3">
                  {recentPosts.map((post, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl">
                      <h4 className="text-white text-sm font-medium truncate">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                        <span>{post.wordCount} words</span>
                        <span className="px-1.5 py-0.5 bg-white/10 rounded">{post.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">💡 Tips for Great Content</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• Use specific, long-tail keywords</li>
                <li>• Include local terms like &ldquo;Bangalore&rdquo;</li>
                <li>• Focus on plant care problems</li>
                <li>• Target seasonal gardening topics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
