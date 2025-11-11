"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: { 'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }> };
};

export default function LatestArticles() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://wholelotofnature.com/wp-json';
    const url = `${API_BASE}/wp/v2/posts?per_page=3&orderby=date&order=desc&_embed=true`;
    let active = true;
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        if (active) setPosts(data);
      } catch (e) {
        console.error('LatestArticles fetch failed', e);
        if (active) setPosts([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Latest Articles</h2>
          <p className="text-gray-600 mt-2">Fresh reads from our blog</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: WPPost) => {
            const featured = post._embedded?.['wp:featuredmedia']?.[0];
            return (
              <article key={post.id} className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
                {featured?.source_url && (
                  <div className="relative h-48">
                    <Image src={featured.source_url} alt={featured.alt_text || post.title.rendered} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                  <Link href={`/blog/${post.slug}`} className="inline-block mt-3 text-primary-700 font-medium hover:underline">
                    Read more →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
