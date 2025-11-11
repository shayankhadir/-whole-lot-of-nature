import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    MotionProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

/**
 * CustomButton Component
 * 
 * Premium button with multiple variants, sizes, and smooth animations.
 * Features:
 * - 4 design variants (primary, secondary, outline, ghost)
 * - Multiple sizes (sm, md, lg, xl)
 * - Icon support with positioning
 * - Loading state
 * - Full width option
 * - Smooth hover/tap animations
 * - Green theme
 */
export const CustomButton = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  loadingText = 'Loading...',
  fullWidth = false,
  rounded = 'full',
  children,
  disabled,
  className = '',
  whileHover,
  whileTap,
  ...props
}: CustomButtonProps) => {
  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  // Variant styles
  const variantStyles = {
    primary:
      'bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg hover:shadow-xl',
    secondary:
      'bg-gray-700 hover:bg-gray-600 text-white border-0 shadow-md hover:shadow-lg',
    outline:
      'bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600/10',
    ghost:
      'bg-transparent text-white hover:bg-white/10 border-0',
  };

  // Border radius styles
  const radiusStyles = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  // Animation defaults
  const defaultHover = { scale: 1.02 };
  const defaultTap = { scale: 0.98 };

  return (
    <motion.button
      whileHover={!disabled && (whileHover || defaultHover)}
      whileTap={!disabled && (whileTap || defaultTap)}
      disabled={disabled || isLoading}
      className={`
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${radiusStyles[rounded]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {/* Icon (left) */}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="inline-flex">{icon}</span>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      )}

      {/* Text */}
      <span>{isLoading ? loadingText : children}</span>

      {/* Icon (right) */}
      {icon && iconPosition === 'right' && !isLoading && (
        <span className="inline-flex">{icon}</span>
      )}
    </motion.button>
  );
};

export default CustomButton;
