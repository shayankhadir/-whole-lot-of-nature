'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sprout, Leaf, Droplet, FlaskConical, Pill, Wrench } from 'lucide-react';

const categories = [
  {
    title: 'Soil Mixes',
    href: '/shop?category=soil-mixes',
    description: 'Signature organic blends for thriving roots.',
    icon: Sprout,
    gradient: 'from-primary-600 to-primary-400',
  },
  {
    title: 'Indoor Plants',
    href: '/shop?category=indoor-plants',
    description: 'Curated greens that elevate interiors.',
    icon: Leaf,
    gradient: 'from-primary-500 to-primary-300',
  },
  {
    title: 'Aquatic Plants',
    href: '/shop?category=aquatic-plants',
    description: 'Aquascape-ready oxygenating flora.',
    icon: Droplet,
    gradient: 'from-primary-700 to-primary-500',
  },
  {
    title: 'Organic Fertilizers',
    href: '/shop?category=organic-fertilizers',
    description: 'Nutrient-dense, chemical-free boosters.',
    icon: FlaskConical,
    gradient: 'from-primary-600 to-primary-500',
  },
  {
    title: 'Herbal Products',
    href: '/shop?category=herbal-products',
    description: 'Ayurvedic botanicals for modern wellness.',
    icon: Pill,
    gradient: 'from-primary-400 to-primary-600',
  },
  {
    title: 'Plant Accessories',
    href: '/shop?category=plant-accessories',
    description: 'Pots, tools, and thoughtful essentials.',
    icon: Wrench,
    gradient: 'from-primary-500 to-primary-700',
  },
];

export default function FeaturedTiltCategories() {
  return (
    <section className="relative py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{ backgroundImage: "url('/hero-leaves.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-primary-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black">
            Featured Categories
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-bold tracking-tight text-black">
            Shop by What You Need
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-black">
            Six curated paths to start your green journey—each tile responds with a gentle tilt and glow.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group [transform-style:preserve-3d]"
            >
              <Link
                href={cat.href}
                className="relative block h-full rounded-3xl border border-primary-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                style={{ perspective: '800px' }}
              >
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(16,93,56,0.06), transparent 40%)',
                  }}
                />

                <div className={`relative rounded-2xl bg-gradient-to-br ${cat.gradient} px-5 py-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5`}> 
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20">
                      <cat.icon className="h-5 w-5 text-black" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black">Signature</span>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-2xl font-semibold text-black group-hover:text-primary-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-black">{cat.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm font-semibold text-black">
                  <span className="uppercase tracking-wider">Explore</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
