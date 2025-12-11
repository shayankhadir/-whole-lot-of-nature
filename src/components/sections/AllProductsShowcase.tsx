'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoCatalog';
import { getDisplayPrice, getOriginalPrice, isOnSale } from '@/lib/utils/pricing';
import { useCartStore } from '@/stores/cartStore';

const FALLBACK_PRODUCTS = DEMO_PRODUCTS;

export default function AllProductsShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch('/api/products?limit=12')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          setProducts(data.data);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#0d3512]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#12501a]/40 rounded-2xl mb-4 backdrop-blur-md" />
                <div className="h-4 bg-[#12501a]/40 rounded mb-2 backdrop-blur-md" />
                <div className="h-3 bg-[#12501a]/40 rounded w-2/3 backdrop-blur-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-[#0d3512]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/bgleaf1.webp"
          alt="Tropical palm leaves background"
          fill
          className="object-cover opacity-15"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010a05]/92 via-[#041107]/90 to-[#010a05]/94" />
      </div>

      {/* Leaf Background Decorations */}
      <div className="absolute top-10 left-0 w-64 h-64 text-[var(--emerald-700)]/5 pointer-events-none z-0">
        <ShoppingCart className="w-full h-full rotate-12" strokeWidth={0.3} />
      </div>
      <div className="absolute bottom-20 right-0 w-80 h-80 text-[var(--emerald-500)]/5 pointer-events-none z-0">
        <Eye className="w-full h-full -rotate-12" strokeWidth={0.3} />
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/80 via-[#020f07]/70 to-[#010904]/85 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto rounded-[32px] border border-white/8 bg-white/5/20 backdrop-blur-[2px] px-4 sm:px-6 md:px-8 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-[var(--emerald-700)]/20 border border-[var(--emerald-700)]/30 rounded-full text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-md antialiased"
          >
            Our Collection
          </motion.span>
          
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-cream-50 mb-3 antialiased">
            All <span className="text-emerald-400">Products</span>
          </h2>
          
          <p className="text-base max-w-xl mx-auto antialiased" style={{ color: '#86efac' }}>
            Browse our complete selection of premium plants and gardening essentials
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link href={`/shop/${product.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative rounded-2xl bg-[#0a1f10] overflow-hidden border border-[#1b5e20] hover:border-[#4CAF50] transition-all duration-300 hover:shadow-xl hover:shadow-[#2E7D32]/10"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0d3512]">
                        <span className="text-[#66BB6A]/30">No Image</span>
                      </div>
                    )}
                    
                    {/* Darker Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f10]/90 via-transparent to-transparent opacity-60"></div>

                    {/* Badge */}
                    {isOnSale(product) && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#2E7D32] text-white text-xs font-semibold rounded-full shadow-lg">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-[clamp(0.95rem,2vw,1.05rem)] leading-[1.25] font-semibold font-sans text-[#efebe9] mb-2 line-clamp-2 group-hover:text-[#4CAF50] transition-colors antialiased">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-col">
                        {getOriginalPrice(product) && (
                          <span className="text-xs text-[#a1887f] line-through antialiased">
                            {getOriginalPrice(product)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-[#4CAF50] antialiased">
                          {getDisplayPrice(product)}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addItem({
                            id: String(product.id),
                            name: product.name,
                            price: Number(product.price || 0),
                            originalPrice: product.regular_price ? Number(product.regular_price) : undefined,
                            image: product.images?.[0]?.src || '',
                            type: 'product',
                            inStock: product.in_stock ?? true,
                          });
                        }}
                        className="p-2.5 bg-gradient-to-r from-[#14532d] to-[#0f3c24] text-white rounded-full hover:brightness-110 transition-all shadow-lg shadow-[#0f3c24]/35 border border-emerald-900/50"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 bg-gradient-to-r from-[#14532d] to-[#0f3c24] text-white font-bold text-lg rounded-full shadow-[var(--shadow-card)] transition-all antialiased border border-emerald-900/50 hover:brightness-110"
            >
              <span className="flex items-center gap-3">
                View All Products
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
