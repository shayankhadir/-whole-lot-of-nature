'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ComboProductCard from '@/components/shop/ComboProductCard';
import { sampleCombos } from '@/data/combos';

export default function BundlesShowcase() {
  const combos = sampleCombos.slice(0, 3);

  return (
    <section className="py-16 bg-[#0d3512]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#2E7D32] bg-[#2E7D32]/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#66BB6A]">
            Bundles
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#E8F5E9] antialiased">
            Curated Combos To Save More
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-[#daf2d0] antialiased">
            Handpicked sets that pair perfectly—and cost less than buying separately.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo) => (
            <ComboProductCard key={combo.id} combo={combo} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/combos" className="inline-flex items-center px-8 py-3 rounded-xl bg-white text-black font-semibold border border-primary-200 hover:bg-primary-50">
            View All Combos
          </Link>
        </div>
      </div>
    </section>
  );
}
