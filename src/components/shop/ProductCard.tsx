import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import Card from '@/components/ui/Card';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { getDisplayPrice, getOriginalPrice, isOnSale, getDiscountPercentage } from '@/lib/utils/pricing';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import Button from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
}

function WishlistButton({ isWishlisted, onToggle }: { isWishlisted: boolean; onToggle: (e: React.MouseEvent) => void }) {
  const [popping, setPopping] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    setPopping(true);
    onToggle(e);
    // reset animation state
    setTimeout(() => setPopping(false), 500);
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      animate={{ scale: popping ? [1, 1.35, 1] : 1 }}
      transition={{ duration: 0.45 }}
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/30 bg-white/10 text-primary-600 hover:bg-white/20 hover:text-primary-700 transition-colors shadow-sm`}
    >
      <Heart className={`w-5 h-5 ${isWishlisted ? 'text-primary-400' : 'text-primary-600'}`} />
    </motion.button>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem, openCart } = useCartStore();
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id.toString()));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const mainImage = product.images && product.images.length > 0 ? product.images[currentImageIndex] : null;

  const description = useMemo(() => {
    const html = product.short_description || product.description || '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }, [product.short_description, product.description]);

  const handleAddToCart = () => {
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
    // Open mini cart on add
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card className="relative group overflow-hidden h-full flex flex-col border border-primary-200 rounded-2xl bg-white transition-all hover:shadow-2xl hover:border-primary-300 hover:-translate-y-1 min-h-[340px]">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl">
          <Link href={`/shop/${product.slug}`} className="block h-full w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {mainImage ? (
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt}
                  width={900}
                  height={1200}
                  className="h-full w-full object-cover object-center shadow-inner"
                  priority={false}
                  quality={90}
                />
              ) : (
                <div className="h-full w-full bg-primary-50 flex items-center justify-center">
                  <span className="text-primary-300">No image</span>
                </div>
              )}
            </motion.div>
          </Link>
          
          {/* (Removed static top-left wishlist) - wishlist now appears in hover actions */}

          {/* Sale badge */}
          {isOnSale(product) && (
            <div className="absolute top-3 right-3 z-20">
              <motion.span 
                className="bg-primary-700 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {getDiscountPercentage(product)}% OFF
              </motion.span>
            </div>
          )}
          
          {/* Always-visible premium icon actions, with green hover */}
          <div className="absolute left-0 right-0 bottom-5 z-10 flex items-center justify-center gap-4 pointer-events-auto">
            <button
              aria-label="Add to cart"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(); }}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-primary-200 bg-white text-primary-600 shadow-md hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
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
        </div>
        {/* Premium footer: name (2 lines) + price, enhanced visibility */}
        <div className="px-4 py-3 flex flex-col gap-2">
          <Link href={`/shop/${product.slug}`} className="text-base font-bold text-gray-900 line-clamp-2 hover:text-primary-700 transition-colors leading-tight">
            {product.name}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{getDisplayPrice(product)}</span>
            {getOriginalPrice(product) && (
              <span className="text-sm font-medium text-gray-500 line-through">{getOriginalPrice(product)}</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}