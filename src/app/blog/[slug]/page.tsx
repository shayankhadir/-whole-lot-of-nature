'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WooCommerceService, BlogPost } from '@/lib/services/woocommerceService';
import SectionHeader from '@/components/content/SectionHeader';
import { CTASection } from '@/components/content/CTAButton';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const blogPost = await WooCommerceService.getBlogPostBySlug(slug);
      setPost(blogPost);

      if (blogPost) {
        // Load related posts from the same category
        const related = await WooCommerceService.getBlogPostsByCategory(
          blogPost.category_id || 1,
          3
        );
        setRelatedPosts(related.filter((p) => p.id !== blogPost.id).slice(0, 3));
      }
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="sr-only">Loading blog article</h1>
        <p className="text-2xl font-bold text-black antialiased">📖 Loading Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="sr-only">Blog article not found</h1>
          <p className="text-2xl font-bold text-black mb-4 antialiased">Article Not Found</p>
          <Link href="/blog" className="px-6 py-3 bg-[#2E7D32] text-white rounded-lg font-semibold hover:bg-[#2E7D32]">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <h1 className="sr-only">{post.title}</h1>
      {/* Article Hero */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-[#2E7D32] text-[#2E7D32] rounded-full text-sm font-bold antialiased">
                Gardening Tips
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 antialiased">{post.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b-2 border-gray-200">
              <div className="flex items-center gap-4">
                {/* Author */}
                <div className="flex items-center gap-3">
                  {post.author_avatar && (
                    <Image
                      src={post.author_avatar}
                      alt={post.author_name || 'Author'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-black"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-black">{post.author_name || 'Author'}</p>
                    <p className="text-sm text-gray-100">Author</p>
                  </div>
                </div>
              </div>

              {/* Date & Reading Time */}
              <div className="flex items-center gap-4 text-sm text-gray-100">
                <span>📅 {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                {post.reading_time && <span>☕ {post.reading_time} min read</span>}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="max-w-3xl mx-auto relative h-96 rounded-lg overflow-hidden border-4 border-black">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      )}

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-black
              prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:mb-4 prose-p:leading-relaxed
              prose-a:text-[#2E7D32] prose-a:hover:text-[#2E7D32] prose-a:underline
              prose-strong:font-bold prose-strong:text-black
              prose-em:italic prose-em:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-[#2E7D32] prose-blockquote:pl-4 prose-blockquote:italic
              prose-ul:list-disc prose-ul:ml-6 prose-ul:text-gray-700
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:text-gray-700
              prose-li:mb-2
              prose-img:rounded-lg prose-img:border-2 prose-img:border-black prose-img:my-6
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
             antialiased"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </motion.article>

            {post.tags && post.tags.length > 0 && (
              <div className="py-8 px-4 sm:px-6 lg:px-8 border-y-2 border-gray-200">
                <div className="max-w-3xl mx-auto">
                  <p className="text-sm font-semibold text-gray-100 mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

      {/* Share Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-black mb-4">Share this article:</p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              𝕏 Tweet
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              f Share
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg font-semibold hover:bg-[#2E7D32] transition"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader as="h2" title="Related Articles" subtitle="You might also like" align="center" />
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relPost, idx) => (
                <motion.article
                  key={relPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {relPost.featured_image && (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relPost.featured_image}
                        alt={relPost.title}
                        fill
                        className="object-cover hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-black mb-2 line-clamp-2 antialiased">{relPost.title}</h3>
                    <p className="text-sm text-gray-100 mb-4">
                      {new Date(relPost.date).toLocaleDateString()}
                      {relPost.reading_time && ` • ${relPost.reading_time} min`}
                    </p>
                    <Link
                      href={`/blog/${relPost.slug}`}
                      className="text-[#2E7D32] font-semibold hover:text-[#2E7D32] transition"
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-[#2E7D32]">
        <CTASection
          title="Get More Gardening Tips"
          description="Subscribe to our newsletter for weekly gardening advice and exclusive seed collections"
          primaryButton={{
            text: 'Subscribe to Newsletter',
            href: '/newsletter'
          }}
          secondaryButton={{
            text: 'Browse More Articles',
            href: '/blog'
          }}
          variant="centered"
          backgroundVariant="white"
        />
      </div>

      {/* Navigation Links */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Link href="/blog" className="text-[#2E7D32] font-semibold hover:text-[#2E7D32] flex items-center gap-2">
              ← Back to Blog
            </Link>
            <Link href="/shop" className="text-[#2E7D32] font-semibold hover:text-[#2E7D32] flex items-center gap-2">
              Shop Seeds →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
