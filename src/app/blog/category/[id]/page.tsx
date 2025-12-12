'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/services/woocommerceService';
import { getPosts } from '@/lib/api/wordpress';
import SectionHeader from '@/components/content/SectionHeader';
import { CTASection } from '@/components/content/CTAButton';

import type { Metadata } from 'next';

/*
export const metadata: Metadata = {
  title: 'Plant Care Tips & Gardening Guides | Whole Lot of Nature Blog',
  description: 'Discover expert plant care tips, gardening guides, and sustainable living advice. Learn how to grow and maintain healthy plants indoors and outdoors.',
  openGraph: {
    title: 'Plant Care Tips & Gardening Guides | Whole Lot of Nature Blog',
    description: 'Discover expert plant care tips, gardening guides, and sustainable living advice. Learn how to grow and maintain healthy plants indoors and outdoors.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plant Care Tips & Gardening Guides | Whole Lot of Nature Blog',
    description: 'Discover expert plant care tips, gardening guides, and sustainable living advice. Learn how to grow and maintain healthy plants indoors and outdoors.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/blog',
  },
};
*/



export default function BlogCategoryPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const rawPosts = await getPosts({ categories: categoryId.toString(), per_page: 50 });
        const categoryPosts = rawPosts.map(p => ({
            id: p.id,
            title: p.title.rendered,
            slug: p.slug,
            excerpt: p.excerpt.rendered.replace(/<[^>]*>/g, ''),
            content: p.content.rendered,
            featured_image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url,
            date: p.date,
            categories: p.categories || [],
            category_id: p.categories?.[0],
            author: p.author,
            author_name: p._embedded?.author?.[0]?.name,
            author_avatar: p._embedded?.author?.[0]?.avatar_urls?.['48'],
            tags: p.tags?.map((t: any) => t.name) || []
        } as BlogPost));
        setPosts(categoryPosts);
      } catch (error) {
        console.error('Error loading category posts:', error);
      }
      setLoading(false);
    };
    loadPosts();
  }, [categoryId]);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIdx = (currentPage - 1) * postsPerPage;
  const paginatedPosts = posts.slice(startIdx, startIdx + postsPerPage);

  const getCategoryName = () => {
    const categoryNames: { [key: number]: string } = {
      1: 'Growing Tips',
      2: 'Organic Gardening',
      3: 'Sustainability',
      4: 'Community Stories'
    };
    return categoryNames[categoryId] || 'Blog Category';
  };

  const getCategoryDescription = () => {
    const descriptions: { [key: number]: string } = {
      1: 'Learn expert techniques and proven methods for growing healthy organic plants',
      2: 'Discover sustainable gardening practices for a healthier environment',
      3: 'Explore our commitment to ecological and sustainable farming',
      4: 'Read inspiring stories from our community of organic gardeners'
    };
    return descriptions[categoryId] || 'Explore our latest blog posts';
  };

  return (
    <div className="bg-white">
      <h1 className="text-4xl font-bold mb-6">Plant Care Tips & Gardening Guides</h1>
      {/* Hero Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            as="h1"
            title={getCategoryName()}
            subtitle={getCategoryDescription()}
            align="center"
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-black antialiased">Loading Articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-black mb-4 antialiased">No articles found</p>
              <p className="text-gray-700 mb-6">Check back soon for new content</p>
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-[#2E7D32] text-white rounded-lg font-semibold hover:bg-[#2E7D32]"
              >
                View All Categories
              </Link>
            </div>
          ) : (
            <>
              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col h-full"
                  >
                    {/* Featured Image */}
                    {post.featured_image && (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Category Badge */}
                      <span className="inline-block w-fit mb-3 px-3 py-1 bg-[#2E7D32] text-white rounded-full text-xs font-bold antialiased">
                        {getCategoryName()}
                      </span>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-black mb-3 line-clamp-2 group-hover:text-[#2E7D32] transition antialiased">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">
                          {post.excerpt.replace(/<[^>]*>/g, '')}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-100 mb-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          {post.author_avatar && (
                            <Image
                              src={post.author_avatar}
                              alt={post.author_name || 'Author'}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="font-semibold">{post.author_name || 'Author'}</span>
                        </div>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>

                      {/* Reading Time */}
                      {post.reading_time && (
                        <p className="text-xs text-gray-100 mb-4">
                          ☕ {post.reading_time} min read
                        </p>
                      )}

                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-auto inline-block text-[#2E7D32] font-semibold hover:text-[#2E7D32] transition"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 my-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border-2 border-black rounded font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 rounded font-semibold transition ${
                        currentPage === i + 1
                          ? 'bg-[#2E7D32] text-white'
                          : 'border-2 border-black hover:bg-[#2E7D32]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border-2 border-black rounded font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Results Info */}
              <div className="text-center text-gray-700 text-sm mb-12">
                Showing {startIdx + 1}-{Math.min(startIdx + postsPerPage, posts.length)} of {posts.length} articles
              </div>
            </>
          )}
        </div>
      </div>

      {/* Related Categories Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader as="h2" title="Other Categories" subtitle="Explore more topics" align="center" />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'Growing Tips', icon: '' },
              { id: 2, name: 'Organic Gardening', icon: '' },
              { id: 3, name: 'Sustainability', icon: '' },
              { id: 4, name: 'Community Stories', icon: '👥' }
            ]
              .filter((cat) => cat.id !== categoryId)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.id}`}
                  className="bg-white border-2 border-black rounded-lg p-6 text-center hover:shadow-lg transition"
                >
                  <p className="text-4xl mb-3 antialiased">{cat.icon}</p>
                  <h3 className="font-bold text-black mb-2 antialiased">{cat.name}</h3>
                  <p className="text-sm text-gray-700">Explore →</p>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <CTASection
          title="Subscribe to Our Newsletter"
          description="Get the latest gardening tips and organic seed varieties delivered to your inbox"
          primaryButton={{
            text: 'Subscribe Now',
            href: '/newsletter'
          }}
          variant="centered"
          backgroundVariant="green"
        />
      </div>
    </div>
  );
}
