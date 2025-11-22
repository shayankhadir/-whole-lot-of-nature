'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import AddToCartButton from '@/components/shop/AddToCartButton';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { getDisplayPrice, getOriginalPrice } from '@/lib/utils/pricing';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShieldCheckIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Lens } from '@/components/ui/lens';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        const result = await res.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const currentProduct = result.data[0];
          setProduct(currentProduct);
          setActiveImageIndex(0);

          // Fetch related products (simulated via category or cross-sells)
          if (currentProduct.cross_sell_ids && currentProduct.cross_sell_ids.length > 0) {
             // In a real app, we'd fetch these by ID. For now, we might need a new API endpoint or just fetch all and filter (inefficient but works for small catalog)
             // Or just fetch category products
             const catId = currentProduct.categories[0]?.id;
             if (catId) {
               const relatedRes = await fetch(`/api/products?category=${catId}&per_page=4`);
               const relatedResult = await relatedRes.json();
               if (relatedResult.success) {
                 setRelatedProducts(relatedResult.data.filter((p: Product) => p.id !== currentProduct.id));
               }
             }
          } else {
             // Fallback to category
             const catId = currentProduct.categories[0]?.id;
             if (catId) {
               const relatedRes = await fetch(`/api/products?category=${catId}&per_page=4`);
               const relatedResult = await relatedRes.json();
               if (relatedResult.success) {
                 setRelatedProducts(relatedResult.data.filter((p: Product) => p.id !== currentProduct.id));
               }
             }
          }

        } else {
          router.push('/shop');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/shop');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
          <p className="mt-4 text-white/85">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productImages = product.images.length > 0
    ? product.images
    : [{ id: -1, src: '/images/placeholder.jpg', alt: product.name }];
  const activeImage = productImages[activeImageIndex] || productImages[0];
  const totalImages = productImages.length;
  const handlePrevImage = () => {
    if (totalImages < 2) return;
    setActiveImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };
  const handleNextImage = () => {
    if (totalImages < 2) return;
    setActiveImageIndex((prev) => (prev + 1) % totalImages);
  };
  const displayPrice = getDisplayPrice(product);
  const originalPrice = getOriginalPrice(product);

  return (
    <div className="min-h-screen bg-[#030a06] relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Subtle leaf background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <Image
          src="/images/backgrounds/bgleaf1.png"
          alt="Tropical foliage backdrop"
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-7xl mx-auto"
        >
          {/* Product Images - Left Side (Larger) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
              <Lens lensSize={300} zoomFactor={1.5} className="absolute inset-0 w-full h-full">
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </Lens>
              
              {/* Image Navigation Overlay */}
              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-md p-4 text-white hover:bg-black/40 transition-all border border-white/10"
                    aria-label="Previous product image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-md p-4 text-white hover:bg-black/40 transition-all border border-white/10"
                    aria-label="Next product image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                {productImages.map((_, idx) => (
                  <button
                    key={`indicator-${idx}`}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {totalImages > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {productImages.map((img, idx) => (
                  <button
                    type="button"
                    key={img.id ?? idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                      idx === activeImageIndex
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 opacity-100 scale-105'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt || `${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Right Side (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {product.categories.map(cat => (
                    <span key={cat.id} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide uppercase border border-emerald-500/20">
                      {cat.name}
                    </span>
                  ))}
                  {product.stock_quantity && product.stock_quantity < 5 && (
                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold tracking-wide uppercase border border-red-500/20 animate-pulse">
                      Only {product.stock_quantity} left
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 antialiased leading-tight">{product.name}</h1>
                
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-white antialiased">{displayPrice}</span>
                    {originalPrice && (
                      <span className="text-xl text-white/40 line-through antialiased">{originalPrice}</span>
                    )}
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5" />
                      ))}
                    </div>
                    <span className="text-white/60 text-sm font-medium">(4.8)</span>
                  </div>
                </div>

                {/* Short Description */}
                <div 
                  className="prose prose-invert prose-lg text-white/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.short_description || product.description }}
                />
              </div>

              <div className="space-y-6 pt-6">
                <AddToCartButton product={product} />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <ShieldCheckIcon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs font-medium text-white/80 block">Quality<br/>Guaranteed</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <TruckIcon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs font-medium text-white/80 block">Secure<br/>Shipping</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <ArrowPathIcon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs font-medium text-white/80 block">Easy<br/>Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Combos / Frequently Bought Together */}
            {relatedProducts.length > 0 && (
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 antialiased">Frequently Bought Together</h3>
                <div className="space-y-4">
                  {relatedProducts.slice(0, 2).map(related => (
                    <div key={related.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10 hover:border-[#2E7D32]/50 transition-colors cursor-pointer backdrop-blur-md" onClick={() => router.push(`/shop/${related.slug}`)}>
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-black/20 backdrop-blur-md">
                        <Image 
                          src={related.images[0]?.src || '/images/placeholder.jpg'} 
                          alt={related.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">{related.name}</h4>
                        <p className="text-xs text-white">{getDisplayPrice(related)}</p>
                      </div>
                      <button className="p-2 rounded-full bg-[#2E7D32]/20 text-white hover:bg-[#2E7D32] hover:text-white transition-colors backdrop-blur-md">
                        <span className="sr-only">View</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Detailed Description & Reviews Tabs */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 antialiased">Product Details</h3>
                <div 
                  className="prose prose-invert max-w-none prose-p:text-[#66BB6A] prose-li:text-[#66BB6A]"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Reviews Section (Mocked for now) */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 antialiased">Customer Reviews</h3>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b border-white/5 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-xs font-bold text-white antialiased">
                            {i === 1 ? 'JD' : 'AS'}
                          </div>
                          <span className="text-sm font-medium text-white">{i === 1 ? 'John Doe' : 'Alice Smith'}</span>
                        </div>
                        <span className="text-xs text-white/40">2 days ago</span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, star) => (
                          <StarIcon key={star} className="h-4 w-4" />
                        ))}
                      </div>
                      <p className="text-sm text-white/70">
                        {i === 1 ? "Absolutely love this plant! Arrived in perfect condition and looks great in my living room." : "Great quality soil mix. My plants are thriving."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar / Similar Products */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white antialiased">You May Also Like</h3>
              <div className="grid grid-cols-1 gap-4">
                {relatedProducts.slice(2, 6).map(related => (
                  <div key={related.id} className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#2E7D32] transition-all cursor-pointer backdrop-blur-md" onClick={() => router.push(`/shop/${related.slug}`)}>
                    <Image
                      src={related.images[0]?.src || '/images/placeholder.jpg'}
                      alt={related.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-medium truncate">{related.name}</h4>
                      <p className="text-[#4ADE80] text-sm">{getDisplayPrice(related)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
