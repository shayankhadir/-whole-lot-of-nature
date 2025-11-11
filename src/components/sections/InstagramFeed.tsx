'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart } from 'lucide-react';
import { fetchInstagramFeed } from '@/lib/graphql';

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count: number;
}

export default function InstagramFeed() {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstagramFeed = async () => {
      try {
        setIsLoading(true);
        const posts = await fetchInstagramFeed(6);
        setInstagramPosts(posts);
        setError(null);
      } catch (err) {
        console.error('Failed to load Instagram feed:', err);
        setError('Failed to load Instagram feed');
        // Set default posts on error
        setInstagramPosts([
          {
            id: '1',
            caption: 'Beautiful garden setup 🌿',
            media_type: 'IMAGE',
            media_url: 'https://via.placeholder.com/300x300?text=Instagram+Post+1',
            permalink: 'https://instagram.com',
            timestamp: '2025-10-16',
            like_count: 245,
          },
          {
            id: '2',
            caption: 'Indoor plant collection 🪴',
            media_type: 'IMAGE',
            media_url: 'https://via.placeholder.com/300x300?text=Instagram+Post+2',
            permalink: 'https://instagram.com',
            timestamp: '2025-10-15',
            like_count: 389,
          },
          {
            id: '3',
            caption: 'Fresh green vibes ✨',
            media_type: 'IMAGE',
            media_url: 'https://via.placeholder.com/300x300?text=Instagram+Post+3',
            permalink: 'https://instagram.com',
            timestamp: '2025-10-14',
            like_count: 567,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstagramFeed();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-pink-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Follow Us on Instagram
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community and see the latest from Whole Lot of Nature
          </p>
          <a
            href="https://instagram.com/wholelotofnature"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            @wholelotofnature
          </a>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Instagram className="w-8 h-8 text-pink-600" />
              </motion.div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12 text-gray-600">
            <p>{error}</p>
          </div>
        )}

        {/* Instagram Grid */}
        {!isLoading && instagramPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={post.media_url}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center text-white">
                    <Heart className="w-8 h-8 mx-auto mb-2 fill-white" />
                    <p className="text-lg font-semibold">{post.like_count}</p>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="bg-white p-4">
                <p className="text-gray-800 text-sm line-clamp-2">{post.caption}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(post.timestamp).toLocaleDateString()}
                </p>
              </div>
            </motion.a>
          ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://instagram.com/wholelotofnature"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            View More on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
