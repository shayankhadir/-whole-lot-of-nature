'use client';

/**
 * Section Header Component
 * Reusable header for content sections with SEO optimization
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  variant?: 'default' | 'featured' | 'centered' | 'hero';
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  withBackground?: boolean;
  backgroundColor?: 'green' | 'black' | 'white' | 'gray';
  seoKeywords?: string;
  as?: 'h1' | 'h2' | 'h3';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  icon,
  variant = 'default',
  align = 'center',
  size = 'medium',
  withBackground = false,
  backgroundColor = 'white',
  seoKeywords,
  as: HeadingTag = 'h2',
}) => {
  const titleSizeClasses = {
    small: 'text-2xl md:text-3xl',
    medium: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl',
  };

  const subtitleSizeClasses = {
    small: 'text-base md:text-lg',
    medium: 'text-lg md:text-xl',
    large: 'text-xl md:text-2xl',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const backgroundClasses = {
    green: 'bg-gradient-to-r from-green-50 to-green-100',
    black: 'bg-gradient-to-r from-black to-gray-900',
    white: 'bg-white',
    gray: 'bg-gray-50',
  };

  const textColorClasses = {
    green: 'text-black',
    black: 'text-white',
    white: 'text-black',
    gray: 'text-black',
  };

  const variantClasses = {
    default: 'gap-2',
    featured: 'gap-4 py-8 px-6 rounded-lg',
    centered: 'gap-3',
    hero: 'gap-6',
  };

  const borderClasses = {
    default: '',
    featured: 'border-4 border-[#2E7D32]',
    centered: 'border-b-4 border-[#2E7D32] pb-4',
    hero: 'border-l-8 border-[#2E7D32] pl-6',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col ${variantClasses[variant]} ${
        withBackground ? `${backgroundClasses[backgroundColor]} ${borderClasses[variant]} py-8 md:py-12 px-6 md:px-8 rounded-lg` : ''
      }`}
    >
      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl antialiased"
        >
          {icon}
        </motion.div>
      )}

      {/* Title */}
      <HeadingTag
        className={`${titleSizeClasses[size]} font-bold ${
          withBackground
            ? textColorClasses[backgroundColor]
            : 'text-[#66BB6A]'
        } ${alignClasses[align]} antialiased`}
      >
        {title}
      </HeadingTag>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`${subtitleSizeClasses[size]} font-semibold ${
            withBackground
              ? textColorClasses[backgroundColor]
              : 'text-white/80'
          } ${alignClasses[align]} antialiased`}
        >
          {subtitle}
        </p>
      )}

      {/* Description */}
      {description && (
        <p
          className={`${
            size === 'small' ? 'text-sm' : 'text-base md:text-lg'
          } ${
            withBackground
              ? textColorClasses[backgroundColor]
              : 'text-white/70'
          } ${alignClasses[align]} max-w-3xl ${
            align === 'center' ? 'mx-auto' : ''
          } antialiased`}
        >
          {description}
        </p>
      )}

      {/* SEO Keywords (hidden but present for search engines) */}
      {seoKeywords && (
        <span className="hidden">{seoKeywords}</span>
      )}
    </motion.div>
  );
};

export default SectionHeader;

/**
 * Preset section headers for Whole Lot of Nature
 */
export const sectionHeaders = {
  aboutHero: {
    title: 'Our Story',
    subtitle: 'A Journey Towards Sustainable Gardening',
    description:
      'From humble beginnings to becoming India\'s trusted organic seed provider, our mission has remained unchanged: empowering gardeners with quality, organic seeds.',
    icon: '🌱',
    variant: 'hero' as const,
    size: 'large' as const,
    seoKeywords: 'organic seeds India, sustainable gardening company, organic agriculture',
  },

  missionVision: {
    title: 'Our Mission & Values',
    description:
      'We believe in making organic gardening accessible to everyone while supporting sustainable farming practices and building a thriving gardening community.',
    icon: '🎯',
    variant: 'featured' as const,
    size: 'medium' as const,
    withBackground: true,
    backgroundColor: 'green' as const,
    seoKeywords: 'organic farming mission, sustainable agriculture values',
  },

  teamHero: {
    title: 'Meet Our Team',
    subtitle: 'Experts Dedicated to Your Gardening Success',
    description:
      'Our diverse team brings over 50 years of combined experience in horticulture, sustainability, and customer success.',
    icon: '👥',
    variant: 'centered' as const,
    size: 'large' as const,
    seoKeywords: 'agricultural experts, horticulture team',
  },

  partnershipHero: {
    title: 'Building Partnerships for Impact',
    description:
      'We collaborate with farmers, businesses, and communities to create sustainable solutions for organic agriculture.',
    icon: '🤝',
    variant: 'featured' as const,
    size: 'large' as const,
    withBackground: true,
    backgroundColor: 'green' as const,
    seoKeywords: 'sustainable agriculture partnerships, farmer networks',
  },

  whyChoose: {
    title: 'Why Choose Whole Lot of Nature',
    description:
      'We combine decades of expertise, 100% organic certification, and a commitment to community sustainability.',
    icon: '✓',
    variant: 'default' as const,
    size: 'medium' as const,
    seoKeywords: 'best organic seeds, certified organic provider, organic seeds online',
  },

  communityImpact: {
    title: 'Our Community Impact',
    description:
      'Through farmer partnerships and educational programs, we\'ve trained over 5,000 gardeners and supported 500+ families.',
    icon: '💚',
    variant: 'featured' as const,
    size: 'medium' as const,
    withBackground: true,
    backgroundColor: 'green' as const,
    seoKeywords: 'sustainable community, agricultural education',
  },
};
