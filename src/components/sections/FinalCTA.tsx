'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function FinalCTA() {
  return (
    <section className="relative py-16 overflow-hidden bg-emerald-950">
      {/* Compact CTA Container */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-10 sm:p-12 shadow-2xl border border-emerald-700/30"
        >
          {/* Decorative Leaf Pattern */}
          <div className="absolute -top-10 -right-10 w-40 h-40 text-gold-500/10 pointer-events-none">
            <Leaf className="w-full h-full rotate-45" strokeWidth={0.5} />
          </div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 text-emerald-950/20 pointer-events-none">
            <Leaf className="w-full h-full -rotate-12" strokeWidth={0.5} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="text-center lg:text-left max-w-xl">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-cream-50 leading-tight"
              >
                Ready to <span className="text-gold-gradient">Grow?</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 font-sans text-[clamp(1rem,2vw,1.125rem)] text-cream-100/90"
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
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="flex items-center gap-3 text-emerald-950 bg-gold-500 font-sans font-bold text-base uppercase tracking-wide px-8 py-4 hover:bg-gold-400 transition-colors"
                  glowColor="#FFD700"
                >
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </HoverBorderGradient>
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
          className="mt-8 text-center text-cream-200/60 text-sm font-sans tracking-wider uppercase"
        >
          Stay Loyal to the Soil — 100% Organic, Sustainably Sourced
        </motion.p>
      </div>
    </section>
  );
}
