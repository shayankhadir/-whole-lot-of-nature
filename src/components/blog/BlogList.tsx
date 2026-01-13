'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Loader2 } from 'lucide-react';
import { Post } from '@/lib/api/wordpress';

// Extended type to handle both WordPress API and our custom API response
interface ExtendedPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string } | string;
  excerpt: { rendered: string } | string;
  featured_image_url?: string | null;
  featured_media?: number;
  author?: number | string;
  _embedded?: Post['_embedded'];
}

interface BlogListProps {
  initialPosts: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState<ExtendedPost[]>(initialPosts as ExtendedPost[]);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fallbackImage = '/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg';

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/list?page=${page}&per_page=12`);
      const data = await res.json();
      
      // Handle both array response and object response with posts property
      const newPosts = Array.isArray(data) ? data : (data.posts || []);
      
      if (newPosts && newPosts.length > 0) {
        setPosts([...posts, ...newPosts]);
        setPage(page + 1);
        // Check if we've reached the end based on pagination
        if (data.pagination && data.pagination.page >= data.pagination.totalPages) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          // Handle both embedded media and direct featured_image_url from API
          const featured = post._embedded?.['wp:featuredmedia']?.[0];
          const author = post._embedded?.author?.[0];
          const heroImage = featured?.source_url || post.featured_image_url || fallbackImage;
          const postTitle = typeof post.title === 'string' ? post.title : (post.title?.rendered || 'Untitled');
          const postExcerpt = typeof post.excerpt === 'string' ? post.excerpt : (post.excerpt?.rendered || '');
          return (
            <article
              key={post.id}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group shadow-lg shadow-black/30"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={heroImage}
                  alt={featured?.alt_text || postTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback on image load error
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  {(author || post.author) && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{author?.name || post.author}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors antialiased"
                  dangerouslySetInnerHTML={{ __html: postTitle }}
                />
                
                <div 
                  className="text-gray-300 mb-4 line-clamp-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: postExcerpt }}
                />

                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-block text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </button>
        </div>
      )}
    </>
  );
}
