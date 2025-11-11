'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wind, Heart, Droplet, Sun, Sprout } from 'lucide-react';

const needs = [
  { label: 'Low Maintenance', icon: Sprout, search: 'low maintenance' },
  { label: 'Air Purifying', icon: Wind, search: 'air purifying' },
  { label: 'Vastu Friendly', icon: Heart, search: 'vastu' },
  { label: 'Aquascape', icon: Droplet, search: 'aquatic' },
  { label: 'Succulents', icon: Sun, search: 'succulent' },
];

export default function ShopByNeed() {
  return (
    <section className="relative py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{ backgroundImage: "url('/hero-leaves.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-primary-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black">
            Shop by Need
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-bold tracking-tight text-black">
            Find Plants That Fit Your Life
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-black">
            Quick filters to jump straight to what you need.
          </p>
        </motion.div>

  <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {needs.map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/shop?search=${encodeURIComponent(n.search)}`}
                className="group flex items-center gap-3 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-black group-hover:text-white group-hover:bg-primary-600 transition-colors">
                  <n.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold text-black group-hover:text-primary-700">
                  {n.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
