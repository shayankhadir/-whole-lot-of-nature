import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Product } from '@/types/product';
import AddToCartButton from '@/components/shop/AddToCartButton';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?slug=${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    if (result.success && result.data && result.data.length > 0) {
      return result.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Whole Lot of Nature`,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images.map(img => img.src),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const mainImage = product.images[0] || { src: '/images/placeholder.jpg', alt: product.name };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle leaf background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Image
          src="https://admin.wholelotofnature.com/wp-content/uploads/2024/11/bgleaf1.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
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
                    className="aspect-square relative rounded-lg overflow-hidden bg-white/5 border border-[#2E7D32]/20 cursor-pointer hover:border-[#2E7D32] transition-all"
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
              <span className="text-white/70">{product.name}</span>
            </div>

            {/* Product Name - Golden Ratio H2 (68px clamped) */}
            <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] leading-tight font-montserrat font-bold text-white">
              {product.name}
            </h1>

            {/* Category badges */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map(cat => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2E7D32]/20 text-[#66BB6A] border border-[#2E7D32]/30"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Price - Golden Ratio H3 (110px clamped) */}
            <div className="flex items-baseline gap-4">
              <span className="text-[clamp(2.625rem,6vw,6.875rem)] font-bold text-[#2E7D32]">
                ${product.price}
              </span>
              {product.sale_price && product.regular_price !== product.price && (
                <span className="text-[clamp(1.625rem,3vw,2.625rem)] line-through text-white/40">
                  ${product.regular_price}
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
                className="text-base leading-relaxed text-white/70 prose prose-invert max-w-none"
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
                  className="prose prose-invert max-w-none text-white/70"
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
                      <dd className="text-sm text-white/70">
                        {attr.options.join(', ')}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
