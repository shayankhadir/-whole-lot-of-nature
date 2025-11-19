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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-950">
        <div className="max-w-[1600px] mx-auto">
          <div className="h-12 bg-emerald-900/50 animate-pulse w-64 mb-12 rounded-lg" />
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[320px] h-[480px] bg-emerald-900/30 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-emerald-950 overflow-hidden">
      {/* Background Leaf Decorations */}
      <div className="absolute top-10 left-0 w-64 h-64 text-emerald-900/20 pointer-events-none">
        <Leaf className="w-full h-full rotate-12" strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-10 right-0 w-80 h-80 text-emerald-800/10 pointer-events-none">
        <Leaf className="w-full h-full -rotate-12" strokeWidth={0.5} />
      </div>

      <div className="max-w-[1600px] mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:text-left"
        >
          <span className="section-eyebrow mb-4">Curated Collection</span>
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold text-cream-50 mb-4">
            Featured <span className="text-gold-gradient">Plants</span>
          </h2>
          <p className="font-sans text-lg text-cream-200/80 max-w-2xl">
            Handpicked organic plants, carefully curated for your home and garden.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-emerald-900/80 border border-gold-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-800 hover:border-gold-500 -translate-x-6 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gold-400" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-emerald-900/80 border border-gold-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-800 hover:border-gold-500 translate-x-6 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gold-400" />
          </button>

          {/* Scrolling Cards */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-8 -mx-4 px-4"
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
                  <div className="group relative bg-emerald-900/20 border border-emerald-800/50 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] h-full">
                    
                    {/* Product Image - 4:5 Aspect Ratio */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-emerald-900/10 to-emerald-950/50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-8 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                        sizes="360px"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Product Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      {/* Category Badge */}
                      <span className="inline-block text-xs uppercase tracking-[0.2em] text-gold-400 font-medium mb-3">
                        {product.category}
                      </span>

                      {/* Product Name */}
                      <h3 className="font-serif text-[1.75rem] text-cream-50 leading-tight mb-4 group-hover:text-gold-200 transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-end justify-between border-t border-white/10 pt-4">
                        <div className="flex flex-col">
                          <span className="font-sans text-2xl text-emerald-400 font-bold">
                            {formatPrice(product.sale_price || product.price || '0')}
                          </span>
                          {product.sale_price && (
                            <span className="text-sm text-white/40 line-through">
                              {formatPrice(product.regular_price || product.price || '0')}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gold-400/80 group-hover:text-gold-300 transition-colors flex items-center gap-1">
                          View Details <ArrowRight className="w-3 h-3" />
                        </span>
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
          className="text-center mt-16"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-gold"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
