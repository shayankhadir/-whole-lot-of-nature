'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';
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

export default function PlantsShowcase() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlants() {
      try {
        // Fetch products from 'plants' category
        const response = await fetch('/api/products?category=plants&limit=4');
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
            category: 'Plants',
            rating: parseFloat(p.average_rating || '0'),
            reviewCount: p.rating_count || 0
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch plants:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlants();
  }, []);

  if (loading) return null; // Or a skeleton

  return (
    <section className="py-24 bg-[#05150a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-green-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Green Sanctuary</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white antialiased">
              Live Plants
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-0"
          >
            <Link 
              href="/shop?category=plants"
              className="group flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
            >
              <span className="font-medium">View all plants</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
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
    </section>
  );
}
