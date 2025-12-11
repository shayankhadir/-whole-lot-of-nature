'use client';

import type { Metadata } from "next";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Heart, Users, Sprout, Droplet, Recycle, Sun, Wind, Award } from 'lucide-react';
import YouTubeShowcase from '@/components/sections/YouTubeShowcase';
import InstagramFeed from '@/components/sections/InstagramFeed';

// Note: This is a client component, so metadata export won't work here.
// For proper SEO, consider converting to server component or using Route Handlers.

const stats = [
  { label: 'Happy Plants Delivered', value: '5,000+' },
  { label: 'Organic Products', value: '100%' },
  { label: 'Green Spaces Created', value: '500+' },
  { label: 'Community Members', value: '10k+' },
];

const values = [
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'We believe in the power of nature. No harsh chemicals, just pure, organic goodness for your plants.'
  },
  {
    icon: Recycle,
    title: 'Sustainable',
    description: 'From our packaging to our sourcing, every step is taken with the planet in mind.'
  },
  {
    icon: Heart,
    title: 'Handcrafted with Love',
    description: 'Our soil mixes and herbal products are small-batch and handmade to ensure premium quality.'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We are not just a store; we are a community of plant lovers growing together.'
  }
];

export default function AboutPage() {
  return (
    <div className="bg-[#0D1B0F] min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-32 lg:py-48">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-[#2E7D32]/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-[#66BB6A]/10 blur-[100px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[#2E7D32]/30 bg-[#2E7D32]/10 text-[#4ADE80] text-sm font-medium backdrop-blur-md">
              Est. 2023 • Bangalore, India
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight antialiased">
              Whole Lot of Nature: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#2E7D32]">Rooted in Love</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto antialiased">
              More than just a nursery. We are a movement to bring life back to our urban spaces, one plant at a time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#4ADE80] mb-2">{stat.value}</div>
                <div className="text-sm text-emerald-100/60 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="font-display text-4xl font-bold text-white mb-8 antialiased flex items-center gap-3">
                <Sprout className="h-8 w-8 text-[#4ADE80]" />
                Our Story
              </h2>

              <div className="space-y-6 text-lg text-emerald-100 antialiased leading-relaxed">
                <p>
                  Whole Lot of Nature grew from a single spark — a deep love for plants that turned into a journey of reconnecting with the Earth. What started as a small collection of potted greens soon bloomed into a mission: to make nature accessible, beautiful, and sustainable for everyone.
                </p>
                <p>
                  From organic soil mixes crafted with care, to eco-friendly fertilizers, living indoor plants, aquatic greens, and handmade herbal products, we blend nature&apos;s purity with modern design and conscious living.
                </p>
                <p className="border-l-4 border-[#4ADE80] pl-6 italic text-white/90">
                  "Every product — whether it&apos;s a premium potting mix, a succulent, or a bottle of our organic herbal hair oil — is made with the same belief: that healthy roots create healthy lives."
                </p>
              </div>
            </motion.div>

            {/* Image column placeholder - using a gradient box for now if no image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border border-white/10 flex items-center justify-center group"
            >
               <div className="absolute inset-0 bg-[url('/images/backgrounds/leaf-pattern.png')] opacity-20 mix-blend-overlay" />
               <div className="text-center p-8">
                  <Sun className="h-20 w-20 text-[#4ADE80]/20 mx-auto mb-6" />
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Grown in Bangalore</h3>
                  <p className="text-emerald-100/60">Nurtured by sunshine and passion</p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="py-24 bg-[#0a160c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us?</h2>
            <p className="text-emerald-100/60 max-w-2xl mx-auto">We don't just sell plants; we cultivate relationships with nature.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#2E7D32]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="h-6 w-6 text-[#4ADE80]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-emerald-100/60 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2E7D32]/10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-8">Ready to grow your own sanctuary?</h2>
          <p className="text-xl text-emerald-100/80 mb-10">
            Join thousands of happy gardeners who have transformed their spaces with Whole Lot of Nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/shop" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#4ADE80] text-[#0D1B0F] font-bold hover:bg-[#2E7D32] hover:text-white transition-all transform hover:scale-105">
              Shop Plants
            </a>
            <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Social Media & Community */}
      <YouTubeShowcase />
      <InstagramFeed />
    </div>
  );
}
