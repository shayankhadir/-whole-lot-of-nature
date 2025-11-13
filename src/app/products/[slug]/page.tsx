'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WooCommerceService, WooCommerceProduct } from '@/lib/services/woocommerceService';
import FeatureCard from '@/components/content/FeatureCard';
import StatisticsCard from '@/components/content/StatisticsCard';
import { CTASection } from '@/components/content/CTAButton';
import SectionHeader from '@/components/content/SectionHeader';

// Format price to INR with proper currency symbol
function formatPrice(priceStr: string): string {
  const price = parseFloat(priceStr || '0');
  // Assuming prices from WordPress are in INR (₹)
  return `₹${price.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<WooCommerceProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<WooCommerceProduct[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const prod = await WooCommerceService.getProductBySlug(slug);
      setProduct(prod);

      if (prod) {
        const related = await WooCommerceService.getRelatedProducts(prod.id, 4);
        setRelatedProducts(related);

        const reviewsData = await WooCommerceService.getProductReviews(prod.id);
        setReviews(reviewsData);
      }
      setLoading(false);
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-black mb-2 antialiased">🌱 Loading Product...</p>
          <p className="text-gray-700">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-black mb-4 antialiased">Product Not Found</p>
          <a href="/shop" className="px-6 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#2E7D32]">
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section with Product Details */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            {product.images.length > 0 && (
              <>
                <div className="relative h-96 md:h-full rounded-lg overflow-hidden border-2 border-black">
                  <Image
                    src={product.images[selectedImage]?.src || '/placeholder.png'}
                    alt={product.images[selectedImage]?.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative h-20 w-20 rounded border-2 transition ${
                          selectedImage === idx ? 'border-[#2E7D32]' : 'border-gray-300'
                        }`}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Title & Category */}
            <div>
              <div className="mb-3 flex gap-2 flex-wrap">
                {product.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-block px-3 py-1 bg-[#2E7D32] text-[#2E7D32] rounded-full text-sm font-semibold"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 antialiased">{product.name}</h1>
              
              {/* Rating */}
              {product.average_rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < Math.round(product.average_rating || 0) ? '⭐' : '☆'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-700">
                    {product.average_rating?.toFixed(1)} ({product.rating_count} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-[#2E7D32] border-4 border-[#2E7D32] rounded-lg p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-white antialiased">
                  {formatPrice(product.price)}
                </span>
                {product.sale_price && product.regular_price && (
                  <>
                    <span className="text-xl line-through text-white/70 antialiased">
                      {formatPrice(product.regular_price)}
                    </span>
                    <span className="text-lg font-bold text-yellow-300 antialiased">
                      -
                      {Math.round(
                        ((parseFloat(product.regular_price) - parseFloat(product.sale_price)) /
                          parseFloat(product.regular_price)) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
              <p className={`font-semibold ${product.in_stock ? 'text-white' : 'text-yellow-300'}`}>
                {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-black mb-2 antialiased">About This Product</h3>
              <div className="text-gray-700 prose prose-sm max-w-none">
                {product.short_description && (
                  <p dangerouslySetInnerHTML={{ __html: product.short_description }} />
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border-2 border-black rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 font-bold hover:bg-gray-100 antialiased"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center font-bold border-x-2 border-black antialiased"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 font-bold hover:bg-gray-100 antialiased"
                >
                  +
                </button>
              </div>
              <button
                disabled={!product.in_stock}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
                  product.in_stock
                    ? 'bg-[#2E7D32] hover:bg-[#2E7D32]'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                🛒 Add to Cart ({quantity})
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-black">
              <div className="text-center">
                <p className="text-2xl mb-1 antialiased">✓</p>
                <p className="text-sm font-semibold text-black">100% Organic</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1 antialiased">🚚</p>
                <p className="text-sm font-semibold text-black">Fast Delivery</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1 antialiased">💚</p>
                <p className="text-sm font-semibold text-black">Eco-Friendly</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <SectionHeader as="h2" title="Product Details" align="center" />
            <div className="mt-8 prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionHeader as="h2" title={`Customer Reviews (${reviews.length})`} align="center" />
            <div className="mt-8 space-y-6">
              {reviews.map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border-2 border-black rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-black antialiased">{review.author}</h3>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < review.rating ? '⭐' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                    {review.verified && ' • ✓ Verified Purchase'}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <SectionHeader as="h2" title="Related Products" subtitle="You might also like" align="center" />
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-2 border-black rounded-lg p-4 hover:shadow-lg transition"
                >
                  {relProd.images[0] && (
                    <div className="relative h-40 mb-4 rounded overflow-hidden">
                      <Image
                        src={relProd.images[0].src}
                        alt={relProd.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-black mb-2 line-clamp-2 antialiased">{relProd.name}</h3>
                  <p className="text-[#2E7D32] font-bold antialiased">{formatPrice(relProd.price)}</p>
                  <a
                    href={`/products/${relProd.slug}`}
                    className="mt-3 block w-full text-center py-2 bg-[#2E7D32] text-white rounded font-semibold hover:bg-[#2E7D32]"
                  >
                    View Product
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <CTASection
            title="Explore More Organic Seeds"
            description="Discover our complete collection of 500+ plant varieties"
            primaryButton={{
              text: 'Browse All Products',
              href: '/shop'
            }}
            variant="centered"
            backgroundVariant="green"
          />
        </div>
      </div>
    </div>
  );
}
