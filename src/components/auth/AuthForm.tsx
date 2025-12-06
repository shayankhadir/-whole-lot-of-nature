'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit?: (data: LoginData | SignupData) => Promise<void>;
  redirectUrl?: string;
  showSocial?: boolean;
  showImage?: boolean;
  backgroundImage?: string;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms?: boolean;
}

/**
 * AuthForm Component
 * 
 * Comprehensive authentication form with login and signup modes.
 * Features:
 * - Split layout with image + form
 * - Password visibility toggle
 * - Social authentication buttons
 * - Form validation
 * - Smooth animations
 * - Responsive design
 * 
 * @component
 */
export const AuthForm = ({
  mode = 'login',
  onSubmit,
  redirectUrl = '/',
  showSocial = true,
  showImage = true,
  backgroundImage = '/auth-background.jpg',
}: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState(
    mode === 'login'
      ? { email: '', password: '', rememberMe: false }
      : { name: '', email: '', password: '', confirmPassword: '', agreeToTerms: false }
  );

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (mode === 'signup') {
        const data = formData as SignupData;
        if (!data.name) setErrors((p) => ({ ...p, name: 'Name is required' }));
        if (!data.email) setErrors((p) => ({ ...p, email: 'Email is required' }));
        if (!data.password) setErrors((p) => ({ ...p, password: 'Password is required' }));
        if (data.password !== data.confirmPassword) {
          setErrors((p) => ({ ...p, confirmPassword: 'Passwords do not match' }));
        }
      } else {
        const data = formData as LoginData;
        if (!data.email) setErrors((p) => ({ ...p, email: 'Email is required' }));
        if (!data.password) setErrors((p) => ({ ...p, password: 'Password is required' }));
      }

      if (onSubmit) {
        await onSubmit(formData as LoginData | SignupData);
      }

      // Handle redirect
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginData = formData as LoginData;
  const signupData = formData as SignupData;

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Image (hidden on mobile) */}
      {showImage && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex w-1/2 relative overflow-hidden"
        >
          <Image
            src={backgroundImage}
            alt="Plants"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />

          {/* Decorative Content */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white text-center"
            >
              <h2 className="text-4xl font-bold mb-4 antialiased">Welcome to Whole Lot of Nature</h2>
              <p className="text-lg text-gray-200 antialiased">
                Discover premium organic seeds and plants for your garden
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`w-full ${showImage ? 'lg:w-1/2' : ''} flex items-center justify-center p-6 sm:p-12`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 antialiased">
              {mode === 'login' ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-gray-100">
              {mode === 'login'
                ? 'Sign in to your account to continue'
                : 'Create an account to start your journey'}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Signup Only) */}
            {mode === 'signup' && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full h-12 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 transition-colors duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={mode === 'login' ? loginData.email : signupData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full h-12 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 transition-colors duration-300 focus:border-[#2E7D32] focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={mode === 'login' ? loginData.password : signupData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-12 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 transition-colors duration-300 focus:border-[#2E7D32] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E7D32] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </motion.div>

            {/* Confirm Password Field (Signup Only) */}
            {mode === 'signup' && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-12 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 transition-colors duration-300 focus:border-[#2E7D32] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E7D32] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </motion.div>
            )}

            {/* Remember Me / Terms */}
            <motion.div variants={itemVariants} className="flex items-center">
              <input
                type="checkbox"
                name={mode === 'login' ? 'rememberMe' : 'agreeToTerms'}
                checked={mode === 'login' ? loginData.rememberMe : signupData.agreeToTerms}
                onChange={handleChange}
                id="checkbox"
                className="w-4 h-4 accent-green-600 cursor-pointer"
              />
              <label htmlFor="checkbox" className="ml-3 text-sm text-gray-100 cursor-pointer">
                {mode === 'login' ? (
                  <>
                    Remember me
                    <Link href="/forgot-password" className="ml-auto text-[#2E7D32] hover:text-[#2E7D32] transition-colors">
                      Forgot password?
                    </Link>
                  </>
                ) : (
                  <>
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors">
                      Terms of Service
                    </Link>
                  </>
                )}
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full h-12 bg-[#2E7D32] hover:bg-[#2E7D32] disabled:bg-[#2E7D32] text-white font-bold rounded-lg transition-all duration-300 mt-8 antialiased"
            >
              {isLoading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create Account'}
            </motion.button>
          </form>

          {/* Divider */}
          {showSocial && (
            <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-600" />
              <span className="text-gray-100 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-600" />
            </motion.div>
          )}

          {/* Social Auth Buttons */}
          {showSocial && (
            <motion.div variants={itemVariants} className="space-y-3">
              <SocialButton provider="facebook" />
              <SocialButton provider="google" />
              <SocialButton provider="twitter" />
            </motion.div>
          )}

          {/* Link to other form */}
          <motion.p variants={itemVariants} className="text-center text-gray-100 mt-6">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors font-semibold">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors font-semibold">
                  Sign in
                </Link>
              </>
            )}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface SocialButtonProps {
  provider: 'facebook' | 'google' | 'twitter';
}

const SocialButton = ({ provider }: SocialButtonProps) => {
  const config = {
    facebook: { label: 'Facebook', icon: 'f', color: '#1877F2' },
    google: { label: 'Google', icon: 'G', color: '#EA4335' },
    twitter: { label: 'Twitter/X', icon: '𝕏', color: '#000000' },
  };

  const { label, icon } = config[provider];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="w-full h-12 bg-white/10 hover:bg-white/20 border border-gray-600 rounded-lg flex items-center justify-center gap-3 text-white font-semibold transition-all duration-300 backdrop-blur-md"
    >
      <span className="text-lg antialiased">{icon}</span>
      Continue with {label}
    </motion.button>
  );
};

export default AuthForm;
