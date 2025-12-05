'use client';

import { motion } from 'framer-motion';
import { Youtube, ExternalLink, Play } from 'lucide-react';
import Link from 'next/link';

export default function YouTubeShowcase() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2 mb-4 backdrop-blur-md">
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-red-400 font-semibold uppercase tracking-wider antialiased">
              Watch & Learn
            </span>
          </div>
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-emerald-400 mb-4 antialiased">
            Whole Lot of Nature on YouTube
          </h2>
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] max-w-2xl mx-auto antialiased" style={{ color: '#86efac' }}>
            Join our community for visual guides, plant tours, and expert gardening tips.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Embed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20"
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/_KyLAP__E5M"
              title="Whole Lot of Nature Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </motion.div>

          {/* Channel Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white font-serif">
                Discover the Magic of Nature
              </h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Dive deeper into the world of plants with our YouTube channel. We share detailed care guides, behind-the-scenes looks at our nursery, and inspiration for your own green spaces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://www.youtube.com/@wholelotofnature"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-900/20"
              >
                <Youtube className="w-5 h-5" />
                <span>Visit Channel</span>
              </Link>
              
              <Link
                href="https://youtu.be/_KyLAP__E5M"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all backdrop-blur-sm"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch on YouTube</span>
              </Link>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-4 text-sm text-emerald-100/60">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-emerald-800 border-2 border-[#0d3512] flex items-center justify-center text-xs font-bold text-emerald-200">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Join our growing community of plant lovers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
