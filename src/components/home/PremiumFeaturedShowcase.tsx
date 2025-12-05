'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingCart } from 'lucide-react';
import { DEMO_PRODUCTS } from '@/data/demoCatalog';
import { ProductCard } from '@/components/ui/ProductCard';
import { useCartStore } from '@/stores/cartStore';

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
  rating: product.average_rating,
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
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  async function fetchFeaturedProducts() {
    try {
      // Curated list of best-selling slugs
      const featuredSlugs = [
        'organic-potting-mix',
        'succulent-potting-mix-2',
        'ayurvedic-hair-oil-200ml',
        'miniature-cactus-succulents-set-of-10',
        'succulent-desert-plante-4-succulents'
      ];

      // Fetch all products in a single request
      const response = await fetch(`/api/products?slugs=${featuredSlugs.join(',')}`);
      const data = await response.json();
      
      let allProducts: any[] = [];
      if (data.success && data.data) {
        allProducts = data.data;
      }

      // Filter out any nulls and ensure unique
      allProducts = Array.from(new Map(allProducts.filter(p => p).map(item => [item.id, item])).values());

      if (allProducts.length > 0) {
        const featured = allProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          sale_price: p.sale_price,
          regular_price: p.regular_price,
          image: p.images[0]?.src || '/placeholder.jpg',
          category: p.categories[0]?.name || 'Shop',
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

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Premium Background - Mesh Gradient */}
      <div className="absolute inset-0 bg-[#0A1F12]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(46,125,50,0.2),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(102,187,106,0.1),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {loading ? (
        <div className="h-[600px] w-full flex items-center justify-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 text-[#66BB6A] mb-4 font-medium tracking-wider text-sm uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Curated Collection</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#E8F5E9] leading-tight">
                Premium Essentials for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#66BB6A] to-[#A5D6A7]">
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
                <span className="text-[#E8F5E9] font-medium">View Full Collection</span>
                <ArrowRight className="w-5 h-5 text-[#66BB6A] group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Unique Layout - Asymmetric Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Highlight Product - Spans 5 columns */}
            <motion.div 
              style={{ y }}
              className="lg:col-span-5 relative group"
            >
              <Link href={`/shop/${mainProduct.slug}`} className="block h-full">
                <div className="relative h-[600px] lg:h-[700px] rounded-[2rem] overflow-hidden">
                  <Image
                    src={mainProduct.image}
                    alt={mainProduct.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <span className="inline-block px-4 py-1.5 bg-[#2E7D32] text-white text-xs font-bold tracking-wider uppercase rounded-full mb-4">
                      Featured Choice
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-2">
                      {mainProduct.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-semibold text-[#66BB6A]">
                        ₹{mainProduct.price}
                      </span>
                      {mainProduct.regular_price && (
                        <span className="text-base text-white/70 line-through">
                          ₹{mainProduct.regular_price}
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 line-clamp-2 mb-8 max-w-md">
                      Experience premium quality with our top-rated selection, perfect for enhancing your green space.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addItem({
                            id: String(mainProduct.id),
                            name: mainProduct.name,
                            price: parseFloat(mainProduct.price),
                            originalPrice: mainProduct.regular_price ? parseFloat(mainProduct.regular_price) : undefined,
                            image: mainProduct.image,
                            quantity: 1,
                            type: 'product',
                            inStock: true,
                            category: mainProduct.category
                          });
                        }}
                        className="px-6 py-3 bg-[#2E7D32] hover:bg-[#66BB6A] text-white rounded-full font-medium transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 z-20 relative"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                      <span className="flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all">
                        View Details <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Secondary Grid - Spans 7 columns */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 content-center">
              {sideProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/shop/${product.slug}`} className="block h-full">
                    <ProductCard
                      id={String(product.id)}
                      name={product.name}
                      image={product.image}
                      price={parseFloat(product.price)}
                      originalPrice={product.regular_price ? parseFloat(product.regular_price) : undefined}
                      rating={product.rating || 4.5}
                      reviewCount={product.reviewCount || 0}
                      variant="glass"
                      onAddToCart={() => addItem({
                        id: String(product.id),
                        name: product.name,
                        price: parseFloat(product.price),
                        originalPrice: product.regular_price ? parseFloat(product.regular_price) : undefined,
                        image: product.image,
                        quantity: 1,
                        type: 'product',
                        inStock: true,
                        category: product.category
                      })}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
