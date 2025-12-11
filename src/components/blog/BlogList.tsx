'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Loader2 } from 'lucide-react';
import { Post } from '@/lib/api/wordpress';

interface BlogListProps {
  initialPosts: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fallbackImage = '/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg';

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/list?page=${page}&per_page=12`);
      const newPosts = await res.json();
      
      if (newPosts && newPosts.length > 0) {
        setPosts([...posts, ...newPosts]);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const featured = post._embedded?.['wp:featuredmedia']?.[0];
          const author = post._embedded?.author?.[0];
          const heroImage = featured?.source_url || fallbackImage;
          return (
            <article
              key={post.id}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group shadow-lg shadow-black/30"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={heroImage}
                  alt={featured?.alt_text || post.title.rendered}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  {author && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{author.name}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                
                <div 
                  className="text-gray-300 mb-4 line-clamp-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
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
