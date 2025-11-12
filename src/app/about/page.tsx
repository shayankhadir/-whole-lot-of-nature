'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Heart, Users, Sprout } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0D3B1F] via-[#1A1A1A] to-[#2E7D32]/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-montserrat text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Stay Loyal to the <span className="text-[#66BB6A]">Soil</span>
            </h1>
            <p className="font-inter text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              We believe in organic, sustainable gardening that connects you back to nature.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
