import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  id: string;
  quote: string;
  author: string;
  title?: string;
  avatar?: string;
  rating?: number;
  variant?: 'default' | 'minimal' | 'featured';
  className?: string;
  index?: number;
}

/**
 * TestimonialCard Component
 * 
 * Displays customer testimonials with quote, author info, and rating.
 * Features:
 * - Left green border accent
 * - Author avatar and details
 * - Star rating display
 * - Multiple variants
 * - Smooth animations
 * 
 * @component
 */
export const TestimonialCard = ({
  id,
  quote,
  author,
  title,
  avatar,
  rating = 5,
  variant = 'default',
  className = '',
  index = 0,
}: TestimonialCardProps) => {
  const variantStyles = {
    default: 'bg-white border-l-4 border-green-600',
    minimal: 'bg-gray-50 border-l-4 border-green-500',
    featured: 'bg-gradient-to-br from-green-50 to-white border-l-4 border-green-600',
  };

  const containerVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.1, duration: 0.5 },
    },
  };

  const contentVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className={`p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      {/* Quote Icon */}
      <div className="text-6xl text-green-200 mb-4 select-none">
        "
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + i * 0.05 }}
          >
            <Star
              size={18}
              className={`transition-colors duration-300 ${
                i < rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Quote Text */}
      <blockquote className="text-lg italic text-gray-700 mb-6 leading-relaxed">
        "{quote}"
      </blockquote>

      {/* Author Section */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        {/* Avatar */}
        {avatar && (
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="relative w-12 h-12 flex-shrink-0"
          >
            <Image
              src={avatar}
              alt={author}
              fill
              className="rounded-full object-cover"
            />
          </motion.div>
        )}

        {/* Author Info */}
        <div>
          <p className="font-bold text-sm text-black">
            {author}
          </p>
          {title && (
            <p className="text-xs text-gray-600">
              {title}
            </p>
          )}
        </div>
      </div>

      {/* Hover Effect Background */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"
        initial={{ opacity: 0, scale: 0 }}
        whileHover={{ opacity: 0.1, scale: 1 }}
      />
    </motion.div>
  );
};

export default TestimonialCard;
