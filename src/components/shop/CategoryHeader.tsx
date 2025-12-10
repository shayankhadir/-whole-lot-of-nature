'use client';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { getCategoryIcon } from '@/lib/categoryIcons';

interface CategoryHeaderProps {
  category: {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    image?: string | { src: string; alt?: string };
  } | null;
  productCount: number;
}

export default function CategoryHeader({ category, productCount }: CategoryHeaderProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 antialiased">
        {category ? (
          <>
            {(() => {
              const Icon = getCategoryIcon(category.slug || category.name);
              return <Icon className="h-6 w-6 text-primary-700" />;
            })()}
            <span>{category.name}</span>
          </>
        ) : (
          'All Products'
        )}
      </h1>
  <div className="text-gray-700 mb-4">
        {category?.description || 'Browse our collection of natural products'}
      </div>
  <div className="flex items-center text-sm text-white/80">
        <span>{productCount} products</span>
      </div>
      {category?.image && (
        <motion.div
          className="mt-4 relative h-48 rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={typeof category.image === 'string' ? category.image : category.image.src}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      )}
    </motion.div>
  );
}