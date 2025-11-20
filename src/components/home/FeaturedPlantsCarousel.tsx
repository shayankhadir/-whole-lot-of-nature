'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { formatPrice } from '@/lib/utils/pricing';

interface FeaturedProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string;
  regular_price?: string;
  image: string;
  category: string;
}

export default function FeaturedPlantsCarousel() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  async function fetchFeaturedProducts() {
    try {
      const response = await fetch('/api/products?limit=8');
      const data = await response.json();
      if (data.success) {
        const featured = data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          sale_price: p.sale_price,
          regular_price: p.regular_price,
          image: p.images[0]?.src || '/placeholder.jpg',
          category: p.categories[0]?.name || 'Plants',
        }));
        setProducts(featured);
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--surface-onyx)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="h-12 bg-[var(--ink-700)] animate-shimmer w-64 mb-12 rounded-lg" />
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[320px] h-[480px] bg-[var(--ink-700)] animate-shimmer forest-card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[var(--surface-onyx)] overflow-hidden">
      {/* Background Leaf Decorations */}
      <div className="absolute top-10 left-0 w-48 h-48 text-[var(--emerald-700)]/5 pointer-events-none">
        <Leaf className="w-full h-full rotate-12" strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-10 right-0 w-64 h-64 text-[var(--emerald-500)]/5 pointer-events-none">
        <Leaf className="w-full h-full -rotate-12" strokeWidth={0.5} />
      </div>

      <div className="max-w-[1600px] mx-auto relative">
        {/* Section Header - Golden Ratio H3 (110px) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-montserrat text-[clamp(1.5rem,8vw,2.5rem)] font-bold text-cream-50 uppercase tracking-wide antialiased">
            Featured <span className="text-emerald-400">Plants</span>
          </h2>
          <p className="font-inter text-lg text-white/85 mt-4 max-w-2xl antialiased">
            Handpicked organic plants, carefully curated for your home and garden.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#2E7D32] -translate-x-6"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#2E7D32] translate-x-6"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Scrolling Cards */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[320px] sm:min-w-[360px]"
              >
                <Link href={`/shop/${product.slug}`}>
                  <div className="group relative bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-2xl overflow-hidden border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#2E7D32]/20 h-full flex flex-col">
                    {/* Forest Leaf Corner Decoration */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 text-[#2E7D32]/15 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Leaf className="w-full h-full rotate-45" strokeWidth={1} />
                    </div>

                    {/* Product Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="360px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F]/80 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-[#2E7D32] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {product.category}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-montserrat text-[clamp(1rem,2.5vw,1.25rem)] font-bold text-white mb-2 group-hover:text-[#66BB6A] transition-colors duration-300 antialiased line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#2E7D32]/20 mt-auto">
                        <div>
                          <span className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#66BB6A] antialiased">
                            {formatPrice(product.sale_price || product.price || '0')}
                          </span>
                          {product.sale_price && (
                            <span className="block text-sm text-white/50 line-through">
                              {formatPrice(product.regular_price || product.price || '0')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[#66BB6A] text-sm font-semibold group-hover:gap-2 transition-all duration-300">
                          <span>Shop</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-[#2E7D32] text-white font-montserrat font-bold text-base uppercase tracking-wider forest-card-lg emerald-glow hover:bg-[#66BB6A] transition-all duration-300 antialiased"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
