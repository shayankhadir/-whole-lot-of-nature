'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * CustomSignupPage Component
 * 
 * Premium signup page with split layout, nature imagery, and green theme.
 * Features:
 * - Split layout (form left, image right)
 * - Elegant typography
 * - Smooth animations
 * - Form validation
 * - Social auth integration
 * - Responsive design
 */
export default function CustomSignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    // Clear error for this field
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
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

      setSuccessMessage('Account created successfully! Redirecting...');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });

      // Simulate redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setErrors({
        submit: 'Something went wrong. Please try again.',
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
              Let's Get Started
            </h1>
            <p className="text-white/90 text-lg antialiased">
              Create your account to explore premium organic seeds and plants
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-2">{errors.name}</p>
              )}
            </motion.div>

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
                Create Password
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

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 pr-12 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E7D32] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
              )}
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div variants={itemVariants} className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                id="terms"
                className="w-5 h-5 accent-green-600 cursor-pointer mt-0.5 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-sm text-white/90 cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </motion.div>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm mt-2">{errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full h-14 bg-[#2E7D32] hover:bg-[#2E7D32] disabled:bg-[#2E7D32] text-white font-bold rounded-full transition-all duration-300 mt-8 text-lg shadow-lg hover:shadow-xl antialiased"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
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
            <SocialSignupButton provider="google" />
            <SocialSignupButton provider="facebook" />
          </motion.div>

          {/* Login Link */}
          <motion.p variants={itemVariants} className="text-center text-white/90 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors font-semibold">
              Sign in here
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Side - Decorative Image Container */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-green-900 to-black"
      >
        {/* Background Image */}
        <Image
          src="/images/backgrounds/monstera-dark.jpg"
          alt="Decorative dark tropical monstera leaves"
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
              Join Our Garden Community
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed antialiased">
              Get exclusive access to premium organic seeds, expert gardening tips, and a thriving community of plant lovers
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-left">
              {['🌱 100% Organic Seeds', '🌍 Eco-Friendly Practices', '🤝 Community Support', '📚 Expert Guides'].map(
                (feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 text-lg text-white/90 antialiased"
                  >
                    <span className="text-2xl antialiased">{feature.split(' ')[0]}</span>
                    {feature.substring(2)}
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

interface SocialSignupButtonProps {
  provider: 'google' | 'facebook';
}

const SocialSignupButton = ({ provider }: SocialSignupButtonProps) => {
  const config = {
    google: { label: 'Sign up with Google', icon: 'G' },
    facebook: { label: 'Sign up with Facebook', icon: 'f' },
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
