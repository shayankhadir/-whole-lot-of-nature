'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingCart, Star } from 'lucide-react';
import { DEMO_PRODUCTS } from '@/data/demoCatalog';
import { ProductCard } from '@/components/ui/ProductCard';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

interface FeaturedProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string;
  regular_price?: string;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

const FALLBACK_FEATURED: FeaturedProduct[] = DEMO_PRODUCTS.filter((product) => product.featured).map((product) => ({
  id: typeof product.id === 'string' ? parseInt(product.id) : product.id,
  name: product.name,
  slug: product.slug,
  price: product.price,
  sale_price: product.sale_price,
  regular_price: product.regular_price,
  image: product.images[0]?.src || '/images/placeholder.jpg',
  category: product.categories[0]?.name || 'Plants',
  rating: typeof product.average_rating === 'number' 
    ? product.average_rating 
    : (product.average_rating ? parseFloat(product.average_rating) : undefined),
  reviewCount: product.rating_count
}));

export default function PremiumFeaturedShowcase() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  async function fetchFeaturedProducts() {
    try {
      const featuredSlugs = [
        'organic-potting-mix',
        'succulent-potting-mix-2',
        'ayurvedic-hair-oil-200ml',
        'miniature-cactus-succulents-set-of-10',
        'succulent-desert-plante-4-succulents'
      ];

      const response = await fetch(`/api/products?slugs=${featuredSlugs.join(',')}`);
      const data = await response.json();
      
      interface ApiProduct {
        id: number;
        name: string;
        slug: string;
        price: string;
        sale_price?: string;
        regular_price?: string;
        images: { src: string }[];
        categories: { name: string }[];
        average_rating?: string;
        rating_count?: number;
      }

      let allProducts: ApiProduct[] = [];
      if (data.success && data.data) {
        allProducts = data.data;
      }

      const uniqueProducts = Array.from(new Map(allProducts.filter(p => p).map(item => [item.id, item])).values());

      if (uniqueProducts.length > 0) {
        const featured = uniqueProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price || '0',
          sale_price: p.sale_price,
          regular_price: p.regular_price,
          image: p.images?.[0]?.src || '/placeholder.jpg',
          category: p.categories?.[0]?.name || 'Shop',
          rating: parseFloat(p.average_rating || '4.5'),
          reviewCount: p.rating_count || 0
        }));
        setProducts(featured); 
      } else {
        setProducts(FALLBACK_FEATURED.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      setProducts(FALLBACK_FEATURED.slice(0, 5));
    } finally {
      setLoading(false);
    }
  }

  const mainProduct = products[0];
  const sideProducts = products.slice(1, 5);

  if (loading) {
    return (
      <section className="relative py-24 bg-[#051F10] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
            alt="Leaf backdrop"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/80 via-[#051F10]/85 to-[#010904]/90" />
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden bg-[#051F10]">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-800/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/80 via-[#051F10]/85 to-[#010904]/90" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-4 font-medium tracking-wider text-sm uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Curated Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              Premium Essentials for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Thriving Gardens
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/shop"
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-300"
            >
              <span className="text-white font-medium">View Full Collection</span>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Highlight Product */}
          <motion.div 
            style={{ y }}
            className="lg:col-span-5 relative group"
          >
            <Link href={`/shop/${mainProduct.slug}`} className="block h-full">
              <div className="relative h-[600px] lg:h-[750px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.02]">
                <Image
                  src={mainProduct.image}
                  alt={mainProduct.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051F10] via-[#051F10]/40 to-transparent opacity-90" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase rounded-full">
                      Featured Choice
                    </span>
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white font-medium">{mainProduct.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
                    {mainProduct.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-3xl font-bold text-emerald-400">
                      ₹{mainProduct.price}
                    </span>
                    {mainProduct.regular_price && (
                      <span className="text-lg text-white/40 line-through decoration-white/40">
                        ₹{mainProduct.regular_price}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          id: String(mainProduct.id),
                          name: mainProduct.name,
                          price: parseFloat(mainProduct.price || '0'),
                          originalPrice: mainProduct.regular_price ? parseFloat(mainProduct.regular_price) : undefined,
                          image: mainProduct.image,
                          quantity: 1,
                          type: 'product',
                          inStock: true,
                          category: mainProduct.category
                        });
                      }}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 z-20 relative group/btn"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Secondary Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 content-center">
            {sideProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={`/shop/${product.slug}`} className="block h-full group">
                  <div className="relative h-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Quick Add Button Overlay */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addItem({
                            id: String(product.id),
                            name: product.name,
                            price: parseFloat(product.price || '0'),
                            originalPrice: product.regular_price ? parseFloat(product.regular_price) : undefined,
                            image: product.image,
                            quantity: 1,
                            type: 'product',
                            inStock: true,
                            category: product.category
                          });
                        }}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-white text-emerald-900 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-emerald-500 hover:text-white z-20"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-white/60">{product.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white">
                          ₹{product.price}
                        </span>
                        {product.regular_price && (
                          <span className="text-sm text-white/40 line-through">
                            ₹{product.regular_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
