'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import AddToCartButton from '@/components/shop/AddToCartButton';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { getDisplayPrice, getOriginalPrice } from '@/lib/utils/pricing';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        const result = await res.json();
        
        if (result.success && result.data && result.data.length > 0) {
          setProduct(result.data[0]);
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

  const mainImage = product.images[0] || { src: '/images/placeholder.jpg', alt: product.name };
  const displayPrice = getDisplayPrice(product);
  const originalPrice = getOriginalPrice(product);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Animated Background Grid */}
      <AnimatedBackground />
      
      {/* Subtle leaf background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <Image
          src="https://admin.wholelotofnature.com/wp-content/uploads/2024/11/bgleaf1.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
        >
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-[#2E7D32]/20">
              <Image
                src={mainImage.src}
                alt={mainImage.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square relative rounded-lg overflow-hidden bg-white/5 border border-[#2E7D32]/20 cursor-pointer hover:border-[#2E7D32] transition-all backdrop-blur-md"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt || `${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-white/50">
              <a href="/shop" className="hover:text-[#2E7D32] transition-colors">Shop</a>
              <span className="mx-2">/</span>
              <span className="text-white/85">{product.name}</span>
            </div>

            {/* Product Name - Golden Ratio H2 (68px clamped) */}
            <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] leading-tight font-montserrat font-bold text-white antialiased">
              {product.name}
            </h1>

            {/* Category badges */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map(cat => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2E7D32]/20 text-[#66BB6A] border border-[#2E7D32]/30 backdrop-blur-md"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Price - Golden Ratio H3 (110px clamped) */}
            <div className="flex items-baseline gap-4">
              <span className="text-[clamp(2.625rem,6vw,6.875rem)] font-bold text-[#2E7D32] antialiased">
                {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-[clamp(1.625rem,3vw,2.625rem)] line-through text-white/40">
                  {originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.in_stock ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
                  <span className="text-sm text-[#66BB6A]">In Stock</span>
                  {product.stock_quantity && (
                    <span className="text-sm text-white/50">({product.stock_quantity} available)</span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-red-400">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div
                className="text-base leading-relaxed text-white/85 prose prose-invert max-w-none antialiased"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Full Description */}
            {product.description && (
              <div className="pt-6 border-t border-[#2E7D32]/20">
                <h3 className="text-[clamp(1.625rem,3vw,2.625rem)] font-montserrat font-semibold text-white mb-4">
                  Description
                </h3>
                <div
                  className="prose prose-invert max-w-none text-white/85"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="pt-6 border-t border-[#2E7D32]/20">
                <h3 className="text-[clamp(1.625rem,3vw,2.625rem)] font-montserrat font-semibold text-white mb-4">
                  Details
                </h3>
                <dl className="space-y-2">
                  {product.attributes.map(attr => (
                    <div key={attr.id} className="flex gap-4">
                      <dt className="text-sm font-semibold text-white/50 min-w-[120px]">
                        {attr.name}:
                      </dt>
                      <dd className="text-sm text-white/85">
                        {attr.options.join(', ')}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
