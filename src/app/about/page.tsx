'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Heart, Users, Sprout, Droplet, Recycle } from 'lucide-react';
import SeamlessSection from '@/components/ui/SeamlessSection';

export default function AboutPage() {
  return (
    <div className="bg-[#0D1B0F] min-h-screen">
      {/* Hero Section */}
      <SeamlessSection bgColor="bg-gradient-to-br from-[#0D3B1F] via-[#0D1B0F] to-[#1a4d2e]" paddingY="lg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-montserrat text-[clamp(2.5rem,8vw,5rem)] font-bold text-white mb-6 tracking-tight antialiased">
              Stay Loyal to the <span className="text-[#66BB6A]">Soil</span>
            </h1>
            <p className="font-inter text-[clamp(1rem,3vw,1.5rem)] text-white/80 leading-relaxed max-w-3xl mx-auto antialiased">
              We believe in organic, sustainable gardening that connects you back to nature.
            </p>
          </motion.div>
        </div>
      </SeamlessSection>

      {/* Our Story Section */}
      <SeamlessSection bgColor="bg-[#0F1E11]" paddingY="lg">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[#66BB6A] leading-tight antialiased mb-6">
                Our Story
              </h2>

              <div className="space-y-4 text-[clamp(0.9375rem,2vw,1.125rem)] text-white/80 antialiased">
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
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-[#2E7D32]/30">
                <Image
                  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80"
                  alt="Hands holding rich soil and roots"
                  fill
                  className="object-cover"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F]/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </SeamlessSection>

      {/* Mission & Values */}
      <SeamlessSection bgColor="bg-[#0D1B0F]" paddingY="lg">
        <div className="mx-auto max-w-7xl text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[#66BB6A] leading-tight antialiased mb-4"
          >
            Our Values
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(0.9375rem,2vw,1.125rem)] text-white/80 max-w-2xl mx-auto"
          >
            We believe in sustainable gardening, mindful consumption, and staying loyal to the soil — because when you nurture nature, it gives back more than you imagine.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              className="bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] p-8 rounded-2xl border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300"
            >
              <value.icon className="w-12 h-12 text-[#66BB6A] mb-4" />
              <h3 className="font-montserrat text-[clamp(1.125rem,3vw,1.5rem)] font-semibold text-white mb-3">
                {value.title}
              </h3>
              <p className="text-[clamp(0.875rem,2vw,1rem)] text-white/70">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </SeamlessSection>

      {/* What We Offer */}
      <SeamlessSection bgColor="bg-gradient-to-b from-[#0F1E11] to-[#0D1B0F]" paddingY="lg">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[#66BB6A] leading-tight antialiased mb-6"
          >
            What We Offer
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4 text-[clamp(0.9375rem,2vw,1.125rem)] text-white/80 antialiased"
          >
            <p>
              Our goal isn't just to sell — it's to build a community of nature lovers, to help people grow their own green spaces, and to create a world where every home breathes life again.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
              <div className="bg-[#0D1B0F]/50 p-6 rounded-xl border border-[#2E7D32]/20">
                <h3 className="font-semibold text-[#66BB6A] mb-3 text-[clamp(1rem,2.5vw,1.25rem)]">Premium Soil & Fertilizers</h3>
                <p className="text-white/70 text-[clamp(0.875rem,2vw,1rem)]">Organic soil mixes and eco-friendly fertilizers crafted for optimal plant growth</p>
              </div>
              <div className="bg-[#0D1B0F]/50 p-6 rounded-xl border border-[#2E7D32]/20">
                <h3 className="font-semibold text-[#66BB6A] mb-3 text-[clamp(1rem,2.5vw,1.25rem)]">Living Plants</h3>
                <p className="text-white/70 text-[clamp(0.875rem,2vw,1rem)]">Indoor plants, succulents, and aquatic greens to bring nature into your space</p>
              </div>
              <div className="bg-[#0D1B0F]/50 p-6 rounded-xl border border-[#2E7D32]/20">
                <h3 className="font-semibold text-[#66BB6A] mb-3 text-[clamp(1rem,2.5vw,1.25rem)]">Herbal Products</h3>
                <p className="text-white/70 text-[clamp(0.875rem,2vw,1rem)]">Handmade organic herbal hair oils and natural care products</p>
              </div>
              <div className="bg-[#0D1B0F]/50 p-6 rounded-xl border border-[#2E7D32]/20">
                <h3 className="font-semibold text-[#66BB6A] mb-3 text-[clamp(1rem,2.5vw,1.25rem)]">Expert Guidance</h3>
                <p className="text-white/70 text-[clamp(0.875rem,2vw,1rem)]">Resources and support to help you succeed in your gardening journey</p>
              </div>
            </div>

            <p className="font-medium text-[#66BB6A] pt-6 text-[clamp(1rem,2.5vw,1.25rem)]">
              Whole Lot of Nature — bringing soil, soul, and sustainability together.
            </p>
          </motion.div>
        </div>
      </SeamlessSection>
    </div>
  );
}
