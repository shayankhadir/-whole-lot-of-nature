'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sprout } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';

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

export default function SoilShowcase() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSoil() {
      try {
        // Fetch products from 'soil-and-growing-media' category
        // Note: Adjust the category slug if it's different in your WooCommerce
        const response = await fetch('/api/products?category=soil-and-growing-media&limit=4');
        const data = await response.json();
        
        if (data.success && data.data) {
          const mappedProducts = data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price || '0',
            sale_price: p.sale_price,
            regular_price: p.regular_price,
            image: p.images?.[0]?.src || '/placeholder.jpg',
            category: 'Soil & Media',
            rating: parseFloat(p.average_rating || '0'),
            reviewCount: p.rating_count || 0
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch soil products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSoil();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-[#1a1510] relative overflow-hidden">
      {/* Earthy Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("/images/noise.png")' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8d6e63]/20 text-[#d7ccc8] text-xs font-bold uppercase tracking-wider mb-6">
                <Sprout className="w-4 h-4" />
                <span>Premium Growing Media</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-[#efebe9] mb-6 antialiased leading-tight">
                The Foundation of <span className="text-[#a1887f]">Growth</span>
              </h2>
              
              <p className="text-[#d7ccc8]/80 text-lg mb-8 leading-relaxed">
                Give your plants the best start with our handcrafted, nutrient-rich soil mixes and organic amendments.
              </p>
              
              <Link 
                href="/shop?category=soil-and-growing-media"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#5d4037] hover:bg-[#4e342e] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#3e2723]/30 hover:shadow-[#3e2723]/50 hover:-translate-y-1"
              >
                <span>Shop Soil Mixes</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    id={String(product.id)}
                    name={product.name}
                    image={product.image}
                    price={typeof product.price === 'string' ? parseFloat(product.price) : product.price}
                    originalPrice={product.regular_price ? parseFloat(product.regular_price) : undefined}
                    rating={product.rating || 0}
                    reviewCount={product.reviewCount || 0}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
