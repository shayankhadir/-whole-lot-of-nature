'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const sampleProducts = [
  { id: 1, name: 'Premium Soil Mix', image: '/images/products/soil-mix.jpg', price: 29.99, href: '/shop/premium-soil-mix' },
  { id: 2, name: 'Succulent Combo', image: '/images/products/succulent-combo.jpg', price: 39.99, href: '/shop/succulent-combo' },
  { id: 3, name: 'Aquatic Plants Set', image: '/images/products/aquatic-plants.jpg', price: 49.99, href: '/shop/aquatic-plants-set' },
  { id: 4, name: 'Eco Fertilizer', image: '/images/products/fertilizer.jpg', price: 19.99, href: '/shop/eco-fertilizer' },
  { id: 5, name: 'Indoor Plant Pack', image: '/images/products/indoor-pack.jpg', price: 24.99, href: '/shop/indoor-pack' },
];

export default function ProductCarousel() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let raf = 0;
    const speed = 0.4; // px per frame

    const step = () => {
      node.scrollLeft += speed;
      if (node.scrollLeft >= node.scrollWidth - node.clientWidth) {
        node.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 antialiased">Best Sellers</h2>
        <div ref={containerRef} className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {sampleProducts.map((p) => (
            <motion.div key={p.id} whileHover={{ scale: 1.03 }} className="min-w-[220px] bg-white rounded-lg shadow-md p-4">
              <Link href={p.href}>
                <div className="relative h-40 w-full mb-3">
                  <Image src={p.image} alt={p.name} fill className="object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{p.name}</h3>
                  <p className="text-gray-600 mt-1">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}