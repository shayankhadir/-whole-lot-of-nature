'use client';

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CTASection } from '@/components/content/CTAButton';
import SectionHeader from '@/components/content/SectionHeader';
import {
  WooCommerceProduct,
  WooCommerceService
} from '@/lib/services/woocommerceService';

interface ProductReview {
  id: number;
  author: string;
  review: string;
  rating: number;
  date: string;
  verified: boolean;
}

type ProductDetailTab = 'details' | 'shipping' | 'care';

interface HighlightCard {
  icon: string;
  title: string;
  description: string;
}

const PREMIUM_HIGHLIGHTS: HighlightCard[] = [
  {
    icon: '🌿',
    title: 'Nursery-Grade Cultivation',
    description: 'Hand-raised by specialist horticulturists for resilient growth and lasting color.'
  },
  {
    icon: '🛡️',
    title: '2-Year Wellness Guarantee',
    description: 'Complimentary replacement or concierge support if your plant struggles within 24 months.'
  },
  {
    icon: '🧪',
    title: 'Soil Intelligence Kit',
    description: 'Each order ships with a premium soil mix, moisture indicator, and feeding calendar.'
  },
  {
    icon: '🚚',
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
  { label: 'Sunlight', value: 'Bright, indirect light for 4-6 hours daily' },
  { label: 'Watering', value: 'Hydrate when top 2 cm of soil feels dry' },
  { label: 'Feeding', value: 'Organic tonic every 15 days during growing season' },
  { label: 'Maintenance', value: 'Rotate weekly + gentle misting for glossy foliage' }
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

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const prod = await WooCommerceService.getProductBySlug(slug);
      setProduct(prod);

      if (prod) {
        const [related, reviewsData] = await Promise.all([
          WooCommerceService.getRelatedProducts(prod.id, 4),
          WooCommerceService.getProductReviews(prod.id)
        ]);

        setRelatedProducts(related);
        setReviews(reviewsData);
      }

      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-2">
          <p className="text-2xl font-semibold text-emerald-900">Calibrating your botanical experience…</p>
          <p className="text-neutral-600">Curating product insights and concierge perks.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-6">
          <p className="text-3xl font-bold text-neutral-900">We couldn&apos;t locate that product</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-800 transition"
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
  const savingsPercentage =
    product.sale_price && product.regular_price
      ? Math.round(
          ((parseFloat(product.regular_price) - parseFloat(product.sale_price)) /
            parseFloat(product.regular_price)) *
            100
        )
      : null;

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white text-neutral-900">
      <Head>
        <title>{`${product.name} | Whole Lot of Nature`}</title>
        <meta name="description" content={seoDescription} />
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
      </Head>

      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-neutral-500 flex flex-wrap gap-2">
          {breadcrumbTrail.map((crumb, index) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-emerald-700 transition">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-neutral-900 font-semibold">{crumb.label}</span>
              )}
              {index < breadcrumbTrail.length - 1 && <span>/</span>}
            </div>
          ))}
        </nav>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-emerald-100 border border-emerald-100">
              {heroImage ? (
                <Image
                  key={heroImage.id}
                  src={heroImage.src}
                  alt={heroImage.alt || product.name}
                  width={1080}
                  height={1080}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="aspect-square bg-neutral-200" />
              )}
              <div className="absolute top-4 left-4 flex gap-2 text-xs font-semibold">
                {product.featured && <span className="px-3 py-1 rounded-full bg-white/90 text-emerald-800">Staff Pick</span>}
                {savingsPercentage && (
                  <span className="px-3 py-1 rounded-full bg-emerald-700 text-white">Save {savingsPercentage}%</span>
                )}
              </div>
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

          <div className="bg-white/80 backdrop-blur rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-50 p-8 space-y-7">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {product.categories.map((category) => (
                  <span key={category.id} className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                    {category.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-900 leading-tight">{product.name}</h1>
              {product.average_rating && (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
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
                <p className="text-sm text-neutral-500">Tagged in {product.tags.map((tag) => tag.name).join(', ')}</p>
              ) : null}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-600 text-white flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-semibold">{formatPrice(effectivePrice || '0')}</span>
                {product.regular_price && product.sale_price && (
                  <span className="line-through text-white/70">{formatPrice(product.regular_price)}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-medium">
                <span className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full">
                  {product.in_stock ? '✓ In Stock' : 'Out of Stock'}
                </span>
                {product.stock_quantity && (
                  <span className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full">
                    {product.stock_quantity} units ready
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80">
                Includes concierge onboarding call, soil intelligence kit, and climate-smart packaging.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1))}
                    className="w-14 text-center font-semibold border-x border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!product.in_stock}
                  className={`flex-1 inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                    product.in_stock
                      ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-200'
                      : 'bg-neutral-300 cursor-not-allowed'
                  }`}
                >
                  🛒 Add {quantity} to Cart
                </button>
              </div>
              <p className="text-sm text-neutral-600 flex items-center gap-2">
                <span>Secure checkout • Free 30-day returns • Exclusive care concierge</span>
              </p>
            </div>

            {attributeChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attributeChips.map((chip) => (
                  <span key={chip} className="px-3 py-1 rounded-full text-xs bg-neutral-100 border border-neutral-200">
                    {chip}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-2 text-base text-neutral-600">
              <p className="leading-relaxed">
                {stripHtml(product.short_description) || stripHtml(product.description).slice(0, 260)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PREMIUM_HIGHLIGHTS.map((highlight) => (
            <div key={highlight.title} className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur">
              <p className="text-3xl mb-3">{highlight.icon}</p>
              <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
              <p className="text-sm text-white/80 leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.4fr,0.6fr]">
          <div className="space-y-6">
            <div className="flex gap-3 text-sm font-medium">
              {(['details', 'shipping', 'care'] as ProductDetailTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full border transition ${
                    activeTab === tab
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                      : 'border-transparent text-neutral-500 hover:border-neutral-200'
                  }`}
                >
                  {tab === 'details' && 'Product Story'}
                  {tab === 'shipping' && 'Shipping & Packaging'}
                  {tab === 'care' && 'Care Ritual'}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-8 space-y-6">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Botanical narrative</h3>
                  <p className="leading-relaxed text-neutral-600">
                    {stripHtml(product.description).slice(0, 900) ||
                      'Sourced from regenerative farms, each specimen is acclimatized in small-batch greenhouses, ensuring remarkable resilience in Indian climates.'}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <p className="text-sm font-medium text-emerald-900">Sustainability</p>
                      <p className="text-base text-neutral-700">Zero pesticide regime & reclaimed-water irrigation.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <p className="text-sm font-medium text-emerald-900">Wellness boost</p>
                      <p className="text-base text-neutral-700">Purifies indoor air, uplifts circadian rhythm, and eases stress hormones.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Logistics engineered for living things</h3>
                  <ul className="space-y-2 text-neutral-600">
                    {SHIPPING_ASSURANCES.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-emerald-600">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Care ritual blueprint</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {CARE_FRAMEWORK.map((item) => (
                      <div key={item.label} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-800">{item.label}</p>
                        <p className="text-sm text-neutral-600 mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-8 space-y-6">
            <div>
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">SEO snapshot</p>
              <p className="text-lg font-semibold text-neutral-900 mt-2">{product.name} — botanical luxury in India</p>
              <p className="text-sm text-neutral-600 mt-3 leading-relaxed">{seoDescription}</p>
            </div>
            <div className="space-y-2 text-sm text-neutral-500">
              <p className="font-semibold text-neutral-700">Suggested focus keywords</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{`${product.name} online India`}</li>
                <li>{`${product.categories?.[0]?.name ?? 'organic plant'} delivery`}</li>
                <li>Whole Lot of Nature premium botanicals</li>
                <li>Climate smart indoor plants</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-700">Meta preview</p>
              <p className="text-sm text-neutral-500 truncate mt-1">
                {`${product.name} | Whole Lot of Nature — ${seoDescription}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {product.description && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
          <div className="max-w-5xl mx-auto">
            <SectionHeader as="h2" title="In-depth product dossier" align="center" />
            <div className="mt-8 prose prose-lg max-w-none text-neutral-700">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionHeader as="h2" title={`Client Stories (${reviews.length})`} align="center" />
            <div className="mt-10 space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, translateY: 20 }}
                  whileInView={{ opacity: 1, translateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-neutral-900">{review.author}</p>
                      <p className="text-sm text-neutral-500">
                        {new Date(review.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {review.verified && ' • Verified Concierge'}
                      </p>
                    </div>
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx}>{idx < review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-neutral-700 leading-relaxed">{review.review}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <SectionHeader as="h2" title="Curated complements" subtitle="Hand-picked by our stylists" align="center" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, translateY: 30 }}
                  whileInView={{ opacity: 1, translateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition"
                >
                  {related.images[0] && (
                    <div className="relative h-48">
                      <Image src={related.images[0].src} alt={related.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <p className="font-semibold text-neutral-900 line-clamp-2">{related.name}</p>
                    <p className="text-emerald-700 font-semibold">{formatPrice(related.price)}</p>
                    <Link
                      href={`/products/${related.slug}`}
                      className="inline-flex items-center justify-center w-full rounded-full border border-neutral-200 py-2 text-sm font-semibold text-neutral-800 hover:border-emerald-700 hover:text-emerald-800"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <CTASection
            title="Design a signature botanical plan"
            description="Partner with our stylists for concierge sourcing, subscription care, and limited edition drops."
            primaryButton={{ text: 'Book a complimentary consult', href: '/contact' }}
            secondaryButton={{ text: 'Explore the full atelier', href: '/shop' }}
            variant="centered"
            backgroundVariant="emerald"
          />
        </div>
      </section>
    </div>
  );
}
