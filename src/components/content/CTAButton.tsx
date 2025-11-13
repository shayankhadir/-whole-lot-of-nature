'use client';

/**
 * Call-to-Action Button Component
 * Reusable CTA buttons with multiple variants and animation support
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CTAButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  isLink?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  disabled = false,
  isLink = true,
}) => {
  const baseClasses =
    'font-bold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer';

  const variantClasses = {
    primary: 'bg-[#2E7D32] text-white border-2 border-[#2E7D32] hover:bg-white hover:text-[#2E7D32]',
    secondary: 'bg-black text-white border-2 border-black hover:bg-white hover:text-black',
    outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white',
    ghost: 'bg-transparent text-black hover:bg-[#2E7D32]',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {text}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </>
  );

  const MotionWrapper = motion.create(isLink ? Link : 'button');

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className="inline-block"
    >
      {isLink && href ? (
        <Link href={href} className={buttonClasses}>
          {content}
        </Link>
      ) : (
        <button
          onClick={onClick}
          disabled={disabled}
          className={buttonClasses}
        >
          {content}
        </button>
      )}
    </motion.div>
  );
};

export default CTAButton;

/**
 * CTA Section Component - Full section with multiple buttons
 */
interface CTASectionProps {
  title: string;
  description?: string;
  primaryButton: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: 'centered' | 'left' | 'right';
  backgroundVariant?: 'green' | 'black' | 'white';
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  variant = 'centered',
  backgroundVariant = 'green',
}) => {
  const bgClasses = {
    green: 'bg-gradient-to-r from-green-50 to-green-100 border-4 border-[#2E7D32]',
    black: 'bg-gradient-to-r from-black to-gray-900 border-4 border-black text-white',
    white: 'bg-white border-2 border-black',
  };

  const textColor = backgroundVariant === 'black' ? 'text-white' : 'text-black';
  const alignClass = {
    centered: 'text-center',
    left: 'text-left',
    right: 'text-right',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${bgClasses[backgroundVariant]} rounded-lg p-8 md:p-12 ${alignClass[variant]}`}
    >
      <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${textColor}`}>{title}</h2>
      {description && (
        <p className={`text-lg mb-6 max-w-2xl ${variant === 'centered' ? 'mx-auto' : ''} ${
          backgroundVariant === 'black' ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {description}
        </p>
      )}
      <div className={`flex gap-4 ${variant === 'centered' ? 'justify-center' : ''} flex-wrap`}>
        <CTAButton
          text={primaryButton.text}
          href={primaryButton.href}
          onClick={primaryButton.onClick}
          variant="primary"
          size="lg"
        />
        {secondaryButton && (
          <CTAButton
            text={secondaryButton.text}
            href={secondaryButton.href}
            onClick={secondaryButton.onClick}
            variant={backgroundVariant === 'black' ? 'primary' : 'secondary'}
            size="lg"
          />
        )}
      </div>
    </motion.div>
  );
};

/**
 * Pre-defined CTA buttons for Whole Lot of Nature
 */
export const ctaButtons = {
  shopNow: {
    text: 'Shop Now',
    href: '/shop',
    variant: 'primary' as const,
    icon: '🛒',
  },

  learnMore: {
    text: 'Learn More',
    href: '/about',
    variant: 'secondary' as const,
    icon: '📚',
  },

  contact: {
    text: 'Contact Us',
    href: '/contact',
    variant: 'outline' as const,
    icon: '📧',
  },

  becomeFarmer: {
    text: 'Become a Partner',
    href: '/partnerships',
    variant: 'primary' as const,
    icon: '🤝',
  },

  viewTeam: {
    text: 'Meet Our Team',
    href: '/team',
    variant: 'outline' as const,
  },

  joinCommunity: {
    text: 'Join Our Community',
    href: '/community',
    variant: 'primary' as const,
    icon: '👥',
  },

  explorePlants: {
    text: 'Explore Plant Varieties',
    href: '/plants',
    variant: 'secondary' as const,
    icon: '🌱',
  },

  getStarted: {
    text: 'Get Started Today',
    href: '/signup',
    variant: 'primary' as const,
    icon: '➜',
    iconPosition: 'right' as const,
  },
};

/**
 * Pre-defined CTA sections for common use cases
 */
export const ctaSections = {
  shopCTA: {
    title: 'Ready to Start Your Garden?',
    description: 'Explore our 500+ varieties of organic seeds and find the perfect plants for your garden.',
    primaryButton: {
      text: 'Shop Now',
      href: '/shop',
    },
    secondaryButton: {
      text: 'Browse Categories',
      href: '/categories',
    },
    variant: 'centered' as const,
    backgroundVariant: 'green' as const,
  },

  partnershipCTA: {
    title: 'Interested in Partnering With Us?',
    description: 'Join our network of farmers, businesses, and communities making a difference in sustainable agriculture.',
    primaryButton: {
      text: 'Explore Partnership Opportunities',
      href: '/partnerships',
    },
    secondaryButton: {
      text: 'Contact Partnership Team',
      href: '/contact?type=partnership',
    },
    variant: 'centered' as const,
    backgroundVariant: 'black' as const,
  },

  communityCTA: {
    title: 'Become Part of Our Growing Community',
    description: 'Get free gardening tips, connect with other gardeners, and learn sustainable farming practices.',
    primaryButton: {
      text: 'Join Community',
      href: '/community',
    },
    secondaryButton: {
      text: 'Browse Guides',
      href: '/guides',
    },
    variant: 'centered' as const,
    backgroundVariant: 'green' as const,
  },

  contactCTA: {
    title: 'Have Questions? Let\'s Talk!',
    description: 'Our team is here to help you with any questions about our products, services, or partnerships.',
    primaryButton: {
      text: 'Contact Us',
      href: '/contact',
    },
    variant: 'centered' as const,
    backgroundVariant: 'white' as const,
  },
};
