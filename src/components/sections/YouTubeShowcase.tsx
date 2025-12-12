'use client';

import { motion } from 'framer-motion';
import { Youtube, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function YouTubeShowcase() {
  return (
    <section className="relative py-20 overflow-hidden bg-[#0d3512]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/85 via-[#0d3512]/88 to-[#010904]/90" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.05] mix-blend-overlay" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-4 backdrop-blur-md">
            <Youtube className="w-4 h-4 text-emerald-300" />
            <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-emerald-200 font-semibold uppercase tracking-wider antialiased">
              Watch & Learn
            </span>
          </div>
          <h2 className="font-montserrat text-[clamp(1.85rem,4.5vw,2.3rem)] font-bold text-[#e7f5e4] mb-3 antialiased">
            Whole Lot of Nature on YouTube
          </h2>
          <p className="text-[clamp(0.9375rem,2vw,1.05rem)] max-w-2xl mx-auto antialiased text-emerald-100/80">
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
            className="relative aspect-video w-full rounded-3xl overflow-hidden border border-emerald-900/40 shadow-[0_20px_60px_rgba(0,0,0,0.35)] bg-gradient-to-br from-[#0c1c12] via-[#0d3512] to-[#0c1c12]"
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#166534] to-[#0f3c24] text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-900/30 border border-emerald-800/40"
              >
                <Youtube className="w-5 h-5" />
                <span>Visit Channel</span>
              </Link>
              
              <Link
                href="https://youtu.be/_KyLAP__E5M"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-white font-semibold rounded-xl transition-all backdrop-blur-sm"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch on YouTube</span>
              </Link>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-4 text-sm text-emerald-100/60">
                <div className="flex -space-x-2" aria-hidden="true">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700/60 to-emerald-900/60 border-2 border-[#0d3512] shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                    />
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
