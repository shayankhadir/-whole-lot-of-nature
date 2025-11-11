'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PromoBanners() {
  const promos = [
    { id: 1, title: 'Free Shipping over $75', image: '/images/promos/free-shipping.jpg', href: '/shop' },
    { id: 2, title: 'New Soil Mixes', image: '/images/promos/soil-mixes.jpg', href: '/shop/soil-mixes' },
    { id: 3, title: 'Buy 2 Get 1 Combo', image: '/images/promos/combo.jpg', href: '/shop/combo-packs' },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo, i) => (
            <motion.div key={promo.id} whileHover={{ y: -6 }} className="relative overflow-hidden rounded-2xl shadow-lg">
              <Link href={promo.href}>
                <div className="relative h-48 md:h-56">
                  <Image src={promo.image} alt={promo.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-semibold">{promo.title}</h3>
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