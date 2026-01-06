'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, ShoppingBag } from 'lucide-react';
import { getUserBehavior, trackProductView } from '@/lib/ai/recommendations';
import { useCartStore } from '@/stores/cartStore';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  categories?: string[];
}

interface Recommendation {
  productId: string;
  product: Product;
  score: number;
  reason: string;
  type: 'similar' | 'complementary' | 'trending' | 'personalized';
}

interface ProductRecommendationsProps {
  currentProductId?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function ProductRecommendations({
  currentProductId,
  title = "Recommended For You",
  subtitle = "Based on your preferences",
  limit = 4
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const behavior = getUserBehavior();
        
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentProductId,
            behavior,
            limit
          })
        });

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [currentProductId, limit]);

  // Track view when product is viewed
  useEffect(() => {
    if (currentProductId) {
      trackProductView(currentProductId);
    }
  }, [currentProductId]);

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-gradient-to-b from-[#0a1f0e] to-[#0d1b0f]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-sm text-white/60">{subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-[#0a1f0e] to-[#0d1b0f]">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-sm text-white/60">{subtitle}</p>
            </div>
          </div>
          <Link 
            href="/shop" 
            className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/shop/${rec.product.slug}`}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
                  {/* Image */}
                  <div className="aspect-square relative bg-gradient-to-br from-emerald-900/20 to-emerald-800/10">
                    {rec.product.image ? (
                      <Image
                        src={rec.product.image}
                        alt={rec.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-emerald-500/30">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Recommendation Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.type === 'personalized' 
                          ? 'bg-purple-500/80 text-white' 
                          : rec.type === 'trending'
                          ? 'bg-orange-500/80 text-white'
                          : rec.type === 'complementary'
                          ? 'bg-blue-500/80 text-white'
                          : 'bg-emerald-500/80 text-white'
                      }`}>
                        {rec.type === 'personalized' ? '✨ For You' :
                         rec.type === 'trending' ? '🔥 Popular' :
                         rec.type === 'complementary' ? '🎯 Great Match' : 
                         '💚 Similar'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-white font-medium text-sm md:text-base line-clamp-2 mb-1">
                      {rec.product.name}
                    </h3>
                    <p className="text-white/50 text-xs mb-2 line-clamp-1">
                      {rec.reason}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">
                        ₹{rec.product.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            id: rec.productId,
                            name: rec.product.name,
                            price: rec.product.price,
                            image: rec.product.image || '',
                            inStock: true,
                            type: 'product'
                          });
                        }}
                        className="w-8 h-8 rounded-full bg-emerald-500/20 hover:bg-emerald-500 flex items-center justify-center text-emerald-400 hover:text-white transition-colors"
                        aria-label={`Add ${rec.product.name} to cart`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center md:hidden">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View All Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
