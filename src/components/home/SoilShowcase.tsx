'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sprout, ShoppingBag, Star } from 'lucide-react';
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

export default function SoilShowcase() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent, product: FeaturedProduct) => {
    e.preventDefault();
    addItem({
      id: String(product.id),
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1,
      type: 'product',
      inStock: true
    });
    openCart();
  };

  useEffect(() => {
    async function fetchSoil() {
      try {
        // Fetch products from 'soil-and-growing-media' category
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
    <section className="py-24 bg-[#0d3512] relative overflow-hidden">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E7D32]/20 text-[#81c784] text-xs font-bold uppercase tracking-wider mb-6">
                <Sprout className="w-4 h-4" />
                <span>Premium Growing Media</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-[#efebe9] mb-6 antialiased leading-tight">
                The Foundation of <span className="text-[#4CAF50]">Growth</span>
              </h2>
              
              <p className="text-[#d7ccc8]/80 text-lg mb-8 leading-relaxed">
                Give your plants the best start with our handcrafted, nutrient-rich soil mixes and organic amendments.
              </p>
              
              <Link 
                href="/shop?category=soil-and-growing-media"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2E7D32] hover:bg-[#1b5e20] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#2E7D32]/30 hover:shadow-[#2E7D32]/50 hover:-translate-y-1"
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
                  <Link href={`/products/${product.slug}`} className="group block h-full">
                    <div className="relative h-full bg-[#0a1f10] rounded-2xl overflow-hidden border border-[#1b5e20] transition-all duration-300 hover:border-[#4CAF50] hover:shadow-xl hover:shadow-[#2E7D32]/10 hover:-translate-y-2">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/80 to-transparent opacity-60" />
                        
                        {/* Quick Add Button */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="absolute bottom-4 right-4 p-3 bg-[#2E7D32] text-white rounded-full opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#1b5e20] shadow-lg"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold text-[#efebe9] line-clamp-2 group-hover:text-[#4CAF50] transition-colors">
                            {product.name}
                          </h3>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex text-[#FFD700]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.round(product.rating || 0)
                                    ? 'fill-current'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#a1887f]">({product.reviewCount})</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            {product.sale_price && (
                              <span className="text-sm text-[#a1887f] line-through">
                                ₹{product.regular_price}
                              </span>
                            )}
                            <span className="text-xl font-bold text-[#4CAF50]">
                              ₹{product.price}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[#8d6e63] bg-[#3e2723]/30 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
