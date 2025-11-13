import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { ShoppingCart, Heart, Check, Leaf } from 'lucide-react';
import { getDisplayPrice, getOriginalPrice, isOnSale, getDiscountPercentage } from '@/lib/utils/pricing';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';

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
      className="w-11 h-11 rounded-full glass flex items-center justify-center hover:bg-[#2E7D32] hover:border-[#2E7D32] transition-all duration-300 group"
    >
      <Heart 
        className={`w-5 h-5 transition-all ${isWishlisted ? 'fill-[#2E7D32] text-[#2E7D32]' : 'text-white group-hover:text-white'}`} 
      />
    </motion.button>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
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
      <div className="group relative bg-[#2C2C2C] forest-card overflow-hidden transition-all duration-300 hover:-translate-y-2 emerald-glow-lg h-full flex flex-col">
        
        {/* Forest Leaf Decoration - Extending from Corner */}
        <div className="absolute -top-8 -right-8 w-24 h-24 text-[#2E7D32]/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Leaf className="w-full h-full rotate-45" strokeWidth={1} />
        </div>

        {/* Product Image Container with 4:5 Aspect Ratio */}
        <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] bg-[#F8F9FA] overflow-hidden">
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
              className="object-contain p-4 transition-transform duration-400 group-hover:scale-110"
                  style={{ aspectRatio: '4/5' }}
                  priority={false}
              quality={90}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#F8F9FA] flex items-center justify-center">
              <span className="text-[#2E7D32]/30 text-sm">No image</span>
            </div>
          )}

          {/* Wishlist Button - Top Right */}
          <div className="absolute top-4 right-4 z-10">
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

          {/* Sale Badge - Muted Gold */}
          {isOnSale(product) && (
            <motion.div 
              className="absolute top-4 left-4 z-10"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="bg-[#C4B17C] text-[#1A1A1A] px-4 py-2 forest-card text-xs font-bold uppercase tracking-wider shadow-lg antialiased">
                {getDiscountPercentage(product)}% OFF
              </div>
            </motion.div>
          )}
        </Link>

        {/* Product Content - Generous Padding with Golden Ratio */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Product Name - Golden Ratio H6 (26px clamped for mobile) */}
          <Link 
            href={`/shop/${product.slug}`}
            className="font-montserrat font-semibold text-[clamp(1.125rem,2.5vw,1.625rem)] leading-tight text-white hover:text-[#66BB6A] transition-colors duration-200 line-clamp-2 mb-3"
          >
            {product.name}
          </Link>

          {/* Short Description - Inter 16px */}
          {shortDesc && (
            <p className="font-inter text-sm text-white/60 line-clamp-2 leading-relaxed mb-4 flex-1">
              {shortDesc}
            </p>
          )}

          {/* Price - Emerald H6 (26px clamped) */}
          <div className="mb-4">
            <div className="flex items-baseline gap-3">
              <span className="font-montserrat text-[clamp(1.5rem,3vw,1.625rem)] text-[#2E7D32] font-bold leading-none antialiased">
                {getDisplayPrice(product)}
              </span>
              {getOriginalPrice(product) && (
                <span className="font-inter text-sm text-white/40 line-through">
                  {getOriginalPrice(product)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button - Full Width, Sharp Corners */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            whileHover={{ scale: product.in_stock ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 forest-card flex items-center justify-center gap-3 font-montserrat font-bold text-base uppercase tracking-wider transition-all duration-300 ${
              addedToCart
                ? 'bg-[#66BB6A] text-white'
                : product.in_stock
                ? 'bg-[#2E7D32] text-white emerald-glow hover:bg-[#66BB6A]'
                : 'bg-[#2C2C2C] text-white/30 cursor-not-allowed'
            }`}
            aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5" />
                Added
              </>
            ) : product.in_stock ? (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            ) : (
              'Out of Stock'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}