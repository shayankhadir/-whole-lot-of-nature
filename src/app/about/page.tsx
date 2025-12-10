'use client';

import type { Metadata } from "next";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Heart, Users, Sprout, Droplet, Recycle } from 'lucide-react';
import YouTubeShowcase from '@/components/sections/YouTubeShowcase';
import InstagramFeed from '@/components/sections/InstagramFeed';



/*
export const metadata: Metadata = {
  title: 'About Us - Premium Plant Nursery | Whole Lot of Nature',
  description: 'Learn about Whole Lot of Nature - your trusted plant nursery in Bangalore. Premium quality plants, expert gardening advice, and sustainable solutions for your green space.',
  openGraph: {
    title: 'About Us - Premium Plant Nursery | Whole Lot of Nature',
    description: 'Learn about Whole Lot of Nature - your trusted plant nursery in Bangalore. Premium quality plants, expert gardening advice, and sustainable solutions for your green space.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Premium Plant Nursery | Whole Lot of Nature',
    description: 'Learn about Whole Lot of Nature - your trusted plant nursery in Bangalore. Premium quality plants, expert gardening advice, and sustainable solutions for your green space.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/about',
  },
};
*/



// Note: This is a client component, so metadata export won't work here.
// For proper SEO, consider converting to server component or using Route Handlers.

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
              Since 2023
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight antialiased">
              Whole Lot of Nature: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#2E7D32]">Rooted in Love</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto antialiased">
              We believe in organic, sustainable gardening that connects you back to nature. Your trusted partner for premium plants and eco-friendly gardening essentials in India.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-24 bg-white/5 border-y border-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h2 className="font-display text-4xl font-bold text-white mb-8 antialiased">
                Our Story
              </h2>

              <div className="space-y-6 text-lg text-emerald-100 antialiased leading-relaxed">
                <p>
                  Whole Lot of Nature grew from a single spark — a deep love for plants that turned into a journey of reconnecting with the Earth. What started as a small collection of potted greens soon bloomed into a mission: to make nature accessible, beautiful, and sustainable for everyone.
                </p>
                <p>
                  From organic soil mixes crafted with care, to eco-friendly fertilizers, living indoor plants, aquatic greens, and handmade herbal products, we blend nature&apos;s purity with modern design and conscious living.
                </p>
                <p>
                  Every product — whether it&apos;s a premium potting mix, a succulent, or a bottle of our organic herbal hair oil — is made with the same belief: that healthy roots create healthy lives.
                </p>
              </div>
            </motion.div>

            {/* Image column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/20"
            >
               <Image
                src="/logo.png"
                alt="Whole Lot of Nature Logo"
                fill
                className="object-contain p-12"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-32 relative">
        <div className="mx-auto max-w-7xl px-6 text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-white mb-6 antialiased"
          >
            Our Values
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
          >
            We believe in sustainable gardening, mindful consumption, and staying loyal to the soil — because when you nurture nature, it gives back more than you imagine.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
          {[
            {
              icon: Leaf,
              title: 'Organic & Natural',
              description: 'Every product is crafted from nature\'s finest ingredients, free from harmful chemicals.'
            },
            {
              icon: Recycle,
              title: 'Sustainable Practices',
              description: 'We minimize waste and maximize care for the environment in everything we do.'
            },
            {
              icon: Heart,
              title: 'Made with Love',
              description: 'Each item is carefully prepared with passion and dedication to quality.'
            },
            {
              icon: Users,
              title: 'Community Focused',
              description: 'Building a community of nature lovers who inspire and support each other.'
            },
            {
              icon: Sprout,
              title: 'Growth & Education',
              description: 'We help people grow their own green spaces through knowledge and guidance.'
            },
            {
              icon: Droplet,
              title: 'Eco-Conscious',
              description: 'Mindful consumption and eco-friendly packaging for a greener tomorrow.'
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 p-8 rounded-xl border border-white/10 hover:border-[#2E7D32]/50 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-[#2E7D32]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-6 h-6 text-[#4ADE80]" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-white mb-3">
                {value.title}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What We Offer */}
      <div className="py-32 bg-gradient-to-b from-[#0F1E11] to-[#0A0A0A] border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-white mb-8 antialiased"
          >
            What We Offer
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Our goal isn&apos;t just to sell — it&apos;s to build a community of nature lovers, to help people grow their own green spaces, and to create a world where every home breathes life again.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                { title: "Premium Soil & Fertilizers", desc: "Organic soil mixes and eco-friendly fertilizers crafted for optimal plant growth" },
                { title: "Living Plants", desc: "Indoor plants, succulents, and aquatic greens to bring nature into your space" },
                { title: "Herbal Products", desc: "Handmade organic herbal hair oils and natural care products" },
                { title: "Expert Guidance", desc: "Resources and support to help you succeed in your gardening journey" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#2E7D32]/30 transition-colors">
                  <h3 className="text-xl font-semibold text-[#4ADE80] mb-3">{item.title}</h3>
                  <p className="text-white/90">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-12">
              <p className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Whole Lot of Nature — bringing soil, soul, and sustainability together.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Social Media & Community */}
      <YouTubeShowcase />
      <InstagramFeed />

      {/* Contact Section */}
      <div id="contact" className="py-24 relative bg-[#05150a]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-emerald-100 text-lg">Have questions about your plants? We&apos;re here to help.</p>
          </div>
          
          <form className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-emerald-200 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-emerald-200 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-emerald-200 mb-2">Message</label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80] outline-none transition-colors"
                placeholder="How can we help you grow?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-900/20"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
