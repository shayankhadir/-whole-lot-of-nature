'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, ArrowRight, CheckCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils/pricing';

export default function FeaturedSoilMixes() {
  const [soilProducts, setSoilProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch soil products - strictly filtering for 'soil' category
    fetch('/api/products?category=soil&limit=4')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSoilProducts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch soil products:', err);
        setLoading(false);
      });
  }, []);

  // Default fallback data if API fails
  const defaultProducts = [
    {
      id: 1,
      name: 'Premium Potting Mix',
      description: 'Perfect blend for indoor plants',
      price: 299,
      image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
      slug: 'premium-potting-mix',
      features: ['Rich in nutrients', 'Well-draining', 'pH balanced'],
    },
    {
      id: 2,
      name: 'Organic Compost',
      description: 'Nutrient-rich soil amendment',
      price: 199,
      image: 'https://images.unsplash.com/photo-1585571142672-bb022f70a6ac?auto=format&fit=crop&w=800&q=80',
      slug: 'organic-compost',
      features: ['100% organic', 'Enriches soil', 'Eco-friendly'],
    },
    {
      id: 3,
      name: 'Cactus & Succulent Mix',
      description: 'Specially formulated for succulents',
      price: 249,
      image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=800&q=80',
      slug: 'cactus-succulent-mix',
      features: ['Fast-draining', 'Prevents rot', 'Desert blend'],
    },
    {
      id: 4,
      name: 'Vermicompost',
      description: 'Premium worm castings',
      price: 349,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
      slug: 'vermicompost',
      features: ['Super fertilizer', 'Natural growth booster', 'Microbial rich'],
    },
  ];

  const displayProducts = soilProducts.length > 0 ? soilProducts : defaultProducts;

  return (
    <section className="relative py-24 overflow-hidden bg-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow mb-4">Featured Products</span>
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold text-cream-50 mb-4">
            Premium Soil & <span className="text-gold-gradient">Mixes</span>
          </h2>
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-cream-200/80 max-w-2xl mx-auto font-sans">
            Organic, nutrient-rich soil blends crafted for optimal plant growth
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.slice(0, 4).map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="group block h-full"
                >
                  <div className="relative bg-emerald-900/20 rounded-[2rem] overflow-hidden border border-emerald-800/50 hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] h-full flex flex-col backdrop-blur-sm">
                    {/* Product Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={product.image || product.images?.[0]?.src || defaultProducts[index].image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent opacity-60"></div>
                      
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 bg-gold-500/90 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-serif text-xl font-medium text-cream-50 mb-2 group-hover:text-gold-200 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-sm text-cream-200/60 mb-4 line-clamp-2 font-sans">
                        {product.description || defaultProducts[index].description}
                      </p>

                      {/* Features */}
                      {(product.features || defaultProducts[index].features) && (
                        <div className="space-y-2 mb-6 flex-1">
                          {(product.features || defaultProducts[index].features).slice(0, 3).map((feature: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                              <span className="text-xs text-cream-100/80 font-sans">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-2xl font-bold text-emerald-400 font-sans">
                            {formatPrice(product.sale_price || product.price || defaultProducts[index].price)}
                          </span>
                          {product.sale_price && product.regular_price && (
                            <span className="block text-xs text-cream-200/40 line-through font-sans">
                              {formatPrice(product.regular_price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-gold-400 text-sm font-medium group-hover:gap-2 transition-all duration-300 group-hover:text-gold-300">
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
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/shop?category=soil-mixes-and-amendments"
            className="btn-gold inline-flex items-center gap-2 group"
          >
            View All Soil Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
