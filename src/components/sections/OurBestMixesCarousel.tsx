'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils/pricing';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: { id: number; src: string; alt: string }[];
  featured: boolean;
}

export default function OurBestMixesCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, openCart } = useCartStore();

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: 'free-snap',
    slides: { perView: 1.1, spacing: 16 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2.1, spacing: 24 } },
      '(min-width: 1024px)': { slides: { perView: 3.1, spacing: 24 } },
    },
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/products?category=soil-mixes&limit=20');
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to load');
        const list: Product[] = (json.data || []).filter((p: Product) => p.featured);
        if (mounted) {
          setProducts(list);
          setLoading(false);
        }
      } catch (e: unknown) {
        if (mounted) {
          const message = e instanceof Error ? e.message : 'Error fetching products';
          setError(message);
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = (p: Product) => {
    addItem({
      id: String(p.id),
      name: p.name,
      price: parseFloat(p.sale_price || p.price || '0'),
      originalPrice: p.sale_price ? parseFloat(p.regular_price || p.price || '0') : undefined,
      image: p.images?.[0]?.src || '/placeholder.png',
      type: 'product',
      inStock: true,
    });
    openCart();
  };

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
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#E8F5E9] antialiased">
            Our Best Mixes
          </h2>
          <p className="mt-3 text-[#daf2d0]">
            Featured, organic soil blends trusted by thousands.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-primary-50 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="mt-8 text-center text-primary-700">{error}</p>
        ) : products.length === 0 ? (
          <p className="mt-8 text-center text-black">No featured soil mixes found.</p>
        ) : (
          <div ref={sliderRef} className="keen-slider mt-12">
            {products.map((p) => (
              <div key={p.id} className="keen-slider__slide">
                <div className="h-full rounded-2xl border border-primary-100 bg-white p-4 shadow-lg hover:shadow-xl transition-all">
                  <Link href={`/shop/${p.slug}`}>
                    <div className="relative w-full h-48 overflow-hidden rounded-xl">
                      <Image src={p.images?.[0]?.src || '/placeholder.png'} alt={p.images?.[0]?.alt || p.name} fill className="object-cover" />
                      <div className="absolute left-3 top-3 rounded-full border border-white/70 bg-primary-700/80 px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                        Organic
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4">
                    <Link href={`/shop/${p.slug}`} className="block text-base font-semibold text-black hover:text-primary-700 antialiased">
                      {p.name}
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-primary-900 antialiased">
                        {formatPrice(p.sale_price || p.price || '0')}
                      </span>
                      {p.sale_price && (
                        <span className="text-sm text-white/80 line-through">
                          {formatPrice(p.regular_price || p.price || '0')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      className="mt-4 w-full rounded-lg bg-primary-700 px-4 py-2 text-white font-semibold hover:bg-primary-600"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
