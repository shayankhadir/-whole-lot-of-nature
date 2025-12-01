import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description?: string;
  badge?: string;
  isFavorite?: boolean;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  variant?: 'default' | 'minimal' | 'featured';
  className?: string;
}

/**
 * ProductCard Component
 * 
 * Displays a plant/seed product with image, rating, price, and actions.
 * Features:
 * - Rounded corners (16-20px)
 * - Rating badge overlay
 * - Discount percentage display
 * - Hover scale animation
 * - Add to cart + favorite buttons
 * - Responsive image loading
 * 
 * @component
 */
export const ProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  description,
  badge,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite,
  variant = 'default',
  className = '',
}: ProductCardProps) => {
  // Calculate discount percentage
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Variant styles
  const variantStyles = {
    default: 'bg-white',
    minimal: 'bg-transparent border border-gray-200',
    featured: 'bg-gradient-to-br from-green-50 to-white',
  };

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -8, transition: { duration: 0.3 } },
  };

  const imageVariants = {
    initial: { scale: 1 },
    whileHover: { scale: 1.1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${variantStyles[variant]} ${className}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <motion.div
          variants={imageVariants}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm flex items-center gap-1 font-semibold"
        >
          <span className="text-[#2E7D32]">⭐</span>
          <span>{rating.toFixed(1)}</span>
          {reviewCount > 0 && (
            <span className="text-xs text-white/70">({reviewCount})</span>
          )}
        </motion.div>

        {/* Badge Label */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-3 left-3 bg-[#2E7D32] text-white text-xs font-bold px-3 py-1 rounded-full antialiased"
          >
            {badge}
          </motion.div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute bottom-3 left-3 bg-[#2E7D32] text-white text-xs font-bold px-2.5 py-1 rounded-full antialiased"
          >
            -{discountPercentage}%
          </motion.div>
        )}

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleFavorite}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isFavorite
                ? 'fill-[#2E7D32] text-[#2E7D32]'
                : 'text-black hover:text-[#2E7D32]'
            }`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Name */}
        <h3 className="font-bold text-base sm:text-lg mb-1.5 text-black line-clamp-2 group-hover:text-[#2E7D32] transition-colors duration-300 antialiased">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-100 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#2E7D32] antialiased">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm sm:text-base text-gray-100 line-through antialiased">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddToCart}
          className="w-full bg-[#2E7D32] hover:bg-[#2E7D32] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </motion.button>
      </div>

      {/* Loading Skeleton Fallback */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 opacity-0 animate-pulse pointer-events-none" />
    </motion.div>
  );
};

export default ProductCard;
