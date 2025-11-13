'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const posts = [
  { id: 1, title: '5 Easy Indoor Plants for Cleaner Air', image: '/images/blog/indoor-plants.jpg', excerpt: 'Learn which plants are the best at improving indoor air quality.', href: '/blog/indoor-plants' },
  { id: 2, title: 'The Secret Life of Soil Microbes', image: '/images/blog/soil-microbes.jpg', excerpt: 'Discover the microscopic helpers that keep your soil healthy.', href: '/blog/soil-microbes' },
  { id: 3, title: 'Aquatic Plant Care 101', image: '/images/blog/aquatic-care.jpg', excerpt: 'Everything you need to know to keep aquatic plants thriving.', href: '/blog/aquatic-care' },
];

export default function BlogTeaser() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 antialiased">Learn & Grow with Nature</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="bg-gray-50 rounded-2xl overflow-hidden">
              <Link href={p.href}>
                <div className="relative h-44">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium antialiased">{p.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm">{p.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}