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
    // Fetch soil & growing media products
    fetch('/api/products?category=soil-growing-media&limit=4')
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
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#2E7D32]/20 border border-[#2E7D32]/30 rounded-full px-4 py-2 mb-4">
            <Leaf className="w-4 h-4 text-[#66BB6A]" />
            <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-[#66BB6A] font-semibold uppercase tracking-wider antialiased">
              Featured Products
            </span>
          </div>
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-[#66BB6A] mb-4 antialiased">
            Premium Soil & Mixes
          </h2>
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-white/70 max-w-2xl mx-auto antialiased">
            Organic, nutrient-rich soil blends crafted for optimal plant growth
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2E7D32] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                  <div className="relative bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-2xl overflow-hidden border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#2E7D32]/20 h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <Image
                        src={product.image || product.images?.[0]?.src || defaultProducts[index].image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F] via-transparent to-transparent opacity-60"></div>
                      
                      {/* Featured Badge */}
                      <div className="absolute top-3 left-3 bg-[#2E7D32] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-montserrat text-[clamp(1rem,2.5vw,1.25rem)] font-bold text-white mb-2 group-hover:text-[#66BB6A] transition-colors duration-300 antialiased">
                        {product.name}
                      </h3>
                      <p className="text-[clamp(0.875rem,1.5vw,0.9375rem)] text-white/60 mb-4 line-clamp-2 antialiased">
                        {product.description || defaultProducts[index].description}
                      </p>

                      {/* Features */}
                      {(product.features || defaultProducts[index].features) && (
                        <div className="space-y-1.5 mb-4 flex-1">
                          {(product.features || defaultProducts[index].features).slice(0, 3).map((feature: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#66BB6A] flex-shrink-0" />
                              <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-white/70 antialiased">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#2E7D32]/20">
                        <div>
                          <span className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#66BB6A] antialiased">
                            {formatPrice(product.sale_price || product.price || defaultProducts[index].price)}
                          </span>
                          {product.sale_price && product.regular_price && (
                            <span className="block text-sm text-white/60 line-through">
                              {formatPrice(product.regular_price)}
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
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop?category=soil-mixes-and-amendments"
            className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#66BB6A] text-white font-semibold text-[clamp(0.9375rem,2vw,1.125rem)] px-8 py-4 rounded-lg transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-[#2E7D32]/30"
          >
            View All Soil Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
