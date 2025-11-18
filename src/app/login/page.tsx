'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * CustomLoginPage Component
 * 
 * Premium login page with split layout matching signup design.
 * Features:
 * - Split layout (form left, image right)
 * - Elegant typography
 * - Smooth animations
 * - Form validation
 * - Social auth integration
 * - Responsive design
 */
export default function CustomLoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage('Login successful! Redirecting...');
      setFormData({
        email: '',
        password: '',
        rememberMe: false,
      });

      // Simulate redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setErrors({
        submit: 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* Left Side - Form Container */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="text-5xl font-bold text-white mb-3 antialiased">
              Welcome Back
            </h1>
            <p className="text-gray-100 text-lg antialiased">
              Sign in to access your account and continue your gardening journey
            </p>
          </motion.div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-[#2E7D32]/20 border border-[#2E7D32] rounded-lg text-[#2E7D32] backdrop-blur-md"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400"
            >
              {errors.submit}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">{errors.email}</p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 pr-12 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E7D32] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password}</p>
              )}
            </motion.div>

            {/* Remember & Forgot */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-green-600 cursor-pointer"
                />
                <span className="text-sm text-gray-100">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#2E7D32] hover:text-[#2E7D32] transition-colors font-semibold"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full h-14 bg-[#2E7D32] hover:bg-[#2E7D32] disabled:bg-[#2E7D32] text-white font-bold rounded-full transition-all duration-300 mt-8 text-lg shadow-lg hover:shadow-xl antialiased"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700" />
          </motion.div>

          {/* Social Auth Buttons */}
          <motion.div variants={itemVariants} className="space-y-3">
            <SocialLoginButton provider="google" />
            <SocialLoginButton provider="facebook" />
          </motion.div>

          {/* Signup Link */}
          <motion.p variants={itemVariants} className="text-center text-gray-100 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors font-semibold">
              Sign up here
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Side - Image (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-green-900 to-black"
      >
        {/* Background Image */}
        <Image
          src="/images/backgrounds/botanical-flowers.jpg"
          alt="Decorative botanical illustration with white flowers"
          fill
          priority
          className="object-cover opacity-80"
          sizes="(max-width: 1024px) 0vw, 50vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Decorative Elements */}
        <motion.div
          animate={{ float: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-10 w-40 h-40 bg-[#2E7D32]/10 rounded-full blur-3xl backdrop-blur-md"
        />
        <motion.div
          animate={{ float: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-40 left-10 w-60 h-60 bg-[#2E7D32]/5 rounded-full blur-3xl backdrop-blur-md"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight antialiased">
              Welcome Home
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed antialiased">
              Continue your gardening adventure with access to exclusive seeds, gardening tips, and your personalized dashboard
            </p>

            {/* Benefit List */}
            <div className="space-y-4 text-left">
              {['📦 Order History', '💚 Saved Favorites', '🎁 Exclusive Deals', '📞 Priority Support'].map(
                (benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 text-lg text-gray-200 antialiased"
                  >
                    <span className="text-2xl antialiased">{benefit.split(' ')[0]}</span>
                    {benefit.substring(2)}
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook';
}

const SocialLoginButton = ({ provider }: SocialLoginButtonProps) => {
  const config = {
    google: { label: 'Sign in with Google', icon: 'G' },
    facebook: { label: 'Sign in with Facebook', icon: 'f' },
  };

  const { label, icon } = config[provider];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="w-full h-12 bg-white/10 hover:bg-white/20 border border-gray-600 hover:border-[#2E7D32] rounded-full flex items-center justify-center gap-3 text-white font-semibold transition-all duration-300 backdrop-blur-md"
    >
      <span className="text-lg antialiased">{icon}</span>
      {label}
    </motion.button>
  );
};
