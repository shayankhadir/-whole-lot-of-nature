'use client';

import { motion } from 'framer-motion';
import { FocusCards } from '@/components/ui/focus-cards';
import { BackgroundGrid } from '@/components/ui/BackgroundEffects';

export default function WhyChooseUsFocus() {
  const reasons = [
    {
      title: 'Organic & Safe',
      src: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?q=80&w=2070&auto=format&fit=crop',
      desc: 'Premium, chemical-free mixes and fertilizers for healthy growth.'
    },
    {
      title: 'Strong Packaging',
      src: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?q=80&w=2070&auto=format&fit=crop',
      desc: 'Plants and products arrive fresh with eco-friendly protection.'
    },
    {
      title: 'Fast Pan-India Delivery',
      src: 'https://images.unsplash.com/photo-1494537329676-fc01ef77cfbb?q=80&w=2070&auto=format&fit=crop',
      desc: 'Reliable shipping with proactive updates and support.'
    },
    {
      title: 'Sustainable Practices',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
      desc: 'Responsible sourcing, recyclable materials, and mindful ops.'
    },
    {
      title: 'Expert Support',
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      desc: 'Guidance from our horticulture team via chat and email.'
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Grid */}
      <BackgroundGrid />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center rounded-full border border-[#2E7D32]/30 bg-[#2E7D32]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#66BB6A] backdrop-blur-md">
            Why Choose Us
          </span>
          <h2 className="mt-6 text-[clamp(1.5rem,4vw,2.5rem)] font-montserrat font-bold tracking-tight text-white antialiased">
            Why Choose Whole Lot of Nature
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[clamp(0.875rem,2vw,1.125rem)] text-white/70 antialiased">
            We blend science, sustainability, and design to elevate your green journey
          </p>
        </motion.div>

        {/* Focus Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FocusCards cards={reasons} />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/70 text-[clamp(0.875rem,2vw,1.125rem)] mb-6 antialiased">
            Join thousands of plant lovers who trust us for their green sanctuary
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#2E7D32] hover:bg-[#66BB6A] text-white font-montserrat font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(46,125,50,0.4)]"
          >
            Start Shopping
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
