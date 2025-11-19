'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, Leaf, Headphones } from 'lucide-react';

const trustSignals = [
  {
    icon: Shield,
    title: 'Quality Products',
    description: 'Premium grade guaranteed',
  },
  {
    icon: Truck,
    title: 'Secure Shipping',
    description: 'Safe delivery to your door',
  },
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'Natural & sustainable',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Guidance for your garden',
  },
];

export default function TrustBanner() {
  return (
    <section className="relative py-12 border-y border-white/5 bg-emerald-950/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-900/40 border border-gold-500/20 flex items-center justify-center mb-4 group-hover:border-gold-500/40 transition-all duration-300 backdrop-blur-md shadow-lg">
                <signal.icon className="w-6 h-6 md:w-7 md:h-7 text-gold-400 group-hover:text-gold-300 transition-colors" />
              </div>
              <h3 className="font-serif text-[clamp(1rem,2vw,1.1rem)] font-medium text-cream-50 mb-1 tracking-wide">
                {signal.title}
              </h3>
              <p className="text-[clamp(0.8rem,1.5vw,0.9rem)] text-cream-200/70 font-sans">
                {signal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
