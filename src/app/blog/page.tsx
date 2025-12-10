import Image from 'next/image';
import Link from 'next/link';
// Server component: keep it motion-free
import { Calendar, User } from 'lucide-react';
import { getPosts, Post } from '@/lib/api/wordpress';
import Button from '@/components/ui/Button';
import BlogList from '@/components/blog/BlogList';

import type { Metadata } from 'next';

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



export default async function BlogPage() {
  const posts: Post[] = await getPosts({ per_page: 12 });

  const fallbackPosts = [
    {
      id: 'sample-1',
      title: 'Beginner&apos;s Guide to Indoor Plants',
      excerpt: 'Start your green journey with low-maintenance indoor plants and essential care tips.',
      href: '/blog',
    },
    {
      id: 'sample-2',
      title: 'Soil 101: The Perfect Potting Mix',
      excerpt: 'Learn how to choose or blend a potting mix tailored to your plant&apos;s needs.',
      href: '/blog',
    },
    {
      id: 'sample-3',
      title: 'Sunlight Simplified: Light for Houseplants',
      excerpt: 'Bright, indirect, low light… decode plant labels and position them like a pro.',
      href: '/blog',
    },
    {
      id: 'sample-4',
      title: 'Watering Wisdom: Avoid Overwatering',
      excerpt: 'Signs of overwatering, proper technique, and how to recover stressed roots.',
      href: '/blog',
    },
    {
      id: 'sample-5',
      title: 'Aquatic Plants for Balcony Water Gardens',
      excerpt: 'Create a calming mini water feature with easy aquatic species.',
      href: '/blog',
    },
    {
      id: 'sample-6',
      title: 'Herbal Wellness: Daily Rituals',
      excerpt: 'Simple herbal routines to help you unwind and restore balance.',
      href: '/blog',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 antialiased">Our Blog</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto antialiased">Discover tips, guides, and inspiration for your gardening journey</p>
        </div>

        <BlogList initialPosts={posts && posts.length > 0 ? posts : []} />

        {(!posts || posts.length === 0) && (
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fallbackPosts.map((p) => (
              <article key={p.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group">
                <div className="relative h-48 overflow-hidden bg-emerald-900/30">
                  <Image src="/hero-leaves.svg" alt="Tropical leaves" fill className="object-cover opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">{p.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{p.excerpt}</p>
                  <Link href={p.href}>
                    <Button variant="outline">Explore Articles</Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
