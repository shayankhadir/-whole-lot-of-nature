'use client';

import type { Metadata } from "next";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Heart, Users, Sprout, Droplet, Recycle } from 'lucide-react';

// Note: This is a client component, so metadata export won't work here.
// For proper SEO, consider converting to server component or using Route Handlers.

export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white overflow-hidden">
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
              Stay Loyal to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#2E7D32]">Soil</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto antialiased">
              We believe in organic, sustainable gardening that connects you back to nature.
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

              <div className="space-y-6 text-lg text-white/90 antialiased leading-relaxed">
                <p>
                  Whole Lot of Nature grew from a single spark — a deep love for plants that turned into a journey of reconnecting with the Earth. What started as a small collection of potted greens soon bloomed into a mission: to make nature accessible, beautiful, and sustainable for everyone.
                </p>
                <p>
                  From organic soil mixes crafted with care, to eco-friendly fertilizers, living indoor plants, aquatic greens, and handmade herbal products, we blend nature's purity with modern design and conscious living.
                </p>
                <p>
                  Every product — whether it's a premium potting mix, a succulent, or a bottle of our organic herbal hair oil — is made with the same belief: that healthy roots create healthy lives.
                </p>
              </div>
            </motion.div>

            {/* Image column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80"
                  alt="Hands holding rich soil and roots"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
              </div>
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
              Our goal isn't just to sell — it's to build a community of nature lovers, to help people grow their own green spaces, and to create a world where every home breathes life again.
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
    </div>
  );
}
