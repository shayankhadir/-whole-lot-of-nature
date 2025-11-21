'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

interface StatisticItem {
  id: string;
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  description?: string;
}

interface StatisticsBlockProps {
  title?: string;
  description?: string;
  items: StatisticItem[];
  variant?: 'default' | 'cards' | 'minimal';
  className?: string;
  animated?: boolean;
}

/**
 * StatisticsBlock Component
 * 
 * Displays impressive statistics with animated count-up.
 * Features:
 * - Animated number counters
 * - Multiple variants
 * - Icon support
 * - Responsive grid layout
 * - Intersection observer for performance
 * 
 * @component
 */
export const StatisticsBlock = ({
  title,
  description,
  items,
  variant = 'default',
  className = '',
  animated = true,
}: StatisticsBlockProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const variantStyles = {
    default: 'gap-8',
    cards: 'gap-6 grid-cols-1 md:grid-cols-2',
    minimal: 'gap-4 text-center',
  };

  const cardStyles = {
    default: 'text-center',
    cards: 'bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300',
    minimal: 'px-4 py-6 border-r border-gray-300 last:border-r-0',
  };

  return (
    <section ref={ref} className={`py-16 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-12">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-black mb-4 antialiased"
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto antialiased"
            >
              {description}
            </motion.p>
          )}
        </div>
      )}

      {/* Statistics Grid */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 ${variantStyles[variant]}`}
      >
        {items.map((item, index) => (
          <StatisticItemComponent
            key={item.id}
            item={item}
            index={index}
            variant={variant}
            cardStyle={cardStyles[variant]}
            isInView={inView}
            animated={animated}
          />
        ))}
      </div>
    </section>
  );
};

interface StatisticItemComponentProps {
  item: StatisticItem;
  index: number;
  variant: string;
  cardStyle: string;
  isInView: boolean;
  animated: boolean;
}

/**
 * Individual Statistic Item Component
 */
const StatisticItemComponent = ({
  item,
  index,
  variant,
  cardStyle,
  isInView,
  animated,
}: StatisticItemComponentProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate counter when in view
  useEffect(() => {
    if (!isInView || !animated) {
      setDisplayValue(item.value);
      return;
    }

    let startValue = 0;
    const duration = 2000; // 2 seconds
    const increment = item.value / (duration / 50);
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= item.value) {
        setDisplayValue(item.value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(startValue));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isInView, item.value, animated]);

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { delay: index * 0.1, duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      className={`${cardStyle} group`}
    >
      {/* Icon */}
      {item.icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
          className="mb-4 text-4xl text-[#2E7D32] group-hover:text-[#2E7D32] transition-colors duration-300 antialiased"
        >
          {item.icon}
        </motion.div>
      )}

      {/* Value */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-[#2E7D32] mb-2 group-hover:text-[#2E7D32] transition-colors duration-300 antialiased"
      >
        {displayValue.toLocaleString()}
        {item.suffix && <span className="text-3xl antialiased">{item.suffix}</span>}
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
        className="text-gray-100 font-semibold mb-2"
      >
        {item.label}
      </motion.p>

      {/* Description */}
      {item.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          className="text-sm text-gray-500 leading-relaxed"
        >
          {item.description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default StatisticsBlock;
