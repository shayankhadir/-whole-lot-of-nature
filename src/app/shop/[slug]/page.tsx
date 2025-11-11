'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { ShieldCheck, Truck, Leaf, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useProduct } from '@/lib/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/Button';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { data: product, isLoading } = useProduct(params.slug);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCartStore();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.images[0]) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.sale_price || product.price),
        originalPrice: parseFloat(product.regular_price || product.price),
        image: product.images[0].src,
        quantity,
        type: 'product',
        inStock: product.in_stock,
        maxQuantity: product.stock_quantity
      });
    }
  };

  const price = product.sale_price || product.regular_price || product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* JSON-LD: Product + Breadcrumbs */}
      <ProductJsonLd
        name={product.name}
        description={product.short_description?.replace(/<[^>]*>/g, '') || undefined}
        sku={product.id}
        images={product.images?.map((i) => ({ src: i.src, alt: i.alt }))}
        price={parseFloat(String(price).replace(/[^\d.]/g, '') || '0')}
        priceCurrency="INR"
        availability={product.in_stock ? 'InStock' : 'OutOfStock'}
        url={(process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com') + `/shop/${product.slug}`}
        aggregateRating={product.average_rating ? { ratingValue: product.average_rating, reviewCount: product.rating_count || 0 } : undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com') + '/' },
          { name: 'Shop', url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com') + '/shop' },
          { name: product.name, url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com') + `/shop/${product.slug}` },
        ]}
      />

      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Gallery */}
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl border border-primary-100 bg-white">
            {product.images[activeImage] && (
              <button className="relative block w-full aspect-square" onClick={() => setLightboxOpen(true)}>
                <Image
                  src={product.images[activeImage].src}
                  alt={product.images[activeImage].alt}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm text-primary-700 shadow"><ZoomIn className="h-4 w-4" /> Zoom</span>
              </button>
            )}
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {product.images.map((img, i) => (
              <button key={img.id || i} onClick={() => setActiveImage(i)} className={`relative aspect-square overflow-hidden rounded-lg border ${i === activeImage ? 'border-primary-600' : 'border-gray-200'}`}>
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details / Buy Block */}
        <div className="mt-8 lg:mt-0 lg:col-span-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-primary-700">
            <ShieldCheck className="h-4 w-4" /> Organic • <Truck className="h-4 w-4" /> Fast Delivery • <Leaf className="h-4 w-4" /> Eco Packaging
          </div>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-bold text-primary-900">₹{product.sale_price || product.regular_price || product.price}</p>
            {product.sale_price && (
              <p className="text-lg text-gray-500 line-through">₹{product.regular_price}</p>
            )}
            <span className="ml-auto text-sm text-gray-600">Ships in 1–3 days</span>
          </div>

          <div className="mt-6 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />

          <div className="mt-6 flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Qty</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <Button onClick={handleAddToCart} disabled={!product.in_stock} className="flex-1">
              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700">
            <div className="rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-2">Secure Payments</div>
            <div className="rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-2">Eco Packaging</div>
            <div className="rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-2">Expert Support</div>
            <div className="rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-2">Easy Replacement</div>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <Tab.Group>
              <Tab.List className="flex gap-2">
                {['Description', 'How to Use', 'Specs', 'FAQs'].map((t) => (
                  <Tab key={t} className={({ selected }) => `rounded-full px-4 py-2 text-sm font-medium ${selected ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-700'}`}>{t}</Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-4">
                <Tab.Panel>
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                </Tab.Panel>
                <Tab.Panel>
                  <p className="text-sm text-gray-700">Apply as directed. Water as needed. For best results, follow our detailed blog guides.</p>
                </Tab.Panel>
                <Tab.Panel>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {product.attributes.map((attr) => (
                      <li key={attr.id}><span className="font-medium">{attr.name}:</span> {attr.options.join(', ')}</li>
                    ))}
                  </ul>
                </Tab.Panel>
                <Tab.Panel>
                  <p className="text-sm text-gray-700">Common questions answered. More coming soon.</p>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Transition show={lightboxOpen} as={Fragment}>
        <Dialog onClose={() => setLightboxOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="transition-transform ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="transition-transform ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black">
                {product.images[activeImage] && (
                  <div className="relative aspect-square">
                    <Image src={product.images[activeImage].src} alt={product.images[activeImage].alt} fill className="object-contain" />
                  </div>
                )}
                <button onClick={() => setLightboxOpen(false)} className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm">Close</button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}