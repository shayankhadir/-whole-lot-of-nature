import { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

// Premium Skeleton Card with Emerald Shimmer
function SkeletonCard() {
  return (
    <div className="bg-[#0F1E11] rounded-[6px] shadow-[0_4px_24px_rgba(46,125,50,0.12)] p-6 border border-transparent">
      {/* Image skeleton with 4:5 aspect ratio */}
      <div className="relative w-full mb-4 overflow-hidden rounded-lg bg-[#2C2C2C]" style={{ aspectRatio: '4/5' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C2C2C] via-[#2E7D32]/10 to-[#2C2C2C] animate-shimmer" 
             style={{ 
               backgroundSize: '200% 100%',
               animation: 'shimmer 2s infinite linear'
             }} 
        />
      </div>
      {/* Name skeleton */}
      <div className="h-7 bg-[#2C2C2C] rounded w-3/4 mx-auto mb-2 animate-pulse" />
      <div className="h-7 bg-[#2C2C2C] rounded w-2/3 mx-auto mb-3 animate-pulse" />
      {/* Description skeleton */}
      <div className="h-4 bg-[#2C2C2C] rounded w-full mb-1 animate-pulse opacity-50" />
      <div className="h-4 bg-[#2C2C2C] rounded w-5/6 mx-auto mb-3 animate-pulse opacity-50" />
      {/* Tags skeleton */}
      <div className="flex gap-2 justify-center mb-6">
        <div className="h-6 w-16 bg-[#2E7D32]/20 rounded-full animate-pulse backdrop-blur-md" />
        <div className="h-6 w-20 bg-[#2E7D32]/20 rounded-full animate-pulse backdrop-blur-md" />
      </div>
      {/* Price and button skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-10 bg-[#2E7D32]/30 rounded w-24 animate-pulse backdrop-blur-md" />
        <div className="w-11 h-11 bg-[#2E7D32]/30 rounded-full animate-pulse backdrop-blur-md" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4 text-center max-w-[600px] mx-auto"
      >
        <div className="text-7xl mb-6 opacity-40 antialiased">🌿</div>
        <h3 className="font-montserrat text-3xl font-bold text-white mb-3 tracking-wide antialiased">
          No Products Found
        </h3>
        <p className="font-inter text-base text-gray-400 opacity-70 leading-relaxed antialiased">
          We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1200px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.3,
                delay: Math.min(index * 0.05, 0.3),
                ease: [0.4, 0, 0.2, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}