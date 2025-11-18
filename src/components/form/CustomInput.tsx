import { ReactNode, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  variant?: 'default' | 'minimal' | 'outlined';
  helperText?: string;
  required?: boolean;
}

/**
 * CustomInput Component
 * 
 * Premium input field with icon support, error handling, and smooth animations.
 * Features:
 * - Bottom border accent styling
 * - Icon support (left and right)
 * - Error messages
 * - Helper text
 * - Multiple variants
 * - Green focus state
 * - Smooth animations
 */
export const CustomInput = ({
  label,
  error,
  icon,
  variant = 'default',
  helperText,
  required = false,
  className = '',
  ...props
}: CustomInputProps) => {
  const variantStyles = {
    default:
      'bg-transparent border-b-2 border-gray-600 focus:border-[#2E7D32]',
    minimal:
      'bg-gray-900/50 border border-gray-700 focus:border-[#2E7D32] rounded-lg px-4',
    outlined:
      'bg-transparent border-2 border-gray-700 focus:border-[#2E7D32] rounded-lg px-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon (left) */}
        {icon && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32] pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          {...props}
          className={`w-full h-14 ${variantStyles[variant]} text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${
            icon ? 'pl-8' : ''
          } ${error ? 'border-red-500' : ''} ${className}`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-gray-100 text-sm mt-2">{helperText}</p>
      )}
    </motion.div>
  );
};

export default CustomInput;
