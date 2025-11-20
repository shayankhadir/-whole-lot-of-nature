import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { ShoppingCart, Heart, Check, Leaf } from 'lucide-react';
import { getDisplayPrice, getOriginalPrice, isOnSale, getDiscountPercentage } from '@/lib/utils/pricing';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { ProductQuickView } from '@/components/shop/ProductQuickView';

interface ProductCardProps {
  product: Product;
}

function WishlistButton({ isWishlisted, onToggle }: { isWishlisted: boolean; onToggle: (e: React.MouseEvent) => void }) {
  const [popping, setPopping] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    setPopping(true);
    onToggle(e);
    setTimeout(() => setPopping(false), 500);
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      animate={{ scale: popping ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full glass flex items-center justify-center hover:bg-[#86efbe] hover:border-[#86efbe] transition-all duration-300 group active:scale-95 touch-manipulation"
    >
      <Heart 
        className={`w-5 h-5 transition-all ${isWishlisted ? 'fill-[#86efbe] text-[#86efbe]' : 'text-[#daf2d0] group-hover:text-[#0d3512]'}`} 
      />
    </motion.button>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem, openCart } = useCartStore();
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id.toString()));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.sale_price || product.price),
      originalPrice: parseFloat(product.regular_price || product.price),
      image: mainImage?.src || '/placeholder-image.jpg',
      quantity: 1,
      type: 'product',
      inStock: product.in_stock,
      maxQuantity: product.stock_quantity
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  };

  const shortDesc = product.short_description 
    ? product.short_description.replace(/<[^>]*>/g, '').substring(0, 100)
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      <div className="group relative bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-2xl overflow-hidden border border-[#2E7D32]/30 hover:border-[#2E7D32]/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#2E7D32]/20 h-full flex flex-col">
        
        {/* Forest Leaf Decoration - Extending from Corner */}
        <div className="absolute -top-6 -right-6 w-20 h-20 text-[#2E7D32]/15 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Leaf className="w-full h-full rotate-45" strokeWidth={1} />
        </div>

        {/* Product Image Container */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-shimmer" />
          )}
          
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              quality={90}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0d3512] flex items-center justify-center">
              <span className="text-[#86efbe]/30 text-sm">No image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B0F]/80 via-transparent to-transparent"></div>

          {/* Wishlist Button - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton
              isWishlisted={isWishlisted}
              onToggle={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist({
                  id: product.id.toString(),
                  slug: product.slug,
                  name: product.name,
                  price: parseFloat(product.sale_price || product.price),
                  image: mainImage?.src || '/placeholder-image.jpg',
                });
              }}
            />
          </div>

          {/* Sale Badge */}
          {isOnSale(product) && (
            <motion.div 
              className="absolute top-3 left-3 z-10"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="bg-[#2E7D32] text-white text-xs font-semibold px-3 py-1 rounded-full">
                {getDiscountPercentage(product)}% OFF
              </div>
            </motion.div>
          )}
        </div>

        {/* Product Content */}
        <Link href={`/shop/${product.slug}`} className="p-5 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-montserrat text-[clamp(1rem,2.5vw,1.25rem)] font-bold text-white mb-2 group-hover:text-[#66BB6A] transition-colors duration-300 antialiased line-clamp-2">
            {product.name}
          </h3>

          {/* Short Description */}
          {shortDesc && (
            <p className="text-[clamp(0.875rem,1.5vw,0.9375rem)] text-white/85 mb-4 line-clamp-2 antialiased flex-1">
              {shortDesc}
            </p>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2E7D32]/20">
            <div>
              <span className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#66BB6A] antialiased">
                {getDisplayPrice(product)}
              </span>
              {getOriginalPrice(product) && (
                <span className="block text-sm text-white/50 line-through">
                  {getOriginalPrice(product)}
                </span>
              )}
            </div>
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              whileHover={{ scale: product.in_stock ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all ${
                addedToCart
                  ? 'bg-[#66BB6A] text-white'
                  : product.in_stock
                  ? 'bg-[#2E7D32] text-white hover:bg-[#66BB6A]'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
            >
              {addedToCart ? (
                <Check className="w-5 h-5" />
              ) : product.in_stock ? (
                <ShoppingCart className="w-5 h-5" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={product}
      />
    </motion.div>
  );
}