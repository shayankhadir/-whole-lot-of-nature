'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import AddToCartButton from '@/components/shop/AddToCartButton';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { getDisplayPrice, getOriginalPrice } from '@/lib/utils/pricing';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShieldCheckIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChevronLeft, ChevronRight, Droplets, Leaf, PackageOpen, Recycle, Ruler, ShieldCheck, Sparkles, Sun, Wind } from 'lucide-react';
import { Lens } from '@/components/ui/lens';
import { cleanProductDescription } from '@/lib/utils';
import ProductRecommendations from '@/components/shop/ProductRecommendations';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CategoryHint {
  title: string;
  description: string;
  icon: ReactNode;
}

const getAttributeValue = (attributes: Product['attributes'], keys: string[]) => {
  const match = attributes.find((attr) =>
    keys.some((key) => attr.name.toLowerCase().includes(key))
  );
  return match?.options?.join(', ');
};

const getCategoryHints = (product: Product): CategoryHint[] => {
  const categoryText = product.categories
    .map((cat) => `${cat.name} ${cat.slug}`)
    .join(' ')
    .toLowerCase();

  const hints: CategoryHint[] = [];

  if (categoryText.includes('succulent') || categoryText.includes('cacti') || categoryText.includes('cactus')) {
    hints.push({
      title: 'Low-water friendly',
      description: 'Ideal for easy-care corners and minimal watering routines.',
      icon: <Droplets className="h-5 w-5 text-emerald-300" />,
    });
  }

  if (categoryText.includes('indoor') || categoryText.includes('home') || categoryText.includes('office')) {
    hints.push({
      title: 'Indoor-ready',
      description: 'Balanced for bright, indirect light and indoor air flow.',
      icon: <Wind className="h-5 w-5 text-emerald-300" />,
    });
  }

  if (categoryText.includes('outdoor') || categoryText.includes('garden') || categoryText.includes('balcony')) {
    hints.push({
      title: 'Outdoor friendly',
      description: 'Prepared for balcony and garden placement with sturdy growth.',
      icon: <Sun className="h-5 w-5 text-emerald-300" />,
    });
  }

  if (categoryText.includes('soil') || categoryText.includes('fertilizer') || categoryText.includes('manure')) {
    hints.push({
      title: 'Usage guidance',
      description: 'Works best with regular top-ups and light watering cycles.',
      icon: <PackageOpen className="h-5 w-5 text-emerald-300" />,
    });
  }

  if (categoryText.includes('pot') || categoryText.includes('planter') || categoryText.includes('decor')) {
    hints.push({
      title: 'Sizing tips',
      description: 'Match with plant root size for best drainage and stability.',
      icon: <Ruler className="h-5 w-5 text-emerald-300" />,
    });
  }

  const light = getAttributeValue(product.attributes, ['light']);
  const water = getAttributeValue(product.attributes, ['water', 'watering']);
  const size = getAttributeValue(product.attributes, ['size', 'height', 'width']);

  if (light) {
    hints.unshift({
      title: 'Light preference',
      description: light,
      icon: <Sun className="h-5 w-5 text-emerald-300" />,
    });
  }

  if (water) {
    hints.unshift({
      title: 'Watering',
      description: water,
      icon: <Droplets className="h-5 w-5 text-emerald-300" />,
    });
  }

  if (size) {
    hints.unshift({
      title: 'Dimensions',
      description: size,
      icon: <Ruler className="h-5 w-5 text-emerald-300" />,
    });
  }

  return hints.slice(0, 4);
};

const FREE_SHIPPING_THRESHOLD = 999;

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;


export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        const result = await res.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const currentProduct = result.data[0];
          setProduct(currentProduct);
          setActiveImageIndex(0);

          // Fetch related products using the dedicated API endpoint
          try {
            const relatedRes = await fetch(`/api/products?related_to=${currentProduct.id}&per_page=6`);
            const relatedResult = await relatedRes.json();
            if (relatedResult.success && relatedResult.data) {
              setRelatedProducts(relatedResult.data);
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            // Fallback: try to fetch by category
            const catId = currentProduct.categories[0]?.id;
            if (catId) {
              const fallbackRes = await fetch(`/api/products?category=${catId}&per_page=6&exclude=${currentProduct.id}`);
              const fallbackResult = await fallbackRes.json();
              if (fallbackResult.success) {
                setRelatedProducts(fallbackResult.data);
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
  const categoryHints = getCategoryHints(product);
  const lightPref = getAttributeValue(product.attributes, ['light']) || 'Bright, indirect light preferred.';
  const watering = getAttributeValue(product.attributes, ['water', 'watering']) || 'Water when the top layer feels dry.';
  const sizing = getAttributeValue(product.attributes, ['size', 'height', 'width']) || 'Refer to specifications for exact dimensions.';
  const soil = getAttributeValue(product.attributes, ['soil', 'potting', 'mix']) || 'Use airy, well-draining soil with organic nutrients.';
  const categorySummary = product.categories.map((cat) => cat.name).slice(0, 3).join(', ') || 'Indoor & outdoor friendly.';

  const knowledgeCards = [
    {
      title: 'Light Profile',
      value: lightPref,
      icon: <Sun className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Water Rhythm',
      value: watering,
      icon: <Droplets className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Sizing & Growth',
      value: sizing,
      icon: <Ruler className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Soil & Nutrition',
      value: soil,
      icon: <Leaf className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Best For',
      value: categorySummary,
      icon: <Sparkles className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Eco Promise',
      value: 'Plastic-free packing and soil-safe inputs where possible.',
      icon: <Recycle className="h-5 w-5 text-emerald-300" />,
    },
  ];

  const careTimeline = [
    {
      title: 'Unbox & Inspect',
      description: 'Open within 24 hours, mist foliage, and let roots breathe.',
      icon: <PackageOpen className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Place Smartly',
      description: 'Set in the recommended light zone and avoid harsh midday sun.',
      icon: <Sun className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Hydrate Gently',
      description: 'Use room-temperature water and allow excess to drain.',
      icon: <Droplets className="h-5 w-5 text-emerald-300" />,
    },
    {
      title: 'Protect & Thrive',
      description: 'Rotate weekly and trim brown leaves to promote fresh growth.',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-300" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030a06] relative overflow-hidden">
      {/* SEO Structured Data */}
      <ProductJsonLd
        name={product.name}
        description={product.short_description || product.description}
        sku={product.sku || String(product.id)}
        images={product.images}
        price={parseFloat(product.price) || 0}
        regularPrice={product.regular_price ? parseFloat(product.regular_price) : undefined}
        availability={product.in_stock ? 'InStock' : 'OutOfStock'}
        slug={product.slug}
        category={product.categories?.[0]?.name}
        aggregateRating={product.average_rating && parseFloat(String(product.average_rating)) > 0 ? {
          ratingValue: parseFloat(String(product.average_rating)),
          reviewCount: product.rating_count || 1
        } : undefined}
      />
      
      <AnimatedBackground />
      
      {/* Subtle leaf background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <Image
          src="/images/backgrounds/bgleaf1.webp"
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
                    aria-label={`View image ${idx + 1}`}
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
              {/* Badges & Category */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {product.categories.map(cat => (
                    <span key={cat.id} className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold tracking-widest uppercase border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors">
                      {cat.name}
                    </span>
                  ))}
                  {product.in_stock && (
                    <span className="px-3 py-1.5 rounded-full bg-green-500/15 text-green-300 text-xs font-bold tracking-widest uppercase border border-green-500/30">
                      In Stock
                    </span>
                  )}
                  {!product.in_stock && (
                    <span className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 text-xs font-bold tracking-widest uppercase border border-red-500/30 animate-pulse">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Product Title */}
              <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-black text-white antialiased leading-tight tracking-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price & Rating Section */}
              <div className="bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-emerald-300 antialiased">
                    {displayPrice}
                  </span>
                  {originalPrice && (
                    <span className="text-2xl text-white/35 line-through antialiased font-semibold">
                      {originalPrice}
                    </span>
                  )}
                  {originalPrice && (
                    <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-sm font-bold border border-red-500/30">
                      Save {Math.round(((parseFloat(product.regular_price || '0') - parseFloat(product.price || '0')) / parseFloat(product.regular_price || '1')) * 100)}%
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <TruckIcon className="h-4 w-4" />
                  Free shipping on orders {formatCurrency(FREE_SHIPPING_THRESHOLD)}+
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white/85 font-semibold">4.8/5</span>
                  <span className="text-white/50 text-sm">({product.rating_count || 0} reviews)</span>
                </div>
              </div>

              {/* Short Description */}
              <div 
                className="text-lg text-white/90 leading-relaxed font-light space-y-3"
                dangerouslySetInnerHTML={{ __html: cleanProductDescription(product.short_description || product.description) }}
              />

              {/* Quick Facts (category-aware) */}
              {categoryHints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categoryHints.map((hint) => (
                    <div
                      key={hint.title}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3"
                    >
                      <div className="mt-0.5">{hint.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-white">{hint.title}</p>
                        <p className="text-xs text-white/70 leading-relaxed">{hint.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-6 pt-8 border-t border-white/10">
                {/* Add to Cart Button */}
                <AddToCartButton product={product} />
                
                {/* Trust Signals */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-center">
                    <ShieldCheckIcon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-white/90 block leading-snug">100% Quality<br/>Guaranteed</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-center">
                    <TruckIcon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-white/90 block leading-snug">Free Shipping<br/>₹{FREE_SHIPPING_THRESHOLD}+</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-center">
                    <ArrowPathIcon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-white/90 block leading-snug">30-Day<br/>Easy Returns</span>
                  </div>
                </div>

                {/* Product Features */}
                {product.attributes && product.attributes.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Specifications</h4>
                    <div className="space-y-3">
                      {product.attributes.slice(0, 4).map((attr, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-4">
                          <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">{attr.name}</span>
                          <span className="text-sm text-white/90 font-medium text-right">{attr.options.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                  dangerouslySetInnerHTML={{ __html: cleanProductDescription(product.description) }}
                />
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-md space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 antialiased">Knowledge Infographics</h3>
                  <p className="text-sm text-white/70">Fast insights crafted by horticulture notes and category data.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {knowledgeCards.map((card) => (
                    <div key={card.title} className="rounded-xl border border-white/10 bg-[#0d1f0f]/60 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
                          {card.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-white">{card.title}</h4>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {careTimeline.map((step) => (
                    <div key={step.title} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {step.icon}
                        <p className="text-xs font-semibold text-white uppercase tracking-wide">{step.title}</p>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white antialiased">Customer Reviews</h3>
                  {session ? (
                    <button 
                      onClick={() => setShowReviewModal(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Write a Review
                    </button>
                  ) : (
                    <Link 
                      href={`/auth/signin?callbackUrl=/shop/${slug}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Sign in to Review
                    </Link>
                  )}
                </div>
                <div className="space-y-6">
                  {[
                    { name: 'Rahul Sharma', initials: 'RS', text: "Absolutely love this plant! Arrived in perfect condition and looks great in my living room.", date: "2 days ago" },
                    { name: 'Priya Patel', initials: 'PP', text: "Great quality soil mix. My plants are thriving.", date: "1 week ago" },
                    { name: 'Amit Kumar', initials: 'AK', text: "Fast delivery and excellent packaging. Will order again.", date: "2 weeks ago" }
                  ].map((review, i) => (
                    <div key={i} className="border-b border-white/5 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-xs font-bold text-white antialiased">
                            {review.initials}
                          </div>
                          <span className="text-sm font-medium text-white">{review.name}</span>
                        </div>
                        <span className="text-xs text-white/40">{review.date}</span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, star) => (
                          <StarIcon key={star} className="h-4 w-4" />
                        ))}
                      </div>
                      <p className="text-sm text-white/90">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section for SEO */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 antialiased">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    {
                      question: `How do I care for ${product.name}?`,
                      answer: "Water when the top inch of soil feels dry. Place in bright, indirect light for best results. Avoid direct sunlight which can burn the leaves. Fertilize monthly during the growing season."
                    },
                    {
                      question: "What is the delivery time?",
                      answer: `We deliver within 3-5 business days across India. Express delivery (1-2 days) is available for Bangalore metro area. Free shipping applies on orders above ${formatCurrency(FREE_SHIPPING_THRESHOLD)}.`
                    },
                    {
                      question: "Do you offer a guarantee on plants?",
                      answer: "Yes! We offer a 7-day health guarantee on all live plants. If your plant arrives damaged or shows signs of stress within 7 days, we'll replace it free of charge."
                    },
                    {
                      question: "Is this product pet-safe?",
                      answer: "Please check the product description for pet safety information. Some plants may be toxic to pets if ingested. We recommend keeping plants out of reach of curious pets and children."
                    }
                  ].map((faq, index) => (
                    <details key={index} className="group bg-white/5 rounded-xl border border-white/10">
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-white font-medium hover:bg-white/5 rounded-xl transition-colors">
                        <span className="pr-4">{faq.question}</span>
                        <svg className="w-5 h-5 text-emerald-400 transform transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <p className="px-4 pb-4 text-white/80 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
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

        {/* AI-Powered Recommendations */}
        <ProductRecommendations 
          currentProductId={String(product.id)}
          title="Perfect For You"
          subtitle="Personalized picks based on your browsing"
        />

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0d1f0f] border border-emerald-500/30 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
              <p className="text-emerald-200/70 text-sm mb-4">
                Share your experience with {product.name}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        className="text-yellow-400 hover:scale-110 transition-transform"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        title={`${star} star${star > 1 ? 's' : ''}`}
                      >
                        <StarIcon className="h-8 w-8" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Your Review</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50"
                    placeholder="Tell us what you think about this product..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Submit Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
