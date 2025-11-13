import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ServiceCardProps {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  learnMoreLink?: string;
  learnMoreLabel?: string;
  variant?: 'default' | 'filled' | 'outlined';
  className?: string;
  index?: number;
}

/**
 * ServiceCard Component
 * 
 * Displays a service/feature with icon, title, description, and link.
 * Features:
 * - Icon with background
 * - Multiple variants (default, filled, outlined)
 * - Green accent on hover
 * - Smooth transitions
 * - Responsive design
 * 
 * @component
 */
export const ServiceCard = ({
  id,
  icon,
  title,
  description,
  learnMoreLink = '#',
  learnMoreLabel = 'Learn More',
  variant = 'default',
  className = '',
  index = 0,
}: ServiceCardProps) => {
  const variantStyles = {
    default: {
      border: 'border-2 border-gray-300 hover:border-[#2E7D32]',
      background: 'bg-white',
      icon: 'bg-[#2E7D32] group-hover:bg-[#2E7D32]',
    },
    filled: {
      border: 'border-0',
      background: 'bg-[#2E7D32] hover:bg-[#2E7D32]',
      icon: 'bg-[#2E7D32]',
    },
    outlined: {
      border: 'border-2 border-[#2E7D32] hover:border-[#2E7D32]',
      background: 'bg-transparent',
      icon: 'bg-[#2E7D32] group-hover:bg-[#2E7D32]',
    },
  };

  const styles = variantStyles[variant];

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5 },
    },
  };

  const hoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02, y: -4 },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      variants={hoverVariants}
      viewport={{ once: true, margin: '-100px' }}
      className={`group relative p-8 rounded-lg transition-all duration-300 cursor-pointer ${styles.background} ${styles.border} shadow-md hover:shadow-lg ${className}`}
    >
      {/* Icon Container */}
      <motion.div
        variants={iconVariants}
        className={`w-16 h-16 ${styles.icon} rounded-lg flex items-center justify-center mb-6 transition-colors duration-300`}
      >
        <div className="text-[#2E7D32] group-hover:text-[#2E7D32] transition-colors duration-300 text-2xl antialiased">
          {icon}
        </div>
      </motion.div>

      {/* Title */}
      <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#2E7D32] transition-colors duration-300 antialiased">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Link */}
      {learnMoreLink && (
        <motion.div
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, x: 4 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={learnMoreLink}
            className="inline-flex items-center gap-2 text-[#2E7D32] font-semibold hover:text-[#2E7D32] transition-colors duration-300"
          >
            {learnMoreLabel}
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      )}

      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#2E7D32] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
};

export default ServiceCard;
