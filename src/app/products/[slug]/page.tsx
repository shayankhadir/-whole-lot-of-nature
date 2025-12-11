'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CTASection } from '@/components/content/CTAButton';
import SectionHeader from '@/components/content/SectionHeader';
import { ProductZoomModal } from '@/components/shop/ProductZoomModal';
import { StickyAddToCart } from '@/components/shop/StickyAddToCart';
import type { WooCommerceProduct } from '@/lib/services/woocommerceService';
import { useCartStore } from '@/stores/cartStore';
import { useDrag } from '@use-gesture/react';
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Camera, Filter, CheckCircle, Sun, Droplet, Sprout, RotateCw, Truck, ShieldCheck, PhoneCall } from 'lucide-react';

import type { Metadata } from 'next';

/*
export const metadata: Metadata = {
  title: 'Products | Whole Lot of Nature',
  description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
  openGraph: {
    title: 'Products | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/products',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/products',
  },
};
*/



interface ProductReview {
  id: number;
  author: string;
  review: string;
  rating: number;
  date: string;
  verified: boolean;
  helpful?: number;
  notHelpful?: number;
  photos?: string[];
}

type ProductDetailTab = 'details' | 'shipping' | 'care' | 'reviews';

type ReviewFilter = 'helpful' | 'recent' | 'rating-5' | 'rating-4' | 'rating-3' | 'rating-2' | 'rating-1';

interface HighlightCard {
  icon: string;
  title: string;
  description: string;
}

const PREMIUM_HIGHLIGHTS: HighlightCard[] = [
  {
    icon: '✓',
    title: 'Nursery-Grade Cultivation',
    description: 'Hand-raised by specialist horticulturists for resilient growth and lasting color.'
  },
  {
    icon: '✓',
    title: '2-Year Wellness Guarantee',
    description: 'Complimentary replacement or concierge support if your plant struggles within 24 months.'
  },
  {
    icon: '✓',
    title: 'Soil Intelligence Kit',
    description: 'Each order ships with a premium soil mix, moisture indicator, and feeding calendar.'
  },
  {
    icon: '✓',
    title: 'Cold-Chain Delivery',
    description: 'Insulated, shock-proof packing keeps every specimen safe from nursery to doorstep.'
  }
];

const SHIPPING_ASSURANCES = [
  'Same-day dispatch for metro orders placed before 4 PM',
  'Complimentary temperature-controlled packaging upgrade',
  'Live order tracking and WhatsApp concierge support',
  'Free care consultation within 48 hours of delivery'
];

const CARE_FRAMEWORK = [
  { label: 'Sunlight', value: 'Bright, indirect light for 4-6 hours daily', icon: Sun },
  { label: 'Watering', value: 'Hydrate when top 2 cm of soil feels dry', icon: Droplet },
  { label: 'Feeding', value: 'Organic tonic every 15 days during growing season', icon: Sprout },
  { label: 'Maintenance', value: 'Rotate weekly + gentle misting for glossy foliage', icon: RotateCw }
];

const stripHtml = (value?: string) =>
  value ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';

const buildSeoDescription = (product: WooCommerceProduct) => {
  const category = product.categories?.[0]?.name ?? 'premium botanical';
  const tone = stripHtml(product.short_description || product.description);
  const blurb = tone
    ? tone.slice(0, 230)
    : `${product.name} is curated by Whole Lot of Nature with ethically sourced seeds, artisanal soil mixes, and concierge-level plant care.`;

  return `${product.name} — ${category} from Whole Lot of Nature. ${blurb}`.slice(0, 300);
};

const buildStructuredData = (product: WooCommerceProduct, description: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
  const offerPrice = product.sale_price || product.price || product.regular_price || '0';

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img) => img.src) ?? [],
    description,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Organization',
      name: 'Whole Lot of Nature'
    },
    category: product.categories?.map((cat) => cat.name) ?? [],
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: offerPrice,
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  if (product.average_rating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.average_rating).toFixed(1),
      reviewCount: product.rating_count || 0
    };
  }

  return structuredData;
};

const SEO_BLURBS: Record<string, string> = {
  'organic-potting-mix':
    'Hand-blended organic potting mix tuned for Bangalore humidity—airy yet moisture-retentive with compost, coco chips, and bio-boosters. Perfect for houseplants, balcony greens, and easy repotting.',
  'succulent-potting-mix-2':
    'Fast-draining succulent and cactus mix with grit, sand, and perlite to prevent root rot in Indian climates. Ideal for haworthias, echeverias, and low-water desert plants.',
  'miniature-cactus-succulents-set-of-10':
    'Curated mini cactus and succulent set with low-water, high-light species—ready for desk or balcony trays. Packed with breathable wrap and labeled for easy care.',
  'succulent-desert-plante-4-succulents':
    'Desert-inspired succulent quartet, acclimatized for Indian sun and indoor bright light. Ships with care QR and repotting guidance.',
  'ayurvedic-hair-oil-200ml':
    'Ayurvedic hair oil crafted with cold-pressed base oils and botanicals—no mineral oil, no silicones. Small-batch steeped for scalp health and stronger strands.',
};

const buildBreadcrumbSchema = (product: WooCommerceProduct) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
  const breadcrumbs = [
    { name: 'Home', item: `${siteUrl}/` },
    { name: 'Shop', item: `${siteUrl}/shop` },
  ];

  if (product?.categories?.[0]) {
    breadcrumbs.push({
      name: product.categories[0].name,
      item: `${siteUrl}/shop?category=${product.categories[0].slug || ''}`,
    });
  }

  breadcrumbs.push({ name: product?.name || 'Product', item: `${siteUrl}/products/${product?.slug}` });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
};

const formatPrice = (priceStr: string): string => {
  const price = parseFloat(priceStr || '0');
  return `₹${price.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<WooCommerceProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<WooCommerceProduct[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<ProductDetailTab>('details');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('helpful');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // Fetch product via API instead of direct service call (Client Component)
        const res = await fetch(`/api/products?slug=${slug}`);
        const data = await res.json();
        
        if (data.success && data.data && data.data.length > 0) {
          const prod = data.data[0];
          setProduct(prod);

          if (prod) {
            // Fetch related products via API
            try {
              const relatedRes = await fetch(`/api/products?related_to=${prod.id}&limit=4`);
              const relatedData = await relatedRes.json();
              if (relatedData.success) {
                setRelatedProducts(relatedData.data);
              }
            } catch (e) {
              console.error("Failed to fetch related products", e);
            }
            
            // Mock reviews for now or fetch from API if available
            setReviews([
              {
                id: 1,
                author: "Priya S.",
                review: "Absolutely beautiful plant! Arrived in perfect condition.",
                rating: 5,
                date: "2 days ago",
                verified: true
              }
            ]);
          }
        } else {
            console.error("Product not found");
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const seoDescription = useMemo(
    () => (product ? buildSeoDescription(product) : 'Discover premium botanicals, seeds, and soil systems from Whole Lot of Nature.'),
    [product]
  );

  const structuredData = useMemo(
    () => (product ? buildStructuredData(product, seoDescription) : null),
    [product, seoDescription]
  );

  const breadcrumbSchema = useMemo(() => (product ? buildBreadcrumbSchema(product) : null), [product]);

  const attributeChips = useMemo(() => {
    if (!product?.attributes?.length) return [];
    return product.attributes
      .flatMap((attribute) => attribute.options.map((option) => `${attribute.name}: ${option}`))
      .slice(0, 6);
  }, [product]);

  const breadcrumbTrail = useMemo(() => {
    if (!product) return [] as Array<{ label: string; href: string | null }>;
    const trail: Array<{ label: string; href: string | null }> = [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' }
    ];

    if (product.categories?.[0]) {
      trail.push({ label: product.categories[0].name, href: `/shop?category=${product.categories[0].slug}` });
    }

    trail.push({ label: product.name, href: null });
    return trail;
  }, [product]);

  const addToCart = useCartStore((state) => state.addItem);

  // Touch gesture for image gallery
  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      if (!down && Math.abs(mx) > 50 && product?.images) {
        if (xDir > 0 && selectedImage > 0) {
          setSelectedImage(selectedImage - 1);
        } else if (xDir < 0 && selectedImage < product.images.length - 1) {
          setSelectedImage(selectedImage + 1);
        }
      }
    },
    { axis: 'x', filterTaps: true }
  );

  // Carousel navigation
  const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 4;
  const maxCarouselIndex = Math.max(0, relatedProducts.length - itemsPerView);

  const nextCarousel = () => {
    setCarouselIndex((prev) => Math.min(prev + 1, maxCarouselIndex));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => Math.max(prev - 1, 0));
  };

  const filteredReviews = useMemo(() => {
    if (!reviews.length) return [];
    let filtered = [...reviews];
    
    if (reviewFilter === 'helpful') {
      filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    } else if (reviewFilter === 'recent') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (reviewFilter.startsWith('rating-')) {
      const rating = parseInt(reviewFilter.split('-')[1]);
      filtered = filtered.filter((r) => r.rating === rating);
    }
    
    return filtered;
  }, [reviews, reviewFilter]);

  const handleAddToCart = (qty: number = quantity) => {
    if (!product) return;
    
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.sale_price || product.price || product.regular_price || '0'),
      originalPrice: parseFloat(product.regular_price || product.price || '0'),
      image: product.images?.[0]?.src || '/placeholder-image.jpg',
      quantity: qty,
      type: 'product',
      inStock: product.in_stock,
      maxQuantity: product.stock_quantity
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#0d3512] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
            alt="Leaf backdrop"
            fill
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/85 via-[#0d3512]/85 to-[#010904]/90" />
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
        <div className="text-center space-y-2 relative z-10">
          <p className="text-2xl font-semibold text-[#daf2d0] antialiased">Calibrating your botanical experience…</p>
          <p className="text-[#daf2d0]/60">Curating product insights and concierge perks.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#0d3512] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
            alt="Leaf backdrop"
            fill
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/85 via-[#0d3512]/85 to-[#010904]/90" />
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
        <div className="text-center space-y-6 relative z-10">
          <p className="text-3xl font-bold text-[#daf2d0] antialiased">We couldn&apos;t locate that product</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2E7D32] text-white font-semibold shadow-lg shadow-[#2E7D32]/30 hover:bg-[#1b5e20] transition"
          >
            Browse the full collection
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = product.images?.[selectedImage];
  const primaryImage = product.images?.[0];
  const effectivePrice = product.sale_price || product.price || product.regular_price;
  const displayPrice = effectivePrice ? `₹${parseFloat(effectivePrice).toLocaleString('en-IN')}` : 'Price unavailable';
  const savingsPercentage =
    product.sale_price && product.regular_price
      ? Math.round(
          ((parseFloat(product.regular_price) - parseFloat(product.sale_price)) /
            parseFloat(product.regular_price)) *
            100
        )
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d3512] text-[#daf2d0]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-12"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/85 via-[#0d3512]/85 to-[#010904]/90" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>
      <Head>
        <title>{`${product.name} | Whole Lot of Nature`}</title>
        <meta name="description" content={seoDescription} />
        {product.categories?.length || product.tags?.length ? (
          <meta
            name="keywords"
            content={[
              product.categories?.map((c) => c.name).join(', '),
              product.tags?.map((t) => t.name).join(', '),
              product.name,
              'Bangalore plants',
              'organic soil mixes',
              'aquascaping plants',
            ]
              .filter(Boolean)
              .join(', ')}
          />
        ) : null}
        <meta property="og:type" content="product" />
        {effectivePrice && <meta property="product:price:amount" content={effectivePrice} />}
        <meta property="product:price:currency" content="INR" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com'}/products/${product.slug}`}
        />
        <meta property="og:title" content={`${product.name} | Whole Lot of Nature`} />
        <meta property="og:description" content={seoDescription} />
        {primaryImage && <meta property="og:image" content={primaryImage.src} />}
        <meta name="twitter:card" content="summary_large_image" />
        {structuredData && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        )}
        {breadcrumbSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        )}
      </Head>

      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-[#daf2d0]/60 flex flex-wrap gap-2">
          {breadcrumbTrail.map((crumb, index) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#4CAF50] transition">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#daf2d0] font-semibold">{crumb.label}</span>
              )}
              {index < breadcrumbTrail.length - 1 && <span>/</span>}
            </div>
          ))}
        </nav>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-4">
            <div 
              {...bind()}
              className="relative bg-[#0a1f10] rounded-3xl overflow-hidden shadow-2xl shadow-[#0d3512]/50 border border-[#1b5e20] cursor-zoom-in group touch-pan-y"
              onClick={() => setIsZoomed(true)}
            >
              {heroImage ? (
                <>
                  <Image
                    key={heroImage.id}
                    src={heroImage.src}
                    alt={heroImage.alt || product.name}
                    width={1080}
                    height={1080}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center backdrop-blur-sm">
                    <span className="opacity-0 group-hover:opacity-100 transition bg-[#0d3512]/90 rounded-full px-4 py-2 text-sm font-semibold text-[#daf2d0] shadow-lg backdrop-blur-md border border-[#1b5e20]">
                      🔍 Click to zoom
                    </span>
                  </div>
                </>
              ) : (
                <div className="aspect-square bg-[#0a1f10]" />
              )}
              <div className="absolute top-4 left-4 flex gap-2 text-xs font-semibold">
                {product.featured && <span className="px-3 py-1 rounded-full bg-[#2E7D32] text-white backdrop-blur-md">Staff Pick</span>}
                {savingsPercentage && (
                  <span className="px-3 py-1 rounded-full bg-[#4CAF50] text-[#0d3512]">Save {savingsPercentage}%</span>
                )}
              </div>
              {/* Swipe indicator for mobile */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
                  {product.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition ${
                        selectedImage === idx ? 'bg-emerald-700' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-2xl border transition shadow-sm ${
                      selectedImage === idx
                        ? 'border-emerald-700 shadow-emerald-100'
                        : 'border-transparent hover:border-emerald-200'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image src={img.src} alt={img.alt || product.name} fill className="object-cover rounded-2xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0a1f10]/80 backdrop-blur rounded-3xl border border-[#1b5e20] shadow-xl shadow-[#0d3512]/50 p-8 space-y-7">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-[#4CAF50]">
                {product.categories.map((category) => (
                  <span key={category.id} className="px-3 py-1 rounded-full bg-[#0d3512] border border-[#1b5e20]">
                    {category.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-[#daf2d0] leading-tight antialiased">{product.name}</h1>
              {product.average_rating && (
                <div className="flex items-center gap-2 text-sm text-[#daf2d0]/70">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx}>{idx < Math.round(product.average_rating || 0) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span>
                    {Number(product.average_rating).toFixed(1)} · {product.rating_count ?? 0} reviews
                  </span>
                </div>
              )}
              {product.tags?.length ? (
                <p className="text-sm text-[#daf2d0]/60">Tagged in {product.tags.map((tag) => tag.name).join(', ')}</p>
              ) : null}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0d3512] to-[#1b5e20] border border-[#2E7D32] text-white flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-semibold antialiased">{formatPrice(effectivePrice || '0')}</span>
                {product.regular_price && product.sale_price && (
                  <span className="line-through text-white/85">{formatPrice(product.regular_price)}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-medium">
                <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  {product.in_stock ? '✓ In Stock' : 'Out of Stock'}
                </span>
                {product.stock_quantity && (
                  <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    {product.stock_quantity} units ready
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80">
                Includes concierge onboarding call, soil intelligence kit, and climate-smart packaging.
              </p>
              {product.slug && SEO_BLURBS[product.slug] && (
                <p className="text-sm text-white/80 leading-relaxed">
                  SEO note: {SEO_BLURBS[product.slug]}
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                {[{
                  title: 'Bangalore Express',
                  desc: 'Same-day dispatch on metro orders before 4 PM',
                  Icon: Truck
                }, {
                  title: 'Cold-chain wrap',
                  desc: 'Insulated, shock-proof, low-sweat packing',
                  Icon: ShieldCheck
                }, {
                  title: 'Care hotline',
                  desc: '24/7 WhatsApp support for settling in',
                  Icon: PhoneCall
                }].map((item) => (
                  <div key={item.title} className="p-3 rounded-xl bg-white/5 border border-white/10 flex gap-3 items-start">
                    <div className="mt-1 text-[#4CAF50]"><item.Icon className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="text-[11px] text-white/70 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-[#1b5e20] bg-[#0d3512] text-[#daf2d0]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-lg antialiased hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1))}
                    className="w-14 text-center font-semibold border-x border-[#1b5e20] bg-transparent focus:outline-none"
                    aria-label="Product quantity"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-lg antialiased hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!product.in_stock}
                  onClick={() => addItem({
                    id: String(product.id),
                    name: product.name,
                    price: Number(product.price || product.regular_price || 0),
                    originalPrice: product.regular_price ? Number(product.regular_price) : undefined,
                    image: product.images?.[0]?.src || '',
                    quantity: quantity,
                    type: 'product',
                    inStock: product.in_stock ?? true,
                  })}
                  className={`flex-1 inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D32] ${
                    product.in_stock
                      ? 'bg-[#2E7D32] hover:bg-[#1b5e20] shadow-[#0d3512]/50'
                      : 'bg-neutral-700 cursor-not-allowed'
                  }`}
                >
                  Add {quantity} to Cart
                </button>
              </div>
              <p className="text-sm text-[#daf2d0]/70 flex items-center gap-2">
                <span>Secure checkout • Free 30-day returns • Exclusive care concierge</span>
              </p>
            </div>

            {attributeChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attributeChips.map((chip) => (
                  <span key={chip} className="px-3 py-1 rounded-full text-xs bg-[#0d3512] border border-[#1b5e20] text-[#daf2d0]">
                    {chip}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-2 text-base text-[#daf2d0]/80 antialiased">
              <p className="leading-relaxed">
                {stripHtml(product.short_description) || stripHtml(product.description).slice(0, 260)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d3512] text-white py-12 border-t border-[#1b5e20]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PREMIUM_HIGHLIGHTS.map((highlight) => (
            <div key={highlight.title} className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur">
              <p className="text-3xl mb-3 antialiased">{highlight.icon}</p>
              <h3 className="text-lg font-semibold mb-2 antialiased">{highlight.title}</h3>
              <p className="text-sm text-white/80 leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0a1f10]">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.4fr,0.6fr]">
          <div className="space-y-6">
            <div className="flex gap-3 text-sm font-medium overflow-x-auto pb-2">
              {(['details', 'shipping', 'care', 'reviews'] as ProductDetailTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-[#4CAF50] bg-[#0d3512] text-[#4CAF50]'
                      : 'border-transparent text-[#daf2d0]/60 hover:border-[#1b5e20] hover:text-[#daf2d0]'
                  }`}
                >
                  {tab === 'details' && 'Product Story'}
                  {tab === 'shipping' && 'Shipping & Packaging'}
                  {tab === 'care' && 'Care Ritual'}
                  {tab === 'reviews' && `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-[#1b5e20] bg-[#0d3512] p-8 space-y-6">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold antialiased text-[#daf2d0]">Botanical narrative</h3>
                  <p className="leading-relaxed text-[#daf2d0]/80">
                    {stripHtml(product.description).slice(0, 900) ||
                      'Sourced from regenerative farms, each specimen is acclimatized in small-batch greenhouses, ensuring remarkable resilience in Indian climates.'}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-5 rounded-2xl bg-[#0a1f10] border border-[#1b5e20]">
                      <p className="text-sm font-medium text-[#4CAF50]">Sustainability</p>
                      <p className="text-base text-[#daf2d0] antialiased">Zero pesticide regime & reclaimed-water irrigation.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-[#0a1f10] border border-[#1b5e20]">
                      <p className="text-sm font-medium text-[#4CAF50]">Wellness boost</p>
                      <p className="text-base text-[#daf2d0] antialiased">Purifies indoor air, uplifts circadian rhythm, and eases stress hormones.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold antialiased text-[#daf2d0]">Logistics engineered for living things</h3>
                  <ul className="space-y-2 text-[#daf2d0]/80">
                    {SHIPPING_ASSURANCES.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-[#4CAF50]">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold antialiased text-[#daf2d0]">Care ritual blueprint</h3>
                  <p className="text-[#daf2d0]/80 leading-relaxed">Follow these expert guidelines to ensure your plant thrives in its new environment.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {CARE_FRAMEWORK.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.label} className="p-5 rounded-2xl bg-gradient-to-br from-[#0a1f10] to-[#0d3512] border border-[#1b5e20] flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1b5e20] flex items-center justify-center text-[#4CAF50]">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-semibold text-[#daf2d0] mb-1 antialiased">{item.label}</p>
                            <p className="text-sm text-[#daf2d0]/70 leading-relaxed">{item.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-6 rounded-2xl bg-amber-900/20 border border-amber-700/50">
                    <p className="text-sm font-semibold text-amber-500 mb-2">💡 Pro Tip</p>
                    <p className="text-sm text-amber-200/80 leading-relaxed">
                      Each plant comes with a detailed care card and access to our 24/7 plant care hotline. Our experts are here to help your green friend flourish.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-2xl font-semibold antialiased text-[#daf2d0]">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#daf2d0]/60" />
                      <select
                        value={reviewFilter}
                        onChange={(e) => setReviewFilter(e.target.value as ReviewFilter)}
                        className="px-4 py-2 rounded-full border border-[#1b5e20] text-sm bg-[#0d3512] text-[#daf2d0] focus:outline-none focus:border-[#4CAF50]"
                        aria-label="Filter reviews"
                      >
                        <option value="helpful">Most Helpful</option>
                        <option value="recent">Most Recent</option>
                        <option value="rating-5">5 Stars</option>
                        <option value="rating-4">4 Stars</option>
                        <option value="rating-3">3 Stars</option>
                        <option value="rating-2">2 Stars</option>
                        <option value="rating-1">1 Star</option>
                      </select>
                    </div>
                  </div>

                  {filteredReviews.length > 0 ? (
                    <div className="space-y-6">
                      {filteredReviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-6 rounded-2xl border border-[#1b5e20] bg-[#0a1f10] space-y-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-[#daf2d0]">{review.author}</p>
                                {review.verified && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1b5e20] text-[#4CAF50] text-xs font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#daf2d0]/60">
                                {new Date(review.date).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <span
                                  key={idx}
                                  className={`text-lg ${
                                    idx < review.rating ? 'text-amber-500' : 'text-[#1b5e20]'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>

                          <p className="text-[#daf2d0]/80 leading-relaxed">{review.review}</p>

                          {review.photos && review.photos.length > 0 && (
                            <div className="flex gap-3 flex-wrap">
                              {review.photos.map((photo, idx) => (
                                <div
                                  key={idx}
                                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#1b5e20] group cursor-pointer"
                                >
                                  <Image
                                    src={photo}
                                    alt={`Review photo ${idx + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center backdrop-blur-md">
                                    <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-3 border-t border-[#1b5e20]">
                            <p className="text-sm text-[#daf2d0]/60">Was this helpful?</p>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1b5e20] text-sm text-[#daf2d0]/70 hover:border-[#4CAF50] hover:text-[#4CAF50] transition"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{review.helpful || 0}</span>
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1b5e20] text-sm text-[#daf2d0]/70 hover:border-red-600 hover:text-red-500 transition"
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span>{review.notHelpful || 0}</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#daf2d0]/60">No reviews match your filter criteria.</p>
                    </div>
                  )}

                  {reviews.length === 0 && (
                    <div className="text-center py-12 rounded-2xl border border-[#1b5e20] bg-[#0a1f10]">
                      <p className="text-lg font-semibold text-[#daf2d0] mb-2 antialiased">No reviews yet</p>
                      <p className="text-[#daf2d0]/70">Be the first to share your experience with this product!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[#1b5e20] bg-gradient-to-b from-[#0d3512] to-[#0a1f10] p-8 space-y-6">
            <div>
              <p className="text-sm font-semibold text-[#4CAF50] uppercase tracking-wide">SEO snapshot</p>
              <p className="text-lg font-semibold text-[#daf2d0] mt-2 antialiased">{product.name} — botanical luxury in India</p>
              <p className="text-sm text-[#daf2d0]/70 mt-3 leading-relaxed">{seoDescription}</p>
            </div>
            <div className="space-y-2 text-sm text-[#daf2d0]/60">
              <p className="font-semibold text-[#daf2d0]/80">Suggested focus keywords</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{`${product.name} online India`}</li>
                <li>{`${product.categories?.[0]?.name ?? 'organic plant'} delivery`}</li>
                <li>Whole Lot of Nature premium botanicals</li>
                <li>Climate smart indoor plants</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-[#0a1f10] border border-[#1b5e20] p-5">
              <p className="text-sm font-semibold text-[#daf2d0]/80">Meta preview</p>
              <p className="text-sm text-[#daf2d0]/60 truncate mt-1">
                {`${product.name} | Whole Lot of Nature — ${seoDescription}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {product.description && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0a1f10]">
          <div className="max-w-5xl mx-auto">
            <SectionHeader as="h2" title="In-depth product dossier" align="center" className="text-[#daf2d0]" />
            <div className="mt-8 prose prose-lg prose-invert max-w-none text-[#daf2d0]/80">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0d3512]">
          <div className="max-w-6xl mx-auto">
            <SectionHeader as="h2" title="Curated complements" subtitle="Hand-picked by our stylists" align="center" className="text-[#daf2d0]" />
            
            <div className="mt-10 relative">
              {/* Navigation Arrows */}
              {relatedProducts.length > itemsPerView && (
                <>
                  <button
                    type="button"
                    onClick={prevCarousel}
                    disabled={carouselIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-[#0a1f10] border-2 border-[#4CAF50] text-[#4CAF50] flex items-center justify-center shadow-lg hover:bg-[#4CAF50] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous products"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextCarousel}
                    disabled={carouselIndex >= maxCarouselIndex}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-[#0a1f10] border-2 border-[#4CAF50] text-[#4CAF50] flex items-center justify-center shadow-lg hover:bg-[#4CAF50] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next products"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Carousel Container */}
              <div className="overflow-hidden" ref={carouselRef}>
                <motion.div
                  className="flex gap-6"
                  animate={{
                    x: `-${carouselIndex * (100 / itemsPerView)}%`
                  }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 200
                  }}
                >
                  {relatedProducts.map((related) => (
                    <motion.div
                      key={related.id}
                      className="flex-shrink-0"
                      style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="rounded-3xl border border-[#1b5e20] bg-[#0a1f10] overflow-hidden shadow-sm hover:shadow-xl transition h-full flex flex-col">
                        {related.images[0] && (
                          <div className="relative h-48">
                            <Image
                              src={related.images[0].src}
                              alt={related.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-5 space-y-3 flex-1 flex flex-col">
                          <p className="font-semibold text-[#daf2d0] line-clamp-2 flex-1">{related.name}</p>
                          <p className="text-[#4CAF50] font-semibold">{formatPrice(related.price)}</p>
                          <Link
                            href={`/products/${related.slug}`}
                            className="inline-flex items-center justify-center w-full rounded-full border border-[#1b5e20] py-2 text-sm font-semibold text-[#daf2d0] hover:border-[#4CAF50] hover:text-[#4CAF50] transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Carousel Dots Indicator */}
              {relatedProducts.length > itemsPerView && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxCarouselIndex + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        carouselIndex === idx ? 'bg-[#4CAF50] w-6' : 'bg-[#1b5e20]'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {isZoomed && selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-emerald-400 transition p-2 rounded-full bg-black/50 backdrop-blur-md"
            aria-label="Close zoom"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-5xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={heroImage?.src || ''}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      )}

      {isSticky && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a1f10] border-t border-[#1b5e20] shadow-2xl"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              {product.images[0] && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-[#daf2d0] line-clamp-1">{product.name}</p>
                <p className="text-[#4CAF50] font-semibold">{displayPrice}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full border border-[#1b5e20] flex items-center justify-center text-[#daf2d0] hover:border-[#4CAF50] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium text-[#daf2d0]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full border border-[#1b5e20] flex items-center justify-center text-[#daf2d0] hover:border-[#4CAF50]"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={!product.in_stock}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
                  product.in_stock
                    ? 'bg-[#2E7D32] hover:bg-[#1b5e20]'
                    : 'bg-neutral-700 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0d3512]">
        <div className="max-w-6xl mx-auto">
          <CTASection
            title="Design a signature botanical plan"
            description="Partner with our stylists for concierge sourcing, subscription care, and limited edition drops."
            primaryButton={{ text: 'Book a complimentary consult', href: '/contact' }}
            secondaryButton={{ text: 'Explore the full atelier', href: '/shop' }}
            variant="centered"
            backgroundVariant="green"
          />
        </div>
      </section>
    </div>
  );
}
