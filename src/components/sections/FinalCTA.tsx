'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-12 overflow-hidden">
      {/* Compact CTA Container */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a28] via-[#2d5a3d] to-[#1a4d2e] p-8 sm:p-10 shadow-2xl border border-[#2E7D32]/30"
        >
          {/* Decorative Leaf Pattern */}
          <div className="absolute -top-10 -right-10 w-40 h-40 text-[#66BB6A]/10 pointer-events-none">
            <Leaf className="w-full h-full rotate-45" strokeWidth={0.5} />
          </div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 text-[#2E7D32]/10 pointer-events-none">
            <Leaf className="w-full h-full -rotate-12" strokeWidth={0.5} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Text Content */}
            <div className="text-center lg:text-left max-w-xl">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-montserrat text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-white leading-tight antialiased"
              >
                Ready to Grow?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-3 font-inter text-[clamp(0.9375rem,2vw,1.125rem)] text-white/90 antialiased"
              >
                Explore premium plants, organic soils & eco-friendly essentials
              </motion.p>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-shrink-0"
            >
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(102,187,106,0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-[#1a4d2e] font-montserrat font-bold text-base uppercase tracking-wide rounded-xl shadow-lg transition-all duration-300 hover:bg-[#66BB6A] hover:text-white"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Small Tagline Below */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center text-white/60 text-sm font-inter"
        >
          Stay Loyal to the Soil — 100% Organic, Sustainably Sourced
        </motion.p>
      </div>
    </section>
  );
}
