'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const combos = [
  { id: 1, title: 'Soil Starter Pack', image: '/images/combos/starter.jpg', price: 49.99, savings: 'Save 20%', href: '/shop/combo-packs/soil-starter' },
  { id: 2, title: 'Succulent Combo', image: '/images/combos/succulent.jpg', price: 39.99, savings: 'Save 15%', href: '/shop/combo-packs/succulent' },
  { id: 3, title: 'Aquarium Pack', image: '/images/combos/aquarium.jpg', price: 59.99, savings: 'Save 25%', href: '/shop/combo-packs/aquarium' },
];

export default function ComboPacks() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 antialiased">Combo Packs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combos.map((c) => (
            <motion.div key={c.id} whileHover={{ y: -8 }} className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <Link href={c.href}>
                <div className="relative h-56">
                  <Image src={c.image} alt={c.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium antialiased">{c.title}</h3>
                    <span className="text-sm text-[#2E7D32] font-semibold">{c.savings}</span>
                  </div>
                  <p className="mt-4 text-gray-600">Perfect starter bundle for new plant parents.</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xl font-bold antialiased">${c.price.toFixed(2)}</span>
                    <button className="px-4 py-2 bg-[#2E7D32] text-white rounded-full">Shop Pack</button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}