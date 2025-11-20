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
    title: '24/7 Support',
    description: 'Always here to help',
  },
];

export default function TrustBanner() {
  return (
    <section className="relative py-8 border-y border-[var(--emerald-700)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--emerald-700)]/20 flex items-center justify-center mb-3 group-hover:bg-[var(--emerald-700)]/30 transition-colors duration-300 backdrop-blur-md">
                <signal.icon className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
              </div>
              <h3 className="font-montserrat text-[clamp(0.875rem,2vw,1rem)] font-semibold text-cream-50 mb-1 antialiased">
                {signal.title}
              </h3>
              <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-cream-100 antialiased">
                {signal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
