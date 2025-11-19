'use client';

import { motion } from 'framer-motion';
import FeaturesSection from '@/components/ui/features-section';
import BackgroundBeams, { BackgroundParticles } from '@/components/ui/BackgroundEffects';

export default function Features() {
  return (
    <section className="relative py-24 bg-emerald-950">
      {/* Animated Background Beams */}
      <BackgroundBeams />
      <BackgroundParticles />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow mb-4">Our Promise</span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-cream-50 mb-4">
            Why Choose <span className="text-gold-gradient">Whole Lot of Nature</span>
          </h2>
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-cream-200/80 max-w-3xl mx-auto font-sans">
            Premium products, expert guidance, and exceptional service for your gardening journey
          </p>
        </motion.div>

        {/* Features Grid Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FeaturesSection />
        </motion.div>
      </div>
    </section>
  );
}