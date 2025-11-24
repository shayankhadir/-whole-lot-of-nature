import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
  link?: string;
  count?: number;
  icon?: string;
}

interface CategoryShowcaseProps {
  categories: Category[];
  title?: string;
  description?: string;
  variant?: 'grid' | 'carousel' | 'minimal';
  className?: string;
}

/**
 * CategoryShowcase Component
 * 
 * Display product categories with images and descriptions.
 * Features:
 * - Responsive grid layout
 * - Image overlays
 * - Hover animations
 * - Multiple variants
 * - Link support
 * 
 * @component
 */
export const CategoryShowcase = ({
  categories,
  title,
  description,
  variant = 'grid',
  className = '',
}: CategoryShowcaseProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className={`py-16 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-12">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4 antialiased"
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90 antialiased"
            >
              {description}
            </motion.p>
          )
        </div>
      )}

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`grid ${
          variant === 'minimal'
            ? 'grid-cols-2 md:grid-cols-3 gap-4'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            variants={itemVariants}
          />
        ))}
      </motion.div>
    </section>
  );
};

interface CategoryCardProps {
  category: Category;
  variants?: any;
}

const CategoryCard = ({ category, variants }: CategoryCardProps) => {
  const content = (
    <motion.div
      variants={variants}
      className="group relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Icon */}
        {category.icon && (
          <div className="text-4xl mb-2 antialiased">{category.icon}</div>
        )}

        {/* Name */}
        <h3 className="text-2xl font-bold text-white mb-2 antialiased">
          {category.name}
        </h3>

        {/* Description */}
        {category.description && (
          <p className="text-white/90 text-sm mb-3 line-clamp-2">
            {category.description}
          </p>
        )

        {/* Count */}
        {category.count && (
          <p className="text-[#2E7D32] text-sm font-semibold">
            {category.count} items
          </p>
        )}

        {/* Hover button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="mt-4 inline-flex items-center gap-2 text-[#2E7D32] font-semibold text-sm"
        >
          Explore <span>→</span>
        </motion.div>
      </div>
    </motion.div>
  );

  if (category.link) {
    return <Link href={category.link}>{content}</Link>;
  }

  return content;
};

export default CategoryShowcase;
